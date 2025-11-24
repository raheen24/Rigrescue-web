import React, { useEffect, useState } from "react";
import crosImg from "../assets/images/crosImg.png";
import { useModal } from "./ModalContext";
import { apiHelper } from "../services";
import { toast } from "react-toastify";

function ManageMechanicStatusModal({
  show,
  onHide,
  onConfirm,
  mechanic_id,
  currentStatus,
}) {
  const { setIsModalOpen } = useModal();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
    return () => setIsModalOpen(false);
  }, [show, setIsModalOpen]);

  if (!show) return null;

  const isActive = currentStatus === "active";
  const newStatus = isActive ? "inactive" : "active";
  const actionText = isActive ? "deactivate" : "activate";

  const handleConfirm = async () => {
    setLoading(true);
    const { error } = await apiHelper(
      "POST",
      "/web/shop/mechanic/manage",
      {},
      { mechanic_id: mechanic_id, status: newStatus }
    );
    setLoading(false);

    if (error) {
      toast.error(`Failed to ${actionText} account: ${error}`);
    } else {
      toast.success(`Your mechanic has been ${actionText}d successfully.`);
      if (onConfirm) onConfirm(); // Call original confirm logic if any
    }
  };

  return (
    <div
      className="modal d-block"
      style={{
        backdropFilter: "blur(5px)",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
      }}
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
      >
        <div className="modal-content border border-black rounded-3">
          <div className="modal-body px-4 py-3 d-flex flex-column justify-content-between text-center">
            {/* Centered Title with Close Button */}
            <div className="position-relative mb-3 mt-3">
              <h5 className="mb-0">
                {isActive ? "Deactivate" : "Activate"} Account
              </h5>
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
              Are you sure you want to {actionText} this account?
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
              disabled={loading}
            >
              {loading ? "Processing..." : isActive ? "Deactivate" : "Activate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageMechanicStatusModal;