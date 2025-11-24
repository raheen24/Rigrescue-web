import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import {
  FaPaypal,
  FaGoogle,
  FaApplePay,
  FaCcVisa,
  FaCcMastercard,
} from "react-icons/fa";
import applePayIcon from "../assets/images/applyPayIcon.png";
import frameIcon from "../assets/images/Frame.png";
import GoogleIcon from "../assets/images/googleIcon.png";
import paypalIcon from "../assets/images/paypalIcon.png";
import CustomTextField from "./CustomTextField";
import CustomButton from "./GlobalBtn";
import backgroundImage from "/src/assets/images/Background.jpg";
import { useNavigate } from "react-router-dom";
import { useModal } from "./ModalContext";
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const AddAccountModal = ({ open = true, onClose, modalBtnPress }) => {
  const navigate = useNavigate();
  const { setIsModalOpen } = useModal();
  const stripe = useStripe();
  const elements = useElements();
  const paymentMethods = [
    { id: 1, icon: <img src={paypalIcon} alt="" /> },
    { id: 2, icon: <img src={GoogleIcon} alt="" /> },
    { id: 3, icon: <img src={applePayIcon} alt="" /> },
    { id: 4, icon: <img src={frameIcon} alt="" /> },
  ];

  const [selected, setSelected] = useState(4);
  const [formData, setFormData] = useState({
    holderName: "",
    accountNumber: "",
    routingNumber: "",
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

  const handleSubmit = async () => {
    if (selected === 4) { // Card
      if (!stripe || !elements) {
        return;
      }
      const cardElement = elements.getElement(CardElement);
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });
      if (error) {
        console.error(error);
        return;
      }
      modalBtnPress?.({ payment_method_id: paymentMethod.id, type: 'card' });
    } else {
      modalBtnPress?.(formData);
    }
    onClose?.() || navigate(-1);
  };

  return (
    <div
      className="modal d-block bg-overlay-all"
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4">
          <div className="position-relative my-4 text-black rounded-top-4">
            <h3 className="modal-title text-center m-0">Add New Account</h3>
            <button
              type="button"
              className="btn btn-sm btn-light p-2 align-items-top rounded-circle position-absolute top-0 end-0 m-2 mt-0 d-flex align-items-center justify-content-center"
              onClick={() => onClose?.() || navigate(-1)}
              style={{ backgroundColor: "#000" }}
            >
              <IoClose size={19} className="text-white mt-0 pt-0" />
            </button>
          </div>

          <div className="modal-body">
            <div className="d-flex justify-content-center gap-5 mb-4 flex-wrap">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`position-relative d-flex align-items-center justify-content-center ${
                    selected === method.id
                      ? "border-orange border-2"
                      : "border-orange"
                  } bg-white rounded p-4`}
                  style={{ width: "64px", height: "64px", cursor: "pointer" }}
                  onClick={() => setSelected(method.id)}
                >
                  <div
                    className="backgroundColorGb p-2 text-white rounded d-flex align-items-center justify-content-center"
                    style={{ width: "32px", height: "32px" }}
                  >
                    {method.icon}
                  </div>
                  {selected === method.id && (
                    <span
                      className="position-absolute top-0 end-0 translate-middle badge rounded-pill bg-white text-black border "
                      style={{
                        fontSize: "0.6rem",
                        width: "18px",
                        height: "18px",
                      }}
                    >
                      ✓
                    </span>
                  )}
                </div>
              ))}
            </div>

            {selected === 4 ? (
              <div className="mb-3">
                <label className="form-label">Card Details</label>
                <div className="border p-3 rounded">
                  <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
                </div>
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <CustomTextField
                    type="text"
                    name="holderName"
                    value={formData.holderName}
                    onChange={handleChange}
                    placeholder={"Account Holder Name"}
                  />
                </div>
                <div className="mb-3">
                  <CustomTextField
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    placeholder="Account Number"
                  />
                </div>
                <div className="mb-3">
                  <CustomTextField
                    type="text"
                    name="routingNumber"
                    value={formData.routingNumber}
                    onChange={handleChange}
                    placeholder="Routing Number"
                  />
                </div>
              </>
            )}
          </div>
          <div className="mx-4 mb-3">
            <CustomButton
              label={"Add Account"}
              className="w-100 py-3 fs-5"
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAccountModal;
