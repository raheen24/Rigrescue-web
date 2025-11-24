import React, { useEffect, useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Navigate,
  useNavigate,
  useOutletContext,
  Link,
} from "react-router-dom";
import { toast } from "react-toastify";
import { apiHelper } from "../services";
import Img from "../assets/images/driverProf.png";
import LoadingSpinner from "../components/LoadingSpinner";
import LocationIcon from "../assets/images/locationdot.png";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const DashboardPage = () => {
  const isSideBarOpen = useOutletContext();
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);

  const totalDrivers = drivers.length;
  const activeDrivers = drivers.filter((d) => d.latitude && d.longitude).length;
  const inactiveDrivers = totalDrivers - activeDrivers;

  const doughnutData = {
    labels: ["Active", "Inactive"],
    datasets: [
      {
        data: [activeDrivers, inactiveDrivers],
        backgroundColor: ["#e2553e", "#1b1f3b"],
        borderWidth: 0,
      },
    ],
  };
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        grid: { drawBorder: false },
      },
    },
  };

  const doughnutOptions = {
    cutout: "70%", // makes the doughnut thinner (inner radius)
    plugins: {
      legend: {
        display: false, // hides legend
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.parsed}%`;
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const lineData = {
    labels: Array.from({ length: 14 }, (_, i) => i + 10),
    datasets: [
      {
        label: "Jobs",
        data: [
          40000, 50000, 60000, 45000, 70000, 50000, 83234, 60000, 65000, 60000,
          58000, 61000, 55000, 60000,
        ],
        fill: true,
        backgroundColor: "rgba(255, 85, 62, 0.1)",
        borderColor: "#e2553e",
        tension: 0.4,
      },
    ],
  };
  const handleToNext = (driverId) => {
    navigate(`/fleet/my-drivers-detail/${driverId}`);
  };

  const handleMapClick = () => {
    navigate("/fleet/track-driver");
  };

  const fetchDrivers = async () => {
    setLoading(true);
    const { error, response } = await apiHelper("GET", "/web/fleet/drivers");
    setLoading(false);
    if (error) {
      toast.error(error);
    } else {
      setDrivers(response.data.data);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return (
    <div
      className={`content_section ${
        isSideBarOpen ? "" : "content_section_close"
      } home_page`}
    >
      <div
        className="innerWrapper bg-[#E9E9E9] rounded-3"
        style={{ backgroundColor: "#E9E9E9" }}
      >
        <div className="row g-4">
          <div className="col-12 col-md-6 col-sm-12">
            <div className="graphBox p-4 bg-white rounded-4 shadow-sm md:p-2 sm:p-1">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-2 mb-md-0 colorOrange">Total Drivers</h5>
                <select className="selectMonth form-select backgroundColorGb form-select-sm w-fit text-white">
                  <option>This Month</option>
                </select>
              </div>

              <div className="row">
                {/* Doughnut chart */}
                <div className="col-12 col-md-6 col-sm-6 d-flex justify-content-center mb-3 mb-sm-0">
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "120px",
                      height: "180px",
                    }}
                  >
                    <Doughnut data={doughnutData} options={doughnutOptions} />
                  </div>
                </div>

                {/* Right-side content */}
                <div className="row">
                  {/* <div className="col-12 col-md-6 col-sm-6"> */}
                  <div className="col-6 col-lg-6 mb-3 col-md-12 mb-3">
                    <small className="text-muted">Total Drivers</small>
                    <div className="d-flex align-items-center">
                      <h6 className="mb-0 me-2 fw-bold">{totalDrivers}</h6>
                    </div>
                  </div>

                  <div className="col-6 col-lg-6 mb-3 col-md-12 mb-3">
                    <small className="text-muted">Active Drivers</small>
                    <div className="d-flex align-items-center">
                      <h6 className="mb-0 me-2 fw-bold">{activeDrivers}</h6>
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mb-3 col-md-6 mb-3">
                    <small className="text-muted">Inactive Drivers</small>
                    <div className="d-flex align-items-center">
                      <h6 className="mb-0 me-2 fw-bold">{inactiveDrivers}</h6>
                    </div>
                  </div>
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="graphBox p-4 bg-white rounded-4 shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0 colorOrange">All Jobs</h5>
                <select className="form-select backgroundColorGb form-select-sm w-auto text-white">
                  <option>This Month</option>
                </select>
              </div>
              <div
                className="relative w-100"
                style={{
                  width: "100%",
                  minHeight: "auto",
                  maxHeight: "180px",
                }}
              >
                <div style={{ width: "100%" }}>
                  <Line
                    data={lineData}
                    options={{ ...lineOptions, maintainAspectRatio: false }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="colorOrange">Registered Drivers</h5>
              <Link
                to="/fleet/my-drivers"
                className="text-decoration-none colorOrange fw-bold"
              >
                View All
              </Link>
            </div>
            <div className="d-flex overflow-auto" style={{ gap: "1rem" }}>
              {loading ? (
                <LoadingSpinner />
              ) : drivers.length === 0 ? (
                <div className="text-center w-100">No drivers found.</div>
              ) : (
                drivers.map((driver) => (
                  <div
                    key={driver.id}
                    className="text-center border p-3 rounded-3 flex-shrink-0"
                    style={{
                      width: "240px",
                      minWidth: "240px",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <img
                      src={driver.avatar || Img}
                      alt="Driver"
                      className="rounded-circle mb-2"
                      width="80"
                      height="80"
                    />
                    <p className="mb-1 fw-bold colorOrange">
                      {driver.first_name} {driver.last_name}
                    </p>
                    <p className="text-black small mb-2">{driver.email}</p>
                    <button
                      className="btn btn-sm my-2"
                      style={{ background: "#171F4D", color: "white" }}
                      onClick={() => handleToNext(driver.id)}
                    >
                      View Profile
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="col-12 mt-4">
            <h5 className="colorOrange">Drivers Location</h5>

            <div
              className="border rounded overflow-hidden position-relative"
              style={{ height: "300px" }}
              onClick={handleMapClick}
            >
              <iframe
                src={`https://maps.google.com/maps?q=${drivers.filter(d => d.latitude && d.longitude).map(d => `${d.latitude},${d.longitude}`).join('&q=')}&output=embed`}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen=""
                aria-hidden="false"
                tabIndex="0"
                title="Drivers Location Map"
                style={{ pointerEvents: 'none' }}
              ></iframe>
              <img
                src={LocationIcon}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
