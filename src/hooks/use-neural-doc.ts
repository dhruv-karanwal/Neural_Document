"use client";

import { useState, useCallback } from "react";
import { Message, BoundingBox, AskResponse } from "@/types";
import { toast } from "sonner";

export function useNeuralDoc() {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [currentBox, setCurrentBox] = useState<BoundingBox | null>(null);

  const clearChat = useCallback(() => {
    setMessages([]);
    setCurrentBox(null);
    toast.info("Chat history cleared");
  }, []);

  const handleUpload = useCallback((file: File) => {
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setImageFile(file);
        setIsUploading(false);
        setMessages([]); // Clear chat for new image
        setCurrentBox(null);
        toast.success("Document uploaded successfully");
      };
      reader.readAsDataURL(file);
    }, 1000);
  }, []);

  const removeImage = useCallback(() => {
    setImage(null);
    setImageFile(null);
    setMessages([]);
    setCurrentBox(null);
    toast.info("Document removed");
  }, []);

  const askQuestion = useCallback(async (question: string) => {
    if (!imageFile) {
      toast.error("Please upload a document first");
      return;
    }
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: question,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsThinking(true);
    setCurrentBox(null); // Clear box before new answer

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("question", question);

      const response = await fetch("/api/ask", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("API Failure");

      const data: AskResponse = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
        confidence: data.confidence,
        boundingBox: {
          x: data.bounding_box[0],
          y: data.bounding_box[1],
          width: data.bounding_box[2],
          height: data.bounding_box[3],
        },
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setCurrentBox(aiMessage.boundingBox || null);
    } catch (error) {
      toast.error("Failed to fetch answer. Please try again.");
      console.error(error);
    } finally {
      setIsThinking(false);
    }
  }, [imageFile]);

  return {
    image,
    messages,
    isUploading,
    isThinking,
    currentBox,
    handleUpload,
    removeImage,
    askQuestion,
    clearChat,
  };
}
