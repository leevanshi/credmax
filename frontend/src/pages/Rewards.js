import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Gift, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { rewardsService } from '../services/api';
import { toast } from 'sonner';

export const Rewards = ({ onNavigate }) => {
  const [alerts, setAlerts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = async () => {
    try {
      const [alertsData, suggestionsData] = await Promise.all([
        rewardsService.getExpiryAlerts(),
        rewardsService.getRedemptionSuggestions()
      ]);
      setAlerts(alertsData.alerts);
      setSuggestions(suggestionsData.suggestions);
    } catch (error) {
      toast.error('Failed to load rewards data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#050505] flex items-center justify-center">
        <div className="text-white font-dmsans">Loading rewards...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#050505] text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#10b981] rounded-full filter blur-[128px] opacity-10"></div>
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
            <div className="w-14 h-14 bg-[#10b981]/20 rounded-2xl flex items-center justify-center">
              <Gift className="w-7 h-7 text-[#10b981]" />
            </div>
            <div>
              <h1 className="font-outfit font-bold text-4xl">Rewards & Redemption</h1>
              <p className="font-dmsans text-gray-400">Manage your points and redeem rewards</p>
            </div>
          </div>
        </motion.div>

        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            data-testid="expiry-alerts-section"
            className="backdrop-blur-xl bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-6 h-6 text-[#ef4444]" />
              <h2 className="font-outfit font-bold text-2xl">Expiry Alerts</h2>
            </div>
            <div className="space-y-4">
              {alerts.map((alert, idx) => (
                <div
                  key={idx}
                  data-testid={`alert-${idx}`}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-outfit font-bold text-xl mb-1">{alert.card_name}</h3>
                      <p className="font-dmsans text-sm text-gray-400">{alert.message}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        alert.risk_level === 'high'
                          ? 'bg-[#ef4444] text-white'
                          : 'bg-[#f59e0b] text-white'
                      }`}
                    >
                      {alert.risk_level.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div>
                      <p className="font-dmsans text-sm text-gray-400">Points at Risk</p>
                      <p className="font-outfit font-bold text-2xl">{alert.points_balance.toLocaleString()}</p>
                    </div>
                    <Button
                      data-testid={`redeem-alert-${idx}-btn`}
                      className="bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-full px-6"
                    >
                      Redeem Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {suggestions.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            data-testid="redemption-suggestions"
          >
            <h2 className="font-outfit font-bold text-2xl mb-6">Redemption Suggestions</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {suggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  data-testid={`suggestion-${idx}`}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[#10b981]/20 rounded-xl flex items-center justify-center">
                      <Gift className="w-6 h-6 text-[#10b981]" />
                    </div>
                    <div>
                      <h3 className="font-outfit font-bold text-xl">{suggestion.card_name}</h3>
                      <p className="font-dmsans text-sm text-gray-400">
                        {suggestion.points_balance.toLocaleString()} points available
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {suggestion.redemption_options.map((option, optIdx) => (
                      <div
                        key={optIdx}
                        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#10b981]/50 transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-dmsans text-sm text-gray-400 capitalize">
                              {option.type.replace('_', ' ')}
                            </p>
                            <p className="font-dmsans text-sm">{option.description}</p>
                          </div>
                          <p className="font-outfit font-bold text-xl text-[#10b981]">${option.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            data-testid="no-rewards-message"
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center"
          >
            <Gift className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="font-outfit font-semibold text-xl mb-2">No redemption options yet</h3>
            <p className="font-dmsans text-gray-400 mb-6">Start earning points to unlock redemption options</p>
            <Button
              data-testid="go-to-recommendation-btn"
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
