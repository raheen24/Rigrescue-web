import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import roleImage from "/src/assets/images/logo.png";
import backgroundImage from "/src/assets/images/Background.jpg";
import { Link } from "react-router-dom";
import { apiHelper } from "../services/index";
import { toast } from "react-toastify";

const OTPVerificationPage = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [email, setEmail] = useState("");
  const inputs = useRef([]);

  useEffect(() => {
    const resetEmail = localStorage.getItem("resetEmail");
    if (resetEmail) {
      setEmail(resetEmail);
    }
  }, []);

  const handleChange = (element, index) => {
    const val = element.value.replace(/\D/g, "");
    if (!val) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (index < 5 && inputs.current[index + 1]) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputs.current[index - 1].focus();
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      toast.error("Email not found. Please try forgot password again.");
      return;
    }

    setResendLoading(true);

    const requestBody = {
      email: email,
    };

    try {
      const { response, error } = await apiHelper(
        "POST",
        "/web/otp/resend",
        {},
        requestBody
      );

      if (response && response.data && response.data.success !== false) {
        toast.success(response.data.message || "A new OTP has been sent to your email address.");
      } else {
        toast.error(response?.data?.message || error || "Failed to resend OTP");
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");

    if (fullOtp.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    setLoading(true);

    const requestBody = {
      email: email, 
      otp_code: fullOtp,
    };

    try {
      const { response, error } = await apiHelper(
        "POST",
        "/web/otp/verify",
        { Authorization: undefined }, // Remove auth header for public endpoint
        requestBody
      );

      if (response && response.data && response.data.success !== false) {
        toast.success(response.data.message || "Your OTP has been verified successfully.");
        navigate('/auth/change-password');
      } else {
        toast.error(response?.data?.message || error || "OTP verification failed");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="d-flex justify-content-center align-items-center"
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(255, 255, 255, 0.50)",
          zIndex: 1,
        }}
      />

      <div
        className="container d-flex justify-content-center align-items-center min-vh-100"
        style={{ zIndex: 2 }}
      >
        <div
          className="card authCard shadow p-3 p-md-4"
        >
          <h5 className="text-center fw-bold mt-4">OTP Verification</h5>
          <h5 className="text-center text-muted mt-2">
            Didn't receive the verification code ?
          </h5>
          <button
            className="decoration-none text-black my-2 bg-transparent border-0"
            onClick={handleResendOTP}
            disabled={resendLoading}
          >
            <h6 className="text-center fw-bold">
              {resendLoading ? "Sending..." : "Resend"}
            </h6>
          </button>
          <form onSubmit={handleSubmit}>
            <div className="d-flex justify-content-center gap-2 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="form-control text-center"
                  style={{
                    width: "50px",
                    height: "50px",
                    fontSize: "20px",
                    borderRadius: "4px",
                    backgroundColor: "#F6F2EE",
                    border: "1px solid #ccc",
                  }}
                  value={digit}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputs.current[index] = el)}
                />
              ))}
            </div>

            <div className="mx-3 mx-md-5">
              <button
                type="submit"
                className="btn cta text-white py-3 w-100 mb-3"
                style={{ backgroundColor: "#171F4D" }}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Continue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;

