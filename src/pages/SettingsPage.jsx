import React, { useState, useEffect, useRef } from "react";
import deleteIcon from "../assets/images/delete.png";
import GoogleIcon from "../assets/images/googleIcon.png";
import CustomButton from "../components/GlobalBtn";
import frameIcon from "../assets/images/Frame.png";
import CustomTextField from "../components/CustomTextField";
import sendIcon from "../assets/images/sendIcon.png";
import AccountadminIcon from "../assets/images/accadminIcon.png";
import { useOutletContext, useLocation } from "react-router-dom";
import AddAccountModal from "../components/AddAccountModal";
import { apiHelper } from "../services";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/LoadingSpinner";
import { io } from "socket.io-client";
import { useProfileQuery, useUploadImageMutation } from "../services/apiQueries";

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

const SettingsPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "payment");
  const isSideBarOpen = useOutletContext();
  const [showModal, setShowModal] = useState(false);
  const [isNotified, setIsNotified] = useState(() => {
    const saved = localStorage.getItem('notificationsEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [termsContent, setTermsContent] = useState(null);
  const [privacyContent, setPrivacyContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cards, setCards] = useState([]);
  const [cardsLoading, setCardsLoading] = useState(false);
  const token = useSelector(state => state.user.token);
  const role = useSelector(state => state.user.role);

  const tabs = [
    { key: "password", label: "Change Password" },
    { key: "terms", label: "Terms and Conditions" },
    { key: "privacy", label: "Privacy Policy" },
    { key: "support", label: "Admin Support" },
  ];

  if (role !== "shop_owner") {
    tabs.unshift({ key: "payment", label: "Payment Accounts" });
  }

  // Socket and chat states for support tab
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [typingUserId, setTypingUserId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const emitStopTypingRef = useRef(null);
  const { data: profileData } = useProfileQuery();
  const currentUser = profileData?.data;
  const adminId = currentUser?.admin?.id;
  const uploadImageMutation = useUploadImageMutation();
  const [onlineUsers, setOnlineUsers] = useState([]);

  const handleModalSubmit = async (formData) => {
    if (formData.type === 'card') {
      const { error, response } = await apiHelper("POST", "/web/fleet/card/add", {}, { payment_method_id: formData.payment_method_id });
      if (error) {
        toast.error(error);
      } else {
        toast.success(response.data.message);
        fetchCards(); 
      }
    } else {
      console.log("Submitted account details:", formData);
    }
  };
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const [termsRes, privacyRes] = await Promise.all([
          apiHelper("GET", "/content/terms_and_conditions"),
          apiHelper("GET", "/content/privacy_policy")
        ]);

        if (termsRes.error) {
          toast.error("Failed to load terms and conditions");
        } else {
          setTermsContent(termsRes.response.data.data);
        }

        if (privacyRes.error) {
          toast.error("Failed to load privacy policy");
        } else {
          setPrivacyContent(privacyRes.response.data.data);
        }
      } catch (error) {
        toast.error("Error loading content");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  useEffect(() => {
    if (activeTab === "payment" && role !== "shop_owner") {
      fetchCards();
    }
  }, [activeTab, role]);

  // Socket connection for support tab
  useEffect(() => {
    if (activeTab !== "support" || !currentUser?.id) return;

    const newSocket = io("https://server1.appsstaging.com:3004", {
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("Socket connected for support:", newSocket.id);
      newSocket.emit("user_online", { user_id: currentUser.id });
      if (adminId) {
        newSocket.emit("chat:message:list", {
          sender_id: currentUser.id,
          receiver_id: adminId,
        });
      }
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected for support");
    });

    newSocket.on("connect_error", () => {
      console.error("Socket connection error for support");
    });

    setSocket(newSocket);

    return () => {
      console.log("Disconnecting support socket...");
      newSocket.disconnect();
    };
  }, [activeTab, currentUser?.id, adminId]);
  useEffect(() => {
    if (!socket || activeTab !== "support") return;

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
  }, [socket, activeTab]);

  const isUserOnline = (id) => onlineUsers.includes(id);

  useEffect(() => {
    if (!socket || activeTab !== "support") return;

    const onTyping = (data) => {
      if (!data) return;
      if (data.sender_id && data.receiver_id) {
        if (
          data.sender_id === adminId &&
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
  }, [socket, activeTab, adminId, currentUser?.id]);

  useEffect(() => {
    if (!socket || activeTab !== "support") return;

    const onReceive = (messageData) => {
      if (!messageData) return;
      const involvesAdmin =
        (messageData.sender_id === adminId && messageData.receiver_id === currentUser?.id) ||
        (messageData.sender_id === currentUser?.id && messageData.receiver_id === adminId);

      if (involvesAdmin) {
        const incoming = {
          from: messageData.sender_id === currentUser?.id ? "me" : "them",
          text: messageData.message,
          time: messageData.created_at
            ? new Date(messageData.created_at).toLocaleTimeString()
            : new Date().toLocaleTimeString(),
          raw: messageData,
        };
        setMessages((prev) => [...prev, incoming]);
      }
    };

    const onChatHistory = (payload) => {
      console.log("Received admin support chat history payload:", payload);
      if (!payload) return;
      const messagesList = payload.messages || payload.data || payload;
      console.log("Admin support messages list:", messagesList);
      if (!Array.isArray(messagesList)) return;
      const formattedMessages = messagesList.map((m) => ({
        from: m.sender_id === currentUser?.id ? "me" : "them",
        text: m.message || m.text || m.body,
        time: m.created_at
          ? new Date(m.created_at).toLocaleTimeString()
          : new Date().toLocaleTimeString(),
        raw: m,
      }));

      setMessages(formattedMessages);
    };

    socket.on("receive_message", onReceive);
    socket.on("chat_history", onChatHistory);
    socket.on("response", onChatHistory);

    return () => {
      socket.off("receive_message", onReceive);
      socket.off("chat_history", onChatHistory);
      socket.off("response", onChatHistory);
    };
  }, [socket, activeTab, adminId, currentUser?.id]);

  useEffect(() => {
    if (activeTab === "support") {
      // Show welcome message initially
      if (adminId) {
        const dummyMessage = {
          from: "them",
          text: "Hello! How can I help you?",
          time: new Date().toLocaleTimeString(),
          raw: { sender_id: adminId, receiver_id: currentUser?.id, message: "Hello! How can I help you?" },
        };
        setMessages([dummyMessage]);
      }
    }
  }, [activeTab, adminId, currentUser?.id]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (role === "shop_owner" && activeTab === "payment") {
      setActiveTab("password");
    }
  }, [role, activeTab]);

  const handleToggle = async (e) => {
    console.log("Token:", token);
    console.log("Token length:", token ? token.length : 0);
    if (!token || token.trim() === "") {
      toast.error("Please login to toggle notifications");
      return;
    }
    const newValue = e.target.checked;
    const { error, response } = await apiHelper("POST", "/notification/toggle", {}, { is_notified: newValue });
    if (error) {
      toast.error(error);
    } else {
      setIsNotified(newValue);
      localStorage.setItem('notificationsEnabled', JSON.stringify(newValue));
      toast.success(response.data.message);
    }
  };

  const handleChangePassword = async () => {
    if (!token || token.trim() === "") {
      toast.error("Please login to change password");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }
    const { error, response } = await apiHelper("POST", "/web/change-password", {}, {
      old_password: oldPassword,
      new_password: newPassword,
      new_password_confirmation: confirmPassword
    });
    if (error) {
      toast.error(error);
    } else {
      toast.success(response.data.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const fetchCards = async () => {
    setCardsLoading(true);
    const { error, response } = await apiHelper("GET", "/web/fleet/cards");
    if (error) {
      toast.error("Failed to load cards");
    } else {
      setCards(response.data.data);
    }
    setCardsLoading(false);
  };

  const deleteCard = async (id) => {
    const { error, response } = await apiHelper("DELETE", "/web/fleet/card/delete", {}, { card_id: id });
    if (error) {
      toast.error(error);
    } else {
      toast.success(response.data.message);
      fetchCards();
    }
  };

  const handleTyping = () => {
    if (!socket || !currentUser?.id || !adminId) return;

    setIsTyping(true);
    socket.emit("typing", {
      sender_id: currentUser.id,
      receiver_id: adminId,
    });
    if (emitStopTypingRef.current) clearTimeout(emitStopTypingRef.current);
    emitStopTypingRef.current = setTimeout(() => {
      socket.emit("stop_typing", {
        sender_id: currentUser.id,
        receiver_id: adminId,
      });
      setIsTyping(false);
    }, 1500);
  };

  // Send message to admin
  const handleSendMessage = async () => {
    // if (
    //   (!newMessage.trim() && !selectedUrl) ||
    //   !socket ||
    //   !adminId ||
    //   !currentUser?.id ||
    //   !socket.connected ||
    //   isUploading
    // ) {
    //   return;
    // }

    let messageContent = newMessage;
    let messageType = "text";

    if (selectedUrl) {
      messageContent = selectedUrl;
      messageType = "image";
    }

    const messageData = {
      sender_id: currentUser.id,
      receiver_id: adminId,
      message: messageContent,
      type: messageType,
    };

    socket.emit("chat:message:send", messageData);

    const localMessage = {
      from: "me",
      text: messageContent,
      time: new Date().toLocaleTimeString(),
      raw: messageData,
    };

    setMessages((prev) => [...prev, localMessage]);

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
        receiver_id: adminId,
      });
    }
  };

  const handleFileChange = async (e) => {
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
  };
  const renderTabContent = () => {
    switch (activeTab) {
      case "payment":
        return (
          <>
            <h5 className="mb-4 fs-4 text-center">Payment Accounts</h5>
            {cardsLoading ? (
              <LoadingSpinner />
            ) : (
              cards.map((card) => (
                <div
                  className="cardBox d-flex align-items-center justify-content-between backgroundOrange text-white rounded mb-3"
                  key={card.id}
                >
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="backgroundColorGb text-white p-2 rounded-3 d-flex align-items-center justify-content-center"
                      style={{ width: 40, height: 40 }}
                    >
                      <img src={frameIcon} alt="" />
                    </div>
                    <span className="fs-5">{card.brand} **** {card.last4}</span>
                  </div>
                  <button
                    className="btn delBtn btn-light text-danger p-2 rounded shadow-sm d-flex align-items-center justify-content-center"
                    onClick={() => deleteCard(card.id)}
                  >
                    <img src={deleteIcon} alt="" />
                  </button>
                </div>
              ))
            )}
            <div>
              <CustomButton
                label={"Add New Account"}
                onClick={() => setShowModal(true)}
                className="cta"
              />
              <AddAccountModal
                open={showModal}
                onClose={() => setShowModal(false)}
                modalBtnPress={handleModalSubmit}
              />
            </div>
          </>
        );

      case "password":
        return (
          <>
            <h5 className="mb-4 fs-4 text-center">Change Password</h5>
            {/* <div className="mx-3"> */}
            <CustomTextField
              type="password"
              placeholder="Enter Old Password"
              label={"Old Password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <CustomTextField
              type="password"
              placeholder="Enter New Password"
              label={"New Password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <CustomTextField
              type="password"
              placeholder="Confirm Password"
              label={"Confirm Password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {/* </div> */}
            <CustomButton label={"Change Password"} className="cta" onClick={handleChangePassword} />
          </>
        );

      case "terms":
        return (
          <>
            <h5 className="mb-4 fs-4 text-center">{termsContent?.title || "Terms and Conditions"}</h5>
            {loading ? (
              <LoadingSpinner />
            ) : termsContent ? (
              <div className="lh-lg scrollSec" style={{ whiteSpace: 'pre-line' }}>
                {termsContent.description}
              </div>
            ) : (
              <p>Failed to load terms and conditions.</p>
            )}
          </>
        );

      case "privacy":
        return (
          <>
            <h5 className="mb-4 fs-4 text-center">{privacyContent?.title || "Privacy Policy"}</h5>
            {loading ? (
              <LoadingSpinner />
            ) : privacyContent ? (
              <div className="lh-lg scrollSec" style={{ whiteSpace: 'pre-line' }}>
                {privacyContent.description}
              </div>
            ) : (
              <p>Failed to load privacy policy.</p>
            )}
          </>
        );
      case "support":
        return (
          <div
            className="chat-container d-flex flex-column"
            style={{ height: "100%" }}
          >
            <div className="chat-header d-flex align-items-center gap-2">
              <img
                src={AccountadminIcon}
                alt="Admin"
                className="rounded-circle"
                width="60"
                height="60"
                // style={{ objectFit: "cover" }}
              />
              <div>
                <h5 className="mb-0 text-orange-custom">Admin Support</h5>
                <div style={{ fontSize: 13, color: "#6c757d" }}>
                  {adminId && isUserOnline(adminId)
                    ? "Online"
                    : "Last seen recently"}
                </div>
              </div>
            </div>

            <div className="chat-messages flex-grow-1 overflow-auto mt-3 h-[400px] p-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-2 d-flex ${
                    msg.from === "me" ? "justify-content-end" : "justify-content-start"
                  }`}
                >
                  {msg.from !== "me" && (
                    <img
                      src={AccountadminIcon}
                      alt="Admin"
                      className="rounded-circle me-2"
                      width="50"
                      height="50"
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
                    {msg.raw?.type === "image" ? (
                      <img
                        src={msg.text}
                        alt="image"
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: "cover",
                          borderRadius: 10,
                          marginTop: 4,
                        }}
                      />
                    ) : (
                      msg.text
                    )}
                  </div>
                  {msg.from === "me" && (
                    <img
                      src={currentUser?.avatar || "https://i.pravatar.cc/40?img=5"}
                      alt="You"
                      className="rounded-circle ms-2"
                      width="40"
                      height="40"
                    />
                  )}
                </div>
              ))}

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
                    src={currentUser?.avatar || "https://i.pravatar.cc/40?img=5"}
                    alt="You"
                    className="rounded-circle ms-2"
                    width="30"
                    height="30"
                  />
                </div>
              )}

              {/* typing indicator inside chat */}
              {typingUserId &&
                adminId &&
                typingUserId === adminId && (
                  <div
                    className="d-flex justify-content-start align-items-center"
                    style={{ marginTop: 4 }}
                  >
                    <img
                      src={AccountadminIcon}
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

            {/* <div className="d-flex justify-content-center mb-2">
              <small className="text-muted">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </small>
            </div> */}
            <div
              className="message-input shadow-lg rounded mb-1 p-2"
              style={{ boxShadow: "0px 0px 6px 0px #007fff" }}
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
                  onChange={handleFileChange}
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
                  style={{ padding: "0px" }}
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
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`content_section ${
        isSideBarOpen ? "" : "content_section_close"
      } home_page `}
    >
      <div
        className="innerWrapper rounded-3"
        // style={{ backgroundColor: "#e9e9e9" }}
      >
        <div className="row">
          <h5 className="colorOrange mb-4">Settings</h5>

          {/* Sidebar */}
          <div className="col-md-6">
            <div
              className="detailsBox rounded-5 shadow p-3"
              // style={{ height: "700px", backgroundColor: "#F3F4F8" }}
            >
              <div className="d-flex justify-content-between px-4 py-3 fs-5  btn-dark shadow-md bg-white text-black rounded-2 align-items-center mb-3">
                <strong>Notifications</strong>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={isNotified}
                    onChange={handleToggle}
                  />
                </div>
              </div>

              <div className="d-grid gap-3">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    className={`settingTabs btn px-4 py-3 d-flex align-items-center justify-content-center  fw-bold rounded-2 ${
                      activeTab === tab.key
                        ? "settingTabs btn-dark shadow-md backgroundColorGb text-white"
                        : "settingTabs backgroundColorGb2 "
                    }`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="col-md-6 mt-4 mt-md-0">
            <div
              className="detailsBox rounded-5 shadow"
              style={{ height: "100%" , minHeight:"550px" }}
            >
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
