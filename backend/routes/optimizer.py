from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from routes.auth import get_current_user
from llm_service import LLMService
from collections import defaultdict
import os

router = APIRouter(prefix="/optimizer", tags=["optimizer"])

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

llm_service = LLMService()

@router.get("/recurring-bills")
async def analyze_recurring_bills(current_user: dict = Depends(get_current_user)):
    transactions = await db.transactions.find({"user_id": current_user['id']}, {"_id": 0}).to_list(1000)
    
    merchant_frequency = defaultdict(list)
    for t in transactions:
        merchant_frequency[t['merchant']].append({
            'amount': t['amount'],
            'category': t['category'],
            'date': t['date']
        })
    
    recurring = []
    for merchant, txs in merchant_frequency.items():
        if len(txs) >= 2:
            avg_amount = sum(t['amount'] for t in txs) / len(txs)
            recurring.append({
                'merchant': merchant,
                'frequency': len(txs),
                'avg_amount': round(avg_amount, 2),
                'category': txs[0]['category'],
                'total_spent': round(sum(t['amount'] for t in txs), 2)
            })
    
    recurring.sort(key=lambda x: x['total_spent'], reverse=True)
    
    return {"recurring_bills": recurring[:10]}

@router.post("/optimize")
async def optimize_cards(current_user: dict = Depends(get_current_user)):
    cards = await db.credit_cards.find({"user_id": current_user['id']}, {"_id": 0}).to_list(100)
    transactions = await db.transactions.find({"user_id": current_user['id']}, {"_id": 0}).to_list(1000)
    
    if not cards:
        return {"optimizations": [], "message": "No cards available"}
    
    merchant_frequency = defaultdict(list)
    for t in transactions:
        merchant_frequency[t['merchant']].append({
            'amount': t['amount'],
            'category': t['category'],
            'card_id': t['card_id']
        })
    
    recurring = []
    for merchant, txs in merchant_frequency.items():
        if len(txs) >= 2:
            avg_amount = sum(t['amount'] for t in txs) / len(txs)
            current_card_id = txs[0]['card_id']
            category = txs[0]['category']
            
            best_card = max(
                cards,
                key=lambda c: c['reward_rate'] * (1.5 if category in c.get('categories', []) else 1)
            )
            
            current_card = next((c for c in cards if c['id'] == current_card_id), None)
            
            if best_card['id'] != current_card_id:
                current_rate = current_card['reward_rate'] if current_card else 1.0
                best_rate = best_card['reward_rate'] * (1.5 if category in best_card.get('categories', []) else 1)
                
                current_points = int(avg_amount * current_rate)
                optimized_points = int(avg_amount * best_rate)
                points_gain = optimized_points - current_points
                
                if points_gain > 0:
                    recurring.append({
                        'merchant': merchant,
                        'category': category,
                        'avg_amount': round(avg_amount, 2),
                        'current_card': f"{current_card['bank_name']} {current_card['card_name']}" if current_card else "Unknown",
                        'recommended_card': f"{best_card['bank_name']} {best_card['card_name']}",
                        'current_points': current_points,
                        'optimized_points': optimized_points,
                        'points_gain': points_gain,
                        'annual_gain_estimate': points_gain * 12
                    })
    
    recurring.sort(key=lambda x: x['annual_gain_estimate'], reverse=True)
    
    total_annual_gain = sum(opt['annual_gain_estimate'] for opt in recurring)
    
    insights = ""
    if recurring:
        try:
            top_merchants = [opt['merchant'] for opt in recurring[:3]]
            prompt = f"""As a credit card rewards expert in India, provide 2-3 brief tips for maximizing rewards on these recurring bills: {', '.join(top_merchants)}. The user could gain {total_annual_gain} points annually by optimizing. Consider Indian credit card market. Keep it actionable and concise."""
            
            chat = llm_service.get_chat_instance("optimizer-insights")
            from emergentintegrations.llm.chat import UserMessage
            user_message = UserMessage(text=prompt)
            insights = await chat.send_message(user_message)
        except Exception as e:
            print(f"LLM error: {e}")
            insights = f"By switching to better cards for your recurring bills, you could earn {total_annual_gain} additional points per year!"
    
    return {
        "optimizations": recurring[:10],
        "total_annual_gain": total_annual_gain,
        "insights": insights
    }
