import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import backgroundImage from "/src/assets/images/Background.jpg";
import { Link } from "react-router-dom";
import { apiHelper } from "../services/index";
import { toast } from "react-toastify";
import { store } from "../redux/store";
import { setLogout } from "../redux/userslice";
import { deleteCookie } from "../utils";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const resetEmail = localStorage.getItem("resetEmail");
    if (resetEmail) {
      setEmail(resetEmail);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email not found. Please try forgot password again.");
      return;
    }

    if (!newPassword.trim()) {
      toast.error("Please enter new password");
      return;
    }

    if (!confirmPassword.trim()) {
      toast.error("Please confirm new password");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setLoading(true);

    const requestBody = {
      email: email,
      new_password: newPassword,
      new_password_confirmation: confirmPassword,
    };

    try {
      const { response, error } = await apiHelper(
        "POST",
        "/web/reset-password",
        {},
        requestBody
      );

      if (response && response.data && response.data.success !== false) {
        toast.success(response.data.message || "Your password has been changed successfully.");
        navigate("/auth/sign-in-fleet");
      } else {
        const errorMessage = response?.data?.message || error || "Failed to reset password";
        if (errorMessage.includes("Unauthenticated")) {
          store.dispatch(setLogout());
          deleteCookie("token");
          toast.error("Session expired. Please login again.");
          navigate("/auth/sign-in-fleet");
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (err) {
      console.error("Change password error:", err);
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
        <div className="card authCard shadow p-3 p-md-4">
          <h5 className="text-center fw-bold mt-4">Reset Password</h5>
          <h5 className="text-center text-muted my-3 text-[18px] text-md-[20px]">
            Enter your email and new password
          </h5>

          <form onSubmit={handleSubmit}>
            <div className="mb-3 mx-3 mx-md-5">
              <label className="form-label fw-bold">New Password</label>
              <div className="input-group">
                <input
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{
                    height: "50px",
                    borderRight: "none",
                    backgroundColor: "#F6F2EE",
                  }}
                  placeholder="••••••"
                />
                <span
                  className="input-group-text text-warning"
                  style={{
                    backgroundColor: "#F6F2EE",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    const input = document.querySelectorAll('input[type="password"]')[0];
                    if (input) {
                      input.type = input.type === "password" ? "text" : "password";
                    }
                  }}
                >
                  <img
                    src="/src/assets/images/showpassword.png"
                    alt="icon"
                    style={{ width: "28px", height: "28px" }}
                  />
                </span>{" "}
              </div>
            </div>

            <div className="mb-3 mx-3 mx-md-5">
              <label className="form-label fw-bold">Confirm New Password</label>
              <div className="input-group">
                <input
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    height: "50px",
                    borderRight: "none",
                    backgroundColor: "#F6F2EE",
                  }}
                  placeholder="••••••"
                />
                <span
                  className="input-group-text text-warning"
                  style={{
                    backgroundColor: "#F6F2EE",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    const inputs = document.querySelectorAll('input[type="password"]');
                    const input = inputs[1];
                    if (input) {
                      input.type = input.type === "password" ? "text" : "password";
                    }
                  }}
                >
                  <img
                    src="/src/assets/images/showpassword.png"
                    alt="icon"
                    style={{ width: "28px", height: "28px" }}
                  />
                </span>{" "}
              </div>
            </div>

            <div className="mx-3 mx-md-5">
              <button
                type="submit"
                className="btn cta text-white py-3 w-100 mb-4"
                style={{ backgroundColor: "#171F4D" }}
                disabled={loading}
              >
                {loading ? "Resetting Password..." : "Reset Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
