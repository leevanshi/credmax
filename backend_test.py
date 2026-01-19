import requests
import sys
import json
from datetime import datetime

class CredMaxAPITester:
    def __init__(self, base_url="https://pointsmax.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.card_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            
            if success:
                self.log_test(name, True)
                try:
                    return response.json() if response.content else {}
                except:
                    return {}
            else:
                error_msg = f"Expected {expected_status}, got {response.status_code}"
                try:
                    error_detail = response.json().get('detail', '')
                    if error_detail:
                        error_msg += f" - {error_detail}"
                except:
                    error_msg += f" - {response.text[:200]}"
                
                self.log_test(name, False, error_msg)
                return {}

        except Exception as e:
            self.log_test(name, False, f"Request failed: {str(e)}")
            return {}

    def test_auth_signup(self):
        """Test user signup"""
        timestamp = datetime.now().strftime('%H%M%S')
        test_user = {
            "name": f"Test User {timestamp}",
            "email": f"test{timestamp}@credmax.com",
            "password": "TestPass123!"
        }
        
        response = self.run_test(
            "User Signup",
            "POST",
            "auth/signup",
            200,
            data=test_user
        )
        
        if response and 'token' in response:
            self.token = response['token']
            self.user_id = response['user']['id']
            return True
        return False

    def test_auth_login(self):
        """Test user login with existing credentials"""
        if not self.token:
            return False
            
        # Try to get user info to verify token works
        response = self.run_test(
            "Get User Info",
            "GET",
            "auth/me",
            200
        )
        return bool(response)

    def test_create_card(self):
        """Test creating a credit card"""
        card_data = {
            "bank_name": "Chase",
            "card_name": "Sapphire Reserve",
            "last_four": "1234",
            "reward_type": "points",
            "reward_rate": 2.0,
            "expiry_date": "2025-12-31",
            "categories": ["Travel", "Food"]
        }
        
        response = self.run_test(
            "Create Credit Card",
            "POST",
            "cards",
            200,
            data=card_data
        )
        
        if response and 'id' in response:
            self.card_id = response['id']
            return True
        return False

    def test_get_cards(self):
        """Test getting all user cards"""
        response = self.run_test(
            "Get All Cards",
            "GET",
            "cards",
            200
        )
        return bool(response)

    def test_get_card_by_id(self):
        """Test getting specific card by ID"""
        if not self.card_id:
            self.log_test("Get Card by ID", False, "No card ID available")
            return False
            
        response = self.run_test(
            "Get Card by ID",
            "GET",
            f"cards/{self.card_id}",
            200
        )
        return bool(response)

    def test_card_recommendation(self):
        """Test AI card recommendation"""
        recommendation_data = {
            "category": "Food",
            "amount": 50.0
        }
        
        response = self.run_test(
            "Get Card Recommendation",
            "POST",
            "recommendations",
            200,
            data=recommendation_data
        )
        return bool(response and 'card_id' in response)

    def test_create_transaction(self):
        """Test creating a transaction"""
        if not self.card_id:
            self.log_test("Create Transaction", False, "No card ID available")
            return False
            
        transaction_data = {
            "card_id": self.card_id,
            "amount": 25.50,
            "category": "Food",
            "merchant": "Starbucks",
            "points_earned": 51
        }
        
        response = self.run_test(
            "Create Transaction",
            "POST",
            "transactions",
            200,
            data=transaction_data
        )
        return bool(response)

    def test_get_transactions(self):
        """Test getting all transactions"""
        response = self.run_test(
            "Get All Transactions",
            "GET",
            "transactions",
            200
        )
        return bool(response)

    def test_spending_patterns(self):
        """Test ML spending pattern analysis"""
        response = self.run_test(
            "Get Spending Patterns",
            "GET",
            "analytics/spending-patterns",
            200
        )
        return bool(response)

    def test_ai_insights(self):
        """Test AI-generated insights"""
        response = self.run_test(
            "Get AI Insights",
            "GET",
            "analytics/insights",
            200
        )
        return bool(response and 'insights' in response)

    def test_expiry_alerts(self):
        """Test reward expiry alerts"""
        response = self.run_test(
            "Get Expiry Alerts",
            "GET",
            "rewards/expiry-alerts",
            200
        )
        return bool(response and 'alerts' in response)

    def test_redemption_suggestions(self):
        """Test redemption suggestions"""
        response = self.run_test(
            "Get Redemption Suggestions",
            "GET",
            "rewards/redemption-suggestions",
            200
        )
        return bool(response and 'suggestions' in response)

    def test_recurring_bills(self):
        """Test recurring bills analysis"""
        response = self.run_test(
            "Get Recurring Bills",
            "GET",
            "optimizer/recurring-bills",
            200
        )
        return bool(response and 'recurring_bills' in response)

    def test_optimizer_optimize(self):
        """Test card optimization recommendations"""
        response = self.run_test(
            "Get Optimization Recommendations",
            "POST",
            "optimizer/optimize",
            200
        )
        return bool(response and 'optimizations' in response)

    def run_all_tests(self):
        """Run complete test suite"""
        print("🚀 Starting CredMax API Test Suite")
        print(f"   Base URL: {self.base_url}")
        print("=" * 60)

        # Authentication Tests
        print("\n📋 AUTHENTICATION TESTS")
        if not self.test_auth_signup():
            print("❌ Signup failed, stopping tests")
            return False

        if not self.test_auth_login():
            print("❌ Login verification failed")

        # Card Management Tests
        print("\n💳 CARD MANAGEMENT TESTS")
        self.test_create_card()
        self.test_get_cards()
        self.test_get_card_by_id()

        # AI & ML Tests
        print("\n🤖 AI & RECOMMENDATION TESTS")
        self.test_card_recommendation()

        # Transaction Tests
        print("\n💰 TRANSACTION TESTS")
        self.test_create_transaction()
        self.test_get_transactions()

        # Analytics Tests
        print("\n📊 ANALYTICS TESTS")
        self.test_spending_patterns()
        self.test_ai_insights()

        # Rewards Tests
        print("\n🎁 REWARDS TESTS")
        self.test_expiry_alerts()
        self.test_redemption_suggestions()

        # Optimizer Tests
        print("\n🔥 OPTIMIZER TESTS")
        self.test_recurring_bills()
        self.test_optimizer_optimize()

        # Print Summary
        print("\n" + "=" * 60)
        print(f"📊 TEST SUMMARY")
        print(f"   Total Tests: {self.tests_run}")
        print(f"   Passed: {self.tests_passed}")
        print(f"   Failed: {self.tests_run - self.tests_passed}")
        print(f"   Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    tester = CredMaxAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'total_tests': tester.tests_run,
            'passed_tests': tester.tests_passed,
            'success_rate': (tester.tests_passed/tester.tests_run)*100 if tester.tests_run > 0 else 0,
            'test_details': tester.test_results
        }, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())