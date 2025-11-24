import Ellipse from "../assets/images/Ellipse1.png";
import picturePdf from "../assets/images/picture_as_pdf.png";
import CustomTextField from "../components/CustomTextField";
import deleteIcon from "../assets/images/delete.png";
import editIcon from "../assets/images/editImg.png";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import CustomButton from "../components/GlobalBtn";
import { useState, useEffect } from "react";
import { apiHelper } from "../services";
import { toast } from "react-toastify";
export default function EditDriversAccount() {
  const navigate = useNavigate();
  const isSideBarOpen = useOutletContext();
  const { id } = useParams();

  const [driverData, setDriverData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    vehicle_plate: "",
    driving_license: "",
    password: "",
    avatar: null
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        setLoading(true);
        const { error, response } = await apiHelper("GET", `/web/fleet/driver/${id}`);
        if (error) {
          toast.error(error);
        } else {
          const data = response.data.data;
          setDriverData(data);
          setFormData({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            email: data.email || "",
            phone: data.phone || "",
            vehicle_plate: data.vehicle_plate || "",
            driving_license: data.driving_license || "",
            password: "",
            avatar: data.avatar || ""
          });
        }
      } catch (err) {
        toast.error("Failed to fetch driver details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDriverDetails();
    }
  }, [id]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        avatar: previewUrl
      }));
    }
  };

  const handleLicenseChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLicenseFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        driving_license: previewUrl
      }));
    }
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('driver_id', id);
      formDataToSend.append('first_name', formData.first_name);
      formDataToSend.append('last_name', formData.last_name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('vehicle_plate', formData.vehicle_plate);

      if (formData.password) {
        formDataToSend.append('password', formData.password);
      }

      if (avatarFile) {
        formDataToSend.append('avatar', avatarFile);
      }

      if (licenseFile) {
        formDataToSend.append('driving_license', licenseFile);
      }

      const { error, response } = await apiHelper("POST", "/web/fleet/driver/update", {}, formDataToSend);

      if (error) {
        toast.error(error);
      } else {
        toast.success("Driver updated successfully!");
        navigate(`/fleet/my-drivers-detail/${id}`);
      }
    } catch (err) {
      toast.error("Failed to update driver");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={`content_section ${isSideBarOpen ? "" : "content_section_close"} home_page`} style={{ minHeight: "100vh" }}>
        <div className="innerWrapper rounded-3 shadow-sm" style={{ backgroundColor: "#E9E9E9" }}>
          <div className="text-center py-5">
            <div className="spinner-border" role="status" style={{ color: '#f55227' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading driver details...</p>
          </div>
        </div>
      </div>
    );
  }

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
                Edit Driver Account
              </h5>
              <div className="text-center">
                <div
                  className="position-relative d-inline-flex align-items-center justify-content-center rounded-circle"
                  // style={{ width: "180px", height: "180px" }}
                >
                  <img
                    src={formData.avatar || Ellipse}
                    alt="Profile"
                    className="avatar rounded-circle"
                    style={{ objectFit: "cover" }}
                  />

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
                    onClick={() => document.getElementById('avatar-input').click()}
                  >
                    <img src={editIcon} alt="Edit" width="24" height="16" />
                  </button>
                </div>
                <input
                  id="avatar-input"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                />
              </div>

              <h5 className="text-center text-muted fw-light">
                Change Driver image
              </h5>

              <div className="mb-4">
                <div className="py-2 my-0 mx-2">
                  <CustomTextField
                    label="First Name"
                    className="w-100"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange("first_name", e.target.value)}
                    placeholder="First Name"
                  />
                </div>
                <div className="py-2 my-0 mx-2">
                  <CustomTextField
                    label="Last Name"
                    className="w-100"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange("last_name", e.target.value)}
                    placeholder="Last Name"
                  />
                </div>

                <div className="py-2 my-0 w-100">
                  <div className="row mx-0">
                    <div className="col-md-6">
                      <CustomTextField
                        label="Drivers Email"
                        className="w-100"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div className="col-md-6">
                      <CustomTextField
                        label="Phone Number"
                        className="w-100"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+1234567890"
                      />
                    </div>
                  </div>
                </div>
                <div className="py-2 my-0 w-100">
                  <div className="row mx-0">
                    <div className="col-md-6">
                      <CustomTextField
                        label="Vehicle Unit"
                        className="w-100"
                        value={formData.vehicle_plate}
                        onChange={(e) => handleInputChange("vehicle_plate", e.target.value)}
                        placeholder="ABC123"
                      />
                    </div>
                    <div className="col-md-6">
                      <CustomTextField
                        label="Account Password"
                        className="w-100"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        placeholder="Leave empty to keep current password"
                      />
                    </div>
                  </div>
                </div>
                <div className="py-0 my-0 mx-0">
                  <div className="bg-white p-4 detailBox rounded-3 mb-4">
                    <h5 className=" pb-2 mb-3">Driver License</h5>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="position-relative w-100">
                        <button
                          className="btn btn-sm btn-light rounded-circle position-absolute"
                          style={{
                            top: "10px",
                            right: "10px",
                            boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                          }}
                        >
                          <img
                            src={deleteIcon}
                            alt="Delete"
                            width="15"
                            height="15"
                          />
                        </button>

                        <div
                          className="border-dashed border-orange rounded-3 text-center py-4 px-3 position-relative"
                          style={{ color: "#E25C28", cursor: "pointer" }}
                          onClick={() => document.getElementById('license-input').click()}
                        >
                          {formData.driving_license ? (
                            <img
                              src={formData.driving_license}
                              alt="Driver License"
                              className="img-fluid"
                              style={{ maxHeight: "100px" }}
                            />
                          ) : (
                            <img
                              src={picturePdf}
                              alt="Driver License"
                              className="img-fluid"
                            />
                          )}
                          <button
                            className="btn btn-sm btn-light rounded-circle position-absolute"
                            style={{
                              top: "10px",
                              right: "10px",
                              boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              document.getElementById('license-input').click();
                            }}
                          >
                            <img
                              src={editIcon}
                              alt="Edit"
                              width="15"
                              height="15"
                            />
                          </button>
                        </div>
                        <input
                          id="license-input"
                          type="file"
                          accept="image/*"
                          onChange={handleLicenseChange}
                          style={{ display: 'none' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-grid gap-2 mx-2">
                <CustomButton
                  icon="bi-gear"
                  label={saving ? "Saving..." : "Save Changes"}
                  className="cta"
                  onClick={handleSaveChanges}
                  disabled={saving}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
