import React from "react";

const CustomButton = ({ icon, label, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`cta ${className}`}
      style={{
        fontSize: "1rem",
        letterSpacing: "0.5px",
        transition: "all 0.3s ease",
      }}
    >
      {icon && <i className={`bi ${icon} me-2`}></i>}
      {label}
    </button>
  );
};

export default CustomButton;
