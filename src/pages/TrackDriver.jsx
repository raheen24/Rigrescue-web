import Ellipse from "../assets/images/Ellipse1.png";
import picturePdf from "../assets/images/picture_as_pdf.png";
import locationdot from "../assets/images/locationdot.png";
import CustomTextField from "../components/CustomTextField";
import deleteIcon from "../assets/images/deleteIcon.png";
import editIcon from "../assets/images/editImg.png";
import { useNavigate, useOutletContext, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiHelper } from "../services";
import { toast } from "react-toastify";
import CustomButton from "../components/GlobalBtn";
import LoadingSpinner from "../components/LoadingSpinner";

export default function TrackDriver() {
  const navigate = useNavigate();
  const location = useLocation();
  const driverId = location.state?.driverId;
  const [driverData, setDriverData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (driverId) {
      const fetchDriver = async () => {
        setLoading(true);
        const { error, response } = await apiHelper("GET", `/web/fleet/driver/${driverId}`);
        if (error) {
          toast.error(error);
        } else {
          setDriverData(response.data.data);
        }
        setLoading(false);
      };
      fetchDriver();
    } else {
      setLoading(false);
    }
  }, [driverId]);

  const handleMapClick = () => {
    navigate(-1);
  };
  const isSideBarOpen = useOutletContext();

  return (
    <div
      className={`content_section ${
        isSideBarOpen ? "" : "content_section_close"
      }home_page`}
      style={{ minHeight: "100vh" }}
    >
      <div
        className="rounded-4 innerWrapper shadow-sm"
        onClick={handleMapClick}
      >
        <div className="col-12 mt-4">
          <h5 className="colorOrange">Track Driver</h5>
          {loading ? (
            <div style={{ height: "800px" }}>
              <LoadingSpinner />
            </div>
          ) : driverData && driverData.latitude && driverData.longitude ? (
            <div
              className="rounded-4 overflow-hidden border-orange position-relative"
              style={{ height: "800px", border: "2px solid" }}
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
            <div className="d-flex justify-content-center align-items-center" style={{ height: "800px", backgroundColor: "#f8f9fa" }}>
              <p className="mb-0 text-muted">Driver location not available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
