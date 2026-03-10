import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const { message } = await req.json();

  // simple response system for now
  const reply = `You asked: "${message}". 
I can help explain algorithms like BFS, DFS, heaps, and sorting methods.`;

  return NextResponse.json({ reply });
}