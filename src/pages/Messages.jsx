import React, { useState, useEffect, useRef } from "react";
import FirstPerson from "../assets/images/firstPerson.png";
import searchIcon from "../assets/images/SearchIcon.png";
import sendIcon from "../assets/images/sendIcon.png";
import { useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  useChatInboxQuery,
  useMarkChatAsReadMutation,
  useProfileQuery,
  useUploadImageMutation,
} from "../services/apiQueries";


const TypingDots = () => (
  <span style={{ display: "inline-block", marginLeft: 8 }}>
    <span
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "#999",
        marginRight: 4,
        animation: "typing-dot 1s infinite",
      }}
    />
    <span
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "#999",
        marginRight: 4,
        animation: "typing-dot 1s 0.2s infinite",
      }}
    />
    <span
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "#999",
        animation: "typing-dot 1s 0.4s infinite",
      }}
    />
    <style>{`
      @keyframes typing-dot {
        0% { transform: translateY(0); opacity: 0.4; }
        50% { transform: translateY(-4px); opacity: 1; }
        100% { transform: translateY(0); opacity: 0.4; }
      }
    `}</style>
  </span>
);

const ChatApp = () => {
  const user = useSelector((state) => state.user.user);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingUserId, setTypingUserId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [loadedChats, setLoadedChats] = useState(new Set());
  const [socket, setSocket] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [readChats, setReadChats] = useState(() => {
    try {
      const stored = localStorage.getItem('readChats');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const emitStopTypingRef = useRef(null);
  const fileInputRef = useRef(null);

  const queryClient = useQueryClient();
  const { data: inboxData, isLoading: inboxLoading } = useChatInboxQuery();
  const { data: profileData } = useProfileQuery();
  const markAsReadMutation = useMarkChatAsReadMutation();
  const uploadImageMutation = useUploadImageMutation();

  const currentUser = profileData?.data;
  const isSideBarOpen = useOutletContext();
  const inbox = inboxData?.data || [];

  const [onlineUsers, setOnlineUsers] = useState([]);


  const loadMessages = (chatId) => {
    try {
      const stored = localStorage.getItem(`chat_messages_${chatId}`);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading messages:", error);
      return [];
    }
  };

  const saveMessages = (chatId, messages) => {
    try {
      localStorage.setItem(`chat_messages_${chatId}`, JSON.stringify(messages));
    } catch (error) {
      console.error("Error saving messages:", error);
    }
  };

  useEffect(() => {
    const newSocket = io("https://server1.appsstaging.com:3004", {
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      if (currentUser?.id) {
        newSocket.emit("user_online", { user_id: currentUser.id });
      }
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    setSocket(newSocket);

    return () => {
      console.log("Disconnecting socket...");
      newSocket.disconnect();
    };
  }, []); 

  useEffect(() => {
    if (!socket) return;

    const handleOnlineUsers = (users) => {
      if (!Array.isArray(users)) return;
      const normalized = users.map((u) => (typeof u === "object" ? u.id : u));
      setOnlineUsers(normalized);
    };

    socket.on("online_users", handleOnlineUsers);

    socket.on("user_online", (userObj) => {
      if (!userObj) return;
      setOnlineUsers((prev) => {
        const id = typeof userObj === "object" ? userObj.id : userObj;
        if (!prev.includes(id)) return [...prev, id];
        return prev;
      });
    });

    socket.on("user_offline", (userObj) => {
      if (!userObj) return;
      const id = typeof userObj === "object" ? userObj.id : userObj;
      setOnlineUsers((prev) => prev.filter((x) => x !== id));
    });

    return () => {
      socket.off("online_users", handleOnlineUsers);
      socket.off("user_online");
      socket.off("user_offline");
    };
  }, [socket]);

  const isUserOnline = (id) => onlineUsers.includes(id);

  useEffect(() => {
    if (!socket) return;

    const onTyping = (data) => {
      if (!data) return;
      if (data.sender_id && data.receiver_id) {
        if (
          data.sender_id === selectedChatId &&
          data.receiver_id === currentUser?.id
        ) {
          setTypingUserId(data.sender_id);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(
            () => setTypingUserId(null),
            2000
          );
        } else {

          setTypingUserId(data.sender_id);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(
            () => setTypingUserId(null),
            1600
          );
        }
      }
    };

    socket.on("typing", onTyping);

    return () => {
      socket.off("typing", onTyping);
    };
  }, [socket, selectedChatId, currentUser?.id]);

  useEffect(() => {
    console.log("Setting up message listeners...");
    if (!socket) return;
    const onReceive = (messageData) => {
      if (!messageData) return;
      const involvesSelected =
        selectedChatId &&
        (messageData.sender_id === selectedChatId ||
          messageData.receiver_id === selectedChatId);

      const fromMe = messageData.sender_id === currentUser?.id;

      const incoming = {
        from: fromMe ? "me" : "them",
        text: messageData.message,
        time: messageData.created_at
          ? new Date(messageData.created_at).toLocaleTimeString()
          : new Date().toLocaleTimeString(),
        raw: messageData,
      };

      if (involvesSelected) {
        setMessages((prev) => {
          const updatedMessages = [...prev, incoming];
          saveMessages(selectedChatId, updatedMessages);
          return updatedMessages;
        });
        if (!fromMe && markAsReadMutation) {
          const chatIndex = inbox.findIndex((c) => c.user.id === selectedChatId);
          markAsReadMutation
            .mutateAsync({
              chat_id: chatIndex + 1 || 0,
              is_read: true,
            })
            .then(() => {
              // On success, update the unread count to 0 immediately
              queryClient.setQueryData(["chatInbox"], (oldData) => {
                if (!oldData || !oldData.data) return oldData;
                const newData = { ...oldData, data: [...oldData.data] };
                if (newData.data[chatIndex]) {
                  newData.data[chatIndex] = { ...newData.data[chatIndex], unread_count: 0, unread: 0 };
                }
                return newData;
              });
              // Mark as read locally
              setReadChats(prev => new Set([...prev, selectedChatId]));
            })
            .catch(() => {});
        }
      } else {
        console.log("Received message for another chat:", messageData);
      }
    };
    const onChatHistory = (payload) => {
      console.log('Received chat history payload:', payload);
      if (!payload) return;
      const roomPartner =
        payload.sender_id ||
        (payload.room && (payload.room.sender_id || payload.room.receiver_id));
      const messagesList = payload.messages || payload.data || payload;
      console.log('Messages list:', messagesList);
      if (!Array.isArray(messagesList)) return;
      setMessages(
        messagesList.map((m) => ({
          from: m.sender_id === currentUser?.id ? "me" : "them",
          text: m.message || m.text || m.body,
          time: m.created_at
            ? new Date(m.created_at).toLocaleTimeString()
            : new Date().toLocaleTimeString(),
          raw: m,
        }))
      );
    };

    socket.on("receive_message", onReceive);
    socket.on("chat_history", onChatHistory);
    socket.on("response", onChatHistory);

    return () => {
      socket.off("receive_message", onReceive);
      socket.off("chat_history", onChatHistory);
      socket.off("get_messages_response", onChatHistory);
    };
  }, [socket, selectedChatId, currentUser, inbox, markAsReadMutation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem('readChats', JSON.stringify([...readChats]));
    } catch (error) {
      console.error("Error saving readChats:", error);
    }
  }, [readChats]);

  const handleSelectChat = async (chatId) => {
    setSelectedChatId(chatId);

    const chatMessages = loadMessages(chatId) || [];
    const selectedChat = inbox.find((chat) => chat.user.id === chatId);

    let initialMessages = chatMessages;
    if (initialMessages.length === 0 && selectedChat && selectedChat.last_message) {
      const lastMsg = {
        from: selectedChat.user.id === currentUser?.id ? "me" : "them",
        text: selectedChat.last_message,
        time: selectedChat.last_message_time || new Date().toLocaleTimeString(),
      };
      initialMessages = [lastMsg];
      saveMessages(chatId, initialMessages);
    }
    setMessages(initialMessages);
    const chatIndex = inbox.findIndex((chat) => chat.user.id === chatId);
    try {
      await markAsReadMutation.mutateAsync({
        chat_id: chatIndex + 1,
        is_read: true,
      });
      // On success, update the unread count to 0 immediately
      queryClient.setQueryData(["chatInbox"], (oldData) => {
        if (!oldData || !oldData.data) return oldData;
        const newData = { ...oldData, data: [...oldData.data] };
        if (newData.data[chatIndex]) {
          newData.data[chatIndex] = { ...newData.data[chatIndex], unread_count: 0, unread: 0 };
        }
        return newData;
      });
      // Mark as read locally
      setReadChats(prev => new Set([...prev, chatId]));
    } catch (err) {
    }

    if (socket && socket.connected && currentUser && currentUser.id) {
      // socket.emit("join_room", {
      //   sender_id: currentUser.id,
      //   receiver_id: chatId,
      // });
      console.log('Loaded chats:', loadedChats);
        console.log('Requesting messages for chat', chatId);
        socket.emit("chat:message:list", {
          sender_id: currentUser.id,
          receiver_id: chatId,
        });
        setLoadedChats((prev) => new Set([...prev, chatId]));
      
    }
  };
  const handleTyping = () => {
    if (!socket || !currentUser?.id || !selectedChatId) return;

    setIsTyping(true);
    socket.emit("typing", {
      sender_id: currentUser.id,
      receiver_id: selectedChatId,
    });
    if (emitStopTypingRef.current) clearTimeout(emitStopTypingRef.current);
    emitStopTypingRef.current = setTimeout(() => {
      socket.emit("stop_typing", {
        sender_id: currentUser.id,
        receiver_id: selectedChatId,
      });
      setIsTyping(false);
    }, 1500);
  };

  // --- Send message ---
  const handleSendMessage = async () => {
    if (
      (!newMessage.trim() && !selectedUrl) ||
      !socket ||
      !selectedChatId ||
      !currentUser ||
      !currentUser.id ||
      isUploading
    ) {
      return;
    }

    if (!socket.connected) {
      console.log("Socket not connected, cannot send message");
      return;
    }

    let messageContent = newMessage;
    let messageType = "text";

    if (selectedUrl) {
      messageContent = selectedUrl;
      messageType = "image";
    }

    const messageData = {
      sender_id: currentUser.id,
      receiver_id: selectedChatId,
      message: messageContent,
      type: messageType,
    };

    // Emit message
    socket.emit("chat:message:send", messageData);

    // locally add message immediately (optimistic)
    const localMessage = {
      from: "me",
      text: messageContent,
      time: new Date().toLocaleTimeString(),
      raw: messageData,
    };

    setMessages((prev) => {
      const updatedMessages = [...prev, localMessage];
      saveMessages(selectedChatId, updatedMessages);
      return updatedMessages;
    });

    setNewMessage("");
    setSelectedFile(null);
    setSelectedUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsTyping(false);
    // send stop typing too
    if (socket) {
      socket.emit("stop_typing", {
        sender_id: currentUser.id,
        receiver_id: selectedChatId,
      });
    }
  };

  const filteredInbox = inbox.filter(thread =>
    `${thread.user.first_name} ${thread.user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedChat = inbox.find((chat) => chat.user.id === selectedChatId);

  return (
    <div
      className={`content_section ${
        isSideBarOpen ? "" : "content_section_close"
      }  home_page`}
      style={{ padding: 16 }}
    >
      <div
        className="rounded-3 innerWrapper bg-[#E9E9E9]"
        style={{ padding: 20 }}
      >
        <h5 className="colorOrange">Messages</h5>

        <div
          className="m-0 d-flex flex-column flex-md-row gap-3"
          style={{ minHeight: 520 }}
        >
          {/* Left column - threads */}
          <div
            className="flex-fill message-list shadow-lg rounded-5"
            style={{
              maxHeight: 650,
              // minWidth: 320,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="message-header" style={{ padding: 12 }}>
              <div className="search-container mb-2">
                <div className="bg-white d-flex rounded-2 px-3 py-2 align-items-center shadow-sm">
                  <div className="input-group flex-grow-1">
                    <input
                      type="text"
                      className="form-control border-0"
                      placeholder="Search"
                      aria-label="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <span className="input-group-text bg-white border-0">
                      <img
                        src={searchIcon}
                        alt="Search"
                        style={{ width: 16, height: 16 }}
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="message-threads"
              style={{ overflowY: "auto", padding: 8, flex: "1 1 auto" }}
            >
              {inboxLoading ? (
                <div className="py-4">
                  <LoadingSpinner />
                </div>
              ) : filteredInbox.length === 0 ? (
                <div className="text-center py-4">No user found</div>
              ) : (
                filteredInbox.map((thread, index) => {
                   const unread = readChats.has(thread.user.id) ? 0 : (thread.unread_count || thread.unread || 0);
                  const partnerId = thread.user?.id;
                  const showTypingInThread =
                    (typingUserId && typingUserId === partnerId) ||
                    (partnerId === selectedChatId && isTyping);
                  return (
                    <div
                      key={partnerId}
                      className={`message-thread d-flex gap-2 py-3 px-2 rounded ${
                        selectedChatId === partnerId ? "active bg-light" : ""
                      }`}
                      onClick={() => handleSelectChat(partnerId)}
                      style={{ cursor: "pointer", alignItems: "center" }}
                    >
                      <div className="position-relative" style={{ width: 48 }}>
                        <img
                          src={thread.user.avatar || FirstPerson}
                          alt={thread.user.first_name}
                          className="rounded-circle"
                          width="48"
                          height="48"
                          style={{ objectFit: "cover" }}
                        />
                        {isUserOnline(partnerId) && (
                          <span
                            style={{
                              position: "absolute",
                              bottom: 2,
                              right: 2,
                              width: 12,
                              height: 12,
                              background: "green",
                              borderRadius: "50%",
                              border: "2px solid white",
                            }}
                          />
                        )}
                      </div>

                      <div className="flex-grow-1" style={{ minWidth: 0 }}>
                        <div className="d-flex justify-content-between align-items-start">
                          <strong
                            className="text-orange-custom"
                            style={{
                              fontSize: 14,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {thread.user.first_name} {thread.user.last_name}
                          </strong>
                          <div
                            style={{
                              minWidth: 70,
                              textAlign: "right",
                              fontSize: 12,
                              color: "#8a8a8a",
                            }}
                          >
                            {thread.last_message_time}
                          </div>
                        </div>

                        <div
                          className="d-flex justify-content-between align-items-center text-muted small"
                          style={{ marginTop: 6 }}
                        >
                          <div
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: 200,
                            }}
                          >
                            {showTypingInThread ? (
                              <span style={{ color: "#28a745" }}>
                                Typing...
                                <TypingDots />
                              </span>
                            ) : (
                              <span style={{ color: "#6c757d" }}>
                                {thread.last_message}
                              </span>
                            )}
                          </div>

                          <div style={{ marginLeft: 8 }}>
                            {unread > 0 && (
                              <span
                                style={{
                                  background: "#0d1b3b",
                                  color: "white",
                                  padding: "6px 10px",
                                  borderRadius: "20px",
                                  fontSize: 12,
                                  minWidth: 24,
                                  textAlign: "center",
                                }}
                              >
                                {unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right column - chat pane */}
          <div
            className="flex-fill chat-area shadow-lg detailsBox rounded-5 p-3"
            style={{
              maxHeight: 650,
              // flex: "1 1 0",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              // minWidth: 420,
              background: "#fff",
            }}
          >
            {selectedChat ? (
              <>
                {/* header */}
                <div
                  className="chat-header mb-3 d-flex align-items-center gap-2"
                  style={{ paddingBottom: 16, borderBottom: "1px solid #f0f0f0" }}
                >
                  <img
                    src={selectedChat.user.avatar || FirstPerson}
                    alt={selectedChat.user.first_name}
                    className="rounded-circle"
                    width="56"
                    height="56"
                    style={{ objectFit: "cover" }}
                  />
                  <div style={{ flex: 1 }}>
                    <h5
                      className="mb-0 text-orange-custom"
                      style={{ marginBottom: 4 }}
                    >
                      {selectedChat.user.first_name}{" "}
                      {selectedChat.user.last_name}
                    </h5>
                    <div style={{ fontSize: 13, color: "#6c757d" }}>
                      {isUserOnline(selectedChat.user.id)
                        ? "Online"
                        : "Last seen " + (selectedChat.last_message_time || "")}
                    </div>
                  </div>
                </div>

                {/* messages area */}
                <div
                  className="chat-messages mb-3"
                  style={{
                    flex: "1 1 auto",
                    padding: 20,
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {messages.map((msg, idx) => {
                    const isMe = msg.from === "me";
                    return (
                      <div
                        key={idx}
                        className={`d-flex ${
                          isMe ? "justify-content-end" : "justify-content-start"
                        }`}
                        style={{ alignItems: "flex-end" }}
                      >
                        {!isMe && (
                          <img
                            src={selectedChat.user.avatar || FirstPerson}
                            alt={selectedChat.user.first_name}
                            className="rounded-circle me-2"
                            width="36"
                            height="36"
                            style={{ objectFit: "cover" }}
                          />
                        )}

                        <div
                          style={{
                            padding: "12px 16px",
                            borderRadius: "10px 0px 10px 10px",
                            background: isMe ? "#08173a" : "#e75a36",
                            color: "#fff",
                            maxWidth: "70%",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                            lineHeight: 1.4,
                            fontSize: 14,
                          }}
                        >
                          <div
                            style={{
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                            }}
                          >
                            {msg.raw?.type === "image" ? (
                              <img
                                src={msg.text}
                                alt="image"
                                style={{
                                  width: 50,
                                  height: 50,
                                  objectFit: "cover",
                                  borderRadius: 10,
                                  marginTop: 4,
                                }}
                              />
                            ) : (
                              msg.text
                            )}
                          </div>
                         
                        </div>

                        {isMe && (
                          <img
                            src={
                              currentUser?.avatar ||
                              "https://i.pravatar.cc/40?img=5"
                            }
                            alt="You"
                            className="rounded-circle ms-2"
                            width="36"
                            height="36"
                          />
                        )}
                      </div>
                    );
                  })}

                  {/* typing indicator for self */}
                  {isTyping && (
                    <div
                      className="d-flex justify-content-end align-items-center"
                      style={{ marginTop: 4 }}
                    >
                      <div
                        style={{
                          padding: "8px 12px",
                          borderRadius: 14,
                          background: "#f1f1f1",
                          color: "#333",
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        <TypingDots />
                      </div>
                      <img
                        src={
                          currentUser?.avatar ||
                          "https://i.pravatar.cc/40?img=5"
                        }
                        alt="You"
                        className="rounded-circle ms-2"
                        width="30"
                        height="30"
                      />
                    </div>
                  )}

                  {/* typing indicator inside chat */}
                  {typingUserId && typingUserId === selectedChat.user.id && (
                    <div
                      className="d-flex justify-content-start align-items-center"
                      style={{ marginTop: 4 }}
                    >
                      <img
                        src={selectedChat.user.avatar || FirstPerson}
                        alt="typing"
                        className="rounded-circle me-2"
                        width="30"
                        height="30"
                      />
                      <div
                        style={{
                          padding: "8px 12px",
                          borderRadius: 14,
                          background: "#f1f1f1",
                          color: "#333",
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        <TypingDots />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </>
            ) : (
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ minHeight: 300 }}
              >
                <h5 className="text-muted">Select a chat to start messaging</h5>
              </div>
            )}

            {/* message input */}
            {selectedChat && (
              <div
                className="message-input shadow-lg rounded-top-3"
                style={{
                  boxShadow: "0px 0px 6px 0px #007fff",
                  borderTop: "1px solid #eee",
                }}
              >
                {selectedUrl && (
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <img
                      src={selectedUrl}
                      alt="preview"
                      style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 8 }}
                    />
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => {
                        setSelectedUrl(null);
                        setSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      style={{ border: "none", background: "transparent", color: "red" }}
                    >
                      ✕
                    </button>
                  </div>
                )}
                <div className="d-flex align-items-center gap-2">
                  <label
                    htmlFor="file-upload"
                    className="btn btn-outline-none btn-sm mb-0"
                    style={{ cursor: isUploading ? "not-allowed" : "pointer" }}
                  >
                    {isUploading ? "⏳" : "📎"}
                  </label>
                  <input
                    ref={fileInputRef}
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setIsUploading(true);
                        try {
                          const uploadResult = await uploadImageMutation.mutateAsync(file);
                          setSelectedUrl(uploadResult.data.url);
                          setSelectedFile(file);
                        } catch (error) {
                          console.error("Error uploading image:", error);
                        } finally {
                          setIsUploading(false);
                        }
                      }
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Type Something..."
                    className="form-control border-0 shadow-none"
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      setSelectedFile(null);
                      setSelectedUrl(null);
                      handleTyping();
                    }}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    style={{ borderRadius: 12, padding: "12px 14px" }}
                  />
                  <button
                    className="backgroundOrange rounded-3 btn-sm"
                    onClick={handleSendMessage}
                    disabled={(!newMessage.trim() && !selectedUrl) || isUploading}
                    style={{
                      background: "#e75a36",
                      border: "none",
                      padding: "10px 12px",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={sendIcon}
                      alt="Send"
                      style={{ width: 18, height: 18 }}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
