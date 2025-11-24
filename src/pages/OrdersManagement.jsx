import React, { useState } from "react";
import DriversProf from "../assets/images/driverProf.png";
import { useNavigate, useOutletContext } from "react-router-dom";
import FilterIcon from "../assets/images/filterIcon.png";
import FilterModal from "../components/FilterModal";

const OrdersManagement = () => {
  const [activeTab, setActiveTab] = useState("current");
  const navigate = useNavigate();
  const isSideBarOpen = useOutletContext();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const currentOrders = Array.from({ length: 12 });
  const previousOrders = Array.from({ length: 12 });

  const handleClick = () => {
    navigate("/shop-owner/order-details");
  };

  const CurrentOrdersHeader = () => (
    <div className="row fw-bold text-muted mb-3 px-3 d-none d-md-flex">
      <div className="col-md-2">Customer</div>
      <div className="col-md-2">Products</div>
      <div className="col-md-2">Product Amount</div>
      <div className="col-md-2">Total Amount</div>
      <div className="col-md-2">Order Status</div>
      <div className="col-md-1">Action</div>
    </div>
  );

  const PreviousOrdersHeader = () => (
    <div className="row fw-bold text-muted mb-3 px-3 d-none d-md-flex">
      <div className="col-md-2">Customer</div>
      <div className="col-md-2">Products</div>
      <div className="col-md-2">Product Amount</div>
      <div className="col-md-2">Total Amount</div>
      <div className="col-md-1">Date</div>
      <div className="col-md-2">Order Status</div>
      <div className="col-md-1">Action</div>
    </div>
  );

  const renderCurrentOrderRow = (_, index) => (
    <div
      key={index}
      className="row align-items-center bg-white rounded-4 shadow-sm py-3 px-3 mb-3"
    >
      <div className="col-md-2 d-flex align-items-center gap-2">
        <img
          src={DriversProf}
          alt="Customer"
          className="rounded-circle"
          width="40"
          height="40"
          style={{ objectFit: "cover" }}
        />
        <span className="fw-semibold text-orange text-nowrap">John Smith</span>
      </div>
      <div className="col-md-2 text-muted small">Lorem ipsum dolor (x2)</div>
      <div className="col-md-2 text-dark">$ 12.00</div>
      <div className="col-md-2 text-dark">$ 24.00</div>
      <div className="col-md-2 text-dark">Pending</div>
      <div className="col-md-1 d-flex justify-content-end">
        <button
          className="btn btn-sm px-3 py-2"
          style={{
            backgroundColor: "#1B1F5E",
            color: "white",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            whiteSpace: "nowrap",
          }}
          onClick={handleClick}
        >
          View Details
        </button>
      </div>
    </div>
  );

  const renderPreviousOrderRow = (_, index) => (
    <div
      key={index}
      className="row align-items-center bg-white rounded-4 shadow-sm py-3 px-3 mb-3"
    >
      <div className="col-md-2 d-flex align-items-center gap-2">
        <img
          src={DriversProf}
          alt="Customer"
          className="rounded-circle"
          width="40"
          height="40"
          style={{ objectFit: "cover" }}
        />
        <span className="fw-semibold text-orange text-nowrap">John Smith</span>
      </div>
      <div className="col-md-2 text-muted small">Lorem ipsum dolor (x2)</div>
      <div className="col-md-2 text-dark">$ 12.00</div>
      <div className="col-md-2 text-dark">$ 24.00</div>
      <div className="col-md-1 text-muted small">2025-05-10</div>
      <div className="col-md-2 text-dark">Delivered</div>
      <div className="col-md-1 d-flex justify-content-end">
        <button
          className="btn btn-sm px-3 py-2"
          style={{
            backgroundColor: "#1B1F5E",
            color: "white",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            whiteSpace: "nowrap",
          }}
          onClick={handleClick}
        >
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <div
      className={`content_section ${
        isSideBarOpen ? "" : "content_section_close"
      } p-4 home_page`}
      style={{ minHeight: "100vh" }}
    >
      <div
        className="rounded-4 p-4 shadow-sm"
        style={{ background: "#E9E9E9" }}
      >
        <h5 className="fw-bold colorOrange mb-4">Order Management</h5>

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
              Current Order
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
              Previous Orders
            </h6>
          </div>

          {activeTab === "previous" && (
            <div
              className="position-absolute end-0 top-0"
              style={{ marginTop: "-4px" }}
            >
              <button
                className="btn bg-white rounded-circle btn-sm px-3 py-3"
                style={{
                  borderRadius: "0.5rem",
                  whiteSpace: "nowrap",
                }}
                onClick={() => setIsFilterModalOpen(true)}
              >
                <img src={FilterIcon} alt="Filter" />
              </button>
            </div>
          )}
          <FilterModal
            open={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            modalBtnPress={(filters) => {
              console.log("Filters applied:", filters);
              // Handle filtering logic here
              setIsFilterModalOpen(false);
            }}
          />
        </div>

        <div style={{ height: "800px", overflowY: "auto" }}>
          {activeTab === "current" && (
            <>
              <CurrentOrdersHeader />
              {currentOrders.map((order, index) =>
                renderCurrentOrderRow(order, index)
              )}
            </>
          )}

          {activeTab === "previous" && (
            <>
              <PreviousOrdersHeader />
              {previousOrders.map((order, index) =>
                renderPreviousOrderRow(order, index)
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersManagement;
