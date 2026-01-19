from emergentintegrations.llm.chat import LlmChat, UserMessage
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

class LLMService:
    def __init__(self):
        self.api_key = os.environ.get('EMERGENT_LLM_KEY')
        
    async def get_card_recommendation(self, category: str, amount: float, cards: list) -> dict:
        if not cards:
            return {
                "reason": "No cards available for recommendation",
                "card_id": None
            }
        
        cards_info = "\n".join([
            f"- {card['bank_name']} {card['card_name']}: {card['reward_rate']}x on {', '.join(card.get('categories', []))} (ID: {card['id']})"
            for card in cards
        ])
        
        prompt = f"""As a credit card rewards expert in India, recommend the best card for this transaction:

Transaction: ₹{amount:.2f} spent on {category}

Available Cards:
{cards_info}

Provide a brief recommendation (2-3 sentences) explaining which card to use and why. Consider Indian spending patterns. Format: "Use the [Bank] [Card Name] because [reason]."""
        
        try:
            chat = LlmChat(
                api_key=self.api_key,
                session_id="card-recommendation",
                system_message="You are a credit card rewards optimization expert. Give concise, practical advice."
            ).with_model("openai", "gpt-5.2")
            
            user_message = UserMessage(text=prompt)
            response = await chat.send_message(user_message)
            
            best_card = max(cards, key=lambda c: c['reward_rate'] * (1.5 if category in c.get('categories', []) else 1))
            
            return {
                "reason": response,
                "card_id": best_card['id']
            }
        except Exception as e:
            print(f"LLM error: {e}")
            best_card = max(cards, key=lambda c: c['reward_rate'])
            return {
                "reason": f"Based on reward rates, use the {best_card['bank_name']} {best_card['card_name']} for maximum points.",
                "card_id": best_card['id']
            }
    
    async def generate_spending_insights(self, transactions: list, patterns: dict) -> str:
        if not transactions:
            return "Start using your cards to see personalized insights!"
        
        categories = {}
        for t in transactions:
            categories[t['category']] = categories.get(t['category'], 0) + t['amount']
        
        top_category = max(categories, key=categories.get) if categories else "general"
        total_spent = sum(t['amount'] for t in transactions)
        
        prompt = f"""Generate 2-3 actionable insights about this spending pattern:

Total Spent: ${total_spent:.2f}
Top Category: {top_category} (${categories.get(top_category, 0):.2f})
Categories: {', '.join(categories.keys())}

Provide brief, actionable tips for maximizing rewards."""
        
        try:
            chat = LlmChat(
                api_key=self.api_key,
                session_id="spending-insights",
                system_message="You are a personal finance advisor focused on credit card rewards optimization."
            ).with_model("openai", "gpt-5.2")
            
            user_message = UserMessage(text=prompt)
            response = await chat.send_message(user_message)
            return response
        except Exception as e:
            print(f"LLM error: {e}")
            return f"You spent most on {top_category}. Consider using cards with higher rewards in this category to maximize points."
    
    def get_chat_instance(self, session_id: str):
        """Get a chat instance for the optimizer"""
        return LlmChat(
            api_key=self.api_key,
            session_id=session_id,
            system_message="You are a credit card rewards optimization expert. Give concise, practical advice."
        ).with_model("openai", "gpt-5.2")
