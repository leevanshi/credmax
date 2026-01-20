import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Receipt, Download, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { transactionService } from '../services/api';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const GSTTracker = ({ onNavigate }) => {
  const [transactions, setTransactions] = useState([]);
  const [gstTransactions, setGstTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quarter, setQuarter] = useState('Q4-2024');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await transactionService.getAll();
      setTransactions(data);
      
      // Filter GST-eligible transactions (business expenses)
      const gstEligible = data.filter(t => 
        ['Bills & Utilities', 'Fuel', 'Travel', 'Shopping'].includes(t.category)
      );
      setGstTransactions(gstEligible);
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const toggleGST = (txId) => {
    setGstTransactions(prev => {
      const tx = prev.find(t => t.id === txId);
      if (tx) {
        tx.gst_claimed = !tx.gst_claimed;
      }
      return [...prev];
    });
  };

  const totalGSTAmount = gstTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalGSTInput = totalGSTAmount * 0.18; // 18% GST
  const claimedGST = gstTransactions.filter(t => t.gst_claimed).reduce((sum, t) => sum + (t.amount * 0.18), 0);

  const exportGSTReport = () => {
    const headers = ['Date', 'Merchant', 'Category', 'Amount', 'GST (18%)', 'Status'];
    const csvData = gstTransactions.map(t => [
      format(new Date(t.date), 'yyyy-MM-dd'),
      t.merchant,
      t.category,
      `₹{t.amount.toFixed(2)}`,
      `₹{(t.amount * 0.18).toFixed(2)}`,
      t.gst_claimed ? 'Claimed' : 'Pending'
    ]);

    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gst-report-${quarter}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    toast.success('GST report exported!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#050505] flex items-center justify-center">
        <div className="text-white font-dmsans">Loading GST data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#050505] text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#10b981] rounded-full filter blur-[128px] opacity-10"></div>
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
            <div className="w-14 h-14 bg-[#10b981]/20 rounded-2xl flex items-center justify-center">
              <Receipt className="w-7 h-7 text-[#10b981]" />
            </div>
            <div>
              <h1 className="font-outfit font-bold text-4xl">GST Expense Tracker</h1>
              <p className="font-dmsans text-gray-400">Track business expenses for GST input credit</p>
            </div>
          </div>
          <Button
            data-testid="export-gst-btn"
            onClick={exportGSTReport}
            disabled={gstTransactions.length === 0}
            className="bg-[#10b981] hover:bg-[#059669] text-white rounded-full px-6"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            data-testid="total-gst-card"
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-[#10b981]" />
              <p className="font-dmsans text-sm text-gray-400">Total GST Eligible</p>
            </div>
            <p className="font-outfit font-bold text-3xl">₹{totalGSTInput.toFixed(2)}</p>
            <p className="font-dmsans text-xs text-gray-500 mt-1">18% of ₹{totalGSTAmount.toFixed(2)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            data-testid="claimed-gst-card"
            className="backdrop-blur-xl bg-[#10b981]/10 border border-[#10b981]/30 rounded-2xl p-6"
          >
            <p className="font-dmsans text-sm text-gray-400 mb-2">GST Claimed</p>
            <p className="font-outfit font-bold text-3xl text-[#10b981]">₹{claimedGST.toFixed(2)}</p>
            <p className="font-dmsans text-xs text-gray-500 mt-1">
              {gstTransactions.filter(t => t.gst_claimed).length} transactions
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            data-testid="pending-gst-card"
            className="backdrop-blur-xl bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-2xl p-6"
          >
            <p className="font-dmsans text-sm text-gray-400 mb-2">Pending Claim</p>
            <p className="font-outfit font-bold text-3xl text-[#f59e0b]">₹{(totalGSTInput - claimedGST).toFixed(2)}</p>
            <p className="font-dmsans text-xs text-gray-500 mt-1">
              {gstTransactions.filter(t => !t.gst_claimed).length} transactions
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-gradient-to-r from-[#6366f1]/10 to-[#a855f7]/10 border border-[#6366f1]/30 rounded-2xl p-6 mb-8"
        >
          <h3 className="font-outfit font-semibold text-lg mb-2">💡 GST Pro Tips</h3>
          <ul className="space-y-2">
            <li className="font-dmsans text-sm text-gray-300">• Keep all invoices with GSTIN for claiming input credit</li>
            <li className="font-dmsans text-sm text-gray-300">• Business expenses like fuel, travel, and utilities qualify for GST input</li>
            <li className="font-dmsans text-sm text-gray-300">• File GSTR-3B monthly to claim your input credit</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
        >
          <div className="p-6 bg-white/5 border-b border-white/10">
            <h2 className="font-outfit font-semibold text-xl">GST-Eligible Transactions</h2>
          </div>
          
          {gstTransactions.length === 0 ? (
            <div data-testid="no-gst-transactions" className="p-12 text-center">
              <Receipt className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="font-outfit font-semibold text-xl mb-2">No GST transactions</h3>
              <p className="font-dmsans text-gray-400">Business expenses will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left font-outfit font-semibold text-sm">Date</th>
                    <th className="px-6 py-4 text-left font-outfit font-semibold text-sm">Merchant</th>
                    <th className="px-6 py-4 text-left font-outfit font-semibold text-sm">Category</th>
                    <th className="px-6 py-4 text-right font-outfit font-semibold text-sm">Amount</th>
                    <th className="px-6 py-4 text-right font-outfit font-semibold text-sm">GST (18%)</th>
                    <th className="px-6 py-4 text-center font-outfit font-semibold text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {gstTransactions.map((tx, idx) => (
                    <tr key={tx.id} data-testid={`gst-tx-${idx}`} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-6 py-4 font-dmsans text-sm text-gray-400">
                        {format(new Date(tx.date), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 font-dmsans text-sm">{tx.merchant}</td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 bg-[#6366f1]/20 text-[#6366f1] rounded-full text-xs font-medium">
                          {tx.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-outfit font-semibold">₹{tx.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right font-outfit font-semibold text-[#10b981]">
                        ₹{(tx.amount * 0.18).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => toggleGST(tx.id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                            tx.gst_claimed
                              ? 'bg-[#10b981]/20 text-[#10b981]'
                              : 'bg-[#f59e0b]/20 text-[#f59e0b] hover:bg-[#f59e0b]/30'
                          }`}
                        >
                          {tx.gst_claimed ? 'Claimed' : 'Mark Claimed'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
