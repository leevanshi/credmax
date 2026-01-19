import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Receipt, Download, Filter, Search, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { transactionService, cardService } from '../services/api';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const Transactions = ({ onNavigate }) => {
  const [transactions, setTransactions] = useState([]);
  const [cards, setCards] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [cardFilter, setCardFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, categoryFilter, cardFilter, dateRange, transactions]);

  const loadData = async () => {
    try {
      const [txData, cardsData] = await Promise.all([
        transactionService.getAll(),
        cardService.getAll()
      ]);
      setTransactions(txData);
      setCards(cardsData);
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }

    if (cardFilter !== 'all') {
      filtered = filtered.filter(t => t.card_id === cardFilter);
    }

    if (dateRange !== 'all') {
      const now = new Date();
      const days = parseInt(dateRange);
      const cutoff = new Date(now.setDate(now.getDate() - days));
      filtered = filtered.filter(t => new Date(t.date) >= cutoff);
    }

    setFilteredTransactions(filtered);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Merchant', 'Category', 'Amount', 'Card', 'Points Earned'];
    const csvData = filteredTransactions.map(t => {
      const card = cards.find(c => c.id === t.card_id);
      return [
        format(new Date(t.date), 'yyyy-MM-dd'),
        t.merchant,
        t.category,
        `$${t.amount.toFixed(2)}`,
        card ? `${card.bank_name} ${card.card_name}` : 'Unknown',
        t.points_earned
      ];
    });

    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `credmax-transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    toast.success('Transactions exported!');
  };

  const categories = ['Food', 'Travel', 'Groceries', 'Gas', 'Shopping', 'Entertainment', 'Bills', 'Other'];
  const totalSpent = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalPoints = filteredTransactions.reduce((sum, t) => sum + t.points_earned, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#050505] flex items-center justify-center">
        <div className="text-white font-dmsans">Loading transactions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#050505] text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#6366f1] rounded-full filter blur-[128px] opacity-10"></div>
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
            <div className="w-14 h-14 bg-[#6366f1]/20 rounded-2xl flex items-center justify-center">
              <Receipt className="w-7 h-7 text-[#6366f1]" />
            </div>
            <div>
              <h1 className="font-outfit font-bold text-4xl">Transaction History</h1>
              <p className="font-dmsans text-gray-400">View and analyze your spending</p>
            </div>
          </div>
          <Button
            data-testid="export-csv-btn"
            onClick={exportToCSV}
            disabled={filteredTransactions.length === 0}
            className="bg-[#10b981] hover:bg-[#059669] text-white rounded-full px-6"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            data-testid="total-spent-card"
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <p className="font-dmsans text-sm text-gray-400 mb-2">Total Spent</p>
            <p className="font-outfit font-bold text-3xl">${totalSpent.toFixed(2)}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            data-testid="total-points-card"
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <p className="font-dmsans text-sm text-gray-400 mb-2">Points Earned</p>
            <p className="font-outfit font-bold text-3xl">{totalPoints.toLocaleString()}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            data-testid="transaction-count-card"
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <p className="font-dmsans text-sm text-gray-400 mb-2">Transactions</p>
            <p className="font-outfit font-bold text-3xl">{filteredTransactions.length}</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Filter className="w-5 h-5 text-[#6366f1]" />
            <h2 className="font-outfit font-semibold text-xl">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                data-testid="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search merchant..."
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl h-12 pl-11"
              />
            </div>

            <select
              data-testid="category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white/5 border border-white/10 text-white rounded-xl h-12 px-4 font-dmsans focus:border-[#6366f1]/50 focus:outline-none"
            >
              <option value="all" className="bg-[#0A0A0A]">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-[#0A0A0A]">{cat}</option>
              ))}
            </select>

            <select
              data-testid="card-filter"
              value={cardFilter}
              onChange={(e) => setCardFilter(e.target.value)}
              className="bg-white/5 border border-white/10 text-white rounded-xl h-12 px-4 font-dmsans focus:border-[#6366f1]/50 focus:outline-none"
            >
              <option value="all" className="bg-[#0A0A0A]">All Cards</option>
              {cards.map(card => (
                <option key={card.id} value={card.id} className="bg-[#0A0A0A]">
                  {card.bank_name} {card.card_name}
                </option>
              ))}
            </select>

            <select
              data-testid="date-filter"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-white/5 border border-white/10 text-white rounded-xl h-12 px-4 font-dmsans focus:border-[#6366f1]/50 focus:outline-none"
            >
              <option value="all" className="bg-[#0A0A0A]">All Time</option>
              <option value="7" className="bg-[#0A0A0A]">Last 7 Days</option>
              <option value="30" className="bg-[#0A0A0A]">Last 30 Days</option>
              <option value="90" className="bg-[#0A0A0A]">Last 90 Days</option>
            </select>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
        >
          {filteredTransactions.length === 0 ? (
            <div data-testid="no-transactions-message" className="p-12 text-center">
              <Receipt className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="font-outfit font-semibold text-xl mb-2">No transactions found</h3>
              <p className="font-dmsans text-gray-400">Try adjusting your filters or record some transactions</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left font-outfit font-semibold text-sm">Date</th>
                    <th className="px-6 py-4 text-left font-outfit font-semibold text-sm">Merchant</th>
                    <th className="px-6 py-4 text-left font-outfit font-semibold text-sm">Category</th>
                    <th className="px-6 py-4 text-left font-outfit font-semibold text-sm">Card</th>
                    <th className="px-6 py-4 text-right font-outfit font-semibold text-sm">Amount</th>
                    <th className="px-6 py-4 text-right font-outfit font-semibold text-sm">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction, idx) => {
                    const card = cards.find(c => c.id === transaction.card_id);
                    return (
                      <tr
                        key={transaction.id}
                        data-testid={`transaction-row-${idx}`}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4 font-dmsans text-sm text-gray-400">
                          {format(new Date(transaction.date), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 font-dmsans text-sm">{transaction.merchant}</td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-3 py-1 bg-[#6366f1]/20 text-[#6366f1] rounded-full text-xs font-medium">
                            {transaction.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-dmsans text-sm text-gray-400">
                          {card ? `${card.bank_name} ****${card.last_four}` : 'Unknown'}
                        </td>
                        <td className="px-6 py-4 text-right font-outfit font-semibold">
                          ${transaction.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right font-outfit font-semibold text-[#10b981]">
                          +{transaction.points_earned}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};