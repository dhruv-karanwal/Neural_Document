export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  confidence?: number;
  boundingBox?: BoundingBox;
  timestamp: number;
}

export interface AskResponse {
  answer: string;
  confidence: number;
  bounding_box: [number, number, number, number];
}
