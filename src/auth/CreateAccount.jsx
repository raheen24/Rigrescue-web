import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import backgroundImage from "/src/assets/images/Background.jpg";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useSignupMutation } from "../services/apiQueries";
import { setCookie } from "../utils";
import { setLogin } from "../redux/userslice";
import { useForm } from "react-hook-form";

const CreateAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const isShopRoute = location.pathname.includes("shop");
  const role = isShopRoute ? "shop_owner" : "fleet_manager";
  const fcmToken = useSelector((state) => state.user.fcmToken);
  const signupMutation = useSignupMutation();

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = (data) => {
    const { email, password, confirmPassword } = data;
    if (!email.trim()) {
      toast.error("Please enter email");
      return;
    }
    if (!password.trim()) {
      toast.error("Please enter password");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!termsAccepted) {
      toast.error("Please accept terms and conditions");
      return;
    }

    const requestBody = {
      email,
      password,
      password_confirmation: confirmPassword,
      role,
      device_token: fcmToken || "default-device-token",
      terms_accepted: termsAccepted,
    };

    signupMutation.mutate(requestBody, {
      onSuccess: (data) => {
        if (data && data.success !== false) {
          const userData = {
            userId: data.data.user?.id,
            email: data.data.user?.email,
            role: data.data.user?.role,
            deviceType: data.data.user?.device_type,
            deviceToken: data.data.user?.device_token,
          };

          setCookie("token", data.data.access_token);
          setCookie("role", data.data.user?.role);

          dispatch(
            setLogin({
              user: userData,
              token: data.data.access_token,
            })
          );

          toast.success(data.message);
          navigate("/profile-setup");
        } else {
          toast.error(data?.message || "Registration failed.");
        }
      },
      onError: (error) => {
        toast.error(error.message || "Something went wrong. Please try again.");
      },
    });
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
          className="card shadow p-3 p-md-4"
          style={{ maxWidth: "552px", width: "100%", borderRadius: "20px" }}
        >
          <h5 className="text-center fw-bold mt-4">Create an Account</h5>
          <h5 className="text-center text-gray-500 my-3 text-[18px] sm:text-[16px] md:text-[16px] lg:text-[18px]">
            Already have an account?{" "}
            <Link
              to="/auth/sign-in-fleet"
              className="text-[16px] sm:text-[16px] md:text-[16px] lg:text-[18px] font-semibold text-dark"
            >
              Sign in
            </Link>
          </h5>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
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
                  {...register("email")}
                  style={{
                    height: "50px",
                    borderLeft: "none",
                    backgroundColor: "#F6F2EE",
                  }}
                />
              </div>
            </div>

            {/* <div className="d-flex justify-content-end mb-2 mx-5">
              <Link
                to="/auth/forgot-password"
                className="text-orange-custom fw-bold"
              >
                Forget Password?
              </Link>
            </div> */}

            <div className="mb-3">
              <label className="form-label fw-bold">Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  {...register("password")}
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
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img
                    src="/src/assets/images/showpassword.png"
                    alt="icon"
                    style={{ width: "28px", height: "28px" }}
                  />
                </span>{" "}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">
                Confirmation Password
              </label>
              <div className="input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control"
                  {...register("confirmPassword")}
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <img
                    src="/src/assets/images/showpassword.png"
                    alt="icon"
                    style={{ width: "28px", height: "28px" }}
                  />
                </span>{" "}
              </div>
            </div>
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="termsAccepted"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="termsAccepted">
                I Accept Terms and Conditions
              </label>
            </div>
            <div>
              <button
                type="submit"
                className="cta"
                style={{ backgroundColor: "#171F4D" }}
                disabled={signupMutation.isPending}
              >
                {signupMutation.isPending ? "Signing Up..." : "Sign Up"}
              </button>
            </div>
          </form>

          <p className="text-center fs-6 text-muted mb-4 mb-0 small">
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

export default CreateAccount;
