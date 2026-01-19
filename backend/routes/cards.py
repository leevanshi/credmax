from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from models import CreditCard, CreditCardCreate, CreditCardResponse
from routes.auth import get_current_user
from typing import List
import os

router = APIRouter(prefix="/cards", tags=["cards"])

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

@router.post("", response_model=CreditCardResponse)
async def create_card(card_data: CreditCardCreate, current_user: dict = Depends(get_current_user)):
    card = CreditCard(
        user_id=current_user['id'],
        **card_data.model_dump()
    )
    
    card_dict = card.model_dump()
    card_dict['created_at'] = card_dict['created_at'].isoformat()
    
    await db.credit_cards.insert_one(card_dict)
    
    return CreditCardResponse(**card.model_dump())

@router.get("", response_model=List[CreditCardResponse])
async def get_cards(current_user: dict = Depends(get_current_user)):
    cards = await db.credit_cards.find({"user_id": current_user['id']}, {"_id": 0}).to_list(100)
    
    from datetime import datetime
    for card in cards:
        if isinstance(card['created_at'], str):
            card['created_at'] = datetime.fromisoformat(card['created_at'])
    
    return [CreditCardResponse(**card) for card in cards]

@router.get("/{card_id}", response_model=CreditCardResponse)
async def get_card(card_id: str, current_user: dict = Depends(get_current_user)):
    card = await db.credit_cards.find_one({"id": card_id, "user_id": current_user['id']}, {"_id": 0})
    
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    
    from datetime import datetime
    if isinstance(card['created_at'], str):
        card['created_at'] = datetime.fromisoformat(card['created_at'])
    
    return CreditCardResponse(**card)

@router.put("/{card_id}", response_model=CreditCardResponse)
async def update_card(card_id: str, card_data: CreditCardCreate, current_user: dict = Depends(get_current_user)):
    card = await db.credit_cards.find_one({"id": card_id, "user_id": current_user['id']}, {"_id": 0})
    
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    
    update_data = card_data.model_dump()
    await db.credit_cards.update_one({"id": card_id}, {"$set": update_data})
    
    updated_card = await db.credit_cards.find_one({"id": card_id}, {"_id": 0})
    
    from datetime import datetime
    if isinstance(updated_card['created_at'], str):
        updated_card['created_at'] = datetime.fromisoformat(updated_card['created_at'])
    
    return CreditCardResponse(**updated_card)

@router.delete("/{card_id}")
async def delete_card(card_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.credit_cards.delete_one({"id": card_id, "user_id": current_user['id']})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Card not found")
    
    return {"message": "Card deleted successfully"}
