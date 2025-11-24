import React, { useEffect, useState } from "react";
import crosImg from "../assets/images/crosImg.png";
import CustomButton from "./GlobalBtn";
import { useModal } from "./ModalContext";
import { apiHelper } from "../services";
import { toast } from "react-toastify";

function AllocateHourlyRateModal({ show, onHide, onConfirm, mechanic_id = null }) {
  const { setIsModalOpen } = useModal();
  const [hourlyRate, setHourlyRate] = useState("");
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

  const handleAllocateHourlyRate = async () => {
    if (!hourlyRate || isNaN(hourlyRate) || parseFloat(hourlyRate) <= 0) {
      toast.error("Please enter a valid hourly rate");
      return;
    }

    setLoading(true);
    try {
      const payload = { hourly_rate: parseFloat(hourlyRate) };
      if (mechanic_id) {
        payload.mechanic_id = mechanic_id;
      }
      const { error, response } = await apiHelper("POST", "/web/shop/mechanic/rate/allocate", {}, payload);

      if (error) {
        toast.error(error);
      } else {
        toast.success("Hourly rate allocated to mechanic successfully.");
        setHourlyRate("");
        onHide();
        if (onConfirm) onConfirm();
      }
    } catch (err) {
      toast.error("Failed to allocate hourly rate");
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
              <h5 className="mb-0 fw-bold">Allocate Hourly Rate</h5>
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

            {/* Hourly Rate Input */}
            <div className=" my-4">
              <h6 className="text-start">Enter Hourly Rate</h6>
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
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
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
                onClick={handleAllocateHourlyRate}
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllocateHourlyRateModal;