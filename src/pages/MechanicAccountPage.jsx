import Ellipse from "../assets/images/Ellipse1.png";
import picturePdf from "../assets/images/picture_as_pdf.png";
import locationdot from "../assets/images/locationdot.png";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import CustomButton from "../components/GlobalBtn";
import ManageMechanicStatusModal from "../components/ManageMechanicStatusModal";
import { useState, useEffect } from "react";
import AllocateHourlyRateModal from "../components/AllocateHourlyRateModal";
import starIcon from "../assets/images/starIcon.png";
import { apiHelper } from "../services";

export default function MechanicAccountPage() {
  const [showModal, setShowModal] = useState(false);
  const [mechanicData, setMechanicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isSideBarOpen = useOutletContext();
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMechanicDetails = async () => {
      try {
        setLoading(true);
        const { error, response } = await apiHelper("GET", `/web/shop/mechanic/${id}`);
        if (error) {
          setError(error);
        } else {
          setMechanicData(response.data.data);
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

  const handleMapClick = () => {
    navigate("/shop-owner/track-mechanic", { state: { mechanicId: id } });
  };
  const [showModal2, setShowModal2] = useState(false);

  const handleNavigate = () => {
    navigate("/shop-owner/mechanic-messages", { state: { mechanicId: id, mechanicData: mechanicData } });
  };
  const handleShow2 = () => setShowModal2(true);
  const handleHide2 = () => setShowModal2(false);

  const handleConfirm = () => {
    // Refresh mechanic data after budget allocation
    const fetchUpdatedMechanicDetails = async () => {
      try {
        const { error, response } = await apiHelper("GET", `/web/shop/mechanic/${id}`);
        if (!error && response) {
          setMechanicData(response.data.data);
        }
      } catch (err) {
        console.error("Failed to refresh mechanic data:", err);
      }
    };

    fetchUpdatedMechanicDetails();
    setShowModal2(false);
  };

  if (loading) {
    return (
      <div className={`content_section ${isSideBarOpen ? "" : "content_section_close"} home_page`} style={{ minHeight: "100vh" }}>
        <div className="innerWrapper rounded-3 shadow-sm" style={{ backgroundColor: "#E9E9E9" }}>
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
        <div className="innerWrapper rounded-3 shadow-sm" style={{ backgroundColor: "#E9E9E9" }}>
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
        className="innerWrapper rounded-3 shadow-sm"
        // style={{ backgroundColor: "#E9E9E9" }}
      >
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-4 headingFlex">
          <h5 className="m-0 colorOrange">Mechanic Account</h5>
          <div className="d-flex">
            <button
              className="cta secondary-btn me-2"
              onClick={() => setShowModal(true)}
            >
              {mechanicData?.status === "active" ? "Deactivate Account" : "Activate Account"}
            </button>
            <CustomButton
              icon="bi-gear"
              label="Edit Details"
              className="py-1"
              onClick={() => navigate(`/shop-owner/edit-mechanics-account/${id}`)}
            />
          </div>
        </div>
        <ManageMechanicStatusModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onConfirm={() => {
            console.log("Account status changed");
            setShowModal(false);
            // Refresh mechanic data after status change
            const fetchUpdatedMechanicDetails = async () => {
              try {
                const { error, response } = await apiHelper("GET", `/web/shop/mechanic/${id}`);
                if (!error && response) {
                  setMechanicData(response.data.data);
                }
              } catch (err) {
                console.error("Failed to refresh mechanic data:", err);
              }
            };
            fetchUpdatedMechanicDetails();
          }}
          mechanic_id={id}
          currentStatus={mechanicData?.status}
        />

        {/* Main Content - Two Columns */}
        <div className="row">
          {/* Left Column - Profile Info */}
          <div className="col-md-6">
            <div
              className="shadow-lg p-4 rounded-4 mb-4 detailsBox"
              // style={{ height: "700px" }}
            >
              <div className="text-center my-4">
                <div className="rounded-circle d-inline-flex align-items-center justify-content-center">
                  <img src={mechanicData?.avatar || Ellipse} className="avatar" alt="" />
                </div>
                <h5 className="colorOrange">{mechanicData?.first_name} {mechanicData?.last_name}</h5>
                <div className="d-flex justify-content-center align-items-center">
                  <div
                    className="rounded shadow-lg bg-white w-fit p-2 d-flex justify-content-center align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/shop-owner/ratings-and-reviews/${id}`)}
                  >
                    <img
                      src={starIcon}
                      className="me-2"
                      alt="Star"
                      style={{ width: "20px", height: "20px" }}
                    />
                    <span className="fw-bold">{mechanicData?.rating_avg || "0.00"} ({mechanicData?.review_count || 0}+) Rating & Reviews</span>
                  </div>
                </div>
              </div>

              {/* Mechanic Info */}
              <div className="mb-4 ">
                <div className="d-flex justify-content-between border-bottom py-2 my-3">
                  <span className="text-muted">Email Address</span>
                  <span>{mechanicData?.email || "N/A"}</span>
                </div>
                <div className="d-flex justify-content-between border-bottom py-2 my-3">
                  <span className="text-muted">Phone Number</span>
                  <span>{mechanicData?.phone || "N/A"}</span>
                </div>
                <div className="d-flex justify-content-between border-bottom py-2 my-3">
                  <span className="text-muted">Account Password</span>
                  <span className="badge bg-secondary">123456</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-grid gap-2">
                <button
                  className="cta cta2"
                  onClick={handleNavigate}
                >
                  <i className="bi bi-envelope me-2"></i> Message
                </button>
                <button
                  className="btn cta shadow-md backgroundColorGb text-white fw-bold py-3"
                  onClick={handleShow2}
                >
                  <i className="bi bi-gear me-2"></i> Allocate Hourly Rates
                </button>
              </div>
            </div>
          </div>
          <AllocateHourlyRateModal
            show={showModal2}
            onHide={handleHide2}
            onConfirm={handleConfirm}
            mechanic_id={id}
          />

          {/* Right Column - Stats */}
          <div className="col-md-6">
            <div className="detailsBox p-4 rounded-4">
              {/* Hourly Rate Section */}
              <div className=" mb-4">
                <h5 className=" pb-2 mb-3">Hourly Rate</h5>
                <div className="d-flex justify-content-between align-items-center">
                  <div
                    className="bgofTextFields rounded-3 text-center py-2 px-2"
                    style={{
                      color: "#E25C28",
                      minWidth: "100%",
                      border: "1px #E25C28 solid",
                    }}
                  >
                    <span className="fs-3 fw-bold">${mechanicData?.hourly_rate || "0.00"}</span>
                  </div>
                </div>
              </div>

              {/* Certification Section */}
              <div className="rounded-3 mb-4">
                <h5 className=" pb-2 mb-3">Mechanic Certification</h5>
                <div className="d-flex justify-content-between align-items-center">
                  <div
                    className="bgofTextFields border-dashed border-orange rounded-3 text-center py-5"
                    style={{
                      color: "#E25C28",
                      minWidth: "100%",
                      height: "200px",
                    }}
                  >
                    {mechanicData?.certification ? (
                      <img src={mechanicData.certification} alt="Certification" style={{ maxWidth: "100%", height: "100%" }} />
                    ) : (
                      <img src={picturePdf} alt="" />
                    )}
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className=" rounded-3" onClick={handleMapClick}>
                <h5 className=" pb-2 mb-3">Mechanic Location</h5>
                {mechanicData?.latitude && mechanicData?.longitude ? (
                  <div
                    className="border rounded overflow-hidden position-relative"
                    style={{ height: "150px" }}
                  >
                    <iframe
                      src={`https://maps.google.com/maps?q=${mechanicData.latitude},${mechanicData.longitude}&output=embed`}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      allowFullScreen=""
                      aria-hidden="false"
                      tabIndex="0"
                      title="Map"
                      style={{ pointerEvents: 'none' }}
                    ></iframe>
                    <img
                      src={locationdot}
                      alt="Location Marker"
                      className="position-absolute"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '30px',
                        height: '30px',
                        pointerEvents: 'none'
                      }}
                    />
                  </div>
                ) : (
                  <div className="border rounded d-flex align-items-center justify-content-center" style={{ height: "150px", backgroundColor: "#f8f9fa" }}>
                    <p className="mb-0 text-muted">Location not available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
