import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export const Auth = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast.success('Welcome back!');
      } else {
        await signup(name, email, password);
        toast.success('Account created successfully!');
      }
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#050505] text-white flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#6366f1] rounded-full filter blur-[128px] opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#a855f7] rounded-full filter blur-[128px] opacity-20"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="font-outfit font-bold text-3xl mb-2">{isLogin ? 'Welcome Back' : 'Get Started'}</h2>
          <p className="font-dmsans text-gray-400">Start maximizing your rewards today</p>
        </div>

        <form data-testid="auth-form" onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <Label htmlFor="name" className="text-gray-300 font-dmsans mb-2 block">Full Name</Label>
              <Input
                id="name"
                data-testid="auth-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required={!isLogin}
                className="bg-white/5 border-white/10 focus:border-[#6366f1]/50 text-white placeholder:text-gray-500 rounded-xl h-12"
              />
            </div>
          )}

          <div>
            <Label htmlFor="email" className="text-gray-300 font-dmsans mb-2 block">Email</Label>
            <Input
              id="email"
              data-testid="auth-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="bg-white/5 border-white/10 focus:border-[#6366f1]/50 text-white placeholder:text-gray-500 rounded-xl h-12"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-300 font-dmsans mb-2 block">Password</Label>
            <Input
              id="password"
              data-testid="auth-password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-white/5 border-white/10 focus:border-[#6366f1]/50 text-white placeholder:text-gray-500 rounded-xl h-12"
            />
          </div>

          <Button
            data-testid="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-full h-12 text-base font-medium shadow-lg shadow-[#6366f1]/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            data-testid="auth-toggle-btn"
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-400 hover:text-white font-dmsans text-sm transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
