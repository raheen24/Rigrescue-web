import React, { useState, useEffect } from "react";
import DriversProf from "../assets/images/driverProf.png";
import { useNavigate, useOutletContext } from "react-router-dom";
import FilterIcon from "../assets/images/filterIcon.png";
import FilterModal from "../components/FilterModal";
import { getProductRequests } from "../services";
import { toast } from "react-toastify";

const ProductRequest = () => {
  const [activeTab, setActiveTab] = useState("current");
  const navigate = useNavigate();
  const isSideBarOpen = useOutletContext();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [productRequests, setProductRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductRequests = async () => {
      setLoading(true);
      const result = await getProductRequests();
      if (result.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        setProductRequests(result.response.data.data);
      }
      setLoading(false);
    };
    fetchProductRequests();
  }, []);

  const handleClick = (request) => {
    navigate("/shop-owner/add-product", { state: { fromRequest: true, request } });
  };

  const CurrentOrdersHeader = () => (
    <thead>
      <tr className="fw-bold text-muted">
        <th>Mechanic</th>
        <th>Justification</th>
        <th>Date</th>
        <th>Quality Needed</th>
        <th>Action</th>
      </tr>
    </thead>
  );

  const renderCurrentOrderRow = (request, index) => {
    const { mechanic, description, created_at, quantity } = request;
    const formattedDate = new Date(created_at).toLocaleDateString('en-GB'); // DD/MM/YYYY
    return (
      <tr key={request.id || index}>
        <td className="d-flex align-items-center gap-2">
          <img
            src={mechanic.avatar || DriversProf}
            alt="Mechanic"
            className="rounded-circle"
            width="40"
            height="40"
            style={{ objectFit: "cover" }}
          />
          <span className="fw-semibold text-orange text-nowrap">
            {mechanic.first_name} {mechanic.last_name}
          </span>
        </td>
        <td className="text-muted small" style={{ wordBreak: "break-word" }}>
          {description}
        </td>
        <td className="text-muted small">{formattedDate}</td>
        <td className="text-dark">{quantity} Products</td>
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
            onClick={() => handleClick(request)}
          >
            Add Product
          </button>
        </td>
      </tr>
    );
  };


  return (
    <div
      className={`content_section ${
        isSideBarOpen ? "" : "content_section_close"
      } home_page`}
      style={{ minHeight: "100vh" }}
    >
      <div
        className="rounded-4 innerWrapper shadow-sm"
        // style={{ background: "#E9E9E9" }}
      >
        <h5 className="fw-bold colorOrange mb-4">Product Request</h5>
        <div className="table-responsive">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-4 text-danger">
              Error loading product requests: {error}
            </div>
          ) : (
            <table className="table">
              <CurrentOrdersHeader />
              <tbody>
                {productRequests.length > 0 ? (
                  productRequests.map((request, index) =>
                    renderCurrentOrderRow(request, index)
                  )
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      No product requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductRequest;
