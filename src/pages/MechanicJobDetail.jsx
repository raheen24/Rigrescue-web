import Ellipse from "../assets/images/Ellipse1.png";
import picturePdf from "../assets/images/picture_as_pdf.png";
import locationdot from "../assets/images/locationdot.png";
import { useNavigate, useOutletContext, useLocation } from "react-router-dom";
import CustomButton from "../components/GlobalBtn";
import InactiveAccountModal from "../components/InactiveAccountModal";
import { useState, useEffect } from "react";
import AllucateBudgetModal from "../components/AllucateBudgetModal";
import MessageIcon from "../assets/images/messageIcon.png";
import CustomerPic from "../assets/images/customer-pic.png";
import ProductImg from "../assets/images/product_img.png";
import { useServiceBookingDetailsQuery } from "../services/apiQueries";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

export default function MechanicJobDetail() {
  const [showModal, setShowModal] = useState(false);
  const isSideBarOpen = useOutletContext();
  const location = useLocation();

  const navigate = useNavigate();
  const jobId = location.state?.jobId;
  const { data: job, isLoading, error } = useServiceBookingDetailsQuery(jobId);

  const handleMessageClick = () => {
    navigate("/shop-owner/messages");
  };
  const handleMecAccClick = () => {
    navigate("/shop-owner/mechanic-account");
  };
  const handleMapClick = () => {
    navigate("/shop-owner/track-mechanic", { state: { mechanic: job.mechanic } });
  };
  const [showModal2, setShowModal2] = useState(false);

  const handleNavigate = () => {
    navigate("/shop-owner/messages");
  };
  const handleShow2 = () => setShowModal2(true);
  const handleHide2 = () => setShowModal2(false);

  const handleConfirm = () => {
    console.log("Allucated budget");
    setShowModal2(false); // Hide the modal after confirmation
  };

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!job) {
    return <div>Job not found</div>;
  }

  return (
    <div
      className={`content_section ${
        isSideBarOpen ? "" : "content_section_close"
      } home_page`}
    >
      <div
        className="innerWrapper rounded-3 shadow-sm"
        style={{ backgroundColor: "#E9E9E9" }}
      >
        {/* Header Section */}
        <h5 className="m-0 colorOrange mb-3">Job Details</h5>

        {/* Main Content - Two Columns */}
        <div className="row">
          {/* Left Column - Profile Info */}
          <div className="col-md-6">
            <div
              className="shadow-lg detailsBox rounded-4 mb-4"
              // style={{ backgroundColor: "#F3F4F8", height: "100%" }}
            >
              <div className="d-flex justify-content-between">
                <h6 className="colorOrange">Mechanic</h6>
                <a onClick={handleMessageClick}>
                  <img src={MessageIcon} alt="Messages" />
                </a>
              </div>
              <div className="text-center">
                <div className="rounded-circle d-inline-flex align-items-center justify-content-center">
                  {job.mechanic && job.mechanic.first_name ? (
                    <a onClick={handleMecAccClick}>
                      <img src={job.mechanic.avatar || Ellipse} alt="" className="avatar" />
                    </a>
                  ) : (
                    <img src={Ellipse} alt="" className="avatar" />
                  )}
                </div>
                <p>{job.mechanic && job.mechanic.first_name ? `${job.mechanic.first_name} ${job.mechanic.last_name}` : 'Mechanic not assigned'}</p>
              </div>

              <p>Hourly Rate</p>
              <div className="d-flex justify-content-center align-items-center mb-3">
                <div className="rounded shadow-lg bgofTextFields w-100 py-3 d-flex justify-content-center align-items-center">
                  <span className="fw-bold">$ {job.mechanic?.hourly_rate || 'N/A'}</span>
                </div>
              </div>
              {/* Location Section */}
              <div className="rounded-3" onClick={handleMapClick}>
                <h5 className=" pb-2 mb-3">Mechanic Location</h5>
                <div
                  className="border rounded overflow-hidden position-relative"
                  style={{ height: "150px" }}
                >
                  {job.mechanic && job.mechanic.latitude && job.mechanic.longitude ? (
                    <>
                      <iframe
                        src={`https://maps.google.com/maps?q=${job.mechanic.latitude},${job.mechanic.longitude}&output=embed`}
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
                          width: '20px',
                          height: '20px',
                          pointerEvents: 'none'
                        }}
                      />
                    </>
                  ) : (
                    <div className="d-flex justify-content-center align-items-center h-100 bg-light">
                      <p className="mb-0 text-muted small">Location not available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="col-md-6">
            <div className=" detailsBox rounded-4">
              <div className="d-flex justify-content-between">
                <h6 className="fw-bold fs-5">Customer:</h6>
                <h6 className="colorOrange">Job Status</h6>
              </div>
              <div className="d-flex justify-content-between">
                <div className="d-flex align-items-center">
                  <img src={job.driver?.avatar || CustomerPic} alt="" />
                  <p className="colorOrange">{job.driver?.first_name || 'N/A'} {job.driver?.last_name || ''}</p>
                </div>
                <div style={{ height: "10px" }} className=" align-items-center">
                  <CustomButton label={job.status === 'ongoing' ? 'Ongoing' : 'Completed'} className="statusBtn" />
                </div>
              </div>
              <div className="p-0">
                <h6 className="fw-bold fs-5">Issue</h6>
                <p className="fw-light">
                  {job.description}
                </p>
              </div>
              <div className="d-flex justify-content-center">
                <div className="issuesBox d-flex col-md-12 gap-2 my-2">
                  {job.issue_images?.map((img, index) => (
                    <img key={index} src={img.image} alt="" />
                  ))}
                </div>
              </div>

              <h6 className="fw-bold fs-5">Products</h6>
              {job.products?.map((product, i) => (
                <div
                  key={i}
                  className="mechanicBox d-flex bg-white p-3 rounded-4 mb-3 align-items-center shadow-lg"
                >
                  <img
                    src={product.image}
                    alt="product"
                    className="me-3 rounded"
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
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
      <AllucateBudgetModal
        show={showModal2}
        onHide={handleHide2}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
