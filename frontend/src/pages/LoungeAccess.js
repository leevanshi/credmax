import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plane, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { cardService } from '../services/api';
import { toast } from 'sonner';

export const LoungeAccess = ({ onNavigate }) => {
  const [cards, setCards] = useState([]);
  const [loungeVisits, setLoungeVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Popular Indian airports
  const airports = [
    { code: 'DEL', name: 'Delhi (IGI)', lounges: 12 },
    { code: 'BOM', name: 'Mumbai (BOM)', lounges: 15 },
    { code: 'BLR', name: 'Bangalore (BLR)', lounges: 8 },
    { code: 'HYD', name: 'Hyderabad (HYD)', lounges: 6 },
    { code: 'CCU', name: 'Kolkata (CCU)', lounges: 5 },
    { code: 'MAA', name: 'Chennai (MAA)', lounges: 7 },
    { code: 'GOI', name: 'Goa (GOI)', lounges: 3 },
    { code: 'AMD', name: 'Ahmedabad (AMD)', lounges: 4 }
  ];

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const data = await cardService.getAll();
      
      // Calculate lounge access for each card
      const cardsWithLounge = data.map(card => {
        let loungeAccess = 0;
        let loungeType = 'None';
        
        // Premium cards typically have lounge access
        if (card.reward_rate >= 3) {
          loungeAccess = card.reward_rate >= 5 ? 12 : 6; // Premium vs Super Premium
          loungeType = card.reward_rate >= 5 ? 'Unlimited' : 'Quarterly';
        }
        
        return {
          ...card,
          loungeAccess,
          loungeType,
          usedAccess: 0 // Would come from database in production
        };
      });
      
      setCards(cardsWithLounge.filter(c => c.loungeAccess > 0));
    } catch (error) {
      toast.error('Failed to load cards');
    } finally {
      setLoading(false);
    }
  };

  const totalLoungeAccess = cards.reduce((sum, card) => sum + (card.loungeAccess - card.usedAccess), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#050505] flex items-center justify-center">
        <div className="text-white font-dmsans">Loading lounge access...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#050505] text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#3b82f6] rounded-full filter blur-[128px] opacity-10"></div>
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
            <div className="w-14 h-14 bg-[#3b82f6]/20 rounded-2xl flex items-center justify-center">
              <Plane className="w-7 h-7 text-[#3b82f6]" />
            </div>
            <div>
              <h1 className="font-outfit font-bold text-4xl">Airport Lounge Access</h1>
              <p className="font-dmsans text-gray-400">Track your lounge visits across India</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            data-testid="total-access-card"
            className="backdrop-blur-xl bg-gradient-to-br from-[#3b82f6]/20 to-[#6366f1]/20 border border-[#3b82f6]/30 rounded-2xl p-6"
          >
            <p className="font-dmsans text-sm text-gray-400 mb-2">Available Access</p>
            <p className="font-outfit font-bold text-4xl">{totalLoungeAccess}</p>
            <p className="font-dmsans text-xs text-gray-400 mt-1">lounge visits remaining</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            data-testid="eligible-cards-card"
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <p className="font-dmsans text-sm text-gray-400 mb-2">Eligible Cards</p>
            <p className="font-outfit font-bold text-4xl">{cards.length}</p>
            <p className="font-dmsans text-xs text-gray-400 mt-1">with lounge access</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            data-testid="airports-card"
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <p className="font-dmsans text-sm text-gray-400 mb-2">Covered Airports</p>
            <p className="font-outfit font-bold text-4xl">{airports.length}</p>
            <p className="font-dmsans text-xs text-gray-400 mt-1">major Indian airports</p>
          </motion.div>
        </div>

        {cards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            data-testid="no-lounge-access"
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center"
          >
            <Plane className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="font-outfit font-semibold text-xl mb-2">No Lounge Access</h3>
            <p className="font-dmsans text-gray-400 mb-6">
              Upgrade to premium cards for complimentary lounge access
            </p>
            <Button
              data-testid="explore-cards-btn"
              onClick={() => onNavigate('card-recommendations')}
              className="bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-full px-6"
            >
              Explore Premium Cards
            </Button>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="font-outfit font-bold text-2xl mb-6">Your Cards with Lounge Access</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cards.map((card, idx) => (
                  <div
                    key={card.id}
                    data-testid={`lounge-card-${idx}`}
                    className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-outfit font-bold text-lg mb-1">{card.card_name}</h3>
                        <p className="font-dmsans text-sm text-gray-400">{card.bank_name}</p>
                      </div>
                      <div className="backdrop-blur-xl bg-[#3b82f6]/20 rounded-xl px-3 py-1">
                        <span className="font-dmsans text-xs text-[#3b82f6] font-semibold">
                          {card.loungeType}
                        </span>
                      </div>
                    </div>

                    <div className="backdrop-blur-xl bg-white/5 rounded-xl p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-dmsans text-sm text-gray-400">Remaining Access</span>
                        <span className="font-outfit font-bold text-xl">{card.loungeAccess - card.usedAccess}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#3b82f6] h-full rounded-full transition-all duration-300"
                          style={{ width: `${((card.loungeAccess - card.usedAccess) / card.loungeAccess) * 100}%` }}
                        ></div>
                      </div>
                      <p className="font-dmsans text-xs text-gray-500 mt-2">
                        {card.usedAccess} of {card.loungeAccess} used this quarter
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <CheckCircle className="w-4 h-4 text-[#10b981]" />
                      <span className="font-dmsans">Valid at {airports.length} airports across India</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-6 h-6 text-[#3b82f6]" />
                <h2 className="font-outfit font-bold text-2xl">Covered Airports</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {airports.map((airport) => (
                  <div
                    key={airport.code}
                    className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4"
                  >
                    <div className="font-outfit font-bold text-lg mb-1">{airport.code}</div>
                    <div className="font-dmsans text-sm text-gray-400 mb-2">{airport.name}</div>
                    <div className="font-dmsans text-xs text-[#3b82f6]">{airport.lounges} lounges</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};
