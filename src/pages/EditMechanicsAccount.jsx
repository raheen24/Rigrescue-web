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

export default function EditMechanicsAccount() {
  const navigate = useNavigate();
  const isSideBarOpen = useOutletContext();
  const { id } = useParams();

  const [mechanicData, setMechanicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [certificate, setCertificate] = useState(null);

  useEffect(() => {
    const fetchMechanicDetails = async () => {
      try {
        setLoading(true);
        const { error, response } = await apiHelper("GET", `/web/shop/mechanic/${id}`);
        if (error) {
          setError(error);
        } else {
          const data = response.data.data;
          setMechanicData(data);
          setFirstName(data.first_name || "");
          setLastName(data.last_name || "");
          setHourlyRate(data.hourly_rate || "");
          // Password not fetched, leave empty
        }
      } catch (err) {
        setError("Failed to fetch mechanic details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMechanicDetails();
    }
  }, [id]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("mechanic_id", id);
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("password", password);
      formData.append("hourly_rate", hourlyRate);
      if (avatar) formData.append("avatar", avatar);
      if (certificate) formData.append("certificate", certificate);

      const { error, response } = await apiHelper("POST", "/web/shop/mechanic/update", {}, formData, true); // true for multipart

      if (error) {
        toast.error(error);
      } else {
        toast.success("The mechanic has been updated successfully.");
        navigate(`/shop-owner/mechanic-account/${id}`);
      }
    } catch (err) {
      toast.error("Failed to update mechanic");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={`content_section ${isSideBarOpen ? "" : "content_section_close"} home_page`} style={{ minHeight: "100vh" }}>
        <div className="innerWrapper bg-white rounded-3 shadow-sm">
          <div className="text-center py-5">
            <div className="spinner-border" role="status" style={{ color: '#f55227' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading mechanic details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`content_section ${isSideBarOpen ? "" : "content_section_close"} home_page`} style={{ minHeight: "100vh" }}>
        <div className="innerWrapper bg-white rounded-3 shadow-sm">
          <div className="text-center py-5">
            <div className="alert alert-danger">
              <h5>Error loading mechanic details</h5>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`content_section ${
        isSideBarOpen ? "" : "content_section_close"
      } home_page`}
      style={{ minHeight: "100vh" }}
    >
      <div
        className="innerWrapper bg-white rounded-3 shadow-sm"
        // style={{ backgroundColor: "#E9E9E9" }}
      >
        <div className="row justify-content-center">
          <div className="col-md-7 col-12">
            <div
              className="shadow-lg detailsBox bg-white rounded-4 mb-4"
              style={{ height: "100%" }}
            >
              <h5 className="text-center colorOrange py-3">
                Edit Mechanics Account
              </h5>
              <div className="text-center">
                <div
                  className="position-relative d-inline-flex align-items-center justify-content-center rounded-circle"
                  // style={{ width: "180px", height: "180px" }}
                >
                  <img
                    src={mechanicData?.avatar || Ellipse}
                    alt="Profile"
                    className="rounded-circle avatar"
                    style={{ objectFit: "cover" }}
                  />

                  {/* Edit Icon */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatar(e.target.files[0])}
                    className="position-absolute"
                    style={{
                      width: "30px",
                      height: "30px",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      zIndex: 2,
                      opacity: 0,
                      cursor: "pointer"
                    }}
                  />
                  <button
                    className="position-absolute d-flex align-items-center bg-transparent justify-content-center"
                    style={{
                      width: "30px",
                      height: "30px",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      zIndex: 1,
                    }}
                  >
                    <img src={editIcon} alt="Edit" width="24" height="16" />
                  </button>
                </div>
              </div>

              <h5 className="text-center text-muted fw-light">
                Change Mechanic image
              </h5>

              <div className="mb-4 ">
                <div className="py-0 my-0 mx-2">
                  <CustomTextField
                    label="First Name"
                    className="w-100"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                  />
                </div>
                <div className="py-0 my-0 mx-2">
                  <CustomTextField
                    label="Last Name"
                    className="w-100"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                  />
                </div>

                <div className="py-0 my-0 w-100">
                  <div className="row mx-0">
                    <div className="col-md-6">
                      <CustomTextField
                        label="Hourly Rate"
                        className="w-100"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        placeholder="$ 99.00"
                      />
                    </div>
                    <div className="col-md-6">
                      <CustomTextField
                        label="Account Password"
                        type="password"
                        className="w-100"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                      />
                    </div>
                  </div>
                </div>
                {/* <div className="py-0 my-0 mx-0"> */}
                <div className="bg-white p-2 rounded-3">
                  <h5 className=" pb-2 mb-3">Mechanic Certificate</h5>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="position-relative w-100">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setCertificate(e.target.files[0])}
                        className="position-absolute"
                        style={{
                          width: "30px",
                          height: "30px",
                          top: "10px",
                          right: "10px",
                          zIndex: 2,
                          opacity: 0,
                          cursor: "pointer"
                        }}
                      />
                      <button
                        className="btn btn-sm btn-light rounded-circle position-absolute"
                        style={{
                          top: "10px",
                          right: "10px",
                          boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                          zIndex: 1,
                        }}
                      >
                        <img
                          src={editIcon}
                          alt="Edit"
                          width="15"
                          height="15"
                        />
                      </button>

                      <div
                        className="border-dashed border-orange rounded-3 text-center py-4 px-3"
                        style={{ color: "#E25C28" }}
                      >
                        {mechanicData?.certification ? (
                          <img
                            src={mechanicData.certification}
                            alt="Certificate"
                            className="img-fluid"
                          />
                        ) : (
                          <img
                            src={picturePdf}
                            alt="Certificate"
                            className="img-fluid"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* </div> */}
              </div>

              <div className="d-grid gap-2 mx-2">
                <CustomButton
                  icon="bi-gear"
                  label={saving ? "Saving..." : "Save Changes"}
                  className="py-3"
                  onClick={handleSubmit}
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
