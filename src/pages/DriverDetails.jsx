import Ellipse from "../assets/images/Ellipse1.png";
import picturePdf from "../assets/images/picture_as_pdf.png";
import locationdot from "../assets/images/locationdot.png";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import CustomButton from "../components/GlobalBtn";
import InactiveAccountModal from "../components/InactiveAccountModal";
import { useState, useEffect } from "react";
import AllucateBudgetModal from "../components/AllucateBudgetModal";
import { apiHelper } from "../services";

export default function DriverDetails() {
  const [showModal, setShowModal] = useState(false);
  const [driverData, setDriverData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isSideBarOpen = useOutletContext();
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        setLoading(true);
        const { error, response } = await apiHelper("GET", `/web/fleet/driver/${id}`);
        if (error) {
          setError(error);
        } else {
          setDriverData(response.data.data);
        }
      } catch (err) {
        setError("Failed to fetch driver details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDriverDetails();
    }
  }, [id]);

  const handleMapClick = () => {
    navigate("/fleet/track-driver", { state: { driverId: id } });
  };
  const [showModal2, setShowModal2] = useState(false);

  const handleNavigate = () => {
    navigate("/fleet/driver-messages", { state: { driverId: id, driverData: driverData } });
  };
  const handleShow2 = () => setShowModal2(true);
  const handleHide2 = () => setShowModal2(false);

  const handleConfirm = () => {
    // Refresh driver data after budget allocation
    const fetchUpdatedDriverDetails = async () => {
      try {
        const { error, response } = await apiHelper("GET", `/web/fleet/driver/${id}`);
        if (!error && response) {
          setDriverData(response.data.data);
        }
      } catch (err) {
        console.error("Failed to refresh driver data:", err);
      }
    };

    fetchUpdatedDriverDetails();
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
            <p className="mt-3">Loading driver details...</p>
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
              <h5>Error loading driver details</h5>
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
      }  home_page`}
      style={{ minHeight: "100vh" }}
    >
      <div
        className="innerWrapper rounded-3 shadow-sm"
        style={{ backgroundColor: "#E9E9E9" }}
      >
        {/* Header Section */}
        <div className="d-flex headingFlex mb-4">
          <h5 className="m-0 colorOrange">Drivers Account</h5>
          <div className="d-flex gap-2 align-items-center">
            <button
              className=" cta secondary-btn"
              onClick={() => setShowModal(true)}
            >
              {driverData?.status === "active" ? "Deactivate Account" : "Activate Account"}
            </button>
            <CustomButton
              icon="bi-gear"
              label="Edit Details"
              className="py-1"
              onClick={() => navigate(`/fleet/edit-drivers-account/${id}`)}
            />
          </div>
        </div>
        <InactiveAccountModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onConfirm={() => {
            console.log("Account status changed");
            setShowModal(false);
            // Refresh driver data after status change
            const fetchUpdatedDriverDetails = async () => {
              try {
                const { error, response } = await apiHelper("GET", `/web/fleet/driver/${id}`);
                if (!error && response) {
                  setDriverData(response.data.data);
                }
              } catch (err) {
                console.error("Failed to refresh driver data:", err);
              }
            };
            fetchUpdatedDriverDetails();
          }}
          driver_id={id}
          currentStatus={driverData?.status}
        />

        {/* Main Content - Two Columns */}
        <div className="row">
          {/* Left Column - Profile Info */}
          <div className="col-md-6">
            <div
              className="detailsBox shadow-lg rounded-4 mb-4"
              style={{ backgroundColor: "#F3F4F8", height: "700px" }}
            >
              {/* Profile Picture */}
              <div className="text-center my-4">
                <div
                  className="avatarBox rounded-circle d-inline-flex align-items-center justify-content-center"
                >
                  <img src={driverData?.avatar || Ellipse} alt=""  className="avatar"/>
                </div>
                <h6 className="mt-3 mb-0 fw-bold text-capitalize">{driverData?.first_name} {driverData?.last_name}</h6>
              </div>

              {/* Driver Info */}
              <div className="mb-4">
               
                <div className="d-flex justify-content-between border-bottom py-2 my-3">
                  <span className="text-muted">Email Address</span>
                  <span className="para">{driverData?.email || "N/A"}</span>
                </div>
                <div className="d-flex justify-content-between border-bottom py-2 my-3">
                  <span className="text-muted">Phone Number</span>
                  <span>{driverData?.phone || "N/A"}</span>
                </div>
                <div className="d-flex justify-content-between border-bottom py-2 my-3">
                  <span className="text-muted">Vehicle Unit</span>
                  <span>{driverData?.vehicle_plate || "N/A"}</span>
                </div>
                {/* <div className="d-flex justify-content-between border-bottom py-2 my-3">
                  <span className="text-muted">Assign VIN</span>
                  <span>{driverData?.driving_license || "N/A"}</span>
                </div> */}
                <div className="d-flex justify-content-between my-3">
                  <span className="text-muted">Account Password</span>
                  <span className="badge bg-secondary">123456</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-grid gap-2">
                <button
                  className="btn cta shadow-md bg-white fw-bold py-3 text-dark"
                  onClick={handleNavigate}
                >
                  <i className="bi bi-envelope me-2"></i> Message
                </button>
                <button
                  className="btn cta shadow-md backgroundColorGb text-white fw-bold py-3"
                  onClick={handleShow2}
                >
                  <i className="bi bi-gear me-2"></i> Allocate Budget
                </button>
              </div>
            </div>
          </div>
          <AllucateBudgetModal
            show={showModal2}
            onHide={handleHide2}
            onConfirm={handleConfirm}
            driver_id={id}
          />

          {/* Right Column - Stats */}
          <div className="col-md-6">
            <div className=" detailsBox rounded-4" style={{ height: "700px" }}>
              {/* Budget Section */}
              <div className=" mb-4">
                <h5 className=" pb-2 mb-3">Driver Budget</h5>
                <div className="d-flex justify-content-between align-items-center">
                  <div
                    className="bgofTextFields rounded-3 text-center py-2 px-2"
                    style={{
                      color: "#E25C28",
                      minWidth: "100%",
                      border: "1px #E25C28 solid",
                    }}
                  >
                    <span className="fs-3 fw-bold">${driverData?.wallet_balance || "0.00"}</span>
                  </div>
                </div>
              </div>

              {/* License Section */}
              <div className=" rounded-3 mb-4">
                <h5 className=" pb-2 mb-3">Driver License</h5>
                <div className="d-flex justify-content-between align-items-center">
                  <div
                    className="bgofTextFields border-dashed border-orange rounded-3 text-center py-5"
                    style={{
                      color: "#E25C28",
                      minWidth: "100%",
                      height:"200px",
                    }}
                  >
                    {driverData?.driving_license ? (
                      <img src={driverData.driving_license} alt="Driving License" style={{ maxWidth: "100%", height: "100%" }} />
                    ) : (
                      <img src={picturePdf} alt="" />
                    )}
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className=" rounded-3" onClick={handleMapClick}>
                <h5 className=" pb-2 mb-3">Drive Location</h5>
                {driverData.latitude && driverData.longitude ? (
                  <div
                    className="border rounded overflow-hidden position-relative"
                    style={{ height: "150px" }}
                  >
                    <iframe
                      src={`https://maps.google.com/maps?q=${driverData.latitude},${driverData.longitude}&output=embed`}
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
