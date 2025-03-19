"use client";
import React, { useState } from "react";

export default function ChatForm({
  onSendMessage,
}: {
  onSendMessage: (message: string) => void;
}) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() !== "") {
      onSendMessage(message)
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 px-4 border-2 py-2 rounded-lg border-gray-200 focus:outline-none"
        placeholder="Insira sua mensagem..."
      />
      <button
        type="submit"
        className="px-4 py-2 rounded-lg bg-neutral-800 text-white font-bold"
      >
        Enviar
      </button>
    </form>
  );
}
