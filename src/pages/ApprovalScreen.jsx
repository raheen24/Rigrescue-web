
import React, { useState, useEffect } from "react";
import Success from "../assets/images/Success Illustration.png";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/GlobalBtn";
import approvalImage from "../assets/images/approve.png";
import { useSelector } from "react-redux";

const ApprovalScreen = ({ open = true }) => {
  const navigate = useNavigate();
  const role = useSelector((state) => state.user.role);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSuccess(true); 
    }, 5000);

    return () => clearTimeout(timer); 
  }, []);

  const approvalSteps = [
    {
      title: "Verified Phone Number",
      desc: "Lorem ipsum dolor sit amet consectetur adipi, elit nascetur dictum habitant convallis.",
    },
    {
      title: "Verified Email Address",
      desc: "Lorem ipsum dolor sit amet consectetur adipi, elit nascetur dictum habitant convallis.",
    },
    {
      title: "Verified Account Details",
      desc: "Lorem ipsum dolor sit amet consectetur adipi, elit nascetur dictum habitant convallis.",
    },
    {
      title: "Verified Restaurant Details",
      desc: "Lorem ipsum dolor sit amet consectetur adipi, elit nascetur dictum habitant convallis.",
    },
  ];

  const handleAddDriver = () => {
    const addPath = role === "shop_owner" ? "/shop-owner/add-mechanic" : "/add-driver";
    navigate(addPath);
  };

  if (!open) return null;

  return (
    <div className="approvalScreen bg-overlay-all" tabIndex="-1">
      {!showSuccess && (
        <div className="approvalWrapper">
          <img src={approvalImage} alt="Approval" className="approvalImage" />
          <h2 className="approvalTitle">For Getting Approval</h2>
          <p className="approvalPara">
            Please complete all verification steps below to activate your
            account.
          </p>

          <div className="approvalPoints">
            <div className="verticalLine" />
            {approvalSteps.map((item, i) => (
              <div key={i} className="point">
                <div className={`circle ${i >= 2 ? "orange" : "blue"}`}>
                  {i + 1}
                </div>
                <div className="text">
                  <p className="title">{item.title}</p>
                  <p className="desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="successBox">
          <img src={Success} alt="Success" className="mb-5" />
          <h2 className="approvalTitle">Congratulations</h2>
          <p className="approvalPara">
            All verification steps completed successfully. Your account is now
            active.
          </p>
          <CustomButton
            className="mt-3"
            label="Continue"
            onClick={handleAddDriver}
          />
        </div>
      )}
    </div>
  );
};

export default ApprovalScreen;
