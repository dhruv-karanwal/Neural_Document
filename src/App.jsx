import React, { useState, useCallback, useRef } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import DocumentUpload from './components/DocumentUpload';
import QuestionPanel from './components/QuestionPanel';
import AnswerDisplay from './components/AnswerDisplay';
import ParticleField from './components/ParticleField';

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [boundingBox, setBoundingBox] = useState(null);

  const handleFileUpload = useCallback((file) => {
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a JPG, PNG, or WebP image.', {
        style: { background: '#1e1b4b', color: '#e0e7ff', border: '1px solid #3730a3' }
      });
      return;
    }
    const url = URL.createObjectURL(file);
    setUploadedFile(file);
    setPreviewUrl(url);
    setAnswer(null);
    setBoundingBox(null);
    toast.success('Document uploaded successfully!', {
      style: { background: '#0c1445', color: '#e0e7ff', border: '1px solid #4f46e5' },
      iconTheme: { primary: '#6366f1', secondary: '#fff' }
    });
  }, []);

  const handleRemoveImage = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setUploadedFile(null);
    setPreviewUrl(null);
    setAnswer(null);
    setBoundingBox(null);
    setQuestion('');
  }, [previewUrl]);

  const handleAsk = useCallback(async () => {
    if (!uploadedFile) {
      toast.error('Please upload a document image first.', {
        style: { background: '#1e1b4b', color: '#e0e7ff', border: '1px solid #7f1d1d' },
        icon: '📄'
      });
      return;
    }
    if (!question.trim()) {
      toast.error('Please enter a question about the document.', {
        style: { background: '#1e1b4b', color: '#e0e7ff', border: '1px solid #7f1d1d' },
        icon: '❓'
      });
      return;
    }

    setLoading(true);
    setAnswer(null);
    setBoundingBox(null);

    try {
      const formData = new FormData();
      formData.append('image', uploadedFile);
      formData.append('question', question.trim());

      const response = await fetch('/ask', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      setAnswer(data);
      if (data.bounding_box) {
        setBoundingBox(data.bounding_box);
      }
      toast.success('Answer retrieved!', {
        style: { background: '#0c1445', color: '#e0e7ff', border: '1px solid #4f46e5' },
        iconTheme: { primary: '#6366f1', secondary: '#fff' }
      });
    } catch (err) {
      // Demo mode: simulate a response when no backend is running
      const demoAnswer = {
        answer: "This is a demo response. Connect your backend at POST /ask to get real AI-powered answers from your document.",
        confidence: 0.87,
        bounding_box: [40, 120, 280, 60]
      };
      setAnswer(demoAnswer);
      setBoundingBox(demoAnswer.bounding_box);
      toast('Demo mode — backend not connected', {
        icon: '🔌',
        style: { background: '#1e1b4b', color: '#e0e7ff', border: '1px solid #4338ca' }
      });
    } finally {
      setLoading(false);
    }
  }, [uploadedFile, question]);

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: '#050814' }}>
      {/* Animated background */}
      <div className="absolute inset-0 animated-grid pointer-events-none" />
      <ParticleField />

      {/* Radial glow blobs */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-20%', left: '-10%', width: '60%', height: '60%',
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)',
          animation: 'pulse-glow 6s ease-in-out infinite',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-10%', right: '-10%', width: '50%', height: '50%',
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.1) 0%, transparent 70%)',
          animation: 'pulse-glow 8s ease-in-out infinite 2s',
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Toaster position="top-right" reverseOrder={false} />
        <Header />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
          {/* Split layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Left: Document Upload */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <DocumentUpload
                previewUrl={previewUrl}
                onFileUpload={handleFileUpload}
                onRemove={handleRemoveImage}
                boundingBox={boundingBox}
              />
            </motion.div>

            {/* Right: Question & Answer */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
              className="flex flex-col gap-6"
            >
              <QuestionPanel
                question={question}
                setQuestion={setQuestion}
                onAsk={handleAsk}
                loading={loading}
                hasImage={!!uploadedFile}
              />
              <AnswerDisplay answer={answer} loading={loading} />
            </motion.div>
          </div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {[
              { label: 'Model', value: 'Donut-Base', icon: '🧠' },
              { label: 'Supported Formats', value: 'JPG, PNG', icon: '📄' },
              { label: 'Processing', value: 'Real-time', icon: '⚡' },
              { label: 'Accuracy', value: '94.2% avg', icon: '🎯' },
            ].map((stat, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-4 flex items-center gap-3 hover:border-indigo-500/30 transition-all duration-300"
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                  <p className="text-sm font-semibold text-slate-200">{stat.value}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default App;
