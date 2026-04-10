"use client";

import { Navbar } from "@/components/navbar";
import { UploadZone } from "@/components/upload/upload-zone";
import { DocumentViewer } from "@/components/viewer/document-viewer";
import { ChatInterface } from "@/components/chat/chat-interface";
import { ChatInput } from "@/components/chat/chat-input";
import { useNeuralDoc } from "@/hooks/use-neural-doc";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const {
    image,
    messages,
    isUploading,
    isThinking,
    currentBox,
    handleUpload,
    removeImage,
    askQuestion,
    clearChat,
  } = useNeuralDoc();

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      
      <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] relative">
        {/* Left Panel: Document Viewer */}
        <div className="flex-1 overflow-hidden p-6 lg:p-10 border-r border-white/5 bg-black/5">
          <AnimatePresence mode="wait">
            {!image ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full"
              >
                <UploadZone onUpload={handleUpload} isUploading={isUploading} />
              </motion.div>
            ) : (
              <motion.div
                key="viewer"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full"
              >
                <DocumentViewer 
                  image={image} 
                  onRemove={removeImage} 
                  boundingBox={currentBox} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Panel: Chat Interface */}
        <div className="w-full md:w-[450px] lg:w-[500px] flex flex-col glass border-l border-white/10 shadow-2xl z-10">
          <div className="flex-1 overflow-hidden">
            <ChatInterface messages={messages} isThinking={isThinking} />
          </div>
          <ChatInput 
            onSend={askQuestion} 
            onClear={clearChat}
            disabled={!image}
            isThinking={isThinking}
          />
        </div>
      </div>
    </div>
  );
}
