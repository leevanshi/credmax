import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { transactionService } from '../services/api';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { format, startOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

export const Trends = ({ onNavigate }) => {
  const [transactions, setTransactions] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryTrends, setCategoryTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(6);

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    try {
      const data = await transactionService.getAll();
      setTransactions(data);
      processData(data);
    } catch (error) {
      toast.error('Failed to load trends');
    } finally {
      setLoading(false);
    }
  };

  const processData = (txData) => {
    const now = new Date();
    const months = eachMonthOfInterval({
      start: subMonths(startOfMonth(now), timeRange - 1),
      end: now
    });

    const monthlySpending = months.map(month => {
      const monthKey = format(month, 'yyyy-MM');
      const monthTxs = txData.filter(t => {
        const txDate = new Date(t.date);
        return format(txDate, 'yyyy-MM') === monthKey;
      });

      const spending = monthTxs.reduce((sum, t) => sum + t.amount, 0);
      const points = monthTxs.reduce((sum, t) => sum + t.points_earned, 0);

      return {
        month: format(month, 'MMM yyyy'),
        spending: parseFloat(spending.toFixed(2)),
        points,
        transactions: monthTxs.length
      };
    });

    setMonthlyData(monthlySpending);

    const categories = ['Food', 'Travel', 'Groceries', 'Gas', 'Shopping', 'Entertainment', 'Bills', 'Other'];
    const categoryData = months.map(month => {
      const monthKey = format(month, 'yyyy-MM');
      const monthTxs = txData.filter(t => {
        const txDate = new Date(t.date);
        return format(txDate, 'yyyy-MM') === monthKey;
      });

      const result = { month: format(month, 'MMM yyyy') };
      categories.forEach(cat => {
        result[cat] = monthTxs
          .filter(t => t.category === cat)
          .reduce((sum, t) => sum + t.amount, 0);
      });

      return result;
    });

    setCategoryTrends(categoryData);
  };

  const totalSpending = monthlyData.reduce((sum, m) => sum + m.spending, 0);
  const avgMonthly = monthlyData.length > 0 ? totalSpending / monthlyData.length : 0;
  const trend = monthlyData.length >= 2 
    ? ((monthlyData[monthlyData.length - 1].spending - monthlyData[0].spending) / monthlyData[0].spending) * 100
    : 0;

  const COLORS = ['#6366f1', '#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#050505] flex items-center justify-center">
        <div className="text-white font-dmsans">Loading trends...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#050505] text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#3b82f6] rounded-full filter blur-[128px] opacity-10"></div>
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
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#3b82f6]/20 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-[#3b82f6]" />
            </div>
            <div>
              <h1 className="font-outfit font-bold text-4xl">Spending Trends</h1>
              <p className="font-dmsans text-gray-400">Visualize your spending over time</p>
            </div>
          </div>
          <select
            data-testid="time-range-select"
            value={timeRange}
            onChange={(e) => setTimeRange(parseInt(e.target.value))}
            className="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 font-dmsans focus:border-[#3b82f6]/50 focus:outline-none"
          >
            <option value="3" className="bg-[#0A0A0A]">Last 3 Months</option>
            <option value="6" className="bg-[#0A0A0A]">Last 6 Months</option>
            <option value="12" className="bg-[#0A0A0A]">Last 12 Months</option>
          </select>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            data-testid="total-spending-card"
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <p className="font-dmsans text-sm text-gray-400 mb-2">Total Spending</p>
            <p className="font-outfit font-bold text-3xl mb-1">₹{totalSpending.toFixed(2)}</p>
            <p className="font-dmsans text-xs text-gray-400">Last {timeRange} months</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            data-testid="avg-monthly-card"
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <p className="font-dmsans text-sm text-gray-400 mb-2">Avg Monthly</p>
            <p className="font-outfit font-bold text-3xl mb-1">₹{avgMonthly.toFixed(2)}</p>
            <p className="font-dmsans text-xs text-gray-400">Per month</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            data-testid="trend-card"
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <p className="font-dmsans text-sm text-gray-400 mb-2">Trend</p>
            <p className={`font-outfit font-bold text-3xl mb-1 ₹{trend >= 0 ? 'text-[#ef4444]' : 'text-[#10b981]'}`}>
              {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
            </p>
            <p className="font-dmsans text-xs text-gray-400">{trend >= 0 ? 'Increase' : 'Decrease'}</p>
          </motion.div>
        </div>

        {monthlyData.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              data-testid="spending-chart"
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-8"
            >
              <h2 className="font-outfit font-semibold text-xl mb-6">Monthly Spending & Points</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(10, 10, 10, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                  <Legend wrapperStyle={{ color: '#fff' }} />
                  <Area type="monotone" dataKey="spending" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} name="Spending ($)" />
                  <Area type="monotone" dataKey="points" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Points Earned" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              data-testid="category-trends-chart"
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <h2 className="font-outfit font-semibold text-xl mb-6">Category Trends</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={categoryTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(10, 10, 10, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                  <Legend wrapperStyle={{ color: '#fff' }} />
                  {['Food', 'Travel', 'Groceries', 'Gas', 'Shopping', 'Entertainment', 'Bills', 'Other'].map((category, idx) => (
                    <Line
                      key={category}
                      type="monotone"
                      dataKey={category}
                      stroke={COLORS[idx]}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            data-testid="no-data-message"
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center"
          >
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="font-outfit font-semibold text-xl mb-2">No trend data available</h3>
            <p className="font-dmsans text-gray-400 mb-6">Record transactions to see spending trends over time</p>
            <Button
              data-testid="get-recommendation-btn"
              onClick={() => onNavigate('recommendation')}
              className="bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-full px-6"
            >
              Get Card Recommendation
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};