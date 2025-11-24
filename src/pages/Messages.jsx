import React, { useState, useEffect, useRef } from "react";
import FirstPerson from "../assets/images/firstPerson.png";
import searchIcon from "../assets/images/SearchIcon.png";
import sendIcon from "../assets/images/sendIcon.png";
import { useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { useChatInboxQuery, useMarkChatAsReadMutation, useProfileQuery } from "../services/apiQueries";

const ChatApp = () => {
  const user = useSelector((state) => state.user.user);
  if (user) {
    Object.keys(user).forEach(key => {
      console.log(`User ${key}:`, user[key]);
    });
  }
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadedChats, setLoadedChats] = useState(new Set()); 
  const loadMessages = (chatId) => {
    try {
      const stored = localStorage.getItem(`chat_messages_${chatId}`);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading messages:", error);
      return [];
    }
  };

  // Save messages to localStorage
  const saveMessages = (chatId, messages) => {
    try {
      localStorage.setItem(`chat_messages_${chatId}`, JSON.stringify(messages));
    } catch (error) {
      console.error("Error saving messages:", error);
    }
  };
  const [socket, setSocket] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const { data: inboxData, isLoading: inboxLoading } = useChatInboxQuery();
  const { data: profileData } = useProfileQuery();
  const markAsReadMutation = useMarkChatAsReadMutation();

  const currentUser = profileData?.data;

  const isSideBarOpen = useOutletContext();

  const inbox = inboxData?.data || [];

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("https://server1.appsstaging.com:3004");

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
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
    if (socket && selectedChatId) {

      socket.on("receive_message", (messageData) => {
        if (messageData.sender_id === selectedChatId || messageData.receiver_id === selectedChatId) {
          const newMessage = {
            from: messageData.sender_id === currentUser?.id ? "me" : "them",
            text: messageData.message,
            time: new Date().toLocaleTimeString()
          };
          setMessages((prev) => {
            // console.log("Adding new message:", newMessage);
            const updatedMessages = [...prev, newMessage];
            saveMessages(selectedChatId, updatedMessages);
            return updatedMessages;
          });
        } else {
          console.log("Message not for this chat:", messageData);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("receive_message");
      }
    };
  }, [socket, selectedChatId, currentUser?.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectChat = async (chatId, chatIndex) => {
    setSelectedChatId(chatId);

    // Load messages from localStorage
    const chatMessages = loadMessages(chatId);
    setMessages(chatMessages);

    // Mark as read - use index + 1 as chat_id
    try {
      await markAsReadMutation.mutateAsync({ chat_id: chatIndex + 1, is_read: true });
    } catch (error) {
    }

    // Join room for this chat
    if (socket && socket.connected && currentUser && currentUser.id) {
      socket.emit("join_room", { sender_id: currentUser.id, receiver_id: chatId });
      if (!loadedChats.has(chatId)) {
        socket.emit("get_messages", { sender_id: currentUser.id, receiver_id: chatId });
        setLoadedChats(prev => new Set([...prev, chatId]));
      }
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket || !selectedChatId || !currentUser || !currentUser.id) {
      return;
    }

    if (!socket.connected) {
      console.log("Socket not connected, cannot send message");
      return;
    }

    const messageData = {
      sender_id: currentUser.id,
      receiver_id: selectedChatId,
      message: newMessage,
      type: "text"
    };

    socket.emit("send_message", messageData);
    const localMessage = {
      from: "me",
      text: newMessage,
      time: new Date().toLocaleTimeString()
    };
    setMessages((prev) => {
      const updatedMessages = [...prev, localMessage];
      saveMessages(selectedChatId, updatedMessages);
      return updatedMessages;
    });
    setNewMessage("");
  };

  const selectedChat = inbox.find((chat) => chat.user.id === selectedChatId);

  return (
    <div
      className={`content_section ${
        isSideBarOpen ? "" : "content_section_close"
      }  home_page`}
    >
      {" "}
      <div className="rounded-3 innerWrapper bg-[#E9E9E9] m-">
        <h5 className="colorOrange">Messages</h5>
        {/* <div className="container-fluid"> */}
        <div className="row">
          <div className="col-12 col-md-6 message-list shadow-lg rounded-5 order-2 order-md-1 mb-2">
            <div className="message-header">
              <div className="search-container mb-2">
                <div className="bg-white flex rounded-2 px-4 py-2 items-center shadow-lg">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control border-0"
                      placeholder="Search"
                      aria-label="Search"
                    />
                    <span className="input-group-text bg-white border-0">
                      <img
                        src={searchIcon}
                        alt="Search"
                        style={{ width: "16px", height: "16px " }}
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="message-threads">
              {inboxLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                inbox.map((thread, index) => (
                  <div
                    key={thread.user.id}
                    className={`message-thread d-flex gap-2 py-3 px-2 rounded ${
                      selectedChatId === thread.user.id ? "active bg-light" : ""
                    }`}
                    onClick={() => handleSelectChat(thread.user.id, index)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={thread.user.avatar || FirstPerson}
                      alt={thread.user.first_name}
                      className="rounded-circle"
                      width="40"
                      height="40"
                      style={{ objectFit: "cover" }}
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <strong className="text-orange-custom">
                          {thread.user.first_name} {thread.user.last_name}
                        </strong>
                      </div>
                      <div className="d-flex justify-content-between text-muted small">
                        <span>{thread.last_message_time}</span>
                        <span>{thread.last_message}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Right Column - Selected Chat */}
          <div className="col-12 col-md-6 chat-area shadow-lg detailsBox rounded-5  order-1 order-md-2">
            {selectedChat ? (
              <>
                <div className="chat-header mb-3 d-flex align-items-center gap-2">
                  <img
                    src={selectedChat.user.avatar || FirstPerson}
                    alt={selectedChat.user.first_name}
                    className="rounded-circle"
                    width="40"
                    height="40"
                    style={{ objectFit: "cover" }}
                  />
                  <h5 className="mb-0 text-orange-custom">
                    {selectedChat.user.first_name} {selectedChat.user.last_name}
                  </h5>
                </div>

                <div className="chat-messages mb-3" style={{ minHeight: "200px", maxHeight: "400px", overflowY: "auto" }}>
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`mb-2 d-flex ${
                        msg.from === "me"
                          ? "justify-content-end"
                          : "justify-content-start"
                      }`}
                    >
                      {msg.from !== "me" && (
                        <img
                          src={selectedChat.user.avatar || FirstPerson}
                          alt={selectedChat.user.first_name}
                          className="rounded-circle me-2"
                          width="30"
                          height="30"
                        />
                      )}

                      <div
                        className={`p-2 rounded ${
                          msg.from === "me"
                            ? "backgroundColorGb text-white"
                            : "backgroundOrange text-white"
                        }`}
                        style={{ maxWidth: "70%" }}
                      >
                        {msg.text}
                      </div>

                      {msg.from === "me" && (
                        <img
                          src={currentUser?.avatar || "https://i.pravatar.cc/40?img=5"}
                          alt="You"
                          className="rounded-circle ms-2"
                          width="30"
                          height="30"
                        />
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </>
            ) : (
              <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "300px" }}>
                <h5 className="text-muted">Select a chat to start messaging</h5>
              </div>
            )}

            {selectedChat && (
              <div
                className="message-input shadow-lg rounded-top-3 p-2"
                style={{ boxShadow: "0px 0px 6px 0px #007fff" }}
              >
                <div className="d-flex align-items-center gap-2">
                  <label
                    htmlFor="file-upload"
                    className="btn btn-outline-none btn-sm mb-0"
                  >
                    📎
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e) => console.log(e.target.files[0])}
                  />
                  <input
                    type="text"
                    placeholder="Type Something..."
                    className="form-control border-0 shadow-none"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    className="backgroundOrange rounded-3 btn-sm"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <img src={sendIcon} alt="Send" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default ChatApp;
