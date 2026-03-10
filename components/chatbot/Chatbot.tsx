"use client";

import { useState } from "react";

export default function Chatbot() {

  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">

      <button
        onClick={() => setOpen(!open)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        Ask AlgoBot
      </button>

      {open && (
        <div className="mt-2 w-80 h-80 bg-[#0b1220] border border-white/10 rounded-xl p-4">
          Chatbot coming soon...
        </div>
      )}

    </div>
  );
}