from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from routes.auth import get_current_user
from ml_service import MLService
import os

router = APIRouter(prefix="/rewards", tags=["rewards"])

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

ml_service = MLService()

@router.get("/expiry-alerts")
async def get_expiry_alerts(current_user: dict = Depends(get_current_user)):
    cards = await db.credit_cards.find({"user_id": current_user['id']}, {"_id": 0}).to_list(100)
    transactions = await db.transactions.find({"user_id": current_user['id']}, {"_id": 0}).to_list(1000)
    
    alerts = []
    for card in cards:
        if card.get('points_balance', 0) > 0:
            risk_analysis = ml_service.predict_expiry_risk(card, transactions)
            if risk_analysis['risk'] in ['high', 'medium']:
                alerts.append({
                    "card_id": card['id'],
                    "card_name": f"{card['bank_name']} {card['card_name']}",
                    "points_balance": card['points_balance'],
                    "risk_level": risk_analysis['risk'],
                    "message": risk_analysis['message'],
                    "days_until_expiry": risk_analysis.get('days', 0)
                })
    
    return {"alerts": alerts}

@router.get("/redemption-suggestions")
async def get_redemption_suggestions(current_user: dict = Depends(get_current_user)):
    cards = await db.credit_cards.find({"user_id": current_user['id']}, {"_id": 0}).to_list(100)
    
    suggestions = []
    for card in cards:
        points = card.get('points_balance', 0)
        if points > 0:
            value = points * 0.01
            
            options = []
            if points >= 5000:
                options.append({"type": "statement_credit", "value": round(value, 2), "description": f"₹{round(value, 2)} statement credit"})
            if points >= 10000:
                options.append({"type": "travel", "value": round(value * 1.25, 2), "description": f"₹{round(value * 1.25, 2)} travel booking"})
            if points >= 2500:
                options.append({"type": "gift_card", "value": round(value, 2), "description": f"₹{round(value, 2)} gift card"})
            
            if options:
                suggestions.append({
                    "card_id": card['id'],
                    "card_name": f"{card['bank_name']} {card['card_name']}",
                    "points_balance": points,
                    "redemption_options": options
                })
    
    return {"suggestions": suggestions}
