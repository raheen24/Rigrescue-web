import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import roleImage from "/src/assets/images/logo.png";
import backgroundImage from "/src/assets/images/Background.jpg";
import { Link } from "react-router-dom";
import { apiHelper } from "../services";
import { toast } from "react-toastify";
import LoadingSpinner from "./LoadingSpinner";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { error, response } = await apiHelper("GET", "/content/privacy_policy");
        if (error) {
          toast.error("Failed to load privacy policy");
        } else {
          setContent(response.data.data);
        }
      } catch (error) {
        toast.error("Error loading privacy policy");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleFleetPress = () => {
    navigate("/auth/sign-in-fleet");
  };

  const handleShopPress = () => {
    navigate("/shop");
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
          className="card scrollSec shadow-lg rounded-5  p-4"
          style={{ Width: "552px", width: "100%", }}
        >
          <h5 className="text-center fw-bold mt-4">{content?.title || "Privacy Policy"}</h5>

          {loading ? (
            <LoadingSpinner />
          ) : content ? (
            <div style={{ whiteSpace: 'pre-line' }}>
              {content.description}
            </div>
          ) : (
            <p className="text-center">Failed to load privacy policy.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
