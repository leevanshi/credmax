import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, RupeeSign, Tag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { recommendationService, transactionService } from '../services/api';
import { toast } from 'sonner';

export const Recommendation = ({ onNavigate }) => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recordTransaction, setRecordTransaction] = useState(false);
  const [merchant, setMerchant] = useState('');

  const handleGetRecommendation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRecommendation(null);

    try {
      const result = await recommendationService.get(category, parseFloat(amount));
      setRecommendation(result);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to get recommendation');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordTransaction = async () => {
    if (!merchant.trim()) {
      toast.error('Please enter merchant name');
      return;
    }

    try {
      await transactionService.create({
        card_id: recommendation.card_id,
        amount: parseFloat(amount),
        category,
        merchant,
        points_earned: recommendation.points_earned
      });
      toast.success('Transaction recorded!');
      setRecordTransaction(false);
      setCategory('');
      setAmount('');
      setMerchant('');
      setRecommendation(null);
    } catch (error) {
      toast.error('Failed to record transaction');
    }
  };

  const categories = ['Food', 'Travel', 'Groceries', 'Gas', 'Shopping', 'Entertainment', 'Bills', 'Other'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#050505] text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#a855f7] rounded-full filter blur-[128px] opacity-10"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <Button
          data-testid="back-btn"
          onClick={() => onNavigate('dashboard')}
          variant="ghost"
          className="text-gray-400 hover:text-white mb-8 rounded-full"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 mb-8"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-[#a855f7]/20 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-[#a855f7]" />
            </div>
            <div>
              <h1 className="font-outfit font-bold text-3xl">Smart Recommendation</h1>
              <p className="font-dmsans text-gray-400">Find the best card for your purchase</p>
            </div>
          </div>

          <form data-testid="recommendation-form" onSubmit={handleGetRecommendation} className="space-y-6">
            <div>
              <Label className="text-gray-300 font-dmsans mb-3 block">Category</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    data-testid={`category-₹{cat.toLowerCase()}-btn`}
                    onClick={() => setCategory(cat)}
                    className={`p-3 rounded-xl font-dmsans text-sm transition-all duration-300 ₹{
                      category === cat
                        ? 'bg-[#a855f7] text-white border-[#a855f7]'
                        : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                    } border`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="amount" className="text-gray-300 font-dmsans mb-2 block">Amount (₹)</Label>
              <div className="relative">
                <RupeeSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="amount"
                  data-testid="amount-input"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                  className="bg-white/5 border-white/10 focus:border-[#a855f7]/50 text-white placeholder:text-gray-500 rounded-xl h-14 pl-12 text-lg"
                />
              </div>
            </div>

            <Button
              data-testid="get-recommendation-btn"
              type="submit"
              disabled={loading || !category || !amount}
              className="w-full bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-full h-14 text-base font-medium shadow-lg shadow-[#a855f7]/30 transition-all duration-300"
            >
              {loading ? 'Analyzing...' : 'Get Recommendation'}
            </Button>
          </form>
        </motion.div>

        {recommendation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            data-testid="recommendation-result"
            className="backdrop-blur-xl bg-gradient-to-br from-[#10b981]/10 to-[#3b82f6]/10 border border-[#10b981]/30 rounded-3xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#10b981] rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h2 className="font-outfit font-bold text-2xl">Best Card for This Purchase</h2>
            </div>

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-outfit font-bold text-2xl mb-2">{recommendation.card_name}</h3>
                  <p className="font-dmsans text-gray-400">{recommendation.bank_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-dmsans text-sm text-gray-400">You'll earn</p>
                  <p className="font-outfit font-bold text-3xl text-[#10b981]">{recommendation.points_earned}</p>
                  <p className="font-dmsans text-sm text-gray-400">points</p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="font-dmsans text-sm text-gray-300 leading-relaxed">{recommendation.reason}</p>
              </div>
            </div>

            {!recordTransaction ? (
              <Button
                data-testid="record-transaction-btn"
                onClick={() => setRecordTransaction(true)}
                className="w-full bg-white/10 hover:bg-white/20 text-white rounded-full h-12 border border-white/20"
              >
                Record This Transaction
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="merchant" className="text-gray-300 font-dmsans mb-2 block">Merchant Name</Label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      id="merchant"
                      data-testid="merchant-input"
                      value={merchant}
                      onChange={(e) => setMerchant(e.target.value)}
                      placeholder="e.g., Starbucks, Amazon"
                      className="bg-white/5 border-white/10 focus:border-[#10b981]/50 text-white placeholder:text-gray-500 rounded-xl h-12 pl-12"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    data-testid="cancel-record-btn"
                    onClick={() => setRecordTransaction(false)}
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white/10 rounded-full h-12"
                  >
                    Cancel
                  </Button>
                  <Button
                    data-testid="save-transaction-btn"
                    onClick={handleRecordTransaction}
                    className="flex-1 bg-[#10b981] hover:bg-[#059669] text-white rounded-full h-12"
                  >
                    Save Transaction
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};
