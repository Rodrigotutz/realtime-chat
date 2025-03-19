"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/SocketClient";
import ChatForm from "@/components/ChatForm";
import ChatMessage from "@/components/ChatMessage";

export default function Home() {
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [userName, setUserName] = useState("");
  const [messages, setMessages] = useState<
    {
      sender: string;
      message: string;
    }[]
  >([]);

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("user_joined", (message) => {
      setMessages((prev) => [...prev, { sender: "system", message }]);
    });

    return () => {
      socket.off("user_joined");
      socket.off("message");
    };
  }, []);

  const handleJoinRomm = () => {
    if (room && userName) {
      socket.emit("join-room", { room, username: userName });
      setJoined(true);
    }
  };
  const handleSendMessage = (message: string) => {
    const data = {room, message, sender: userName}
    setMessages((prev) => [...prev, {sender: userName, message}])
    socket.emit("message", data)
  };

  return (
    <main className="w-full mt-5 flex justify-center">
      {!joined ? (
        <div className="flex flex-col items-center justify-center h-[500px]">
          <div className="flex flex-col w-96 items-center justify-between border border-gray-200 shadow-lg p-5 rounded">
            <h1 className="mb-5 text-2xl font-bold">Acesse a Sala</h1>
            <input
              type="text"
              placeholder="Insira seu Nome"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 mb-4 border-1 border-gray-200 rounded-lg focus:outline-none"
            />
            <input
              type="text"
              placeholder="Insira o nome da Sala"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full px-4 py-2 mb-4 border-1 border-gray-200 rounded-lg focus:outline-none"
            />
            <button
              onClick={handleJoinRomm}
              className="px-4 py-2 text-white bg-neutral-800 font-bold rounded-lg w-full"
            >
              Acessar
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-3xl mx-auto">
          <h1 className="mb-4 text-2xl font-bold">{room}</h1>
          <div className="h-[450px] overflow-y-auto p-4 mb-4 bg-neutral-500 rounded-lg">
            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                sender={msg.sender}
                message={msg.message}
                isOwnMessage={msg.sender === userName}
              />
            ))}
          </div>
          <ChatForm onSendMessage={handleSendMessage} />
        </div>
      )}
    </main>
  );
}
