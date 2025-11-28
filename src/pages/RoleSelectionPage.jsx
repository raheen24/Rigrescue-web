import React, { useEffect, useState } from "react";
import { fontFamily } from "../assets/fonts";
import roleImage from "/src/assets/images/logo.png";
import backgroundImage from "/src/assets/images/background.jpg";
import splashLogo from "/src/assets/images/rigrescue-logo.png";
import { useNavigate } from "react-router-dom";

const RoleSelector = () => {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

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
    navigate("/auth/sign-in-shop");
  };

  if (showSplash) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start", // Aligns content to the top
        }}
      >
        <img
          src={splashLogo}
          alt="Splash Logo"
          className="splashLogo"
          // style={{ width: "444px", height: "auto", marginTop: "3%" }}
        />
      </div>
    );
  }

  return (
    <div
      className="roleSelection"
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "2rem",
      }}
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
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "500px",
          width: "100%",
          borderRadius: "1.5rem",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.9)",
          textAlign: "center",
          backgroundColor: "#ffffff",
          margin: "20px",
          paddingBottom: "20px",
        }}
        className="h-[100%] sm:h-auto"
      >
        <div
          style={{
            backgroundColor: "#141D58",
            padding: "2rem",
            borderTopLeftRadius: "1.5rem",
            borderTopRightRadius: "1.5rem",
            borderBottomLeftRadius: "100% 170px",
            borderBottomRightRadius: "100% 170px",
            height: "65%",
          }}
          className="roleblueSec sm:px-4 sm:py-2 sm:rounded-lg"
        >
          <img
            src={roleImage}
            alt="Role Selection"
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        <div style={{ padding: "1.5rem" }}>
          <h3
            style={{
              color: "#000",
              // fontSize: "1.25rem",
              //   fontFamily: fontFamily.RalewayBold,
              marginTop: "0%",
              marginBottom: "0%",
            }}
            className="text-[18px] sm:text-[20px] font-semibold text-black m-0"
          >
            Select your Role
          </h3>
          <p
            style={{
              color: "#626262",
              margin: "0.5rem 0",
              fontSize: "0.95rem",
              // fontFamily: fontFamily.RalewaySemiBold,
            }}
          >
            Lorem ipsum dolor sit amet consectetur adipiscing elit eget, ad
            netus torquent
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <button
              onClick={handleFleetPress}
              className="cta"
              style={{
                padding: "0.75rem 1rem",
                backgroundColor: "#141D58",
                color: "#fff",
                // fontFamily: fontFamily.RalewayBold,
                border: "none",
                borderRadius: "0.5rem",
                width: "100%",
              }}
            >
              Fleet Manager
            </button>
            <button
              className="cta"
              onClick={handleShopPress}
              style={{
                padding: "0.75rem 1rem",
                backgroundColor: "#141D58",
                color: "#fff",
                border: "none",
                borderRadius: "0.5rem",
                width: "100%",
              }}
            >
              Shop Owner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
