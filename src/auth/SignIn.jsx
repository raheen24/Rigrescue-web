import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import roleImage from "/src/assets/images/logo.png";
import backgroundImage from "/src/assets/images/Background.jpg";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { apiHelper } from "../services/index";
import { setCookie } from "../utils";

import { setLogin } from "../redux/userslice";
const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine device token based on route
  const isShopRoute = location.pathname.includes('shop');
  const deviceToken = isShopRoute ? "94c8y20y9y0t93854y" : "c94t78n4gfyhh2f92";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleSignin = async () => {
    console.log("handleSignin called");
    if (!email.trim()) {
      toast.error("Please enter email");
      return;
    }

    if (!password.trim()) {
      toast.error("Please enter password");
      return;
    }

    setLoading(true);

    const requestBody = {
      email,
      password,
      deviceToken,
    };

    console.log("Request body:", requestBody);

    try {
      console.log("Calling apiHelper...");
      const { response, error } = await apiHelper(
        "POST",
        "/web/login",
        {},
        requestBody
      );

      console.log("API Response:", response.data);
      console.log("API Error:", error);

      if (response && response.data && response.data.success !== false) {
        const userData = {
          userId: response.data.data.user?.id,
          stripeId: response.data.data.user?.stripe_id,
          firstName: response.data.data.user?.first_name,
          lastName: response.data.data.user?.last_name,
          email: response.data.data.user?.email,
          phone: response.data.data.user?.phone,
          role: response.data.data.user?.role,
          avatar: response.data.data.user.avatar,
          website: response.data.data.user.website,
          bio: response.data.data.user.bio,
          deviceType: response.data.data.user.device_type,
          location: response.data.data.user.location,
          latitude: response.data.data.user.latitude,
          longitude: response.data.data.user.longitude,
          status: response.data.data.user.status,
          isProfileCompleted: response.data.data.user.is_profile_completed,
          isApproved: response.data.data.user.is_approved,
          isNotified: response.data.data.user.is_notified,
          deviceToken: response.data.data.user.device_token,
          emailVerifiedAt: response.data.data.user.email_verified_at,
          deletedAt: response.data.data.user.deleted_at,
          createdAt: response.data.data.user.created_at,
          updatedAt: response.data.data.user.updated_at,
        };

        setCookie("token", response.data.data.access_token);
        setCookie("role", response.data.data.user?.role);

        dispatch(
          setLogin({
            user: userData,
            token: response.data.data.access_token,
          })
        );

        toast.success(response.message);
        if (response.data.data.user.role === 'fleet_manager') {
          window.location.href = "/fleet/dashboard";
        } else if (response.data.data.user.role === 'shop_owner') {
          window.location.href = "/shop-owner/dashboard";
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        toast.error(response?.data?.message || error || "Login failed.");
      }
    } catch (err) {
      console.error("Catch Error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignin();
  };

  const handleCreateAccount = () => {
    navigate("/auth/create-account");
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
          className="card authCard"
          style={{ maxWidth: "552px", width: "100%", borderRadius: "20px" }}
        >
          <h5 className="text-center fw-bold mt-4">Sign-in to Account</h5>
          <h5 className="text-center text-gray-500 my-3 text-[18px] sm:text-[16px] md:text-[16px] lg:text-[18px]">
            Don’t have an account?{" "}
            <Link
              to={isShopRoute ? "/auth/create-account-shop" : "/auth/create-account"}
              className="text-[16px] sm:text-[16px] md:text-[16px] lg:text-[18px] font-semibold text-dark"
            >
              Sign up
            </Link>
          </h5>

          <form>
            <div className="mb-3 mx-3 mx-md-5">
              <label className="form-label fw-bold">Email Address</label>
              <div className="input-group">
                <span
                  className="input-group-text text-warning"
                  style={{
                    backgroundColor: "#F6F2EE",
                  }}
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
                  style={{
                    height: "50px",
                    borderLeft: "none",
                    backgroundColor: "#F6F2EE",
                  }}
                />
              </div>
            </div>

            <div className="d-flex justify-content-end mb-2 mx-3 mx-md-5">
              <Link
                to="/auth/forgot-password"
                className="text-orange-custom fw-bold"
              >
                Forget Password?
              </Link>
            </div>

            <div className="mb-3 mx-3 mx-md-5">
              <label className="form-label fw-bold">Password</label>
              <div className="input-group">
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                    const input = document.querySelector('input[type="password"]');
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


            <div className="form-check mb-4 mx-3 mx-md-5">
              <input
                className="form-check-input"
                type="checkbox"
                id="rememberMe"
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember Password
              </label>
            </div>
            <div className="mx-3 mx-md-5">
              <button
                onClick={handleSubmit}
                className="btn cta text-white py-3 w-100 fw-bold mb-4"
                style={{ backgroundColor: "#171F4D" }}
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>

          <p className="text-center fs-6 text-muted mt-4 mb-4 mb-0 small">
            By signing in, you agree to our <br />
            <Link
              to="/terms-and-conditions"
              className="fw-semibold fs-6 text-black"
            >
              Terms & Conditions
            </Link>{" "}
            &{" "}
            <Link to="/privacy-policy" className="fw-semibold fs-6 text-black">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
