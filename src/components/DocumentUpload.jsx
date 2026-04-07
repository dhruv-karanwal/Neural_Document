import React, { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image, CloudUpload, CheckCircle } from 'lucide-react';

const DocumentUpload = ({ previewUrl, onFileUpload, onRemove, boundingBox }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);
  const [imgDims, setImgDims] = useState({ w: 0, h: 0, nw: 0, nh: 0 });

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileUpload(file);
  }, [onFileUpload]);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleInputChange = (e) => { if (e.target.files[0]) onFileUpload(e.target.files[0]); };

  const handleImgLoad = (e) => {
    const img = e.target;
    setImgDims({
      w: img.naturalWidth,
      h: img.naturalHeight,
      nw: img.width,
      nh: img.height,
    });
  };

  const calcBBox = () => {
    if (!boundingBox || !imgDims.w) return null;
    const [x, y, w, h] = boundingBox;
    const scaleX = imgDims.nw / imgDims.w;
    const scaleY = imgDims.nh / imgDims.h;
    return {
      left: x * scaleX,
      top: y * scaleY,
      width: w * scaleX,
      height: h * scaleY,
    };
  };

  const bbox = calcBBox();

  return (
    <div
      className="glass rounded-3xl p-6 h-full flex flex-col"
      style={{
        border: '1px solid rgba(255,255,255,0.08)',
        minHeight: '480px',
      }}
    >
      {/* Card header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          <Image className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-100" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Document Upload
          </h2>
          <p className="text-xs text-slate-500">JPG, PNG supported</p>
        </div>
        {previewUrl && (
          <div className="ml-auto flex items-center gap-1 text-emerald-400 text-xs font-medium">
            <CheckCircle className="w-4 h-4" />
            Loaded
          </div>
        )}
      </div>

      {/* Upload area */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {!previewUrl ? (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`
                cursor-pointer rounded-2xl flex flex-col items-center justify-center gap-5
                transition-all duration-300 h-full min-h-72
                border-2 border-dashed
                ${isDragging ? 'dropzone-active' : 'border-slate-700 hover:border-indigo-500/50'}
              `}
              style={{ background: isDragging ? 'rgba(99,102,241,0.05)' : 'rgba(255,255,255,0.02)' }}
            >
              <motion.div
                animate={isDragging ? { scale: 1.15, rotate: 5 } : { scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div
                  className="w-20 h-20 rounded-3xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
                    border: '1px solid rgba(99,102,241,0.3)',
                  }}
                >
                  <CloudUpload className="w-9 h-9 text-indigo-400" />
                </div>
              </motion.div>

              <div className="text-center px-4">
                <p className="text-slate-200 font-semibold text-base mb-1">
                  {isDragging ? 'Drop your document here' : 'Drag & drop your document'}
                </p>
                <p className="text-slate-500 text-sm">or click to browse files</p>
              </div>

              <div
                className="flex items-center gap-3 px-5 py-2.5 rounded-xl text-sm font-semibold text-indigo-300 btn-shine"
                style={{
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
                  border: '1px solid rgba(99,102,241,0.4)',
                }}
              >
                <Upload className="w-4 h-4" />
                Choose File
              </div>

              <div className="flex gap-3">
                {['JPG', 'PNG', 'WebP'].map(fmt => (
                  <span
                    key={fmt}
                    className="px-2.5 py-0.5 rounded-md text-xs text-slate-400 font-medium"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    {fmt}
                  </span>
                ))}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleInputChange}
              />
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35 }}
              className="relative h-full rounded-2xl overflow-hidden"
              style={{
                border: '1px solid rgba(99,102,241,0.25)',
                minHeight: '280px',
              }}
            >
              <div className="relative w-full h-full">
                <img
                  ref={imgRef}
                  src={previewUrl}
                  alt="Uploaded document"
                  onLoad={handleImgLoad}
                  className="w-full h-full object-contain rounded-2xl"
                  style={{ background: 'rgba(0,0,0,0.3)', maxHeight: '380px' }}
                />

                {/* Bounding box overlay */}
                <AnimatePresence>
                  {bbox && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        position: 'absolute',
                        left: bbox.left,
                        top: bbox.top,
                        width: bbox.width,
                        height: bbox.height,
                        border: '2px solid #6366f1',
                        borderRadius: '4px',
                        background: 'rgba(99,102,241,0.15)',
                        boxShadow: '0 0 12px rgba(99,102,241,0.5)',
                        pointerEvents: 'none',
                      }}
                    >
                      <div
                        className="absolute -top-5 left-0 text-xs font-medium px-2 py-0.5 rounded"
                        style={{ background: '#6366f1', color: '#fff', whiteSpace: 'nowrap' }}
                      >
                        Answer Region
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Scan line when loading */}
                {!bbox && (
                  <div
                    className="absolute inset-0 pointer-events-none scan-line overflow-hidden rounded-2xl"
                    style={{ opacity: 0.4 }}
                  />
                )}
              </div>

              {/* Action bar */}
              <div
                className="absolute bottom-0 inset-x-0 flex items-center justify-between px-4 py-3"
                style={{ background: 'linear-gradient(to top, rgba(5,8,20,0.95), transparent)' }}
              >
                <span className="text-xs text-slate-400 font-medium">
                  {boundingBox ? '📍 Region highlighted' : '📄 Document ready'}
                </span>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium text-indigo-300 transition-colors"
                    style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}
                  >
                    Change
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, background: 'rgba(239,68,68,0.2)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onRemove}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium text-red-400 transition-all"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
                  >
                    <X className="w-3.5 h-3.5 inline mr-1" />
                    Remove
                  </motion.button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleInputChange}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DocumentUpload;
