import Ellipse from "../assets/images/Ellipse1.png";
import picturePdf from "../assets/images/picture_as_pdf.png";
import CustomTextField from "../components/CustomTextField";
import deleteIcon from "../assets/images/deleteIcon.png";
import editIcon from "../assets/images/editImg.png";
import { useNavigate, useOutletContext } from "react-router-dom";
import CustomButton from "../components/GlobalBtn";
export default function TrackMechanic() {
    const navigate = useNavigate();
    const handleMapClick = () => {
      navigate(-1);
    };
    const isSideBarOpen = useOutletContext()

  return (
    <div className={`content_section ${isSideBarOpen ? "" : "content_section_close"} p-4 home_page`}
    style={{ minHeight: "100vh" }}
  >
      <div
        className="p-4 rounded-3 shadow-sm"
        style={{ backgroundColor: "#E9E9E9" }} onClick={handleMapClick}
      >
          <div className="col-12 mt-4">
            <h5 className="colorOrange">Track Mechanic</h5>
            <div
              className="rounded-4 overflow-hidden border-orange"
              style={{ height: "800px", border: '2px solid' }}  
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
  );
}
