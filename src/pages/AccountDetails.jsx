import React, { useState } from "react";
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
import CustomTextField from "../components/CustomTextField";
import CustomButton from "../components/GlobalBtn";
import backgroundImage from "/src/assets/images/Background.jpg";
import { useNavigate } from "react-router-dom";
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { apiHelper } from "../services";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const AccountDetails = ({ open = true, onClose, modalBtnPress }) => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const token = useSelector(state => state.user.token);
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
        toast.error("Failed to create payment method");
        return;
      }
      const { error: apiError, response } = await apiHelper("POST", "/web/fleet/card/add", {}, { payment_method_id: paymentMethod.id });
      if (apiError) {
        toast.error(apiError);
      } else {
        toast.success(response.data.message);
        modalBtnPress?.({ payment_method_id: paymentMethod.id, type: 'card' });
      }
    } else {
      modalBtnPress?.(formData);
    }
    onClose?.() || navigate("/approval-screen");
  };

  return (
    <div
      className="modal d-block bg-overlay-all"
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4">
          <div className="position-relative my-4 text-black rounded-top-4">
            <h3 className="modal-title text-center m-0">Account Details</h3>
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
            <div className="d-flex mb-4 flex-wrap payCards">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`selectCard position-relative d-flex align-items-center justify-content-center ${
                    selected === method.id
                      ? "border-orange border-2"
                      : "border-orange"
                  } bgofTextFields rounded p-4`}
                //   style={{ width: "70px", height: "70px", cursor: "pointer" }}
                  onClick={() => setSelected(method.id)}
                >
                  <div
                    className="card_icon "
                  >
                    {method.icon}
                  </div>
                  {selected === method.id && (
                    <span
                      className="position-absolute top-[10px] end-[-6px] translate-middle badge  bg-[#EFF0F3] text-black border "
                      style={{
                        fontSize: "10px",
                        width: "16px",
                        height: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
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
          <div className="mx-2 mb-3">
            <CustomButton
              label={"Create Account"}
              className="cta"
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;