import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Loader2, Brain, ChevronRight } from 'lucide-react';

const SUGGESTIONS = [
  "What is the total amount on this invoice?",
  "Who is the sender of this document?",
  "What is the date mentioned in this form?",
  "What are the key findings in this report?",
  "What is the account number listed?",
];

const QuestionPanel = ({ question, setQuestion, onAsk, loading, hasImage }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 140) + 'px';
    }
  }, [question]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onAsk();
    }
  };

  return (
    <div
      className="glass rounded-3xl p-6"
      style={{ border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }}
        >
          <Search className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-100" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Ask a Question
          </h2>
          <p className="text-xs text-slate-500">Natural language queries</p>
        </div>
      </div>

      {/* Textarea */}
      <div
        className="relative rounded-2xl mb-4 transition-all duration-300"
        style={{
          border: '1px solid rgba(99,102,241,0.3)',
          background: 'rgba(0,0,0,0.2)',
          boxShadow: question ? '0 0 20px rgba(99,102,241,0.1)' : 'none',
        }}
      >
        <textarea
          ref={textareaRef}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about the document..."
          disabled={loading}
          rows={2}
          className="w-full bg-transparent text-slate-200 placeholder-slate-600 text-sm p-4 pr-12 resize-none outline-none rounded-2xl"
          style={{ lineHeight: '1.6', minHeight: '72px', maxHeight: '140px' }}
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {question.length > 0 && (
            <span className="text-xs text-slate-600">{question.length}</span>
          )}
          <Search className="w-4 h-4 text-slate-600" />
        </div>
      </div>

      {/* Suggestions */}
      <div className="mb-5">
        <p className="text-xs text-slate-600 font-medium mb-2 uppercase tracking-wider">Quick Suggestions</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.slice(0, 3).map((s, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setQuestion(s)}
              className="text-xs px-3 py-1.5 rounded-xl text-slate-400 text-left transition-all duration-200 hover:text-indigo-300"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <ChevronRight className="w-3 h-3 inline mr-1 opacity-50" />
              {s.length > 35 ? s.substring(0, 35) + '…' : s}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Ask Button */}
      <motion.button
        whileHover={!loading ? { scale: 1.02, y: -1 } : {}}
        whileTap={!loading ? { scale: 0.98 } : {}}
        onClick={onAsk}
        disabled={loading}
        className="w-full py-3.5 rounded-2xl font-semibold text-white text-sm flex items-center justify-center gap-2.5 transition-all duration-300 btn-shine relative overflow-hidden"
        style={{
          background: loading
            ? 'linear-gradient(135deg, #4338ca, #7c3aed)'
            : 'linear-gradient(135deg, #4f46e5, #7c3aed, #8b5cf6)',
          boxShadow: loading ? 'none' : '0 4px 20px rgba(99,102,241,0.4), 0 0 40px rgba(139,92,246,0.2)',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Analyzing Document…</span>
            <div
              className="absolute inset-0 pointer-events-none shimmer opacity-50"
              style={{ borderRadius: '16px' }}
            />
          </>
        ) : (
          <>
            <Brain className="w-4 h-4" />
            <span>Get Answer</span>
            <Sparkles className="w-4 h-4 opacity-70" />
          </>
        )}
      </motion.button>

      <p className="text-center text-xs text-slate-600 mt-3">
        Press <kbd className="px-1.5 py-0.5 rounded text-slate-500" style={{ background: 'rgba(255,255,255,0.06)', fontSize: '10px' }}>Enter</kbd> to submit quickly
      </p>
    </div>
  );
};

export default QuestionPanel;
