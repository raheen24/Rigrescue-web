import Ellipse from "../assets/images/Ellipse1.png";
import picturePdf from "../assets/images/picture_as_pdf.png";
import CustomTextField from "../components/CustomTextField";
import deleteIcon from "../assets/images/delete.png";
import editIcon from "../assets/images/editImg.png";
import { useNavigate, useOutletContext } from "react-router-dom";
import CustomButton from "../components/GlobalBtn";
import { useState } from "react";
import { useCreateDriverMutation } from "../services/apiQueries";
import { toast } from "react-toastify";

export default function DriverDetails() {
    const navigate = useNavigate();
    const isSideBarOpen = useOutletContext();
    const createDriverMutation = useCreateDriverMutation();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [driverEmail, setDriverEmail] = useState("");
    const [password, setPassword] = useState("");
    const [vehiclePlate, setVehiclePlate] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [licenseFile, setLicenseFile] = useState(null);
    const [licensePreview, setLicensePreview] = useState(null);

  const handleAddDriver = () => {
    if (!firstName || !lastName || !driverEmail || !password || !vehiclePlate) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", `${firstName} ${lastName}`.trim());
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("email", driverEmail);
    formData.append("password", password);
    formData.append("vehicle_plate", vehiclePlate);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    if (licenseFile) {
      formData.append("driving_license", licenseFile);
    }

    createDriverMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Driver created successfully.");
        navigate("/fleet/my-drivers");
      },
      onError: (error) => {
        toast.error(error.message || "Something went wrong.");
      },
    });
  };

  return (
    <div
      className={`content_section ${
        isSideBarOpen ? "" : "content_section_close"
      }  home_page`}
      style={{ minHeight: "100vh" }}
    >
      <div
        className="innerWrapper rounded-3 shadow-sm"
        style={{ backgroundColor: "#E9E9E9" }}
      >
        <div className="row justify-content-center">
          <div className="col-md-7 pe-md-4">
            <div
              className="shadow-lg detailBox bg-white rounded-4 mb-4"
              style={{ height: "100%" }}
            >
              <h5 className="text-center colorOrange py-3">
                Add New Driver
              </h5>
              <div className="text-center">
                <div
                  className="position-relative d-inline-flex align-items-center justify-content-center rounded-circle"
                >
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
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    <img
                      src={avatarPreview || Ellipse}
                      alt="Profile"
                      className="avatar rounded-circle"
                    />
                  </label>

                  {/* Edit Icon */}
                  <button
                    className="position-absolute d-flex align-items-center bg-transparent justify-content-center"
                    style={{
                      width: "30px",
                      height: "30px",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      zIndex: 2,
                    }}
                    onClick={() => document.getElementById('avatar-upload').click()}
                  >
                    <img src={editIcon} alt="Edit" width="24" height="16" />
                  </button>
                </div>
              </div>

              <h5 className="text-center text-muted fw-light">
                Upload Driver image
              </h5>

              <div className="mb-4">
                <div className="py-2 my-0 w-100">
                  <div className="row mx-0">
                    <div className="col-md-6">
                      <CustomTextField
                        label="First Name"
                        className="w-100"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                      />
                    </div>
                    <div className="col-md-6">
                      <CustomTextField
                        label="Last Name"
                        className="w-100"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                      />
                    </div>
                  </div>
                </div>

                <div className="py-2 my-0 w-100">
                  <div className="row mx-0">
                    <div className="col-md-6">
                      <CustomTextField
                        label="Drivers Email"
                        className="w-100"
                        value={driverEmail}
                        onChange={(e) => setDriverEmail(e.target.value)}
                        placeholder="Lorem ipsum dolor sit"
                      />
                    </div>
                    <div className="col-md-6">
                      <CustomTextField
                        label="Account Password"
                        className="w-100"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Lorem ipsum12345"
                      />
                    </div>
                  </div>
                </div>

                <div className="py-2 my-0 mx-2">
                  <CustomTextField
                    label="Vehicle Plate"
                    className="w-100"
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value)}
                    placeholder="Vehicle Plate"
                  />
                </div>
                <div className=" my-0 mx-2">
                  <div className="rounded-3 mb-4">
                    <h5 className=" pb-2 mb-3 ">Driver License</h5>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="position-relative w-100">
                        <button
                          className="btn btn-sm btn-light rounded-circle position-absolute"
                          style={{
                            top: "10px",
                            right: "10px",
                            boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            setLicenseFile(null);
                            setLicensePreview(null);
                          }}
                        >
                          <img
                            src={deleteIcon}
                            alt="Delete"
                            width="15"
                            height="15"
                          />
                        </button>

                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            setLicenseFile(file);
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => setLicensePreview(e.target.result);
                              reader.readAsDataURL(file);
                            }
                          }}
                          style={{ display: "none" }}
                          id="license-upload"
                        />
                        <div
                          className="border-dashed border-orange rounded-3 text-center py-4 position-relative"
                          style={{ color: "#E25C28", cursor: "pointer", backgroundImage: licensePreview ? `url(${licensePreview})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '200px' }}
                        >
                          <label htmlFor="license-upload" className="w-100 h-100 d-flex align-items-center justify-content-center" style={{ cursor: "pointer" , flexDirection:"column" }}>
                            {!licensePreview && (
                              <div className="d-flex ">
                                <img
                                  src={picturePdf}
                                  alt="Driver License"
                                  className="img-fluid"
                                  width="30"
                                  height="auto"
                                />
                                <p className="mt-2">Click to upload Driver License</p>
                              </div>
                            )}
                          </label>
                          {licensePreview && (
                            <button
                              className="btn btn-sm btn-light rounded-circle position-absolute"
                              style={{
                                top: "10px",
                                right: "10px",
                                boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                setLicenseFile(null);
                                setLicensePreview(null);
                              }}
                            >
                              <img
                                src={deleteIcon}
                                alt="Delete"
                                width="15"
                                height="15"
                              />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-grid gap-2 mx-2">
                <CustomButton
                  icon="bi-gear"
                  className="py-3"
                  label="Add Driver"
                  onClick={handleAddDriver}
                  disabled={createDriverMutation.isPending}
                  />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
