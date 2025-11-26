import Ellipse from "../assets/images/Ellipse1.png";
import picturePdf from "../assets/images/picture_as_pdf.png";
import locationdot from "../assets/images/locationdot.png";
import CustomTextField from "../components/CustomTextField";
import deleteIcon from "../assets/images/deleteIcon.png";
import editIcon from "../assets/images/editImg.png";
import { useNavigate, useOutletContext } from "react-router-dom";
import CustomButton from "../components/GlobalBtn";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useMechanicsQuery } from "../services/apiQueries";
import LoadingSpinner from "../components/LoadingSpinner";
import { useState } from "react";
export default function TrackMechanic() {
    const navigate = useNavigate();
    const isSideBarOpen = useOutletContext();
    const { data: mechanics, isLoading, error } = useMechanicsQuery("active");
    const center = {
      lat: 40.730610,
      lng: -73.876242,
    };

    const handleMapClick = () => {
      navigate(-1);
    };

    const handleMarkerClick = (mechanic) => {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${mechanic.latitude},${mechanic.longitude}`;
      window.open(url, "_blank");
    };

    const mapContainerStyle = {
      height: "800px",
      width: "100%",
    };

    return (
      <div className={`content_section ${isSideBarOpen ? "" : "content_section_close"} home_page`}
        style={{ minHeight: "100vh" }}
      >
        <div
          className="innerWrapper rounded-3 shadow-sm"
          style={{ backgroundColor: "#E9E9E9" }}
        >
          <div className="col-12">
            <h5 className="colorOrange mb-3">Track Mechanics</h5>
            {isLoading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: "800px", backgroundColor: "#f8f9fa" }}>
                <p className="mb-0 text-danger">{error.message}</p>
              </div>
            ) : mechanics && mechanics.length > 0 ? (
              <div
                className="rounded-4 overflow-hidden border-orange position-relative"
                style={{ height: "500px", border: "2px solid" }}
              >
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={10}
                >
                  {mechanics.map((mechanic) => (
                    mechanic.latitude && mechanic.longitude ? (
                      <Marker
                        key={mechanic.id}
                        position={{
                          lat: parseFloat(mechanic.latitude),
                          lng: parseFloat(mechanic.longitude),
                        }}
                        icon={{
                          url: locationdot,
                          scaledSize: new window.google.maps.Size(30, 30),
                        }}
                        title={`${mechanic.first_name} ${mechanic.last_name}`}
                        onClick={() => handleMarkerClick(mechanic)}
                      />
                    ) : null
                  ))}
                </GoogleMap>
              </div>
            ) : (
              <div className="d-flex justify-content-center align-items-center" style={{ height: "800px", backgroundColor: "#f8f9fa" }}>
                <p className="mb-0 text-muted">No mechanics with location data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
}
