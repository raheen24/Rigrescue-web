import Ellipse from "../assets/images/Ellipse1.png";
import productpic from "../assets/images/productimg.png";
import locationdot from "../assets/images/locationdot.png";
import { useNavigate, useOutletContext, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import chatIcon from "../assets/images/chaticon.png";
import { useServiceBookingDetailsQuery } from "../services/apiQueries";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

export default function JobDetails() {
    const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const jobId = location.state?.jobId;

  const { data: jobDetails, isLoading, error } = useServiceBookingDetailsQuery(jobId);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  const handleMapClick = () => {
    navigate("/fleet/track-driver", { state: { driverId: jobDetails.driver.id } });
  };
  const [showModal2, setShowModal2] = useState(false);

  const handleNavigate = () => {
    navigate("/fleet/driver-messages", { state: { driverId: jobDetails.driver.id, driverData: jobDetails.driver } });
  };
  const handleShow2 = () => setShowModal2(true);
  const handleHide2 = () => setShowModal2(false);
  const isSideBarOpen = useOutletContext();
  const handleConfirm = () => {
    console.log("Allucated budget");
    setShowModal2(false);
  };

  if (isLoading) {
    return (
      <div
        className={`content_section ${
          isSideBarOpen ? "" : "content_section_close"
        } home_page`}
        style={{ minHeight: "100vh" }}
      >
        <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!jobDetails) {
    return (
      <div
        className={`content_section ${
          isSideBarOpen ? "" : "content_section_close"
        } home_page`}
        style={{ minHeight: "100vh" }}
      >
        <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
          No job details found.
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
        style={{ backgroundColor: "#E9E9E9" }}
      >
        <h5 className="mb-4 colorOrange">Job Details</h5>

        <div className="row">
          {/* Left Column */}
          <div className="col-md-6 mb-4">
            <div
              className="detailsBox rounded-4 shadow-sm"
              style={{ height: "600px" }}
            >
              <div className="d-flex justify-content-between">
                <div className="d-flex align-items-center">
                  <img
                    src={jobDetails.driver.avatar || Ellipse}
                    alt="Profile"
                    className="rounded-circle me-2"
                    style={{ width: "60px", height: "60px" }}
                  />
                  <div>
                    <h6 className="m-0 text-orange-custom">{jobDetails.driver.first_name} {jobDetails.driver.last_name}</h6>
                    <p className="mb-0 small">{jobDetails.driver.email}</p>
                    <p className="mb-0 fw-bold small">{jobDetails.driver.phone}</p>
                  </div>
                </div>
                <span >
                  <button className="chatIcon" onClick={handleNavigate}>
                    <img src={chatIcon} alt="Chat Icon" />
                  </button>
                </span>
              </div>

              <div className="my-3">
                <h6>Issue</h6>
                <p className="small text-muted">
                  {jobDetails.description}
                </p>
              </div>

              <div className="issuesBox d-flex gap-3 mb-3 overflow-auto">
                {jobDetails.issue_images.map((img, i) => (
                  <img
                    key={i}
                    src={img.image}
                    className="rounded-3 border border-color-[#f55227] flex-shrink-0"
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    alt="Issue"
                  />
                ))}
              </div>
              <div onClick={handleMapClick}>
                <h6>Drive Location</h6>
                {jobDetails.latitude && jobDetails.longitude ? (
                  <div className="rounded overflow-hidden border-[#f55227] position-relative">
                    <iframe
                      src={`https://maps.google.com/maps?q=${jobDetails.latitude},${jobDetails.longitude}&output=embed`}
                      width="100%"
                      height="180"
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
                  <div className="rounded border-[#f55227] d-flex align-items-center justify-content-center" style={{ height: "180px", backgroundColor: "#f8f9fa" }}>
                    <p className="mb-0 text-muted">Location not available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-md-6">
            <div
              className="detailsBox rounded-4 shadow-sm"
              style={{ backgroundColor: "#F3F4F8", height: "600px" }}
            >
              <h4 className="mb-3 fw-semibold">Mechanic Details:</h4>
              <div className="d-flex justify-content-between small mb-2">
                <span>Mechanic:</span> <strong>{jobDetails.mechanic.first_name} {jobDetails.mechanic.last_name}</strong>
              </div>
              <div className="d-flex justify-content-between small mb-2">
                <span>Hourly Charges:</span> <strong>$ {jobDetails.mechanic.hourly_rate} Per hour</strong>
              </div>
              <div className="d-flex justify-content-between small mb-4">
                <span>Date & Time:</span>{" "}
                <strong>{new Date(jobDetails.created_at).toLocaleString()}</strong>
              </div>

              <h5 className="mb-3">Products:</h5>
              {jobDetails.products.map((product, i) => (
                <div
                  key={i}
                  className="mechanicBox d-flex bg-light p-2 rounded-3 mb-3 align-items-center shadow-sm"
                >
                  <img
                    src={product.image || productpic}
                    alt="product"
                    className="me-3 rounded"
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                  <div>
                    <strong>{product.name}</strong>
                    <p>
                      {" "}
                      <strong className="mb-0 text-muted small">${product.price}</strong>
                    </p>
                    <p className="mb-0 text-muted small">
                      {product.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

