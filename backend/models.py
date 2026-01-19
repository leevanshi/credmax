from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
from datetime import datetime, timezone
import uuid

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    password_hash: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    created_at: datetime

class CreditCard(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    bank_name: str
    card_name: str
    last_four: Optional[str] = None
    reward_type: str
    reward_rate: float
    points_balance: int = 0
    expiry_date: Optional[str] = None
    categories: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CreditCardCreate(BaseModel):
    bank_name: str
    card_name: str
    last_four: Optional[str] = None
    reward_type: str
    reward_rate: float
    expiry_date: Optional[str] = None
    categories: List[str] = []

class CreditCardResponse(BaseModel):
    id: str
    user_id: str
    bank_name: str
    card_name: str
    last_four: Optional[str] = None
    reward_type: str
    reward_rate: float
    points_balance: int
    expiry_date: Optional[str] = None
    categories: List[str]
    created_at: datetime

class Transaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    card_id: str
    amount: float
    category: str
    merchant: str
    points_earned: int
    date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TransactionCreate(BaseModel):
    card_id: str
    amount: float
    category: str
    merchant: str
    points_earned: int

class TransactionResponse(BaseModel):
    id: str
    user_id: str
    card_id: str
    amount: float
    category: str
    merchant: str
    points_earned: int
    date: datetime

class RecommendationRequest(BaseModel):
    category: str
    amount: float

class RecommendationResponse(BaseModel):
    card_id: str
    card_name: str
    bank_name: str
    reason: str
    points_earned: int
    reward_rate: float
