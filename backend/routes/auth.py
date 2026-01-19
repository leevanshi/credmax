from fastapi import APIRouter, HTTPException, Depends, Header
from motor.motor_asyncio import AsyncIOMotorClient
from models import User, UserCreate, UserLogin, UserResponse
from auth import hash_password, verify_password, create_access_token, decode_access_token
import os

router = APIRouter(prefix="/auth", tags=["auth"])

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.replace('Bearer ', '')
    payload = decode_access_token(token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = await db.users.find_one({"id": payload.get("sub")}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

@router.post("/signup")
async def signup(user_data: UserCreate):
    existing_user = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(
        email=user_data.email,
        name=user_data.name,
        password_hash=hash_password(user_data.password)
    )
    
    user_dict = user.model_dump()
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    
    await db.users.insert_one(user_dict)
    
    token = create_access_token({"sub": user.id})
    
    return {
        "token": token,
        "user": UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            created_at=user.created_at
        )
    }

@router.post("/login")
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    
    if not user or not verify_password(credentials.password, user['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": user['id']})
    
    from datetime import datetime
    created_at = user['created_at']
    if isinstance(created_at, str):
        created_at = datetime.fromisoformat(created_at)
    
    return {
        "token": token,
        "user": UserResponse(
            id=user['id'],
            email=user['email'],
            name=user['name'],
            created_at=created_at
        )
    }

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    from datetime import datetime
    created_at = current_user['created_at']
    if isinstance(created_at, str):
        created_at = datetime.fromisoformat(created_at)
    
    return UserResponse(
        id=current_user['id'],
        email=current_user['email'],
        name=current_user['name'],
        created_at=created_at
    )
