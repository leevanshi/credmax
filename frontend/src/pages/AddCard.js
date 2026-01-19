import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { cardService } from '../services/api';
import { toast } from 'sonner';

export const AddCard = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    bank_name: '',
    card_name: '',
    last_four: '',
    reward_type: 'cashback',
    reward_rate: '',
    expiry_date: '',
    categories: []
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await cardService.create({
        ...formData,
        reward_rate: parseFloat(formData.reward_rate),
        expiry_date: formData.expiry_date || null
      });
      toast.success('Card added successfully!');
      onNavigate('dashboard');
    } catch (error) {
      toast.error('Failed to add card');
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = ['Food & Dining', 'Travel', 'Groceries', 'Fuel', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Online Shopping', 'Other'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#050505] text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#6366f1] rounded-full filter blur-[128px] opacity-10"></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        <Button
          data-testid="back-to-dashboard-btn"
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
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-[#6366f1]/20 rounded-2xl flex items-center justify-center">
              <CreditCard className="w-7 h-7 text-[#6366f1]" />
            </div>
            <div>
              <h1 className="font-outfit font-bold text-3xl">Add Credit Card</h1>
              <p className="font-dmsans text-gray-400">Enter your card details (no sensitive info required)</p>
            </div>
          </div>

          <form data-testid="add-card-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="bank_name" className="text-gray-300 font-dmsans mb-2 block">Bank Name</Label>
                <Input
                  id="bank_name"
                  data-testid="bank-name-input"
                  value={formData.bank_name}
                  onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                  placeholder="e.g., HDFC, SBI, ICICI"
                  required
                  className="bg-white/5 border-white/10 focus:border-[#6366f1]/50 text-white placeholder:text-gray-500 rounded-xl h-12"
                />
              </div>

              <div>
                <Label htmlFor="card_name" className="text-gray-300 font-dmsans mb-2 block">Card Name</Label>
                <Input
                  id="card_name"
                  data-testid="card-name-input"
                  value={formData.card_name}
                  onChange={(e) => setFormData({ ...formData, card_name: e.target.value })}
                  placeholder="e.g., Regalia, SimplySAVE, Amazon Pay"
                  required
                  className="bg-white/5 border-white/10 focus:border-[#6366f1]/50 text-white placeholder:text-gray-500 rounded-xl h-12"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="last_four" className="text-gray-300 font-dmsans mb-2 block">Last 4 Digits</Label>
                <Input
                  id="last_four"
                  data-testid="last-four-input"
                  value={formData.last_four}
                  onChange={(e) => setFormData({ ...formData, last_four: e.target.value.slice(0, 4) })}
                  placeholder="1234"
                  maxLength={4}
                  required
                  className="bg-white/5 border-white/10 focus:border-[#6366f1]/50 text-white placeholder:text-gray-500 rounded-xl h-12 font-jetbrains"
                />
              </div>

              <div>
                <Label htmlFor="reward_rate" className="text-gray-300 font-dmsans mb-2 block">Reward Rate (multiplier)</Label>
                <Input
                  id="reward_rate"
                  data-testid="reward-rate-input"
                  type="number"
                  step="0.1"
                  value={formData.reward_rate}
                  onChange={(e) => setFormData({ ...formData, reward_rate: e.target.value })}
                  placeholder="e.g., 1.5, 2.0"
                  required
                  className="bg-white/5 border-white/10 focus:border-[#6366f1]/50 text-white placeholder:text-gray-500 rounded-xl h-12"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="expiry_date" className="text-gray-300 font-dmsans mb-2 block">Points Expiry Date (Optional)</Label>
              <Input
                id="expiry_date"
                data-testid="expiry-date-input"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                className="bg-white/5 border-white/10 focus:border-[#6366f1]/50 text-white placeholder:text-gray-500 rounded-xl h-12"
              />
            </div>

            <div>
              <Label className="text-gray-300 font-dmsans mb-3 block">Bonus Categories (Select all that apply)</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categoryOptions.map((category) => (
                  <button
                    key={category}
                    type="button"
                    data-testid={`category-₹{category.toLowerCase()}-btn`}
                    onClick={() => {
                      const newCategories = formData.categories.includes(category)
                        ? formData.categories.filter(c => c !== category)
                        : [...formData.categories, category];
                      setFormData({ ...formData, categories: newCategories });
                    }}
                    className={`p-3 rounded-xl font-dmsans text-sm transition-all duration-300 ₹{
                      formData.categories.includes(category)
                        ? 'bg-[#6366f1] text-white border-[#6366f1]'
                        : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                    } border`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                data-testid="cancel-btn"
                type="button"
                onClick={() => onNavigate('dashboard')}
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-white/10 rounded-full h-12"
              >
                Cancel
              </Button>
              <Button
                data-testid="add-card-submit-btn"
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-full h-12 shadow-lg shadow-[#6366f1]/30"
              >
                {loading ? 'Adding...' : 'Add Card'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
