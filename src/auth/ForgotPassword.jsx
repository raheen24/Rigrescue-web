import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import roleImage from "/src/assets/images/logo.png";
import backgroundImage from "/src/assets/images/Background.jpg";
import { Link } from "react-router-dom";
import { apiHelper } from "../services/index";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleFleetPress = () => {
    navigate("/auth/sign-in-fleet");
  };

  const handleShopPress = () => {
    navigate("/shop");
  };

  const handleSubmit = async () => {
    if (!email.trim()) {
      toast.error("Please enter email address");
      return;
    }

    setLoading(true);

    const requestBody = {
      email: email.trim(),
    };

    try {
      const { response, error } = await apiHelper(
        "POST",
        "/web/forgot-password",
        { Authorization: undefined }, // Remove auth header for public endpoint
        requestBody
      );

      if (response && response.data && response.data.success !== false) {
        localStorage.setItem("resetEmail", email.trim());
        toast.success(response.data.message || "OTP has been sent to your email address.");
        navigate("/auth/verification-page");
      } else {
        toast.error(response?.data?.message || error || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
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
          <h5 className="text-center fw-bold mt-4">Forgot Password?</h5>
          <h5 className="text-center text-muted my-3 text-[18px] text-md-[20px]">
            Enter Email Address To Get OTP
          </h5>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {" "}
            <div className="mb-3 mx-3 mx-md-5">
              <label className="form-label fw-bold">Email Address</label>
              <div className="input-group">
                <span
                  className="input-group-text text-warning"
                  style={{
                    backgroundColor: '#F6F2EE'                  }}
                >
                  <img
                    src="/src/assets/images/mail.png"
                    alt="icon"
                    style={{ width: "22px", height: "17px" }}
                  />
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="abc@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ height: "50px", borderLeft: "none", backgroundColor: '#F6F2EE' }}
                />
              </div>
            </div>
            <div className="mx-3 mx-md-5">
              <button
                type="submit"
                className="btn cta text-white py-3 w-100 mb-4"
                style={{ backgroundColor: "#171F4D" }}
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Continue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
