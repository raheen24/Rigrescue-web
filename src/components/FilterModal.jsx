import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import CustomTextField from "./CustomTextField";
import CustomButton from "./GlobalBtn";
import { useModal } from "./ModalContext";

const FilterModal = ({ open, onClose, modalBtnPress }) => {
  const { setIsModalOpen } = useModal();
  const [formData, setFormData] = useState({
    name: "",
    dateFrom: "",
    dateTo: "",
  });

  useEffect(() => {
    if (open) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
    return () => setIsModalOpen(false);
  }, [open, setIsModalOpen]);

  if (!open) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    modalBtnPress?.(formData);
    onClose();
  };

  return (
    <div className="modal d-block bg-overlay-all" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4">
          <div className="position-relative my-4 text-black rounded-top-4">
            <h3 className="modal-title text-center m-0">Filter Orders</h3>
            <button
              type="button"
              className="btn btn-sm btn-light p-2 align-items-top rounded-circle position-absolute top-0 end-0 m-2 mt-0 d-flex align-items-center justify-content-center"
              onClick={onClose}
              style={{ backgroundColor: "#000" }}
            >
              <IoClose size={19} className="text-white mt-0 pt-0" />
            </button>
          </div>

          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label fw-semibold">Mechanic</label>
              <CustomTextField
                type="text"
                name="name"
                placeholder="john smith"
                value={formData.Name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Select Date</label>
              <CustomTextField
                type="date"
                name="dateFrom"
                value={formData.dateFrom}
                onChange={handleChange}
                className="custom-date-black"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">End Date</label>
              <CustomTextField
                type="date"
                name="dateTo"
                value={formData.dateTo}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mx-4 mb-3">
            <CustomButton
              label={"Apply Filters"}
              className="w-100 py-3 fs-5"
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
