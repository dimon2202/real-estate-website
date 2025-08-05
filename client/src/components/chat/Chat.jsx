"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";

function Chat({ chats, initialChatId }) {
  const [chat, setChat] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  const messageEndRef = useRef();

  const decrease = useNotificationStore((state) => state.decrease);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // Auto-open chat if initialChatId is provided
  useEffect(() => {
    if (initialChatId && chats) {
      const targetChat = chats.find((c) => c.id === initialChatId);
      if (targetChat) {
        handleOpenChat(targetChat.id, targetChat.receiver);
      }
    }
  }, [initialChatId, chats]);

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await apiRequest("/chats/" + id);
      if (!res.data.seenBy.includes(currentUser.id)) {
        decrease();
      }
      setChat({ ...res.data, receiver });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const text = formData.get("text");

    if (!text) return;
    try {
      const res = await apiRequest.post("/messages/" + chat.id, { text });
      setChat((prev) => ({ ...prev, messages: [...prev.messages, res.data] }));
      e.target.reset();
      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const read = async () => {
      try {
        await apiRequest.put("/chats/read/" + chat.id);
      } catch (err) {
        console.log(err);
      }
    };

    if (chat && socket) {
      socket.on("getMessage", (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
          read();
        }
      });
    }
    return () => {
      socket.off("getMessage");
    };
  }, [socket, chat]);

  return (
    <div className="flex flex-col h-[calc(100%-66px)]">
      {/* Chat List */}
      <div className="flex-1 h-full overflow-y-auto border-b border-gray-200">
        <div className="space-y-2">
          {chats?.map((c) => (
            <div
              key={c.id}
              className={`flex items-center gap-3 m-1 py-2 rounded-lg cursor-pointer transition-colors ${
                c.seenBy.includes(currentUser.id) || chat?.id === c.id
                  ? "bg-white hover:bg-gray-50"
                  : "bg-purple-50 hover:bg-purple-100"
              } ${chat?.id === c.id ? "ring-2 ring-purple-500" : ""}`}
              onClick={() => handleOpenChat(c.id, c.receiver)}
            >
              <div className="relative">
                <img
                  src={c.receiver.avatar || "/noavatar.jpg"}
                  alt={c.receiver.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {/* {!c.seenBy.includes(currentUser.id) && chat?.id !== c.id && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"></div>
                )} */}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {c.receiver.username}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {c.lastMessage || "Почніть розмову..."}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      {chat && (
        <div className="flex flex-col h-96 bg-white border rounded-lg mb-0">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <div className="flex items-center gap-3">
              <img
                src={chat.receiver.avatar || "/noavatar.jpg"}
                alt={chat.receiver.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="font-medium text-gray-900">
                {chat.receiver.username}
              </div>
            </div>
            <button
              onClick={() => setChat(null)}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chat.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.userId === currentUser.id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 m-1 rounded-lg ${
                    message.userId === currentUser.id
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span
                    className={`text-xs ${
                      message.userId === currentUser.id
                        ? "text-purple-200"
                        : "text-gray-500"
                    }`}
                  >
                    {format(message.createdAt)}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messageEndRef}></div>
          </div>

          {/* Message Input */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-gray-200 bg-white"
          >
            <div className="flex gap-2">
              <input
                name="text"
                placeholder="Напишіть повідомлення..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  ></path>
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Empty State */}
      {!chat && chats?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <svg
            className="w-16 h-16 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            ></path>
          </svg>
          <p className="text-lg font-medium">Немає повідомлень</p>
          <p className="text-sm">Почніть розмову з власниками нерухомості</p>
        </div>
      )}

      {/* {!chat && chats?.length > 0 && (
        <div className="flex flex-col items-center justify-center text-gray-500">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            ></path>
          </svg>
          <p className="text-lg font-medium">Оберіть чат</p>
          <p className="text-sm">Виберіть розмову зі списку вище</p>
        </div>
      )} */}
    </div>
  );
}

export default Chat;
