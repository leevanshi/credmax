from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from routes.auth import get_current_user
import os

router = APIRouter(prefix="/referrals", tags=["referrals"])

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Popular Indian credit card offers with affiliate potential
CARD_OFFERS = [
    {
        "id": "hdfc_regalia",
        "bank": "HDFC Bank",
        "name": "Regalia Credit Card",
        "type": "premium",
        "annual_fee": 2500,
        "reward_rate": 4.0,
        "welcome_bonus": 10000,
        "categories": ["Travel", "Shopping", "Online Shopping"],
        "benefits": [
            "4 reward points per ₹150 spent",
            "10,000 bonus points on ₹5L annual spend",
            "Airport lounge access (6 domestic + 6 international)",
            "Insurance cover up to ₹1 Cr"
        ],
        "best_for": "Travel & Shopping",
        "referral_commission": 1500,
        "apply_url": "https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-credit-card"
    },
    {
        "id": "sbi_simplyclick",
        "bank": "SBI Card",
        "name": "SimplyCLICK Credit Card",
        "type": "rewards",
        "annual_fee": 499,
        "reward_rate": 5.0,
        "welcome_bonus": 2000,
        "categories": ["Online Shopping", "Food & Dining"],
        "benefits": [
            "10x reward points on partner brands",
            "5x on other online spends",
            "₹2000 Amazon voucher",
            "1% fuel surcharge waiver"
        ],
        "best_for": "Online Shopping",
        "referral_commission": 800,
        "apply_url": "https://www.sbicard.com/en/personal/credit-cards/shopping/simplyclick-advantage-credit-card.page"
    },
    {
        "id": "icici_amazon",
        "bank": "ICICI Bank",
        "name": "Amazon Pay ICICI Credit Card",
        "type": "cashback",
        "annual_fee": 0,
        "reward_rate": 5.0,
        "welcome_bonus": 2000,
        "categories": ["Online Shopping"],
        "benefits": [
            "5% cashback on Amazon Prime",
            "2% on Amazon without Prime",
            "1% on other spends",
            "Welcome ₹2000 Amazon Pay Gift Card"
        ],
        "best_for": "Amazon Shopping",
        "referral_commission": 1000,
        "apply_url": "https://www.icicibank.com/Personal-Banking/cards/credit-cards/amazon-pay-credit-card",
        "co_branded": "Amazon"
    },
    {
        "id": "axis_flipkart",
        "bank": "Axis Bank",
        "name": "Flipkart Axis Bank Credit Card",
        "type": "cashback",
        "annual_fee": 500,
        "reward_rate": 4.0,
        "welcome_bonus": 500,
        "categories": ["Online Shopping"],
        "benefits": [
            "4% unlimited cashback on Flipkart",
            "1.5% on groceries & bill payments",
            "1% on other spends",
            "₹500 Flipkart voucher"
        ],
        "best_for": "Flipkart Shopping",
        "referral_commission": 900,
        "apply_url": "https://www.axisbank.com/retail/cards/credit-card/flipkart-axis-bank-credit-card",
        "co_branded": "Flipkart"
    },
    {
        "id": "axis_vistara",
        "bank": "Axis Bank",
        "name": "Vistara Infinite Credit Card",
        "type": "travel",
        "annual_fee": 10000,
        "reward_rate": 6.0,
        "welcome_bonus": 15000,
        "categories": ["Travel"],
        "benefits": [
            "15,000 Club Vistara points annually",
            "2 complimentary tickets on renewal",
            "Unlimited lounge access",
            "6 CV points per ₹200 on Vistara"
        ],
        "best_for": "Frequent Flyers",
        "referral_commission": 2000,
        "apply_url": "https://www.axisbank.com/retail/cards/credit-card/vistara-credit-card",
        "co_branded": "Vistara"
    },
    {
        "id": "hdfc_swiggy",
        "bank": "HDFC Bank",
        "name": "Swiggy HDFC Bank Credit Card",
        "type": "cashback",
        "annual_fee": 500,
        "reward_rate": 10.0,
        "welcome_bonus": 250,
        "categories": ["Food & Dining"],
        "benefits": [
            "10% cashback on Swiggy",
            "5% cashback on Zomato, Uber",
            "1% on other spends",
            "3 months Swiggy One free"
        ],
        "best_for": "Food Delivery",
        "referral_commission": 700,
        "apply_url": "https://www.hdfcbank.com/personal/pay/cards/credit-cards/swiggy-hdfc-bank-credit-card",
        "co_branded": "Swiggy"
    }
]

@router.get("/recommended-cards")
async def get_recommended_cards(current_user: dict = Depends(get_current_user)):
    """Get card recommendations based on user's spending patterns"""
    
    # Get user transactions to analyze spending
    transactions = await db.transactions.find(
        {"user_id": current_user['id']}, 
        {"_id": 0}
    ).to_list(1000)
    
    # Analyze spending by category
    category_spending = {}
    for t in transactions:
        category = t['category']
        category_spending[category] = category_spending.get(category, 0) + t['amount']
    
    # Get user's current cards
    user_cards = await db.credit_cards.find(
        {"user_id": current_user['id']},
        {"_id": 0}
    ).to_list(100)
    
    user_card_names = [f"{c['bank_name']} {c['card_name']}" for c in user_cards]
    
    # Filter out cards user already has
    available_cards = [
        card for card in CARD_OFFERS 
        if f"{card['bank']} {card['name']}" not in user_card_names
    ]
    
    # Score cards based on user's spending
    scored_cards = []
    for card in available_cards:
        score = 0
        matching_categories = []
        
        for category in card['categories']:
            if category in category_spending:
                score += category_spending[category] * card['reward_rate']
                matching_categories.append(category)
        
        scored_cards.append({
            **card,
            'relevance_score': round(score, 2),
            'matching_categories': matching_categories
        })
    
    # Sort by relevance
    scored_cards.sort(key=lambda x: x['relevance_score'], reverse=True)
    
    return {
        "recommended_cards": scored_cards[:6],
        "user_spending_profile": category_spending
    }

@router.get("/co-branded-cards")
async def get_co_branded_cards():
    """Get all co-branded credit cards"""
    co_branded = [card for card in CARD_OFFERS if card.get('co_branded')]
    return {"co_branded_cards": co_branded}

@router.get("/all-cards")
async def get_all_cards():
    """Get all available card offers"""
    return {"cards": CARD_OFFERS}

@router.post("/track-application/{card_id}")
async def track_card_application(card_id: str, current_user: dict = Depends(get_current_user)):
    """Track when user applies for a card (for commission tracking)"""
    
    card = next((c for c in CARD_OFFERS if c['id'] == card_id), None)
    if not card:
        return {"success": False, "message": "Card not found"}
    
    # Log the application
    application_log = {
        "user_id": current_user['id'],
        "card_id": card_id,
        "card_name": f"{card['bank']} {card['name']}",
        "commission_amount": card['referral_commission'],
        "status": "pending",
        "applied_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.card_applications.insert_one(application_log)
    
    return {
        "success": True,
        "message": "Application tracked",
        "apply_url": card['apply_url']
    }

from datetime import datetime, timezone
