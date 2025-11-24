import React, { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import CustomButton from "./GlobalBtn";
import deleteIcon from "../assets/images/delete-icon.png";
import { useModal } from "./ModalContext";

const DeleteAccountModal = ({ open, onClose, onConfirm }) => {
  const { setIsModalOpen } = useModal();

  useEffect(() => {
    if (open) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
    return () => setIsModalOpen(false);
  }, [open, setIsModalOpen]);

  if (!open) return null;

  return (
    <div className="modal d-block bg-overlay-all" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 text-center">
          <div className="position-relative my-2 rounded-top-4">
            <img src={deleteIcon} alt="" className="successImg" />
            <h4 className="modal-title text-center text-black m-2">
              Delete Account
            </h4>
          </div>

          <div className="modal-body">
            <p className="fs-6 text-black mb-4 p-0">
              Are you sure you want to delete this account? This action cannot
              be undone.
            </p>
          </div>

          <div className="d-flex justify-content-between px-4 pb-4 gap-2">
            <CustomButton
              label="Cancel"
              className="w-100 cta2"
              onClick={onClose}
            />
            <CustomButton
              label="Delete"
              className="w-100 text-white"
              onClick={onConfirm}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
