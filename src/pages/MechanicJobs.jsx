import React, { useState, useEffect } from "react";
import DriversProf from "../assets/images/driverProf.png";
import { useNavigate, useOutletContext } from "react-router-dom";
import SearchIcon from "../assets/images/SearchIcon.png";
import { getServiceBookings } from "../services";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

const MechanicJobs = () => {
  const [activeTab, setActiveTab] = useState("current");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const isSideBarOpen = useOutletContext();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const status = activeTab === "current" ? "ongoing" : "completed";
      const result = await getServiceBookings(status, search);
      if (result.error) {
        toast.error(result.error);
      } else {
        const allJobs = result.response.data.data || [];
        const filteredJobs = allJobs.filter(job => job.status === status);
        setJobs(filteredJobs);
      }
      setLoading(false);
    };
    fetchJobs();
  }, [activeTab, search]);

  const handleClick = (jobId) => {
    navigate("/shop-owner/mechanic-job-details", { state: { jobId } });
  };

  const handlePreviousClick = (jobId) => {
    navigate("/shop-owner/previous-mechanic-job-details", { state: { jobId } });
  };

  const CurrentOrdersHeader = () => (
    <thead>
      <tr className="fw-bold text-muted">
        <th>Mechanic</th>
        <th>Issue</th>
        <th>Date</th>
        <th>Driver</th>
        <th>Est Amount</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    </thead>
  );

  const PreviousOrdersHeader = () => (
    <thead>
      <tr className="fw-bold text-muted">
        <th>Mechanic</th>
        <th>Issue</th>
        <th>Date</th>
        <th>Driver</th>
        <th>Est Amount</th>
        <th>Status</th>
        <th>Request Status</th>
        <th>Action</th>
      </tr>
    </thead>
  );

  const renderCurrentOrderRow = (job) => (
    <tr key={job.id}>
      <td className="d-flex align-items-center gap-2">
        <img
          src={job.quotation.mechanic_avatar || DriversProf}
          alt="Mechanic"
          className="rounded-circle"
          width="40"
          height="40"
          style={{ objectFit: "cover" }}
        />
        <span className="fw-semibold text-orange text-nowrap">
          {job.quotation.mechanic_name}
        </span>
      </td>
      <td className="text-muted small" style={{ wordBreak: "break-word" }}>
        {job.description}
      </td>
      <td className="text-muted small">
        {new Date(job.created_at).toLocaleDateString()}
      </td>
      <td className="text-dark">
        {job.driver?.first_name || "N/A"} {job.driver?.last_name || ""}
      </td>
      <td className="text-dark">$ {job.quotation.est_amount}</td>
      <td className="text-dark">Ongoing</td>
      <td>
        <button
          className="btn btn-sm px-3 py-2"
          style={{
            backgroundColor: "#1B1F5E",
            color: "white",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            whiteSpace: "nowrap",
          }}
          onClick={() => handleClick(job.id)}
        >
          View Details
        </button>
      </td>
    </tr>
  );

  const renderPreviousOrderRow = (job) => (
    <tr key={job.id}>
      <td className="d-flex align-items-center gap-2">
        <img
          src={job.quotation.mechanic_avatar || DriversProf}
          alt="Mechanic"
          className="rounded-circle"
          width="40"
          height="40"
          style={{ objectFit: "cover" }}
        />
        <span className="fw-semibold text-orange text-nowrap">
          {job.quotation.mechanic_name}
        </span>
      </td>
      <td className="text-muted small" style={{ wordBreak: "break-word" }}>
        {job.description}
      </td>
      <td className="text-muted small">
        {new Date(job.completed_at).toLocaleDateString()}
      </td>
      <td className="text-dark">
        {job.driver?.first_name || "N/A"} {job.driver?.last_name || ""}
      </td>
      <td className="text-dark">$ {job.total_amount}</td>
      <td className="text-dark">Completed</td>
      <td className="text-dark">Approved</td>
      <td>
        <button
          className="btn btn-sm px-3 py-2"
          style={{
            backgroundColor: "#1B1F5E",
            color: "white",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            whiteSpace: "nowrap",
          }}
          onClick={() => handlePreviousClick(job.id)}
        >
          View Details
        </button>
      </td>
    </tr>
  );

  return (
    <div
      className={`content_section ${
        isSideBarOpen ? "" : "content_section_close"
      }  home_page`}
      style={{ minHeight: "100vh" }}
    >
      <div
        className="rounded-4 innerWrapper shadow-sm"
        style={{ background: "#E9E9E9" }}
      >
        <h5 className="fw-bold colorOrange mb-4">Mechanic Jobs</h5>
        <div className="searchfield">
          <input
            type="search"
            placeholder="Search jobs..."
            className="custom-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <img src={SearchIcon} alt="Search" className="w-5 h-5" />
        </div>

        <div className="position-relative mb-4">
          <div className="d-flex justify-content-center gap-4">
            <h6
              className={`fw-bold pb-2 mb-0 ${
                activeTab === "current"
                  ? "colorOrange border-orange-act"
                  : "text-muted"
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => setActiveTab("current")}
            >
              Ongoing Jobs
            </h6>
            <h6
              className={`fw-bold pb-2 mb-0 ${
                activeTab === "previous"
                  ? "colorOrange border-orange-act"
                  : "text-muted"
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => setActiveTab("previous")}
            >
              Previous Jobs
            </h6>
          </div>

          {activeTab === "previous" && (
            <div
              className="position-absolute end-0 top-[-10px]"
              style={{ marginTop: "0px" }}
            >
              {/* <button
                className="btn bg-white rounded-circle btn-sm px-3 py-3"
                style={{
                  borderRadius: "0.5rem",
                  whiteSpace: "nowrap",
                }}
                onClick={() => setIsFilterModalOpen(true)}
              >
                <img src={FilterIcon} alt="Filter" />
              </button> */}
            </div>
          )}
          {/* <FilterModal
            open={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            modalBtnPress={(filters) => {
              console.log("Filters applied:", filters);
              // Handle filtering logic here
              setIsFilterModalOpen(false);
            }}
          /> */}
        </div>

        {activeTab === "current" && (
          <div className="table-responsive">
            <table className="table">
              <CurrentOrdersHeader />
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7"><LoadingSpinner /></td>
                  </tr>
                ) : (
                  jobs.map((job) => renderCurrentOrderRow(job))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "previous" && (
          <div className="table-responsive">
            <table className="table">
              <PreviousOrdersHeader />
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8"><LoadingSpinner /></td>
                  </tr>
                ) : (
                  jobs.map((job) => renderPreviousOrderRow(job))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MechanicJobs;
