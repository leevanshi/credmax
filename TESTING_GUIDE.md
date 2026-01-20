# CredMax - Complete Testing Guide

## 🎯 Step-by-Step Testing Instructions

### Step 1: Create Account & Login
1. Go to http://localhost:3000
2. Click "Check Your Rewards Now"
3. Sign up with:
   - Name: `Test User`
   - Email: `test@credmax.com`
   - Password: `test123`

---

## 📋 Test Cards to Add (Add these 5 cards)

### Card 1: HDFC Regalia (Travel & Premium)
```
Bank Name: HDFC Bank
Card Name: Regalia Credit Card
Last 4 Digits: 1234 (optional - leave empty for privacy)
Reward Type: cashback
Reward Rate: 4.0
Points Expiry Date: 2025-03-31
Bonus Categories: ✅ Travel, ✅ Shopping, ✅ Online Shopping
```

### Card 2: SBI SimplyCLICK (Online Shopping)
```
Bank Name: SBI Card
Card Name: SimplyCLICK
Last 4 Digits: (leave empty)
Reward Type: rewards
Reward Rate: 5.0
Points Expiry Date: 2025-04-15
Bonus Categories: ✅ Online Shopping, ✅ Food & Dining
```

### Card 3: ICICI Amazon Pay (E-commerce)
```
Bank Name: ICICI Bank
Card Name: Amazon Pay Credit Card
Last 4 Digits: 5678
Reward Type: cashback
Reward Rate: 5.0
Points Expiry Date: (leave empty - no expiry)
Bonus Categories: ✅ Online Shopping, ✅ Shopping
```

### Card 4: Axis Flipkart (Cashback King)
```
Bank Name: Axis Bank
Card Name: Flipkart Credit Card
Last 4 Digits: (leave empty)
Reward Type: cashback
Reward Rate: 4.0
Points Expiry Date: 2025-02-28
Bonus Categories: ✅ Online Shopping, ✅ Groceries
```

### Card 5: HDFC Swiggy (Food Specialist)
```
Bank Name: HDFC Bank
Card Name: Swiggy Credit Card
Last 4 Digits: 9012
Reward Type: cashback
Reward Rate: 10.0
Points Expiry Date: 2025-05-10
Bonus Categories: ✅ Food & Dining
```

---

## 🧪 Test Scenarios (Do in order)

### Test 1: Add All 5 Cards
1. Dashboard → Click "Add Card"
2. Add each card from above list
3. Return to Dashboard
4. **Expected**: See 5 cards displayed with points balance = 0

---

### Test 2: Smart Recommendations (AI)
1. Dashboard → Click "Get Advice"
2. **Test Recommendation 1:**
   - Category: `Food & Dining`
   - Amount: `500`
   - Click "Get Recommendation"
   - **Expected**: HDFC Swiggy (10x rewards = 5000 points)
   
3. **Test Recommendation 2:**
   - Category: `Online Shopping`
   - Amount: `2000`
   - **Expected**: SBI SimplyCLICK or ICICI Amazon (5x = 10,000 points)

4. **Record Transaction:**
   - After getting recommendation, click "Record This Transaction"
   - Merchant: `Swiggy`
   - Click "Save Transaction"
   - **Expected**: Toast "Transaction recorded!"

---

### Test 3: More Transactions (Create spending history)
Repeat "Smart Recommendations" with these:

```
Transaction 1:
- Category: Travel
- Amount: 3000
- Merchant: MakeMyTrip
- Record it

Transaction 2:
- Category: Groceries
- Amount: 1500
- Merchant: BigBasket
- Record it

Transaction 3:
- Category: Fuel
- Amount: 2000
- Merchant: Indian Oil
- Record it

Transaction 4:
- Category: Bills & Utilities
- Amount: 1200
- Merchant: Airtel
- Record it

Transaction 5:
- Category: Online Shopping
- Amount: 5000
- Merchant: Amazon
- Record it

Transaction 6:
- Category: Food & Dining
- Amount: 800
- Merchant: Zomato
- Record it
```

---

### Test 4: View Transactions History
1. Dashboard → Click "Transactions"
2. **Expected**: See all 7 transactions
3. **Test Filters:**
   - Search: Type "Swiggy"
   - Category: Select "Food & Dining"
   - Date Range: "Last 30 Days"
4. Click "Export CSV"
   - **Expected**: Download CSV file with ₹ symbol

---

### Test 5: Spending Analytics
1. Dashboard → Click "Analytics"
2. **Expected**: 
   - Pie chart showing category breakdown
   - AI insights about your spending
   - ML clustering showing spending levels

---

### Test 6: Rewards & Expiry Alerts
1. Dashboard → Click "Rewards"
2. **Expected**: 
   - See expiry alerts for cards with dates in Feb/March
   - Redemption suggestions for cards with points
   - Risk levels (High/Medium/Low)

---

