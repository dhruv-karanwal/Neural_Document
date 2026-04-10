"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BoundingBox as BBoxType } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DocumentViewerProps {
  image: string;
  onRemove: () => void;
  boundingBox: BBoxType | null;
}

export function DocumentViewer({ image, onRemove, boundingBox }: DocumentViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(1);
  const [imgDims, setImgDims] = useState({ width: 0, height: 0, naturalWidth: 0, naturalHeight: 0 });

  useEffect(() => {
    const updateDims = () => {
      if (imgRef.current) {
        setImgDims({
          width: imgRef.current.clientWidth,
          height: imgRef.current.clientHeight,
          naturalWidth: imgRef.current.naturalWidth,
          naturalHeight: imgRef.current.naturalHeight,
        });
      }
    };

    window.addEventListener("resize", updateDims);
    return () => window.removeEventListener("resize", updateDims);
  }, [image]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    setImgDims({
      width: target.clientWidth,
      height: target.clientHeight,
      naturalWidth: target.naturalWidth,
      naturalHeight: target.naturalHeight,
    });
  };

  // Calculate box style relative to displayed image
  const getBoxStyle = () => {
    if (!boundingBox || imgDims.naturalWidth === 0) return null;

    const scaleX = imgDims.width / imgDims.naturalWidth;
    const scaleY = imgDims.height / imgDims.naturalHeight;

    return {
      left: boundingBox.x * scaleX,
      top: boundingBox.y * scaleY,
      width: boundingBox.width * scaleX,
      height: boundingBox.height * scaleY,
    };
  };

  const boxStyle = getBoxStyle();

  return (
    <div className="relative w-full h-full flex flex-col gap-4">
      <div className="flex items-center justify-between glass px-4 py-2 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setScale(s => Math.max(0.5, s - 0.1))}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs font-medium w-12 text-center">{Math.round(scale * 100)}%</span>
          <Button variant="ghost" size="icon" onClick={() => setScale(s => Math.min(2, s + 0.1))}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setScale(1)}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="destructive" size="sm" onClick={onRemove} className="rounded-xl h-8 px-3">
              <X className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </TooltipTrigger>
          <TooltipContent>Remove document and restart</TooltipContent>
        </Tooltip>
      </div>

      <div 
        ref={containerRef}
        className="relative flex-1 bg-black/20 rounded-3xl overflow-hidden border border-white/5 flex items-center justify-center p-8"
      >
        <motion.div 
          className="relative shadow-2xl"
          style={{ scale }}
          layoutId="document-image"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <img
            ref={imgRef}
            src={image}
            alt="Uploaded document"
            className="max-w-full max-h-[70vh] rounded-lg object-contain"
            onLoad={handleLoad}
          />

          {/* Bounding Box Overlay */}
          <AnimatePresence>
            {boxStyle && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute border-2 border-primary bg-primary/10 shadow-[0_0_15px_rgba(var(--primary),0.5)] z-10 pointer-events-none rounded-sm"
                style={{
                  ...boxStyle,
                }}
              >
                <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-primary" />
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-primary" />
                <motion.div 
                  className="absolute inset-0 bg-primary/20"
                  animate={{ opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
