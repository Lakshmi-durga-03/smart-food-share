<<<<<<< HEAD
=======


>>>>>>> upstream/main
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function ChatBox({ socket, roomId, userRole, food }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef();

  // LOAD OLD MESSAGES
  useEffect(() => {
    if (!roomId) return;

    axios
      .get(`http://localhost:5000/api/chat/${roomId}`)
      .then((res) => setMessages(res.data))
      .catch(() => {});
  }, [roomId]);

  // SOCKET
  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit("joinRoom", roomId);

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receiveMessage");
  }, [socket, roomId]);

  // AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("sendMessage", {
      roomId,
      sender: userRole,
      message: text,
    });

    setText("");
  };

<<<<<<< HEAD
  // ⭐ ENTER KEY SEND
=======
  //  ENTER KEY SEND
>>>>>>> upstream/main
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  // HEADER NAME
  const getHeaderName = () => {
    if (!food) return "Chat";

    if (userRole === "receiver") {
<<<<<<< HEAD
      return `Donor, ${food?.donorName || "Unknown"}`;
    }

    if (userRole === "donor") {
      return `Receiver, ${food?.receiverName || "Unknown"}`;
=======
      return `Donor ${food?.donorName || ""}`;
    }

    if (userRole === "donor") {
      return `Receiver ${food?.receiverName || ""}`;
>>>>>>> upstream/main
    }

    return "Chat";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      
      {/* HEADER */}
      <div
        style={{
          padding: "15px",
          borderBottom: "1px solid #ddd",
          fontWeight: "600",
          background: "#fff"
        }}
      >
        {getHeaderName()}
      </div>

      {/* MESSAGES */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          background: "#f5f5f5"
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.sender === userRole ? "right" : "left",
              marginBottom: "14px"
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "10px 14px",
                borderRadius: "14px",
                maxWidth: "70%",
                background:
                  m.sender === userRole ? "#ff7a00" : "#e0e0e0",
                color: m.sender === userRole ? "white" : "black"
              }}
            >
              {m.message}
            </span>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      {/* INPUT */}
      <div
        style={{
          padding: "12px",
          borderTop: "1px solid #ddd",
          display: "flex",
          gap: "10px",
          background: "#fff"
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type message..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            background: "#ff7a00",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Send
        </button>
      </div>

    </div>
  );
}

export default ChatBox;