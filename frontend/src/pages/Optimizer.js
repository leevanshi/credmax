import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, TrendingUp, CreditCard, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const getHeaders = () => {
  const token = localStorage.getItem('credmax_token');
  return { Authorization: `Bearer ${token}` };
};

export const Optimizer = ({ onNavigate }) => {
  const [recurringBills, setRecurringBills] = useState([]);
  const [optimizations, setOptimizations] = useState([]);
  const [insights, setInsights] = useState('');
  const [totalGain, setTotalGain] = useState(0);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    loadRecurringBills();
  }, []);

  const loadRecurringBills = async () => {
    try {
      const response = await axios.get(`${API}/optimizer/recurring-bills`, { headers: getHeaders() });
      setRecurringBills(response.data.recurring_bills);
    } catch (error) {
      toast.error('Failed to load recurring bills');
    } finally {
      setLoading(false);
    }
  };

  const runOptimization = async () => {
    setOptimizing(true);
    try {
      const response = await axios.post(`${API}/optimizer/optimize`, {}, { headers: getHeaders() });
      setOptimizations(response.data.optimizations);
      setInsights(response.data.insights);
      setTotalGain(response.data.total_annual_gain);
      toast.success('Optimization complete!');
    } catch (error) {
      toast.error('Failed to optimize');
    } finally {
      setOptimizing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#050505] flex items-center justify-center">
        <div className="text-white font-dmsans">Loading optimizer...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#050505] text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#f59e0b] rounded-full filter blur-[128px] opacity-10"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
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
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 bg-[#f59e0b]/20 rounded-2xl flex items-center justify-center">
              <Zap className="w-7 h-7 text-[#f59e0b]" />
            </div>
            <div>
              <h1 className="font-outfit font-bold text-4xl">Points Optimizer</h1>
              <p className="font-dmsans text-gray-400">Maximize rewards on recurring bills</p>
            </div>
          </div>
        </motion.div>

        {recurringBills.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            data-testid="no-recurring-bills"
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center"
          >
            <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="font-outfit font-semibold text-xl mb-2">No recurring bills detected</h3>
            <p className="font-dmsans text-gray-400 mb-6">Record at least 2 transactions with the same merchant to identify patterns</p>
            <Button
              data-testid="get-recommendation-btn"
              onClick={() => onNavigate('recommendation')}
              className="bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-full px-6"
            >
              Get Card Recommendation
            </Button>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              data-testid="recurring-bills-section"
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-outfit font-semibold text-xl">Your Recurring Bills</h2>
                <Button
                  data-testid="optimize-btn"
                  onClick={runOptimization}
                  disabled={optimizing}
                  className="bg-[#f59e0b] hover:bg-[#d97706] text-white rounded-full px-6 shadow-lg shadow-[#f59e0b]/30"
                >
                  {optimizing ? (
                    'Optimizing...'
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Optimize Now
                    </>
                  )}
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recurringBills.map((bill, idx) => (
                  <div
                    key={idx}
                    data-testid={`recurring-bill-${idx}`}
                    className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-outfit font-bold text-lg">{bill.merchant}</h3>
                      <span className="px-2 py-1 bg-[#6366f1]/20 text-[#6366f1] rounded-md text-xs font-medium">
                        {bill.category}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between text-gray-400">
                        <span>Frequency:</span>
                        <span className="font-semibold text-white">{bill.frequency}x</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Avg Amount:</span>
                        <span className="font-semibold text-white">${bill.avg_amount}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Total Spent:</span>
                        <span className="font-semibold text-[#f59e0b]">${bill.total_spent}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {optimizations.length > 0 && (
              <>
                {totalGain > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    data-testid="potential-gain-banner"
                    className="backdrop-blur-xl bg-gradient-to-r from-[#10b981]/20 to-[#3b82f6]/20 border border-[#10b981]/30 rounded-2xl p-6 mb-8"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[#10b981] rounded-2xl flex items-center justify-center">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-outfit font-bold text-2xl mb-1">Potential Annual Gain</h3>
                        <p className="font-dmsans text-gray-300">By optimizing your recurring bills</p>
                      </div>
                      <div className="text-right">
                        <p className="font-outfit font-bold text-5xl text-[#10b981]">+{totalGain.toLocaleString()}</p>
                        <p className="font-dmsans text-sm text-gray-400">points per year</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {insights && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    data-testid="ai-insights"
                    className="backdrop-blur-xl bg-gradient-to-r from-[#6366f1]/10 to-[#a855f7]/10 border border-[#6366f1]/30 rounded-2xl p-6 mb-8"
                  >
                    <h3 className="font-outfit font-semibold text-xl mb-3">AI Insights</h3>
                    <p className="font-dmsans text-gray-300 leading-relaxed">{insights}</p>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  data-testid="optimization-results"
                >
                  <h2 className="font-outfit font-bold text-2xl mb-6">Optimization Recommendations</h2>
                  <div className="space-y-4">
                    {optimizations.map((opt, idx) => (
                      <div
                        key={idx}
                        data-testid={`optimization-${idx}`}
                        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#10b981]/50 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-outfit font-bold text-xl mb-1">{opt.merchant}</h3>
                            <p className="font-dmsans text-sm text-gray-400">
                              {opt.category} • ~${opt.avg_amount} per transaction
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-outfit font-bold text-2xl text-[#10b981]">+{opt.points_gain}</p>
                            <p className="font-dmsans text-xs text-gray-400">pts/transaction</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <CreditCard className="w-4 h-4 text-gray-400" />
                              <p className="font-dmsans text-xs text-gray-400">Current Card</p>
                            </div>
                            <p className="font-outfit font-semibold text-sm mb-1">{opt.current_card}</p>
                            <p className="font-dmsans text-xs text-gray-400">{opt.current_points} points per transaction</p>
                          </div>
                          <div className="backdrop-blur-xl bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Zap className="w-4 h-4 text-[#10b981]" />
                              <p className="font-dmsans text-xs text-[#10b981]">Recommended Card</p>
                            </div>
                            <p className="font-outfit font-semibold text-sm mb-1">{opt.recommended_card}</p>
                            <p className="font-dmsans text-xs text-gray-400">{opt.optimized_points} points per transaction</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <p className="font-dmsans text-sm text-gray-400">Estimated Annual Gain</p>
                          <p className="font-outfit font-bold text-lg text-[#10b981]">+{opt.annual_gain_estimate} points/year</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};