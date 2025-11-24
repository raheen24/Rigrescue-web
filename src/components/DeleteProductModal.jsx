import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useModal } from "./ModalContext";

function DeleteProductModal({ show, onHide, onConfirm }) {
  const { setIsModalOpen } = useModal();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (show) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
    return () => setIsModalOpen(false);
  }, [show, setIsModalOpen]);

  if (!show) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    if (location.pathname.startsWith("/shop")) {
      navigate("/shop-owner/inventory-management");
    } else {
      navigate("/fleet/my-products");
    }
  };

  return (
    <div
      className="modal d-block"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(5px)",
      }}
    >
      <div
        className="modal-dialog"
        style={{
          width: "280px",
          margin: "auto",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          className="modal-content"
          style={{
            borderRadius: "12px",
            border: "2px solid #000", // stronger border all around
            boxShadow: "none",
            position: "relative", // for positioning close button
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => {
              console.log("Close clicked");
              onHide();
            }}
            aria-label="Close"
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              border: "none",
              fontSize: "20px",
              fontWeight: "700",
              cursor: "pointer",
              color: "#fff",
              backgroundColor: "#000",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              lineHeight: "32px",
              textAlign: "center",
              padding: 0,
              userSelect: "none",
            }}
          >
            &times;
          </button>

          <div className="modal-body text-center" style={{}}>
            {/* Title */}
            <h5
              className="mb-3 mt-3"
              style={{
                fontWeight: "700",
                fontSize: "16px",
                lineHeight: "24px",
                color: "#000",
              }}
            >
              Delete Product
            </h5>

            {/* Confirmation Text */}
            <p
              className="mb-4"
              style={{
                fontWeight: "400",
                fontSize: "14px",
                lineHeight: "20px",
                color: "#000",
                marginBottom: "24px",
              }}
            >
              Are you sure you want to delete this product
            </p>
          </div>
          {/* Action Buttons */}
          <div className="d-flex justify-content-center w-full gap-0 activeBtnSec">
            <button
              type="button"
              onClick={onHide}
              className="btn btn-outline-secondary px-4"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="btn btn-outline-secondary px-4"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteProductModal;
