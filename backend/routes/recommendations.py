from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from models import RecommendationRequest, RecommendationResponse
from routes.auth import get_current_user
from llm_service import LLMService
import os

router = APIRouter(prefix="/recommendations", tags=["recommendations"])

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

llm_service = LLMService()

@router.post("", response_model=RecommendationResponse)
async def get_recommendation(request: RecommendationRequest, current_user: dict = Depends(get_current_user)):
    cards = await db.credit_cards.find({"user_id": current_user['id']}, {"_id": 0}).to_list(100)
    
    if not cards:
        raise HTTPException(status_code=400, detail="No credit cards found. Please add a card first.")
    
    result = await llm_service.get_card_recommendation(
        category=request.category,
        amount=request.amount,
        cards=cards
    )
    
    if not result['card_id']:
        raise HTTPException(status_code=400, detail="Unable to generate recommendation")
    
    recommended_card = next((c for c in cards if c['id'] == result['card_id']), None)
    
    if not recommended_card:
        raise HTTPException(status_code=404, detail="Recommended card not found")
    
    points_earned = int(request.amount * recommended_card['reward_rate'])
    
    return RecommendationResponse(
        card_id=recommended_card['id'],
        card_name=recommended_card['card_name'],
        bank_name=recommended_card['bank_name'],
        reason=result['reason'],
        points_earned=points_earned,
        reward_rate=recommended_card['reward_rate']
    )
