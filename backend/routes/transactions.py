from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from models import Transaction, TransactionCreate, TransactionResponse
from routes.auth import get_current_user
from typing import List
import os

router = APIRouter(prefix="/transactions", tags=["transactions"])

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

@router.post("", response_model=TransactionResponse)
async def create_transaction(transaction_data: TransactionCreate, current_user: dict = Depends(get_current_user)):
    card = await db.credit_cards.find_one({"id": transaction_data.card_id, "user_id": current_user['id']}, {"_id": 0})
    
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    
    transaction = Transaction(
        user_id=current_user['id'],
        **transaction_data.model_dump()
    )
    
    transaction_dict = transaction.model_dump()
    transaction_dict['date'] = transaction_dict['date'].isoformat()
    
    await db.transactions.insert_one(transaction_dict)
    
    new_balance = card['points_balance'] + transaction_data.points_earned
    await db.credit_cards.update_one(
        {"id": transaction_data.card_id},
        {"$set": {"points_balance": new_balance}}
    )
    
    return TransactionResponse(**transaction.model_dump())

@router.get("", response_model=List[TransactionResponse])
async def get_transactions(current_user: dict = Depends(get_current_user)):
    transactions = await db.transactions.find({"user_id": current_user['id']}, {"_id": 0}).sort("date", -1).to_list(100)
    
    from datetime import datetime
    for t in transactions:
        if isinstance(t['date'], str):
            t['date'] = datetime.fromisoformat(t['date'])
    
    return [TransactionResponse(**t) for t in transactions]
