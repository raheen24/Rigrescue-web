import React, { useEffect, useState } from "react";
import crosImg from "../assets/images/crosImg.png";
import { useLocation, useNavigate } from "react-router-dom";
import CustomButton from "./GlobalBtn";
import { useModal } from "./ModalContext";
import { apiHelper } from "../services";
import { toast } from "react-toastify";

function AllucateBudgetModal({ show, onHide, onConfirm, driver_id = null }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsModalOpen } = useModal();
  const [amount, setAmount] = useState("");
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
  
  const handleNavigation = () => {
    if (location.pathname.startsWith("/shop")) {
      navigate("/shop-owner/my-mechanics");
    } else {
      navigate("/fleet/my-drivers-detail");
    }
  };
  const handleAllocateBudget = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      const payload = { amount: parseFloat(amount) };
      if (driver_id) {
        payload.driver_id = driver_id;
      }
      const { error, response } = await apiHelper("POST", "/web/fleet/budget/allocate", {}, payload);

      if (error) {
        toast.error(error);
      } else {
        toast.success("Budget allocated successfully!");
        setAmount("");
        onHide();
        if (onConfirm) onConfirm();
      }
    } catch (err) {
      toast.error("Failed to allocate budget");
    } finally {
      setLoading(false);
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
          margin: "auto",
          position: "absolute",
          top: "50%",
          width: '320px',
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="modal-content border border-black rounded-3">
          <div className="modal-body px-4 py-3 d-flex flex-column justify-content-between text-center">
            {/* Centered Title with Close Button */}
            <div className="position-relative mb-3 mt-3">
              <h5 className="mb-0 fw-bold">Allucate Budget</h5>
              <button
                type="button"
                className="btn p-0 border-0 bg-transparent position-absolute"
                onClick={onHide}
                aria-label="Close"
                style={{
                  top: 0,
                  right: 0,
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

            {/* Amount Input */}
            <div className=" my-4">
              <h6 className="text-start">Enter Amount</h6>
              <div className="d-flex justify-content-between align-items-center">
                <input
                  type="number"
                  className="form-control bgofTextFields rounded-3 text-center py-2 px-2"
                  style={{
                    color: "#E25C28",
                    minWidth: "100%",
                    border: "1px #E25C28 solid",
                    fontSize: "1.5rem",
                    fontWeight: "bold"
                  }}
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex justify-content-center gap-0">
              <CustomButton
                icon="bi-gear"
                label={loading ? "Allocating..." : "Submit"}
                className="w-100"
                onClick={handleAllocateBudget}
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllucateBudgetModal;
