import React, { useState, useEffect, useRef } from "react";
import applePayIcon from "../assets/images/applyPayIcon.png";
import frameIcon from "../assets/images/Frame.png";
import GoogleIcon from "../assets/images/googleIcon.png";
import paypalIcon from "../assets/images/paypalIcon.png";
import { useModal } from "./ModalContext";
import { apiHelper } from "../services";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const NotificationModal = ({ open, onClose, modalBtnPress }) => {
  const modalRef = useRef();
  const { setIsModalOpen } = useModal();
  const token = useSelector(state => state.user.token);

  const paymentMethods = [
    { id: 1, icon: <img src={paypalIcon} alt="" /> },
    { id: 2, icon: <img src={GoogleIcon} alt="" /> },
    { id: 3, icon: <img src={applePayIcon} alt="" /> },
    { id: 4, icon: <img src={frameIcon} alt="" /> },
  ];

  const [selected, setSelected] = useState(4);
  const [isNotified, setIsNotified] = useState(() => {
    const saved = localStorage.getItem('notificationsEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [formData, setFormData] = useState({
    holderName: "",
    accountNumber: "",
    routingNumber: "",
  });

  // Detect click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (open) {
      setIsModalOpen(true);
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      setIsModalOpen(false);
    }

    return () => {
      setIsModalOpen(false);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose, setIsModalOpen]);

  if (!open) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    modalBtnPress?.(formData);
    onClose();
  };

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

  return (
    <div className="modal d-block bg-overlay-all" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered" ref={modalRef}>
        <div className="modal-content rounded-5 border-0  shadow-lg">
          {/* Header */}
          <div className="d-flex justify-content-between border-bottom px-2 py-3 mx-3 fs-5 btn-dark shadow-md bg-white text-black rounded-2 align-items-center mb-3">
            <p className="mb-0">Notifications</p>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={isNotified}
                onChange={handleToggle}
                id="flexSwitchCheck"
              />
            </div>
          </div>

          {/* Body */}
          <div
            className="modal-body"
            style={{ maxHeight: "500px", overflowY: "auto" }}
          >
            {[
              "Edit your information in a swipe Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
              "It is a long established fact that a reader will be distracted by the readable.",
              "There are many variations of passages of Lorem Ipsum available, but the majority have suffered.",
              "Edit your information in a swipe Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
            ].map((text, index) => (
              <div
                className={`border-bottom ${index !== 0 ? "my-4" : ""}`}
                key={index}
              >
                <p className="text-secondary mb-0">
                  <span className="text-black">{text.split(" ")[0]} </span>
                  {text.split(" ").slice(1).join(" ")}
                </p>
                <p className="my-2">
                  <span className="text-muted small">12 May, 2025</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
