import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, TrendingUp, Check, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { cardService } from '../services/api';
import { toast } from 'sonner';

export const CardComparison = ({ onNavigate }) => {
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const data = await cardService.getAll();
      setCards(data);
    } catch (error) {
      toast.error('Failed to load cards');
    } finally {
      setLoading(false);
    }
  };

  const toggleCard = (cardId) => {
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter(id => id !== cardId));
    } else if (selectedCards.length < 3) {
      setSelectedCards([...selectedCards, cardId]);
    } else {
      toast.error('Maximum 3 cards can be compared');
    }
  };

  const comparedCards = cards.filter(card => selectedCards.includes(card.id));

  const categories = ['Food', 'Travel', 'Groceries', 'Gas', 'Shopping', 'Entertainment', 'Bills', 'Other'];

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
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#a855f7] rounded-full filter blur-[128px] opacity-10"></div>
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
            <div className="w-14 h-14 bg-[#a855f7]/20 rounded-2xl flex items-center justify-center">
              <CreditCard className="w-7 h-7 text-[#a855f7]" />
            </div>
            <div>
              <h1 className="font-outfit font-bold text-4xl">Card Comparison</h1>
              <p className="font-dmsans text-gray-400">Compare up to 3 cards side-by-side</p>
            </div>
          </div>
        </motion.div>

        {cards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            data-testid="no-cards-message"
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center"
          >
            <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="font-outfit font-semibold text-xl mb-2">No cards to compare</h3>
            <p className="font-dmsans text-gray-400 mb-6">Add at least 2 cards to start comparing</p>
            <Button
              data-testid="add-card-btn"
              onClick={() => onNavigate('add-card')}
              className="bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-full px-6"
            >
              Add Card
            </Button>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-8"
            >
              <h2 className="font-outfit font-semibold text-xl mb-4">Select Cards to Compare ({selectedCards.length}/3)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card, idx) => (
                  <button
                    key={card.id}
                    data-testid={`select-card-${idx}`}
                    onClick={() => toggleCard(card.id)}
                    className={`p-4 rounded-xl border transition-all duration-300 text-left ${
                      selectedCards.includes(card.id)
                        ? 'bg-[#a855f7]/20 border-[#a855f7]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-outfit font-bold text-lg">{card.card_name}</h3>
                      {selectedCards.includes(card.id) && (
                        <Check className="w-5 h-5 text-[#a855f7]" />
                      )}
                    </div>
                    <p className="font-dmsans text-sm text-gray-400">{card.bank_name}</p>
                    <p className="font-jetbrains text-xs text-gray-500 mt-1">****{card.last_four}</p>
                  </button>
                ))}
              </div>
            </motion.div>

            {comparedCards.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                data-testid="comparison-table"
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4 text-left font-outfit font-semibold">Feature</th>
                        {comparedCards.map((card) => (
                          <th key={card.id} className="px-6 py-4 text-center font-outfit font-semibold">
                            <div>{card.card_name}</div>
                            <div className="font-dmsans text-sm text-gray-400 font-normal mt-1">{card.bank_name}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/5 hover:bg-white/5">
                        <td className="px-6 py-4 font-dmsans font-semibold">Base Reward Rate</td>
                        {comparedCards.map((card) => (
                          <td key={card.id} className="px-6 py-4 text-center font-outfit text-xl font-bold text-[#10b981]">
                            {card.reward_rate}x
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/5 hover:bg-white/5">
                        <td className="px-6 py-4 font-dmsans font-semibold">Points Balance</td>
                        {comparedCards.map((card) => (
                          <td key={card.id} className="px-6 py-4 text-center font-outfit text-lg">
                            {card.points_balance.toLocaleString()}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/5 hover:bg-white/5">
                        <td className="px-6 py-4 font-dmsans font-semibold">Points Value</td>
                        {comparedCards.map((card) => (
                          <td key={card.id} className="px-6 py-4 text-center font-outfit text-lg">
                            ${(card.points_balance * 0.01).toFixed(2)}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/5 hover:bg-white/5">
                        <td className="px-6 py-4 font-dmsans font-semibold">Reward Type</td>
                        {comparedCards.map((card) => (
                          <td key={card.id} className="px-6 py-4 text-center">
                            <span className="inline-block px-3 py-1 bg-[#6366f1]/20 text-[#6366f1] rounded-full text-sm font-medium capitalize">
                              {card.reward_type}
                            </span>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/5 hover:bg-white/5">
                        <td className="px-6 py-4 font-dmsans font-semibold">Bonus Categories</td>
                        {comparedCards.map((card) => (
                          <td key={card.id} className="px-6 py-4 text-center">
                            {card.categories.length > 0 ? (
                              <div className="flex flex-wrap gap-1 justify-center">
                                {card.categories.map((cat) => (
                                  <span key={cat} className="inline-block px-2 py-1 bg-white/10 text-gray-300 rounded-md text-xs">
                                    {cat}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-500 text-sm">None</span>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-white/5">
                        <td className="px-6 py-4 font-dmsans font-semibold">Points Expiry</td>
                        {comparedCards.map((card) => (
                          <td key={card.id} className="px-6 py-4 text-center font-dmsans text-sm">
                            {card.expiry_date ? (
                              <span className="text-[#f59e0b]">
                                {new Date(card.expiry_date).toLocaleDateString()}
                              </span>
                            ) : (
                              <span className="text-[#10b981]">No expiry</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-6 bg-white/5 border-t border-white/10">
                  <h3 className="font-outfit font-semibold text-lg mb-4">Scenario Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {comparedCards.map((card) => {
                      const foodBonus = card.categories.includes('Food') ? 1.5 : 1;
                      const travelBonus = card.categories.includes('Travel') ? 1.5 : 1;
                      const groceriesBonus = card.categories.includes('Groceries') ? 1.5 : 1;

                      return (
                        <div key={card.id} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
                          <h4 className="font-outfit font-bold text-sm mb-3">{card.card_name}</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">$100 on Food:</span>
                              <span className="font-semibold text-[#10b981]">+{Math.round(100 * card.reward_rate * foodBonus)} pts</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">$200 on Travel:</span>
                              <span className="font-semibold text-[#10b981]">+{Math.round(200 * card.reward_rate * travelBonus)} pts</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">$150 on Groceries:</span>
                              <span className="font-semibold text-[#10b981]">+{Math.round(150 * card.reward_rate * groceriesBonus)} pts</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};