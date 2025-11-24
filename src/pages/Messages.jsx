import React, { useState } from "react";
import FirstPerson from "../assets/images/firstPerson.png";
import searchIcon from "../assets/images/SearchIcon.png";
import sendIcon from "../assets/images/sendIcon.png";
import { useOutletContext } from "react-router-dom";
const mockThreads = [
  {
    id: 1,
    name: "Killan James",
    role: "Admin",
    lastMessage: "Typing...",
    time: "4:30 PM",
    profile: "https://i.pravatar.cc/40?img=1",
    messages: [
      { from: "them", text: "Hello, how can I help you?" },
      { from: "me", text: "Sure, I’ll get back to you shortly." },
    ],
  },
  {
    id: 2,
    name: "Claudia Maudi",
    role: "",
    lastMessage: "Nice",
    time: "4:45 PM",
    profile: "https://i.pravatar.cc/40?img=2",
    messages: [
      { from: "them", text: "Thanks for your quick response." },
      { from: "me", text: "Sure, I’ll get back to you shortly." },
    ],
  },
  {
    id: 3,
    name: "John Doe",
    role: "Admin",
    lastMessage: "Be right back",
    time: "5:00 PM",
    profile: "https://i.pravatar.cc/40?img=3",
    messages: [
      { from: "them", text: "Just checking in." },
      { from: "me", text: "Be right back" },
    ],
  },
  {
    id: 4,
    name: "Killan James",
    role: "Admin",
    lastMessage: "Typing...",
    time: "4:30 PM",
    profile: "https://i.pravatar.cc/40?img=1",
    messages: [
      { from: "them", text: "Hello, how can I help you?" },
      { from: "me", text: "Sure, I’ll get back to you shortly." },
    ],
  },
  {
    id: 5,
    name: "Claudia Maudi",
    role: "",
    lastMessage: "Nice",
    time: "4:45 PM",
    profile: "https://i.pravatar.cc/40?img=2",
    messages: [
      { from: "them", text: "Thanks for your quick response." },
      { from: "me", text: "Sure, I’ll get back to you shortly." },
    ],
  },
  {
    id: 6,
    name: "John Doe",
    role: "Admin",
    lastMessage: "Be right back",
    time: "5:00 PM",
    profile: "https://i.pravatar.cc/40?img=3",
    messages: [
      { from: "them", text: "Just checking in." },
      { from: "me", text: "Be right back" },
    ],
  },
  {
    id: 7,
    name: "Killan James",
    role: "Admin",
    lastMessage: "Typing...",
    time: "4:30 PM",
    profile: "https://i.pravatar.cc/40?img=1",
    messages: [
      { from: "them", text: "Hello, how can I help you?" },
      { from: "me", text: "Sure, I’ll get back to you shortly." },
    ],
  },
  {
    id: 8,
    name: "John Doe",
    role: "Admin",
    lastMessage: "Be right back",
    time: "5:00 PM",
    profile: "https://i.pravatar.cc/40?img=3",
    messages: [
      { from: "them", text: "Just checking in." },
      { from: "me", text: "Be right back" },
    ],
  },
  {
    id: 9,
    name: "Killan James",
    role: "Admin",
    lastMessage: "Typing...",
    time: "4:30 PM",
    profile: "https://i.pravatar.cc/40?img=1",
    messages: [
      { from: "them", text: "Hello, how can I help you?" },
      { from: "me", text: "Sure, I’ll get back to you shortly." },
    ],
  },
];

const ChatApp = () => {
  const [selectedChatId, setSelectedChatId] = useState(mockThreads[0].id);

  const handleSelectChat = (id) => {
    setSelectedChatId(id);
  };
  const isSideBarOpen = useOutletContext();

  const selectedChat = mockThreads.find((chat) => chat.id === selectedChatId);

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
              {mockThreads.map((thread) => (
                <div
                  key={thread.id}
                  className={`message-thread d-flex gap-2 py-3 px-2 rounded ${
                    selectedChatId === thread.id ? "active bg-light" : ""
                  }`}
                  onClick={() => handleSelectChat(thread.id)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    // src={thread.profile}
                    src={FirstPerson}
                    alt={thread.name}
                    className="rounded-circle"
                    width="40"
                    height="40"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between">
                      <strong className="text-orange-custom">
                        {thread.name}
                      </strong>
                      {thread.role && <small>{thread.role}</small>}
                    </div>
                    <div className="d-flex justify-content-between text-muted small">
                      <span>{thread.time}</span>
                      <span>{thread.lastMessage}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Right Column - Selected Chat */}
          <div className="col-12 col-md-6 chat-area shadow-lg detailsBox rounded-5  order-1 order-md-2">
            <div className="chat-header mb-3 d-flex align-items-center gap-2">
              <img
                src={selectedChat.profile}
                alt={selectedChat.name}
                className="rounded-circle"
                width="40"
                height="40"
                style={{ objectFit: "cover" }}
              />
              <h5 className="mb-0 text-orange-custom">
                {selectedChat.name}{" "}
                {selectedChat.role && `(${selectedChat.role})`}
              </h5>
            </div>

            <div className="chat-messages mb-3" style={{ minHeight: "200px" }}>
              {selectedChat.messages.map((msg, idx) => (
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
                      src={selectedChat.profile}
                      alt={selectedChat.name}
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
                      src="https://i.pravatar.cc/40?img=5"
                      alt="You"
                      className="rounded-circle ms-2"
                      width="30"
                      height="30"
                    />
                  )}
                </div>
              ))}
            </div>

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
                />
                <button className="backgroundOrange rounded-3 btn-sm">
                  <img src={sendIcon} alt="Send" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default ChatApp;