### Test 7: Spending Trends
1. Dashboard → Click "Trends"
2. Select "Last 3 Months"
3. **Expected**:
   - Line charts showing monthly spending
   - Category trends over time
   - Total spending stats

---

### Test 8: Card Comparison
1. Dashboard → Click "Compare Cards"
2. Select 3 cards (HDFC Regalia, SBI SimplyCLICK, ICICI Amazon)
3. **Expected**:
   - Side-by-side comparison table
   - Scenario analysis (₹100 on Food, ₹200 on Travel)
   - Best for categories highlighted

---

### Test 9: Points Optimizer (🔥 AI-Powered)
1. Dashboard → Click "🔥 Optimizer"
2. **Expected**:
   - Shows recurring bills detected
   - Click "Optimize Now"
   - See AI suggestions for better cards
   - Annual gain estimates

---

### Test 10: Card Recommendations (Get New Cards)
1. Dashboard → Click "🎁 Get New Cards"
2. **Tab 1: Recommended for You**
   - **Expected**: AI recommends cards based on your spending
   - Shows relevance score & matching categories
3. **Tab 2: Co-branded Cards**
   - **Expected**: See Amazon, Flipkart, Vistara, Swiggy cards
4. Click "Apply Now" on any card
   - **Expected**: Opens bank website in new tab

---

### Test 11: GST Expense Tracker
1. Dashboard → Click "GST Tracker"
2. **Expected**:
   - Shows GST-eligible transactions (Fuel, Bills, Travel)
   - Auto-calculated 18% GST
   - Total eligible, Claimed, Pending amounts
3. Click "Mark Claimed" on any transaction
4. Click "Export Report"
   - **Expected**: Download GST CSV

---

### Test 12: Lounge Access Tracker
1. Dashboard → Click "✈️ Lounge Access"
2. **Expected**:
   - Shows cards with lounge access (Premium cards: Regalia)
   - Available lounge visits
   - 8 Indian airports covered
   - Usage progress bars

---

### Test 13: Theme Toggle
1. Dashboard → Click Sun/Moon icon (top right)
2. **Expected**:
   - Background changes from dark to light
   - Cards become white with shadow
   - Text changes to dark color
   - Toggle again to go back to dark

---

## 🎨 What Each Feature Shows

### Dashboard (Main Hub)
- Total reward points across all cards
- Quick actions (11 buttons)
- AI insights banner
- Expiry alerts (red banner if any)
- Card grid with points balance

### AI Features You'll See:
1. **Smart Recommendations**: GPT-5.2 explains WHY you should use a specific card
2. **Spending Insights**: ML-powered analysis of your patterns
3. **Points Optimizer**: AI detects recurring bills & suggests optimizations

### Visual Highlights:
- 🔥 Optimizer button has orange gradient
- 🎁 Get New Cards has purple gradient
- Expiry alerts show in red
- High-value features have special styling

---

## 🐛 If Something Doesn't Work:

### Backend Not Responding:
```bash
sudo supervisorctl status backend
sudo supervisorctl restart backend
```

### Frontend Not Loading:
```bash
sudo supervisorctl status frontend
sudo supervisorctl restart frontend
```

### Check Logs:
```bash
tail -f /var/log/supervisor/backend.err.log
tail -f /var/log/supervisor/frontend.err.log
```

---

## ✅ Expected Results Summary:

After completing all tests, you should have:
- ✅ 5 cards added
- ✅ 7+ transactions recorded
- ✅ Points earned on each card
- ✅ AI recommendations working
- ✅ Spending charts populated
- ✅ Expiry alerts visible
- ✅ Theme toggle working (dark/light)
- ✅ All 12 pages accessible from dashboard
- ✅ GST calculations accurate (18%)
- ✅ Lounge access showing for premium cards
- ✅ Card recommendations based on spending
- ✅ CSV exports downloading

---

## 📊 Expected Dashboard Stats (After All Tests):

```
Total Points: ~32,000-35,000 points
Cards: 5
Transactions: 7
Total Spent: ₹14,000+
GST Eligible: ₹4,700+ (18% = ₹846)
Lounge Access: 6-12 visits available
```

---

## 🎯 Pro Tips:

1. **Test AI Quality**: The more transactions you add, the better the AI insights
2. **Expiry Testing**: Cards with Feb/March dates will show HIGH/MEDIUM risk
3. **Optimizer Magic**: Add 2+ transactions to same merchant (e.g., Swiggy) to trigger recurring bill detection
4. **Card Recommendations**: Your spending on Food = HDFC Swiggy recommendation
5. **Theme Toggle**: Works best on Dashboard, other pages may need refresh

---

## 🚀 Quick Test (5 Minutes):
1. Signup
2. Add HDFC Swiggy card
3. Get recommendation for ₹500 Food
4. Record transaction
5. Check Transactions page
6. Toggle theme
7. ✅ Basic flow verified!

Happy Testing! 🎉
