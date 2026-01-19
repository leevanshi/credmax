import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { analyticsService } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { toast } from 'sonner';

export const Analytics = ({ onNavigate }) => {
  const [patterns, setPatterns] = useState(null);
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [patternsData, insightsData] = await Promise.all([
        analyticsService.getPatterns(),
        analyticsService.getInsights()
      ]);
      setPatterns(patternsData);
      setInsights(insightsData.insights);
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#6366f1', '#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const chartData = patterns?.category_totals
    ? Object.entries(patterns.category_totals).map(([name, value]) => ({
        name,
        value
      }))
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#050505] flex items-center justify-center">
        <div className="text-white font-dmsans">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#050505] text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#3b82f6] rounded-full filter blur-[128px] opacity-10"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
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
            <div className="w-14 h-14 bg-[#3b82f6]/20 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-[#3b82f6]" />
            </div>
            <div>
              <h1 className="font-outfit font-bold text-4xl">Spending Analytics</h1>
              <p className="font-dmsans text-gray-400">Understand your spending patterns</p>
            </div>
          </div>
        </motion.div>

        {insights && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            data-testid="insights-section"
            className="backdrop-blur-xl bg-gradient-to-r from-[#6366f1]/10 to-[#a855f7]/10 border border-[#6366f1]/30 rounded-2xl p-6 mb-8"
          >
            <h2 className="font-outfit font-semibold text-xl mb-3">AI Insights</h2>
            <p className="font-dmsans text-gray-300 leading-relaxed">{insights}</p>
          </motion.div>
        )}

        {chartData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              data-testid="spending-chart"
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <h2 className="font-outfit font-semibold text-xl mb-6">Category Breakdown</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(10, 10, 10, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                  <Legend
                    wrapperStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              data-testid="category-list"
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <h2 className="font-outfit font-semibold text-xl mb-6">Spending by Category</h2>
              <div className="space-y-4">
                {Object.entries(patterns.category_totals)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, amount], idx) => (
                    <div key={category} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                        ></div>
                        <span className="font-dmsans font-medium">{category}</span>
                      </div>
                      <span className="font-outfit font-bold text-lg">${amount.toFixed(2)}</span>
                    </div>
                  ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            data-testid="no-data-message"
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center"
          >
            <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="font-outfit font-semibold text-xl mb-2">No spending data yet</h3>
            <p className="font-dmsans text-gray-400 mb-6">Start using the recommendation feature to track your spending</p>
            <Button
              data-testid="go-to-recommendation-btn"
              onClick={() => onNavigate('recommendation')}
              className="bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-full px-6"
            >
              Get Card Recommendation
            </Button>
          </motion.div>
        )}

        {patterns?.clusters && patterns.clusters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            data-testid="spending-clusters"
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mt-8"
          >
            <h2 className="font-outfit font-semibold text-xl mb-6">Spending Clusters (ML Analysis)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {patterns.clusters.map((cluster, idx) => (
                <div key={idx} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
                  <h3 className="font-outfit font-bold text-lg mb-2">{cluster.level} Spending</h3>
                  <p className="font-dmsans text-sm text-gray-400 mb-3">
                    {cluster.categories.join(', ')}
                  </p>
                  <p className="font-outfit font-bold text-2xl">${cluster.total_spending.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
