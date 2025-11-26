import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiHelper } from "../services";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";
import { GoogleMap, Marker } from "@react-google-maps/api";
import locationdot from "../assets/images/locationdot.png";

const containerStyle = {
  width: "100%",
  height: "800px",
};

const center = {
  lat: 40.7128, // Default to New York or some central location
  lng: -74.0060,
};

export default function TrackDriver() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const isSideBarOpen = useOutletContext();

  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true);
      const { error, response } = await apiHelper("GET", "/web/fleet/drivers?status=active");
      if (error) {
        toast.error(error);
        setDrivers([]);
      } else {
        if (response.data.success === false) {
          toast.error(response.data.message);
          setDrivers([]);
        } else {
          setDrivers(response.data.data);
        }
      }
      setLoading(false);
    };
    fetchDrivers();
  }, []);

  const handleMarkerClick = (driver) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${driver.latitude},${driver.longitude}`;
    window.open(url, "_blank");
  };

  return (
    <div
      className={`content_section ${
        isSideBarOpen ? "" : "content_section_close"
      } home_page`}
      style={{ minHeight: "100vh" }}
    >
      <div className="rounded-4 innerWrapper shadow-sm">
        <div className="col-12">
          <h5 className="colorOrange mb-3">Track Drivers</h5>
          {loading ? (
            <div style={{ height: "550px" }}>
              <LoadingSpinner />
            </div>
          ) : (
            <div
              className="rounded-4 overflow-hidden border-orange"
              style={{ height: "550px", border: "2px solid" }}
            >
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
              >
                {drivers
                  .filter((driver) => driver.latitude && driver.longitude)
                  .map((driver) => (
                    <Marker
                      key={driver.id}
                      position={{
                        lat: parseFloat(driver.latitude),
                        lng: parseFloat(driver.longitude),
                      }}
                      icon={{
                        url: locationdot,
                        scaledSize: new window.google.maps.Size(30, 30),
                      }}
                      onClick={() => handleMarkerClick(driver)}
                    />
                  ))}
              </GoogleMap>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
