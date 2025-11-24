import { useState, useRef, useEffect } from "react";
import { FaCog, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import profileImg from "../assets/images/Group.png";
import arrowDown from "../assets/images/arrowDown.png";
import LogoutModal from "./LogoutModal";
import SignoutIcon from "../assets/images/sign-out.png";
import ChangePass from "../assets/images/change-pass.png";
import { deleteCookie } from "../utils";
import { getProfile } from "../services";

const UserProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const role = useSelector((state) => state.user.role);
  const user = useSelector((state) => state.user.user);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const result = await getProfile();
      if (!result.error) {
        setProfileData(result.response.data.data);
      }
    };
    fetchProfile();
  }, []);

  const handleToggle = () => setOpen(!open);
  const handleLogout = () => {
    deleteCookie("token");
    deleteCookie("role");
    sessionStorage.clear();
    window.location.href = "/";
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="position-relative" ref={dropdownRef}>
      <button
        className="headerDropdown"
        onClick={handleToggle}
      >
        <div className="headerIcons">
          <img src={profileData?.avatar || profileImg} alt="Profile" className="headerProfile" />
        </div>
        <span className="ms-2 fw-semibold text-white  d-md-inline text-capitalize">
          {profileData?.first_name && profileData?.last_name ? `${profileData.first_name} ${profileData.last_name}` : "John Smith"}
        </span>
        <img
          src={arrowDown}
          alt="Arrow Down"
          className="ms-2 d-none d-md-inline"
          style={{ width: "auto", height: "auto" }}
        />
      </button>

      {open && (
        <div
          className="dropdown-menu show mt-2 p-0 bg-white text-white"
          style={{
            right: 0,
            left: "auto",
            minWidth: "200px",
            position: "absolute",
            zIndex: 999,
            borderRadius: "0.75rem",
            overflow: "hidden",
          }}
        >
          <div
            className="d-flex align-items-center backgroundColorGb text-white p-2 rounded-3"
            style={{ width: "fit-content" }}
          >
            <div
              className="d-flex align-items-center justify-content-center rounded-circle bg-white"
              style={{ width: "44px", height: "44px", borderRadius:"32px" }}
            >
              <img
                src={profileData?.avatar || profileImg}
                alt="Profile"
                style={{ width:"100%", height: "100%" , borderRadius:"32px" }}
              />
            </div>
            <div className="ms-3">
              <p className="mb-0 fw-semibold text-capitalize">{profileData?.first_name && profileData?.last_name ? `${profileData.first_name} ${profileData.last_name}` : "John Smith"}</p>
              <p className="mb-0">{profileData?.email || "Info@Example.Com"}</p>
            </div>
          </div>

          <button
            className="dropdown-item d-flex align-items-center text-black bg-white hover:bg-secondary px-3 py-2"
            onClick={() => {
              setOpen(false);
              const profilePath = role === "shop_owner" ? "/shop-owner/my-profile" : "/fleet/my-profile";
              navigate(profilePath);
            }}
          >
            <img src={profileImg} width={14} className="mx-2" alt="" /> My
            Profile
          </button>

          <button
            className="dropdown-item d-flex align-items-center text-black bg-white hover:bg-secondary px-3 py-2"
            onClick={() => {
              setOpen(false);
              const settingsPath = role === "shop_owner" ? "/shop-owner/settings" : "/fleet/settings";
              navigate(settingsPath, { state: { activeTab: "password" } });
            }}
          >
            <img src={ChangePass} width={14} className="mx-2" alt="" /> Change
            Password
          </button>
          <button
            className="dropdown-item d-flex align-items-center text-black bg-white hover:bg-secondary px-3 py-2"
            onClick={() => setLogoutModalOpen(true)}
          >
            <img src={SignoutIcon} width={14} className="mx-2" alt="" /> Logout
          </button>
          <LogoutModal
            open={logoutModalOpen}
            onClose={() => setLogoutModalOpen(false)}
            onConfirm={() => {
              handleLogout();
              setLogoutModalOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
