import React, { useState, useEffect } from "react";
import deleteIcon from "../assets/images/delete.png";
import GoogleIcon from "../assets/images/googleIcon.png";
import paypalIcon from "../assets/images/paypalIcon.png";
import CustomButton from "../components/GlobalBtn";
import applePayIcon from "../assets/images/applyPayIcon.png";
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
    if (activeTab === "payment") {
      fetchCards();
    }
  }, [activeTab]);

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
              placeholder=""
              label={"Old Password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <CustomTextField
              type="password"
              placeholder=""
              label={"New Password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <CustomTextField
              type="password"
              placeholder=""
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
            className="chat-container d-flex flex-column p-2"
            style={{ height: "100%" }}
          >
            <div className="chat-header d-flex align-items-center gap-2">
              <img
                src={AccountadminIcon}
                alt="John Doe"
                className="rounded-circle"
                width="70"
                height="70"
                style={{ objectFit: "cover" }}
              />
              <h5 className="mb-0 text-orange-custom">Admin Support</h5>
            </div>

            <div className="chat-messages flex-grow-1 overflow-auto mt-3">
              <div className="mb-2 d-flex justify-content-start">
                <img
                  src={AccountadminIcon}
                  alt="John"
                  className="rounded-circle me-2"
                  width="50"
                  height="50"
                />
                <div
                  className="p-2 rounded backgroundOrange text-white"
                  style={{ maxWidth: "70%" }}
                >
                  Hello! How can I help you?
                </div>
              </div>
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
                {[
                  { key: "payment", label: "Payment Accounts" },
                  { key: "password", label: "Change Password" },
                  { key: "terms", label: "Terms and Conditions" },
                  { key: "privacy", label: "Privacy Policy" },
                  { key: "support", label: "Admin Support" },
                ].map((tab) => (
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
