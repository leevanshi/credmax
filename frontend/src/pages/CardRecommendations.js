import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, ExternalLink, Award, Gift, TrendingUp, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const getHeaders = () => {
  const token = localStorage.getItem('credmax_token');
  return { Authorization: `Bearer ${token}` };
};

export const CardRecommendations = ({ onNavigate }) => {
  const [recommendedCards, setRecommendedCards] = useState([]);
  const [coBrandedCards, setCoBrandedCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recommended');

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const [recommended, cobranded] = await Promise.all([
        axios.get(`${API}/referrals/recommended-cards`, { headers: getHeaders() }),
        axios.get(`${API}/referrals/co-branded-cards`, { headers: getHeaders() })
      ]);
      setRecommendedCards(recommended.data.recommended_cards);
      setCoBrandedCards(cobranded.data.co_branded_cards);
    } catch (error) {
      toast.error('Failed to load card recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (card) => {
    try {
      const response = await axios.post(
        `${API}/referrals/track-application/${card.id}`,
        {},
        { headers: getHeaders() }
      );
      
      if (response.data.success) {
        window.open(response.data.apply_url, '_blank');
        toast.success('Opening application page...');
      }
    } catch (error) {
      toast.error('Failed to track application');
    }
  };

  const CardItem = ({ card, showRelevance = false }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#6366f1]/50 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-outfit font-bold text-xl">{card.name}</h3>
            {card.co_branded && (
              <span className="px-2 py-1 bg-[#a855f7]/20 text-[#a855f7] rounded-md text-xs font-semibold">
                {card.co_branded}
              </span>
            )}
          </div>
          <p className="font-dmsans text-sm text-gray-400">{card.bank}</p>
        </div>
        <div className="text-right">
          <div className="font-outfit font-bold text-2xl text-[#10b981]">{card.reward_rate}x</div>
          <div className="font-dmsans text-xs text-gray-400">Reward Rate</div>
        </div>
      </div>

      {showRelevance && card.relevance_score > 0 && (
        <div className="backdrop-blur-xl bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl p-3 mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#10b981]" />
            <span className="font-dmsans text-sm text-[#10b981] font-semibold">
              Highly relevant for your spending
            </span>
          </div>
          {card.matching_categories.length > 0 && (
            <p className="font-dmsans text-xs text-gray-400 mt-1">
              Matches: {card.matching_categories.join(', ')}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="backdrop-blur-xl bg-white/5 rounded-xl p-3">
          <div className="font-dmsans text-xs text-gray-400 mb-1">Annual Fee</div>
          <div className="font-outfit font-bold">₹{card.annual_fee.toLocaleString()}</div>
        </div>
        <div className="backdrop-blur-xl bg-white/5 rounded-xl p-3">
          <div className="font-dmsans text-xs text-gray-400 mb-1">Welcome Bonus</div>
          <div className="font-outfit font-bold text-[#f59e0b]">{card.welcome_bonus.toLocaleString()} pts</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="font-dmsans text-sm font-semibold mb-2">Key Benefits:</div>
        <ul className="space-y-1">
          {card.benefits.slice(0, 3).map((benefit, idx) => (
            <li key={idx} className="font-dmsans text-xs text-gray-400 flex items-start gap-2">
              <Award className="w-3 h-3 text-[#6366f1] mt-0.5 flex-shrink-0" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div>
          <div className="font-dmsans text-xs text-gray-400">Best For</div>
          <div className="font-dmsans text-sm font-semibold">{card.best_for}</div>
        </div>
        <Button
          onClick={() => handleApply(card)}
          className="bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-full px-6"
        >
          Apply Now <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#050505] flex items-center justify-center">
        <div className="text-white font-dmsans">Loading cards...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#050505] text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#6366f1] rounded-full filter blur-[128px] opacity-10"></div>
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
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-[#6366f1]/20 rounded-2xl flex items-center justify-center">
              <Gift className="w-7 h-7 text-[#6366f1]" />
            </div>
            <div>
              <h1 className="font-outfit font-bold text-4xl">Get New Credit Cards</h1>
              <p className="font-dmsans text-gray-400">AI-recommended cards based on your spending</p>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-gradient-to-r from-[#f59e0b]/10 to-[#ef4444]/10 border border-[#f59e0b]/30 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-[#f59e0b]" />
              <div>
                <p className="font-dmsans text-sm text-gray-300">
                  <strong>Important:</strong> We may earn a commission if you're approved for these cards. This helps us keep CredMax free for you!
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-4 mb-8">
          <Button
            data-testid="tab-recommended"
            onClick={() => setActiveTab('recommended')}
            className={`rounded-full px-6 ${
              activeTab === 'recommended'
                ? 'bg-[#6366f1] text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Recommended for You
          </Button>
          <Button
            data-testid="tab-cobranded"
            onClick={() => setActiveTab('cobranded')}
            className={`rounded-full px-6 ${
              activeTab === 'cobranded'
                ? 'bg-[#6366f1] text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Co-branded Cards
          </Button>
        </div>

        {activeTab === 'recommended' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendedCards.length > 0 ? (
              recommendedCards.map((card) => (
                <CardItem key={card.id} card={card} showRelevance={true} />
              ))
            ) : (
              <div className="col-span-2 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="font-outfit font-semibold text-xl mb-2">No Recommendations Yet</h3>
                <p className="font-dmsans text-gray-400">Add transactions to get personalized card recommendations</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {coBrandedCards.map((card) => (
              <CardItem key={card.id} card={card} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
