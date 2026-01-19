import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, TrendingUp, Gift, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';

export const Landing = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#050505] text-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#6366f1] rounded-full filter blur-[128px] opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#a855f7] rounded-full filter blur-[128px] opacity-20"></div>
      </div>

      <nav className="relative z-10 px-6 py-6 max-w-7xl mx-auto flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold font-outfit"
        >
          CredMax
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button 
            data-testid="nav-login-btn"
            onClick={onGetStarted} 
            variant="ghost" 
            className="text-white hover:bg-white/10 rounded-full px-6"
          >
            Login
          </Button>
        </motion.div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="backdrop-blur-xl bg-gradient-to-r from-[#6366f1]/20 to-[#a855f7]/20 border border-[#6366f1]/30 rounded-full px-6 py-2">
              <span className="font-dmsans text-sm text-[#a855f7]">🇮🇳 Built for India • Trusted by Smart Spenders</span>
            </div>
          </motion.div>
          
          <h1 className="font-outfit font-bold text-5xl sm:text-6xl lg:text-7xl tracking-tight mb-6">
            Maximize Every Swipe
          </h1>
          <p className="font-dmsans text-lg sm:text-xl text-gray-400 mb-4 max-w-2xl mx-auto leading-relaxed">
            Stop leaving money on the table. AI-powered insights help you earn <span className="text-[#10b981] font-semibold">15-25% more rewards</span> on every credit card transaction.
          </p>
          <p className="font-dmsans text-base text-gray-500 mb-8">
            Built for India • Works with HDFC, SBI, ICICI, Axis & all major banks
          </p>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 mb-10 max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="font-outfit font-bold text-3xl text-[#6366f1] mb-1">₹2.4L+</div>
                <div className="font-dmsans text-xs text-gray-400">Avg Annual Rewards</div>
              </div>
              <div>
                <div className="font-outfit font-bold text-3xl text-[#10b981] mb-1">15-25%</div>
                <div className="font-dmsans text-xs text-gray-400">More Points Earned</div>
              </div>
              <div>
                <div className="font-outfit font-bold text-3xl text-[#a855f7] mb-1">Zero</div>
                <div className="font-dmsans text-xs text-gray-400">Expired Points</div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              data-testid="hero-get-started-btn"
              onClick={onGetStarted}
              size="lg"
              className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] hover:from-[#4f46e5] hover:to-[#9333ea] text-white rounded-full px-10 py-7 text-lg font-semibold shadow-xl shadow-[#6366f1]/40 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Check Your Rewards Now →
            </Button>
            <Button 
              data-testid="hero-learn-more-btn"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 rounded-full px-8 py-7 text-lg backdrop-blur-sm"
            >
              See How It Works
            </Button>
          </div>
          
          <p className="font-dmsans text-sm text-gray-500 mt-6">
            No card details required • Free forever • 2 min setup
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-24 relative"
        >
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1649945918476-64fb7df0ea84?crop=entropy&cs=srgb&fm=jpg&q=85" 
              alt="Credit Cards" 
              className="w-full h-64 object-cover rounded-2xl"
            />
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="backdrop-blur-xl bg-gradient-to-r from-[#f59e0b]/10 to-[#ef4444]/10 border border-[#f59e0b]/30 rounded-3xl p-10 text-center"
        >
          <h3 className="font-outfit font-bold text-3xl mb-4">
            Are You Losing ₹50,000+ Every Year?
          </h3>
          <p className="font-dmsans text-lg text-gray-300 max-w-3xl mx-auto mb-6">
            Most Indians use the wrong credit card for their purchases. On average, you're missing out on <span className="text-[#f59e0b] font-semibold">₹4,200 per month</span> in rewards. That's a free vacation, EMI payment, or shopping spree you're leaving behind!
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl px-6 py-4">
              <div className="font-outfit font-bold text-2xl text-[#ef4444]">₹50,000+</div>
              <div className="font-dmsans text-sm text-gray-400">Annual Loss</div>
            </div>
            <div className="font-outfit font-bold text-3xl text-gray-600">→</div>
            <div className="backdrop-blur-xl bg-[#10b981]/20 border border-[#10b981]/30 rounded-2xl px-6 py-4">
              <div className="font-outfit font-bold text-2xl text-[#10b981]">₹1.2L+</div>
              <div className="font-dmsans text-sm text-gray-400">With CredMax</div>
            </div>
          </div>
          <Button
            data-testid="cta-stop-losing-btn"
            onClick={onGetStarted}
            className="mt-8 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-full px-8 py-6 text-lg font-semibold shadow-lg"
          >
            Stop Losing Money - Start Now
          </Button>
        </motion.div>
      </div>

      <div id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-outfit font-bold text-4xl lg:text-5xl mb-4">How CredMax Maximizes Your Rewards</h2>
          <p className="font-dmsans text-gray-400 text-lg">India's smartest credit card optimizer powered by AI</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { 
              icon: CreditCard, 
              title: 'Track All Cards', 
              desc: 'Add unlimited cards from HDFC, SBI, ICICI, Axis & more',
              benefit: 'Manage all in one place'
            },
            { 
              icon: Sparkles, 
              title: 'AI Recommendations', 
              desc: 'GPT-5.2 powered suggestions for every purchase',
              benefit: '+15-25% more rewards'
            },
            { 
              icon: TrendingUp, 
              title: 'ML Spending Insights', 
              desc: 'Pattern analysis to identify reward opportunities',
              benefit: 'Optimize ₹50K+ yearly'
            },
            { 
              icon: Gift, 
              title: 'Never Expire Points', 
              desc: 'Smart alerts before your points vanish',
              benefit: 'Save ₹10K+ annually'
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#6366f1]/50 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-[#6366f1]/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#6366f1]/30 transition-colors">
                <feature.icon className="w-6 h-6 text-[#6366f1]" />
              </div>
              <h3 className="font-outfit font-bold text-xl mb-2">{feature.title}</h3>
              <p className="font-dmsans text-gray-400 text-sm mb-3">{feature.desc}</p>
              <div className="backdrop-blur-xl bg-[#10b981]/10 border border-[#10b981]/30 rounded-lg px-3 py-2">
                <p className="font-dmsans text-[#10b981] text-xs font-semibold">{feature.benefit}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="backdrop-blur-xl bg-gradient-to-r from-[#6366f1]/10 to-[#a855f7]/10 border border-[#6366f1]/30 rounded-3xl p-12 text-center"
        >
          <h3 className="font-outfit font-bold text-3xl mb-4">
            Real Indians, Real Savings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {[
              { name: 'Priya S.', location: 'Mumbai', saving: '₹1.2L', quote: 'I was using my HDFC Regalia for groceries. CredMax showed me my Amex gives 5x points!' },
              { name: 'Rahul K.', location: 'Bangalore', saving: '₹85K', quote: 'Points Optimizer detected my Netflix, Spotify bills. Switched cards, now earning 2x more!' },
              { name: 'Anjali M.', location: 'Delhi', saving: '₹1.5L', quote: 'Almost lost 45K points to expiry. CredMax alerts saved me. Best decision ever!' }
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#6366f1] to-[#a855f7] rounded-full"></div>
                  <div className="text-left">
                    <div className="font-outfit font-bold text-base">{testimonial.name}</div>
                    <div className="font-dmsans text-xs text-gray-400">{testimonial.location}</div>
                  </div>
                </div>
                <div className="backdrop-blur-xl bg-[#10b981]/20 border border-[#10b981]/30 rounded-lg px-4 py-2 mb-4">
                  <div className="font-outfit font-bold text-xl text-[#10b981]">{testimonial.saving}</div>
                  <div className="font-dmsans text-xs text-gray-400">Saved in 2024</div>
                </div>
                <p className="font-dmsans text-sm text-gray-300 italic">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
          <Button
            data-testid="cta-start-saving-btn"
            onClick={onGetStarted}
            className="mt-10 bg-gradient-to-r from-[#6366f1] to-[#a855f7] hover:from-[#4f46e5] hover:to-[#9333ea] text-white rounded-full px-10 py-6 text-lg font-semibold shadow-xl"
          >
            Start Saving Like Them →
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
