import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomButton from "../components/GlobalBtn";
import Ellipse from "../assets/images/Ellipse1.png";
import picturePdf from "../assets/images/picture_as_pdf.png";
import CustomTextField from "../components/CustomTextField";
import upload from "../assets/images/upload.png";
import editIcon from "../assets/images/editImg.png";
import closeImg from "../assets/images/closeImg.png";
import { apiHelper } from "../services";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
const AddMechanic = ({ open = true }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { register, handleSubmit } = useForm();
  const [licenseImages, setLicenseImages] = useState([]);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    navigate("/account-details");
  };

  const onSubmit = async (data) => {
    const { driverName, driverEmail, password, vin } = data;
    if (!driverName || !driverEmail || !password || !vin) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    const [first_name, ...rest] = driverName.split(" ");
    const last_name = rest.join(" ");

    const formData = new FormData();
    formData.append("first_name", first_name);
    formData.append("last_name", last_name || "");
    formData.append("email", driverEmail);
    formData.append("password", password);
    formData.append("hourly_rate", vin);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    if (licenseImages.length > 0) {
      formData.append("certificate", licenseImages[0].file); // Take first certificate
    }

    const { error, response } = await apiHelper(
      "POST",
      "/web/shop/mechanic/create",
      {},
      formData
    );

    setLoading(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success("Mechanic created successfully.");
      navigate("/shop-owner/my-mechanics");
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
    }));
    setLicenseImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (id) => {
    setLicenseImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  if (!open) return null;

  return (
    <div
      className="addDriver_wrapper bg-overlay-all"
      tabIndex="-1"
      style={{ minHeight: "100vh" }}
    >
      <div className="row justify-content-center">
        <div className="col-md-12 col-lg-7 pe-md-4">
          <div
            className="my-2 shadow-lg p-4 bg-white rounded-4 sm:m-3"
            style={{
              // height: "calc(100% - 50px) !important",
              // margin: "40px 0",
              position: "relative",
            }}
          >
            <h2 className="heading text-center font-weight-bold">
              Add Mechanic
            </h2>
            <Link
              to="/shop-owner/dashboard"
              s
              className="text-center d-block mb-4"
              style={{
                color: "#f25127",
                textDecoration: "none",
                position: "absolute",
                top: "30px",
                right: "20px",
              }}
            >
              Skip for Now
            </Link>
            <div className="text-center mt-4">
              <div
                className="position-relative d-inline-flex align-items-center justify-content-center rounded-circle"
                style={{ width: "180px", height: "180px" }}
              >
                <img
                  src={avatarPreview || Ellipse}
                  alt="Profile"
                  className="rounded-circle avatar"
                  style={{ objectFit: "cover" }}
                />

                {/* Edit Icon */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setAvatarFile(file);
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => setAvatarPreview(e.target.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{ display: "none" }}
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className="position-absolute d-flex align-items-center bg-transparent justify-content-center"
                  style={{
                    width: "30px",
                    height: "30px",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 2,
                    cursor: "pointer",
                  }}
                >
                  <img src={editIcon} alt="Edit" width="24" height="16" />
                </label>
              </div>
            </div>

            <h5 className="text-center text-muted fw-light">
              Upload Mechanic image
            </h5>

            <div className="scrollSec mb-2 mx-2">
              <div className="my-0 mx-2">
                <CustomTextField
                  label="Mechanic Name"
                  className="w-100"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="Mechanic Name"
                />
              </div>

              <div className="my-0 w-100">
                <div className="row mx-0">
                  <div className="col-12">
                    <CustomTextField
                      label="Mechanic Email"
                      className="w-100"
                      value={driverEmail}
                      onChange={(e) => setDriverEmail(e.target.value)}
                      placeholder="Lorem ipsum dolor sit"
                    />
                  </div>
                  <div className="col-12">
                    <CustomTextField
                      label="Account Password"
                      className="w-100"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Lorem ipsum"
                    />
                  </div>
                </div>
              </div>
              <div className="my-0 w-100">
                <div className="row mx-0">
                  <div className="col-12">
                    <CustomTextField
                      label="Hourly Rate"
                      className="w-100"
                      value={vin}
                      onChange={(e) => setVin(e.target.value)}
                      placeholder="123456789"
                    />
                  </div>
                </div>
              </div>
              <div className="py-0 my-0 mx-0">
                <div className="bg-white p-2 rounded-3 mb-4">
                  <h5 className=" pb-2 mb-3">
                    Mechanic Certification (Optional)
                  </h5>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="position-relative w-100">
                      <div
                        className="border-dashed border-orange rounded-3 text-center py-4 px-3 bg-[#F1F4F9] cursor-pointer"
                        style={{ color: "#E25C28" }}
                        onClick={handleUploadClick}
                      >
                        <img
                          src={upload}
                          alt="Mechanic Certificate"
                          className="img-fluid"
                        />
                        <input
                          type="file"
                          ref={fileInputRef}
                          multiple
                          accept="image/*"
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                        />
                      </div>
                      {licenseImages.length > 0 && (
                        <div className="mt-3 d-flex flex-wrap gap-2">
                          {licenseImages.map((image) => (
                            <div
                              key={image.id}
                              className="license-image-container position-relative"
                            >
                              <img
                                src={image.url}
                                alt="License"
                                className="license-image"
                              />
                              <button
                                className="license-close-btn"
                                onClick={() => removeImage(image.id)}
                              >
                                <img
                                  src={closeImg}
                                  alt="Close"
                                  width="12"
                                  height="12"
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="btn_sec">
                <CustomButton
                  // icon="bi-gear"
                  className="cta2"
                  label="Add Another"
                  // onClick={() => navigate("/fleet/my-drivers")}
                />
                <CustomButton
                  // icon="bi-gear"
                  className="py-3"
                  label="Add"
                  onClick={handleAddDriver}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMechanic;
