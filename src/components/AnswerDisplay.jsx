import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Star, TrendingUp, Copy, CheckCheck } from 'lucide-react';
import { useState } from 'react';

const AnswerDisplay = ({ answer, loading }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (answer?.answer) {
      navigator.clipboard.writeText(answer.answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const confidence = answer?.confidence ?? null;
  const confidencePct = confidence !== null ? Math.round(confidence * 100) : 0;
  const confidenceColor =
    confidencePct >= 80 ? '#10b981' :
    confidencePct >= 60 ? '#f59e0b' : '#ef4444';
  const confidenceLabel =
    confidencePct >= 80 ? 'High' :
    confidencePct >= 60 ? 'Medium' : 'Low';

  return (
    <div
      className="glass rounded-3xl p-6 flex-1"
      style={{ border: '1px solid rgba(255,255,255,0.08)', minHeight: '200px' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
        >
          <MessageSquare className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-100" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            AI Answer
          </h2>
          <p className="text-xs text-slate-500">Real-time document analysis</p>
        </div>
        {answer && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="ml-auto p-2 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            onClick={handleCopy}
          >
            {copied ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </motion.button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-10 gap-4"
          >
            {/* AI thinking animation */}
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 rounded-full"
                  style={{ background: 'linear-gradient(180deg, #6366f1, #8b5cf6)' }}
                  animate={{ height: ['8px', '28px', '8px'] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.12,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
            <p className="text-sm text-slate-500 animate-pulse">AI is reading the document…</p>
          </motion.div>
        ) : answer ? (
          <motion.div
            key="answer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
          >
            {/* Answer text */}
            <div
              className="rounded-2xl p-5 mb-4 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06))',
                border: '1px solid rgba(99,102,241,0.2)',
              }}
            >
              <div
                className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
                style={{ background: 'linear-gradient(180deg, #6366f1, #8b5cf6)' }}
              />
              <p className="text-slate-200 text-sm leading-relaxed pl-2">
                {answer.answer}
              </p>
            </div>

            {/* Confidence score */}
            {confidence !== null && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl p-4"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-xs text-slate-500 font-medium">Confidence Score</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: `${confidenceColor}20`, color: confidenceColor, border: `1px solid ${confidenceColor}40` }}
                    >
                      {confidenceLabel}
                    </span>
                    <span className="text-sm font-bold" style={{ color: confidenceColor }}>
                      {confidencePct}%
                    </span>
                  </div>
                </div>
                {/* Progress bar */}
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <motion.div
                    className="h-full rounded-full confidence-bar"
                    style={{
                      width: `${confidencePct}%`,
                      background: `linear-gradient(90deg, ${confidenceColor}80, ${confidenceColor})`,
                      boxShadow: `0 0 8px ${confidenceColor}60`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${confidencePct}%` }}
                    transition={{ duration: 1, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                  />
                </div>

                {/* Star rating representation */}
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-3 h-3"
                      fill={star <= Math.round(confidencePct / 20) ? confidenceColor : 'transparent'}
                      style={{ color: star <= Math.round(confidencePct / 20) ? confidenceColor : '#334155' }}
                    />
                  ))}
                  <span className="text-xs text-slate-600 ml-1">AI Confidence</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-10 gap-4 text-center"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.15)',
              }}
            >
              <MessageSquare className="w-7 h-7 text-indigo-500 opacity-50" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">No answer yet</p>
              <p className="text-slate-600 text-xs mt-1">Upload a document and ask a question to begin</p>
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              {['Invoice amounts', 'Dates', 'Names', 'Totals'].map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full text-slate-600"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnswerDisplay;
