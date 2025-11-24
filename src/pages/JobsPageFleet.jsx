import React, { useState } from "react";
import DriversProf from "../assets/images/driverProf.png";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useServiceBookingsQuery } from "../services/apiQueries";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

const truncateText = (text, maxWords) => {
  const words = text.split(' ');
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '...';
};

const JobsPage = () => {
  const [activeTab, setActiveTab] = useState("ongoing");
  const navigate = useNavigate();
  const isSideBarOpen = useOutletContext();

  const status = activeTab === "ongoing" ? "ongoing" : "completed";
  const { data, isLoading } = useServiceBookingsQuery(status, '');

  const handleClick = (jobId) => {
    navigate("/fleet/jobs-details", { state: { jobId } });
  };

  const renderJobs = (jobs) =>
    jobs.map((job) => (
      <tr key={job.id}>
        <td
          className="d-flex align-items-center gap-2"
          onClick={() => handleClick(job.id)}
        >
          <img
            src={job.driver.avatar || DriversProf}
            alt="Driver"
            className="rounded-circle"
            width="50"
            height="50"
            style={{ objectFit: "cover" }}
          />
          <span className="fw-semibold text-[#F55227]">
            {job.driver.first_name} {job.driver.last_name}
          </span>
        </td>
        <td
          className="issue text-muted small text-start"
          style={{ whiteSpace: "normal", wordBreak: "break-word" }}
        >
          {truncateText(job.description, 5)}
        </td>
        {activeTab === "previous" && (
          <td className="text-dark">
            {new Date(job.completed_at).toLocaleDateString()}
          </td>
        )}
        <td className="text-dark">{job.quotation.mechanic_name}</td>
        <td className="text-dark fw-semibold">
          ${" "}
          {activeTab === "previous"
            ? job.total_amount
            : job.quotation.est_amount}
        </td>
        <td className="text-dark">
          {activeTab === "ongoing" ? "Mechanic Arriving" : "Completed"}
        </td>
        <td>
          <button
            className="btn btn-sm backgroundColorGb text-white"
            style={{ whiteSpace: "nowrap" }}
            onClick={() => handleClick(job.id)}
          >
            View Details
          </button>
        </td>
      </tr>
    ));
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
        <h5 className="fw-bold colorOrange mb-4">Jobs</h5>

        {/* Tabs */}
        <div className="tabs d-flex gap-4 mb-4 justify-content-center">
          <h6
            className={`fw-bold pb-2 mb-0 ${
              activeTab === "ongoing"
                ? "colorOrange border-orange-act"
                : "text-muted"
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => setActiveTab("ongoing")}
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

        {/* Table Based on Active Tab */}
        {activeTab === "ongoing" && (
          <div className="table-responsive">
            <table className="table ">
              <thead>
                <tr className="fw-bold text-muted">
                  <th>Driver Name</th>
                  <th>Issue</th>
                  <th>Mechanic</th>
                  <th>Quotation Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6"><LoadingSpinner /></td>
                  </tr>
                ) : (
                  renderJobs(data?.data || [])
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "previous" && (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr className="fw-bold text-muted">
                  <th>Driver Name</th>
                  <th>Issue</th>
                  <th>Date</th>
                  <th>Mechanic</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="7"><LoadingSpinner /></td>
                  </tr>
                ) : (
                  renderJobs(data?.data || [])
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
