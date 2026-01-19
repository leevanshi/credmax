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
          <h1 className="font-outfit font-bold text-5xl sm:text-6xl lg:text-7xl tracking-tight mb-6">
            Maximize Every Swipe
          </h1>
          <p className="font-dmsans text-lg sm:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            AI-powered insights to help you earn maximum rewards on every credit card transaction. Built for India, optimized for your wallet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              data-testid="hero-get-started-btn"
              onClick={onGetStarted}
              size="lg"
              className="bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-full px-8 py-6 text-lg font-medium shadow-lg shadow-[#6366f1]/30 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Get Started
            </Button>
            <Button 
              data-testid="hero-learn-more-btn"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg backdrop-blur-sm"
            >
              Learn More
            </Button>
          </div>
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

      <div id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-outfit font-bold text-4xl lg:text-5xl mb-4">Why CredMax?</h2>
          <p className="font-dmsans text-gray-400 text-lg">Smart features to maximize your credit card rewards in India</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: CreditCard, title: 'Track All Cards', desc: 'Manage multiple credit cards in one place' },
            { icon: Sparkles, title: 'AI Recommendations', desc: 'Get smart card suggestions for every purchase' },
            { icon: TrendingUp, title: 'Spending Analytics', desc: 'Understand your spending patterns with ML insights' },
            { icon: Gift, title: 'Reward Alerts', desc: 'Never let your points expire again' }
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
              <p className="font-dmsans text-gray-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
