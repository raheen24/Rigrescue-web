import React, { useState } from "react";
import DriversProf from "../assets/images/driverProf.png";
import Ellipse1 from "../assets/images/Ellipse1.png";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useBudgetRequestsQuery, useManageBudgetRequestMutation } from "../services/apiQueries";
import { toast } from "react-toastify";
import { useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from "../components/LoadingSpinner";

const BudgetRuquests = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const navigate = useNavigate();
  const isSideBarOpen = useOutletContext();
  const queryClient = useQueryClient();

  const status = activeTab === "pending" ? "pending" : "approve";
  const { data, isLoading, error } = useBudgetRequestsQuery(status);
  const manageMutation = useManageBudgetRequestMutation();

  const handleManage = (id, action) => {
    manageMutation.mutate({ budget_id: id, action }, {
      onSuccess: () => {
        toast.success(`Request ${action}d successfully`);
        queryClient.invalidateQueries({ queryKey: ['budgetRequests', status] });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const renderJobs = (requests) =>
    requests.map((request) => (
      <tr key={request.id}>
        <td className="d-flex align-items-center gap-2">
          <img
            src={request.driver.avatar || Ellipse1}
            alt="Driver"
            className="rounded-circle"
            width="50"
            height="50"
            style={{ objectFit: "cover" }}
            onError={(e) => {
              e.target.src = Ellipse1;
            }}
          />
          <span className="fw-semibold text-[#F55227]">
            {request.driver.first_name} {request.driver.last_name}
          </span>
        </td>
        <td className="text-muted small">{request.reason}</td>
        <td className="text-dark fw-semibold">$ {request.amount}</td>
        <td className="text-dark">
          {new Date(request.created_at).toLocaleDateString()}
        </td>
        <td>
          <button
            className="btn btn-sm backgroundColorGb2 text-black me-2"
            onClick={() => handleManage(request.id, "reject")}
          >
            Reject Request
          </button>
          <button
            className="btn btn-sm backgroundColorGb text-white"
            onClick={() => handleManage(request.id, "approve")}
          >
            Approve Request
          </button>
        </td>
      </tr>
    ));

  const renderJobs2 = (requests) =>
    requests.map((request) => (
      <tr key={request.id}>
        <td className="d-flex align-items-center gap-2">
          <img
            src={request.driver.avatar || Ellipse1}
            alt="Driver"
            className="rounded-circle"
            width="50"
            height="50"
            style={{ objectFit: "cover" }}
            onError={(e) => {
              e.target.src = Ellipse1;
            }}
          />
          <span className="fw-semibold text-[#F55227]">
            {request.driver.first_name} {request.driver.last_name}
          </span>
        </td>
        <td className="text-muted small">{request.reason}</td>

        <td className="text-dark fw-semibold">$ {request.amount}</td>
        <td className="text-dark">
          {new Date(request.created_at).toLocaleDateString()}
        </td>

        <td className="text-dark fw-semibold text-success">
          <button
            className="btn btn-sm backgroundColorGb text-white"
            // onClick={() => handleManage(request.id, "approve")}
          >
            Approved
          </button>
        </td>
      </tr>
    ));

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
        <h5 className="fw-bold colorOrange mb-4">Budget Requests</h5>

        {/* Tabs */}
        <div className="tabs d-flex gap-4 mb-4 justify-content-center">
          <h6
            className={`fw-bold pb-2 mb-0 ${
              activeTab === "pending"
                ? "colorOrange border-orange-act"
                : "text-muted"
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => setActiveTab("pending")}
          >
            Current Requests
          </h6>
          <h6
            className={`fw-bold pb-2 mb-0 ${
              activeTab === "approved"
                ? "colorOrange border-orange-act"
                : "text-muted"
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => setActiveTab("approved")}
          >
            Previous Requests
          </h6>
        </div>

        {/* Loading */}
        {isLoading && <LoadingSpinner />}

        {/* Error */}
        {error && <div className="text-center text-danger">{error.message}</div>}

        {/* Table Based on Active Tab */}
        {!isLoading && !error && activeTab === "pending" && (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr className="fw-bold text-muted">
                  <th>Driver Name</th>
                  <th>Reason</th>
                  <th>Request Amount</th>
                  <th>Request Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{renderJobs(data?.data || [])}</tbody>
            </table>
          </div>
        )}

        {!isLoading && !error && activeTab === "approved" && (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr className="fw-bold text-muted">
                  <th>Driver Name</th>
                  <th>Reason</th>
                  <th>Request Amount</th>
                  <th>Request Date</th>
                  <th>Request Status</th>
                </tr>
              </thead>
              <tbody>{renderJobs2(data?.data || [])}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetRuquests;
