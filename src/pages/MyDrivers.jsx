import React, { useState, useEffect } from "react";
import DriversProf from "../assets/images/driverProf.png";
import { Link, useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiHelper } from "../services";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchIcon from "../assets/images/SearchIcon.png";

const DriversPage = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isSideBarOpen = useOutletContext();
  const [search, setSearch] = useState("");

  const handleAddDriver = () => {
    navigate("/fleet/add-new-driver");
  };

  const fetchDrivers = async (status) => {
    setLoading(true);
    const params = new URLSearchParams({ status });
    if (search) params.append('search', search);
    const { error, response } = await apiHelper(
      "GET",
      `/web/fleet/drivers?${params.toString()}`
    );
    setLoading(false);
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
  };
  //   const fetchDrivers = async (status) => {
  //   setLoading(true);
  //   const token = store.getState().user.token || getCookie("token");
  //   if (!token) {
  //     toast.error("No authentication token found. Please login again.");
  //     console.log("Token in interceptor:", token);

  //     return;
  //   }
  //   const { error, response } = await apiHelper(
  //     "GET",
  //     `/web/fleet/drivers?status=${status}`
  //   );
  //   setLoading(false);
  //   if (error) {
  //     toast.error(error);
  //   } else {
  //     setDrivers(response.data.data);
  //   }
  // };

  useEffect(() => {
    fetchDrivers(activeTab);
  }, [activeTab, search]);

  const renderDrivers = () => (
    <div className="row g-4">
      {loading ? (
        <LoadingSpinner />
      ) : drivers.length === 0 ? (
        <div className="text-center">No drivers found.</div>
      ) : (
        drivers.map((driver) => (
          <div className="col-md-4 col-lg-3 col-sm-6" key={driver.id}>
            <div className="bg-white text-center p-3 rounded-4 shadow-sm">
              <img
                src={driver.avatar || DriversProf}
                alt="Driver"
                className="rounded-circle border border-orange mb-3"
                width="80"
                height="80"
                style={{ objectFit: "cover", borderWidth: "3px" }}
              />
              <h6 className="fw-bold colorOrange mb-1">
                {driver.first_name} {driver.last_name}
              </h6>
              <p className="text-muted small mb-3">{driver.email}</p>
              <Link
                to={`/fleet/my-drivers-detail/${driver.id}`}
                className="btn btn-sm backgroundColorGb text-white px-3"
              >
                View Profile
              </Link>{" "}
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div
      className={`content_section ${
        isSideBarOpen ? "" : "content_section_close"
      } home_page`}
      style={{ minHeight: "100vh" }}
    >
      <div
        className="rounded-4 innerWrapper shadow-sm"
        style={{ background: "#E9E9E9" }}
      >
        <div className="d-block d-sm-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold colorOrange">All Drivers</h5>
          <div className="tabs d-flex gap-4">
            <h5
              className={`fw-bold pb-1 ${
                activeTab === "active"
                  ? "colorOrange border-orange-act"
                  : "text-muted"
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => setActiveTab("active")}
            >
              Active Drivers
            </h5>
            <h5
              className={`fw-bold pb-1 ${
                activeTab === "inactive"
                  ? "colorOrange border-orange-act"
                  : "text-muted"
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => setActiveTab("inactive")}
            >
              Inactive Drivers
            </h5>
          </div>
          <button
            className="btn backgroundColorGb text-white btn-sm px-4"
            onClick={handleAddDriver}
          >
            Add Driver
          </button>
        </div>
        <div className="searchfield">
          <input
            type="search"
            placeholder="Search drivers..."
            className="custom-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <img src={SearchIcon} alt="Search" className="w-5 h-5" />
        </div>
        {/* Conditional driver rendering based on tab */}
        {renderDrivers()}
      </div>
    </div>
  );
};

export default DriversPage;
