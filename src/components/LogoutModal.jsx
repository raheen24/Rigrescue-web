import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import CustomButton from "./GlobalBtn";
import LogoutIcon from "../assets/images/LogoutIcon.png";
import { useModal } from "./ModalContext";
import { apiHelper } from "../services/index";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../redux/userslice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { deleteCookie } from "../utils";

const LogoutModal = ({ open, onClose, onConfirm }) => {
  const { setIsModalOpen } = useModal();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (open) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
    return () => setIsModalOpen(false);
  }, [open, setIsModalOpen]);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const deviceToken = user?.deviceToken;
      const body = deviceToken ? { deviceToken } : {};
      const result = await apiHelper("POST", "/web/logout", {}, body);
      if (result.error) {
        // If unauthenticated, still proceed with logout locally
        if (result.error.includes("Unauthenticated")) {
          toast.success("You have been successfully logged out.");
          dispatch(setLogout());
          deleteCookie("token");
          deleteCookie("role");
          sessionStorage.clear();
          navigate("/");
        } else {
          toast.error(result.error);
        }
      } else {
        toast.success(result.response.data.message);
        dispatch(setLogout());
        deleteCookie("token");
        deleteCookie("role");
        sessionStorage.clear();
        navigate("/");
      }
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="modal d-block bg-overlay-all" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 text-center">
          <div className="position-relative my-4 rounded-top-4">
            <img src={LogoutIcon} alt="" />
            <h4 className="modal-title text-center text-black my-2">
            Log out
            </h4>
          </div>

          <div className="modal-body">
            <p className="fs-6 text-black mb-4">
            Are you sure you wants to
            logout ?
            </p>
          </div>

          <div className="d-flex justify-content-between px-4 pb-4 gap-2">
            <button
              className="btn px-4 py-2 d-flex align-items-center w-100 justify-content-center borderBtns shadow-md text-black fw-bold rounded-2 "
              onClick={onClose}
            >
              Cancel
            </button>
            <CustomButton
              label={isLoading ? "Logging out..." : "Log Out"}
              className="w-100 text-white"
              onClick={handleLogout}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
