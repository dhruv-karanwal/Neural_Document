import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Zap } from 'lucide-react';

const Header = () => {
  return (
    <header className="relative w-full">
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-slate-400 tracking-wide uppercase">NeuralQA</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="hidden sm:flex items-center gap-2 text-xs text-slate-500"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
          System Online
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="glass px-4 py-1.5 rounded-full text-xs text-indigo-300 font-medium border"
          style={{ borderColor: 'rgba(99,102,241,0.3)' }}
        >
          v2.0 Beta
        </motion.div>
      </div>

      {/* Hero section */}
      <div className="relative text-center py-14 px-4 overflow-hidden">
        {/* Glow behind heading */}
        <div
          className="absolute inset-x-0 top-0 h-px pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)' }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
          className="inline-flex items-center gap-2 glass px-5 py-2 rounded-full mb-6 border"
          style={{ borderColor: 'rgba(99,102,241,0.3)' }}
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-medium text-indigo-300">Multimodal AI • Document Intelligence</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-bold mb-4 tracking-tight leading-none"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(2rem, 6vw, 4rem)',
          }}
        >
          <span className="gradient-text">Neural Document</span>
          <br />
          <span className="text-white">QA System</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-slate-400 max-w-xl mx-auto text-base sm:text-lg leading-relaxed"
        >
          Upload any document image — invoices, reports, forms — and ask questions in natural language.{' '}
          <span className="text-indigo-400 font-medium">AI answers instantly.</span>
        </motion.p>

        {/* Floating icons */}
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-[8%] top-[30%] hidden lg:block"
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center opacity-30"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            <Brain className="w-6 h-6 text-white" />
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 12, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute right-[8%] top-[25%] hidden lg:block"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center opacity-25"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
