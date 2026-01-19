from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from routes.auth import get_current_user
from ml_service import MLService
from llm_service import LLMService
import os

router = APIRouter(prefix="/analytics", tags=["analytics"])

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

ml_service = MLService()
llm_service = LLMService()

@router.get("/spending-patterns")
async def get_spending_patterns(current_user: dict = Depends(get_current_user)):
    transactions = await db.transactions.find({"user_id": current_user['id']}, {"_id": 0}).to_list(1000)
    
    from datetime import datetime
    for t in transactions:
        if isinstance(t['date'], str):
            t['date'] = datetime.fromisoformat(t['date'])
    
    patterns = ml_service.analyze_spending_patterns(transactions)
    
    return patterns

@router.get("/insights")
async def get_insights(current_user: dict = Depends(get_current_user)):
    transactions = await db.transactions.find({"user_id": current_user['id']}, {"_id": 0}).to_list(1000)
    
    from datetime import datetime
    for t in transactions:
        if isinstance(t['date'], str):
            t['date'] = datetime.fromisoformat(t['date'])
    
    patterns = ml_service.analyze_spending_patterns(transactions)
    insights = await llm_service.generate_spending_insights(transactions, patterns)
    
    return {"insights": insights, "patterns": patterns}
