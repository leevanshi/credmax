import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Plus, TrendingUp, AlertCircle, Sparkles, LogOut, Moon, Sun } from 'lucide-react';
import { Button } from '../components/ui/button';
import { cardService, rewardsService, analyticsService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'sonner';

export const Dashboard = ({ onNavigate }) => {
  const [cards, setCards] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [cardsData, alertsData] = await Promise.all([
        cardService.getAll(),
        rewardsService.getExpiryAlerts()
      ]);
      
      setCards(cardsData);
      setAlerts(alertsData.alerts);

      if (cardsData.length > 0) {
        try {
          const insightsData = await analyticsService.getInsights();
          setInsights(insightsData.insights);
        } catch (error) {
          console.log('No insights yet');
        }
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const totalPoints = cards.reduce((sum, card) => sum + card.points_balance, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#050505] flex items-center justify-center">
        <div className="text-white font-dmsans">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen theme-bg theme-text">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#6366f1] rounded-full filter blur-[128px] opacity-10"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#a855f7] rounded-full filter blur-[128px] opacity-10"></div>
      </div>

      <nav className="relative z-10 px-6 py-6 max-w-7xl mx-auto flex justify-between items-center border-b border-white/10 dark:border-white/10 light:border-black/10">
        <div className="text-2xl font-bold font-outfit">CredMax</div>
        <div className="flex items-center gap-4">
          <span className="font-dmsans theme-text-muted text-sm">Hi, {user?.name}</span>
          <Button
            data-testid="theme-toggle-btn"
            onClick={toggleTheme}
            variant="ghost"
            size="sm"
            className="theme-text-muted hover:text-white rounded-full"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Button
            data-testid="logout-btn"
            onClick={logout}
            variant="ghost"
            size="sm"
            className="theme-text-muted hover:text-white rounded-full"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-outfit font-bold text-4xl mb-2">Dashboard</h1>
          <p className="font-dmsans text-gray-400">Maximize your rewards with smart insights</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            data-testid="total-points-card"
            className="md:col-span-4 backdrop-blur-xl bg-gradient-to-br from-[#6366f1]/20 to-[#a855f7]/20 border border-[#6366f1]/30 rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#6366f1] rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-outfit font-semibold text-lg">Total Rewards</h3>
            </div>
            <div className="font-outfit font-bold text-5xl mb-2">{totalPoints.toLocaleString()}</div>
            <p className="font-dmsans text-sm text-gray-400">points across all cards</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-8 backdrop-blur-xl theme-card border rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-outfit font-semibold text-lg theme-text">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Button
                data-testid="nav-add-card-btn"
                onClick={() => onNavigate('add-card')}
                className="theme-card hover:bg-opacity-80 theme-text rounded-xl h-20 flex flex-col items-center justify-center gap-2 transition-all duration-300 border"
              >
                <Plus className="w-5 h-5" />
                <span className="font-dmsans text-sm">Add Card</span>
              </Button>
              <Button
                data-testid="nav-recommendation-btn"
                onClick={() => onNavigate('recommendation')}
                className="theme-card hover:bg-opacity-80 theme-text rounded-xl h-20 flex flex-col items-center justify-center gap-2 transition-all duration-300 border"
              >
                <Sparkles className="w-5 h-5" />
                <span className="font-dmsans text-sm">Get Advice</span>
              </Button>
              <Button
                data-testid="nav-analytics-btn"
                onClick={() => onNavigate('analytics')}
                className="theme-card hover:bg-opacity-80 theme-text rounded-xl h-20 flex flex-col items-center justify-center gap-2 transition-all duration-300 border"
              >
                <TrendingUp className="w-5 h-5" />
                <span className="font-dmsans text-sm">Analytics</span>
              </Button>
              <Button
                data-testid="nav-rewards-btn"
                onClick={() => onNavigate('rewards')}
                className="theme-card hover:bg-opacity-80 theme-text rounded-xl h-20 flex flex-col items-center justify-center gap-2 transition-all duration-300 border"
              >
                <AlertCircle className="w-5 h-5" />
                <span className="font-dmsans text-sm">Rewards</span>
              </Button>
            </div>
            
            <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Button
                data-testid="nav-transactions-btn"
                onClick={() => onNavigate('transactions')}
                className="theme-card theme-text rounded-xl h-16 flex items-center justify-center gap-2 border transition-all duration-300"
              >
                <span className="font-dmsans text-sm">Transactions</span>
              </Button>
              <Button
                data-testid="nav-comparison-btn"
                onClick={() => onNavigate('comparison')}
                className="theme-card theme-text rounded-xl h-16 flex items-center justify-center gap-2 border transition-all duration-300"
              >
                <span className="font-dmsans text-sm">Compare Cards</span>
              </Button>
              <Button
                data-testid="nav-trends-btn"
                onClick={() => onNavigate('trends')}
                className="theme-card theme-text rounded-xl h-16 flex items-center justify-center gap-2 border transition-all duration-300"
              >
                <span className="font-dmsans text-sm">Trends</span>
              </Button>
              <Button
                data-testid="nav-optimizer-btn"
                onClick={() => onNavigate('optimizer')}
                className="bg-gradient-to-r from-[#f59e0b]/20 to-[#ef4444]/20 hover:from-[#f59e0b]/30 hover:to-[#ef4444]/30 rounded-xl h-16 flex items-center justify-center gap-2 border border-[#f59e0b]/30 transition-all duration-300"
              >
                <span className="font-dmsans text-sm font-semibold text-[#f59e0b]">🔥 Optimizer</span>
              </Button>
            </div>
            
            <div className="mt-4 grid grid-cols-2 lg:grid-cols-3 gap-3">
              <Button
                data-testid="nav-card-recs-btn"
                onClick={() => onNavigate('card-recommendations')}
                className="bg-gradient-to-r from-[#6366f1]/20 to-[#a855f7]/20 hover:from-[#6366f1]/30 hover:to-[#a855f7]/30 rounded-xl h-16 flex items-center justify-center gap-2 border border-[#6366f1]/30 transition-all duration-300"
              >
                <span className="font-dmsans text-sm font-semibold text-[#6366f1]">🎁 Get New Cards</span>
              </Button>
              <Button
                data-testid="nav-gst-btn"
                onClick={() => onNavigate('gst-tracker')}
                className="theme-card theme-text rounded-xl h-16 flex items-center justify-center gap-2 border transition-all duration-300"
              >
                <span className="font-dmsans text-sm">GST Tracker</span>
              </Button>
              <Button
                data-testid="nav-lounge-btn"
                onClick={() => onNavigate('lounge-access')}
                className="theme-card theme-text rounded-xl h-16 flex items-center justify-center gap-2 border transition-all duration-300"
              >
                <span className="font-dmsans text-sm">✈️ Lounge Access</span>
              </Button>
            </div>
          </motion.div>
        </div>

        {insights && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            data-testid="ai-insights-banner"
            className="backdrop-blur-xl bg-gradient-to-r from-[#6366f1]/10 to-[#a855f7]/10 border border-[#6366f1]/30 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#6366f1] rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-outfit font-semibold text-lg mb-2">AI Insights</h3>
                <p className="font-dmsans text-gray-300 text-sm leading-relaxed">{insights}</p>
              </div>
            </div>
          </motion.div>
        )}

        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            data-testid="expiry-alerts-section"
            className="backdrop-blur-xl bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-[#ef4444]" />
              <h3 className="font-outfit font-semibold text-lg">Expiry Alerts</h3>
            </div>
            <div className="space-y-3">
              {alerts.map((alert, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div>
                    <p className="font-dmsans font-medium">{alert.card_name}</p>
                    <p className="font-dmsans text-sm text-gray-400">{alert.message}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-jetbrains font-bold text-lg">{alert.points_balance.toLocaleString()}</p>
                    <p className="font-dmsans text-xs text-gray-400">points</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-outfit font-bold text-2xl">Your Cards</h2>
          </div>

          {cards.length === 0 ? (
            <div data-testid="no-cards-message" className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
              <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="font-outfit font-semibold text-xl mb-2">No cards yet</h3>
              <p className="font-dmsans text-gray-400 mb-6">Add your first credit card to start maximizing rewards</p>
              <Button
                data-testid="add-first-card-btn"
                onClick={() => onNavigate('add-card')}
                className="bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-full px-6"
              >
                Add Your First Card
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card, idx) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  data-testid={`card-item-₹{idx}`}
                  className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 hover:border-[#6366f1]/50 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-[#6366f1]/20 transition-colors">
                      <CreditCard className="w-6 h-6 text-[#6366f1]" />
                    </div>
                    {card.last_four && <span className="font-jetbrains text-sm text-gray-400">****{card.last_four}</span>}
                  </div>
                  <h3 className="font-outfit font-bold text-lg mb-1">{card.card_name}</h3>
                  <p className="font-dmsans text-sm text-gray-400 mb-4">{card.bank_name}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div>
                      <p className="font-dmsans text-xs text-gray-400">Points Balance</p>
                      <p className="font-outfit font-bold text-xl">{card.points_balance.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-dmsans text-xs text-gray-400">Reward Rate</p>
                      <p className="font-outfit font-bold text-xl">{card.reward_rate}x</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
