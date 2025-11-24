import Ellipse from "../assets/images/Ellipse1.png";
import picturePdf from "../assets/images/picture_as_pdf.png";
import { useNavigate, useOutletContext, useLocation } from "react-router-dom";
import CustomButton from "../components/GlobalBtn";
import InactiveAccountModal from "../components/InactiveAccountModal";
import { useState, useEffect } from "react";
import AllucateBudgetModal from "../components/AllucateBudgetModal";
import MessageIcon from "../assets/images/messageIcon.png";
import CustomerPic from "../assets/images/customer-pic.png";
import ProductImg from "../assets/images/product_img.png";
import { getServiceBookingDetails } from "../services";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

export default function MechanicJobDetail() {
  const [showModal, setShowModal] = useState(false);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const isSideBarOpen = useOutletContext();
  const location = useLocation();

  const navigate = useNavigate();

  const handleMessageClick = () => {
    navigate("/shop-owner/messages");
  };
  const handleMecAccClick = () => {
    navigate("/shop-owner/mechanic-account");
  };
  const handleMapClick = () => {
    navigate("/shop-owner/track-mechanic");
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
    const fetchJobDetails = async () => {
      const jobId = location.state?.jobId;
      if (jobId) {
        const result = await getServiceBookingDetails(jobId);
        if (result.error) {
          toast.error(result.error);
        } else {
          setJob(result.response.data);
        }
      }
      setLoading(false);
    };
    fetchJobDetails();
  }, [location.state]);

  if (loading) {
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
      style={{ minHeight: "100vh" }}
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
                  <a onClick={handleMecAccClick}>
                    <img src={job.quotation?.mechanic_avatar || Ellipse} alt="" className="avatar" />
                  </a>
                </div>
                <p>{job.quotation?.mechanic_name || 'N/A'}</p>
              </div>

              <p>Hourly Changes</p>
              <div className="d-flex justify-content-center align-items-center mb-3">
                <div className="rounded shadow-lg bgofTextFields w-100 py-3 d-flex justify-content-center align-items-center">
                  <span className="fw-bold">$ {job.quotation?.est_amount || 'N/A'}</span>
                </div>
              </div>
              {/* Location Section */}
              <div className="rounded-3" onClick={handleMapClick}>
                <h5 className=" pb-2 mb-3">Mechanic Location</h5>
                <div
                  className="border rounded overflow-hidden"
                  style={{ height: "150px" }}
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3151.835434509406!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1618367842780!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen=""
                    aria-hidden="false"
                    tabIndex="0"
                    title="Map"
                  ></iframe>
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
                  <img src={CustomerPic} alt="" />
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
                  {/* <div className="col-md-4"> */}
                  <img src={ProductImg} alt="" />
                  {/* </div> */}
                  {/* <div className="col-md-4"> */}
                  <img src={ProductImg} alt="" />
                  {/* </div> */}
                  {/* <div className="col-md-4"> */}
                  <img src={ProductImg} alt="" />
                  {/* </div> */}
                </div>
              </div>

              <h6 className="fw-bold fs-5">Products</h6>
              {[...Array(1)].map((_, i) => (
                <div
                  key={i}
                  className="mechanicBox d-flex bg-white p-3 rounded-4 mb-3 align-items-center shadow-lg"
                >
                  <img
                    src={ProductImg}
                    alt="product"
                    className="me-3 rounded"
                  />
                  <div>
                    <strong>Lorem Ipsum Product</strong>
                    <p>
                      {" "}
                      <strong className="mb-0 text-muted small">$15.30</strong>
                    </p>
                    <p className="mb-0 text-muted small">
                      Lorem ipsum dolor sit amet adipiscing dignissim, risus
                      massa quam
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
