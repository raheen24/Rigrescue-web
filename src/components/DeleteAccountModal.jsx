import React, { useEffect } from "react";
import crosImg from "../assets/images/crosImg.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useModal } from "./ModalContext";

function DeleteAccountModal({ show, onHide, onConfirm }) {
  const { setIsModalOpen } = useModal();

  useEffect(() => {
    if (show) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
    return () => setIsModalOpen(false);
  }, [show, setIsModalOpen]);

  if (!show) return null;
  const navigate = useNavigate();
  const location = useLocation();

  const handleConfirm = () => {
    if (onConfirm) onConfirm(); 

    if (location.pathname.startsWith("/shop")) {
      navigate("/shop-owner/my-mechanics");
    } else {
      navigate("/fleet/my-drivers");
    }
  };
  return (
    <div
      className="modal d-block"
      style={{
        backdropFilter: "blur(5px)",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
      }}
      onClick={onHide}
    >
      <div
        className="modal-dialog"
        style={{
          maxWidth: "280px",
          margin: "auto",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border border-black rounded-3">
          <div className="modal-body px-4 py-3 d-flex flex-column justify-content-between text-center">
            {/* Centered Title with Close Button */}
            <div className="position-relative mb-3 mt-3">
              <h5 className="mb-0">Delete Account</h5>
              <button
                type="button"
                className="btn p-0 border-0 bg-transparent position-absolute"
                onClick={onHide}
                aria-label="Close"
                style={{
                  top: -10,
                  right: -3,
                  transform: "translate(50%, -50%)",
                  cursor: "pointer",
                }}
              >
                <img
                  src={crosImg}
                  alt="Close"
                  className="img-fluid"
                  style={{ width: "28px", height: "28px" }}
                />
              </button>
            </div>

            {/* Confirmation Text */}
            <p className="mb-4">
              Are you sure you want to delete this account?
            </p>

            {/* Action Buttons */}
          </div>
          <div className="d-flex justify-content-center w-full gap-0 activeBtnSec">
            <button
              type="button"
              className="btn btn-outline-secondary px-4"
              onClick={onHide}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn bg-transparent border border-black px-4"
              onClick={handleConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteAccountModal;