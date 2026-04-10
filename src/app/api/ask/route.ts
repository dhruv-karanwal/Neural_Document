import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const question = formData.get("question") as string;
    
    // Simulate thinking delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simple mock logic for demonstration
    let answer = "I've analyzed the document. Based on your question, I found relevant information regarding your query.";
    let bounding_box: [number, number, number, number] = [100, 100, 200, 150]; // x, y, w, h
    const confidence = 0.85 + Math.random() * 0.1;

    if (question.toLowerCase().includes("date")) {
      answer = "The document was created on April 11, 2026, according to the metadata found in the header.";
      bounding_box = [50, 20, 150, 40];
    } else if (question.toLowerCase().includes("name") || question.toLowerCase().includes("title")) {
      answer = "The title of the document appears to be 'Neural Analysis Report' located at the top center.";
      bounding_box = [200, 10, 300, 60];
    } else if (question.toLowerCase().includes("summary")) {
      answer = "In summary, the document discusses multimodal AI architectures and their application in complex document retrieval.";
      bounding_box = [40, 400, 500, 200];
    }

    return NextResponse.json({
      answer,
      confidence,
      bounding_box,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
