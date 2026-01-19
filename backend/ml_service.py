from sklearn.cluster import KMeans
import numpy as np
from collections import defaultdict

class MLService:
    def analyze_spending_patterns(self, transactions: list) -> dict:
        if len(transactions) < 3:
            return {
                "clusters": [],
                "monthly_avg": {},
                "trends": "Not enough data for analysis"
            }
        
        category_spending = defaultdict(float)
        monthly_spending = defaultdict(float)
        
        for t in transactions:
            category_spending[t['category']] += t['amount']
            month_key = t['date'][:7] if isinstance(t['date'], str) else t['date'].strftime('%Y-%m')
            monthly_spending[month_key] += t['amount']
        
        if len(category_spending) >= 2:
            categories = list(category_spending.keys())
            amounts = np.array(list(category_spending.values())).reshape(-1, 1)
            
            n_clusters = min(3, len(categories))
            kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
            labels = kmeans.fit_predict(amounts)
            
            clusters = []
            for i in range(n_clusters):
                cluster_categories = [categories[j] for j in range(len(categories)) if labels[j] == i]
                cluster_total = sum(category_spending[cat] for cat in cluster_categories)
                clusters.append({
                    "level": ["Low", "Medium", "High"][i] if n_clusters == 3 else f"Cluster {i+1}",
                    "categories": cluster_categories,
                    "total_spending": round(cluster_total, 2)
                })
        else:
            clusters = [{
                "level": "All",
                "categories": list(category_spending.keys()),
                "total_spending": round(sum(category_spending.values()), 2)
            }]
        
        monthly_avg = {
            category: round(amount / max(len(monthly_spending), 1), 2)
            for category, amount in category_spending.items()
        }
        
        return {
            "clusters": clusters,
            "monthly_avg": monthly_avg,
            "category_totals": {k: round(v, 2) for k, v in category_spending.items()}
        }
    
    def predict_expiry_risk(self, card: dict, transactions: list) -> dict:
        if not card.get('expiry_date'):
            return {"risk": "low", "message": "No expiry date set"}
        
        from datetime import datetime
        try:
            expiry = datetime.fromisoformat(card['expiry_date'].replace('Z', '+00:00'))
            now = datetime.now()
            days_until_expiry = (expiry - now).days
            
            if days_until_expiry < 30:
                return {"risk": "high", "message": f"Points expire in {days_until_expiry} days!", "days": days_until_expiry}
            elif days_until_expiry < 90:
                return {"risk": "medium", "message": f"Points expire in {days_until_expiry} days", "days": days_until_expiry}
            else:
                return {"risk": "low", "message": f"Points expire in {days_until_expiry} days", "days": days_until_expiry}
        except:
            return {"risk": "unknown", "message": "Unable to parse expiry date"}
