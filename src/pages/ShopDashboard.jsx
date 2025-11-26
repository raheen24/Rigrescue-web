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
import { useBookingsGraphQuery } from "../services/apiQueries";
import Img from "../assets/images/driverProf.png";
import Group from "../assets/images/Group.png";
import LoadingSpinner from "../components/LoadingSpinner";
import LocationIcon from "../assets/images/locationdot.png";
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const ShopDashboard = () => {
  const isSideBarOpen = useOutletContext();
  const navigate = useNavigate();
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data: graphData } = useBookingsGraphQuery();

  const totalMechanics = mechanics.length;
  const activeMechanics = mechanics.filter((m) => m.latitude && m.longitude).length;
  const inactiveMechanics = totalMechanics - activeMechanics;

  const doughnutData = {
    labels: ["Active", "Inactive"],
    datasets: [
      {
        data: [activeMechanics, inactiveMechanics],
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

  const lineData = graphData ? {
    labels: graphData.x_axis?.labels || [],
    datasets: [
      {
        label: "Jobs",
        data: graphData.chart_data?.line_data?.map(d => d.jobs) || [],
        fill: true,
        backgroundColor: "rgba(255, 85, 62, 0.1)",
        borderColor: "#e2553e",
        tension: 0.4,
      },
    ],
  } : {
    labels: [],
    datasets: [],
  };
  const handleToNext = (mechanicId) => {
    navigate(`/shop-owner/mechanic-account/${mechanicId}`);
  };

  const handleMapClick = () => {
    navigate("/shop-owner/track-mechanic");
  };

  const fetchMechanics = async () => {
    setLoading(true);
    const { error, response } = await apiHelper("GET", "/web/shop/mechanics");
    setLoading(false);
    if (error) {
      toast.error(error);
    } else {
      setMechanics(response.data.data);
    }
  };

  useEffect(() => {
    fetchMechanics();
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
                <h5 className="mb-2 mb-md-0 colorOrange">Total Mechanics</h5>
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
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {loading ? (
                      <LoadingSpinner />
                    ) : totalMechanics === 0 ? (
                      <div className="text-center">
                        <p className="text-muted mb-0">No Data</p>
                      </div>
                    ) : (
                      <Doughnut data={doughnutData} options={doughnutOptions} />
                    )}
                  </div>
                </div>

                {/* Right-side content */}
                <div className="row">
                  {/* <div className="col-lg-12"> */}
                  <div className="col-6 col-lg-6 mb-3 col-md-12 mb-3">
                    <small className="text-muted">Total Mechanics</small>
                    <div className="d-flex align-items-center">
                      <h6 className="mb-0 me-2 fw-bold">{totalMechanics}</h6>
                    </div>
                  </div>

                  <div className="col-6 col-lg-6 mb-3 col-md-12 mb-3">
                    <small className="text-muted">Active Mechanics</small>
                    <div className="d-flex align-items-center">
                      <h6 className="mb-0 me-2 fw-bold">{activeMechanics}</h6>
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mb-3 col-md-6 mb-3">
                    <small className="text-muted">Inactive Mechanics</small>
                    <div className="d-flex align-items-center">
                      <h6 className="mb-0 me-2 fw-bold">{inactiveMechanics}</h6>
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
                <h5 className="mb-0 colorOrange">Total Orders</h5>
                <select className="form-select backgroundColorGb form-select-sm w-auto text-white">
                  <option>{graphData?.current_month || "This Month"}</option>
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
                    options={{
                      ...lineOptions,
                      maintainAspectRatio: false,
                      scales: {
                        ...lineOptions.scales,
                        y: {
                          ...lineOptions.scales.y,
                          max: graphData?.max_value,
                          ticks: {
                            stepSize: graphData ? graphData.max_value / (graphData.y_axis?.intervals || 1) : 1,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="colorOrange">Registered Mechanics</h5>
              <Link
                to="/shop-owner/my-mechanics"
                className="text-decoration-none colorOrange fw-bold"
              >
                View All
              </Link>
            </div>
            <div className="d-flex overflow-auto" style={{ gap: "1rem" }}>
              {loading ? (
                <LoadingSpinner />
              ) : mechanics.length === 0 ? (
                <div className="text-center w-100">No mechanics found.</div>
              ) : (
                mechanics.slice(0, 8).map((mechanic) => (
                  <div
                    key={mechanic.id}
                    className="text-center border p-3 rounded-3 flex-shrink-0"
                    style={{
                      width: "240px",
                      minWidth: "240px",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <img
                      src={mechanic.avatar || Group}
                      alt="Mechanic"
                      className="rounded-circle mb-2"
                      width="80"
                      height="80"
                      onError={(e) => { e.target.src = Group; }}
                    />
                    <p className="mb-1 fw-bold colorOrange">
                      {mechanic.first_name} {mechanic.last_name}
                    </p>
                    <p className="text-black small mb-2">{mechanic.email}</p>
                    <button
                      className="btn btn-sm my-2"
                      style={{ background: "#171F4D", color: "white" }}
                      onClick={() => handleToNext(mechanic.id)}
                    >
                      View Profile
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="col-12 mt-4">
            <h5 className="colorOrange">Mechanics Location</h5>

            <div
              className="border rounded overflow-hidden position-relative"
              style={{ height: "300px" }}
              onClick={handleMapClick}
            >
              <iframe
                src={`https://maps.google.com/maps?q=${mechanics.filter(m => m.latitude && m.longitude).map(m => `${m.latitude},${m.longitude}`).join('&q=')}&output=embed`}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen=""
                aria-hidden="false"
                tabIndex="0"
                title="Mechanics Location Map"
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

export default ShopDashboard;
