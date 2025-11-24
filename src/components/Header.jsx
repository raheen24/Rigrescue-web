import { useState } from "react";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import bellIcon from "../assets/images/notification-icon.png";
import hamburgerIcon from "../assets/images/hamburger.png";
import searchIcon from "../assets/images/SearchIcon.png";
import UserProfileDropdown from "./ UserProfileDropdown";
import NotificationModal from "./NotificationModal";

const Header = ({ toggleSidebar, isSidebarOpen, isMobile }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleModalSubmit = (formData) => {
    console.log("Submitted account details:", formData);
  };
  return (
    <header
      className={`${
        (!isSidebarOpen || isMobile) ? "header__content_sec" : "header__content"
      } user_header fixed top-0 left-0 w-full z-50`}
    >
      <div className="flex header_leftSect items-center gap-4">
        {(!isSidebarOpen || isMobile) && (
          <button
            onClick={toggleSidebar}
            className="btn p-0 border-0 bg-transparent d-flex align-items-center justify-content-center"
            style={{ width: "24px", height: "24px" }}
          >
            <img
              src={hamburgerIcon}
              alt="Menu"
              style={{ width: "20px", height: "20px" }}
            />
          </button>
        )}
        {/* <div className="searchfield">
          <input type="search" placeholder="Search" className="custom-input" />
          <img src={searchIcon} alt="Search" className="w-5 h-5" />
        </div>{" "} */}
      </div>

      <div className="flex items-center header_rightSect">
          <button
            onClick={() => setShowModal(true)}
            className="headerIcons"
          >
            <span>1</span>
            <img src={bellIcon} alt="Notifications" className="w-6 h-6" />
          </button>
        <UserProfileDropdown />
        <NotificationModal
          open={showModal}
          onClose={() => setShowModal(false)}
          modalBtnPress={handleModalSubmit}
        />
      </div>
    </header>
  );
};

export default Header;
