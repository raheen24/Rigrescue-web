import React, { useState, useEffect } from "react";
import ProductImage from "../assets/images/driverProf.png"; // Replace with actual product image
import { useNavigate, useOutletContext } from "react-router-dom";
import imagesq from "../assets/images/imagesq.png";
import { useProductsQuery, useProductRequestsQuery } from "../services/apiQueries";
import LoadingSpinner from "../components/LoadingSpinner";
const InventoryManagement = () => {
  const navigate = useNavigate();
  const isSideBarOpen = useOutletContext();

  const { data: productsData, isLoading: productsLoading } = useProductsQuery();
  const { data: productRequestsData, isLoading: requestsLoading } = useProductRequestsQuery();

  const products = productsData || [];
  const productRequestCount = productRequestsData?.length || 0;
  const loading = productsLoading || requestsLoading;

  const handleProduct = () => {
    navigate('/shop-owner/product-request')
  }
  const handleAddProduct = () => {
    navigate('/shop-owner/add-product')
  }

  if (loading) {
    return (
      <div
        className={`content_section ${isSideBarOpen ? "" : "content_section_close"} home_page`}
        style={{ minHeight: "100vh"}}
      >
        <div className="rounded-4 innerWrapper shadow-sm">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`content_section ${isSideBarOpen ? "" : "content_section_close"} home_page`}
      style={{ minHeight: "100vh"}}
    >
      <div className="rounded-4 innerWrapper shadow-sm">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-4 gap-2">
          <h5 className="fw-bold colorOrange mb-2">Inventory Management</h5>
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm px-3 py-2 position-relative"
              style={{ background: "#FF5C00", color: "white", borderRadius: "8px" }}
              onClick={handleProduct}
            >
              Product Requests
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {productRequestCount}
              </span>
            </button>
            <button
              className="btn btn-sm px-3 py-2 text-white"
              style={{ background: "#1A2343", borderRadius: "8px" }}
              onClick={handleAddProduct}
            >
              Add Product
            </button>
          </div>
        </div>

        {/* Grid of Products */}
        {products.length === 0 ? (
          <div className="text-center py-5">
            <p>No products available</p>
          </div>
        ) : (
          <div className="row g-4">
            {products.map((product, index) => (
              <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6" key={product.id || index}   onClick={() => navigate(`/shop-owner/product-details/${product.id}`)}
              style={{ cursor: "pointer" }} >
                <div className="bg-white rounded-4 shadow-sm h-100">
                  <div className="position-relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="img-fluid rounded-top-4"
                      style={{ height: "120px", width: "100%", objectFit: "cover" , border:"1px solid #f55227"}}
                    />
                    <div
                      className="position-absolute end-0 m-2 px-2 py-1 text-white"
                      style={{ background: "#1A2343", borderRadius: "6px", fontSize: "0.75rem" }}
                    >
                      ${product.price}
                    </div>
                  </div>
                  <div className="p-3">
                    <h6 className="fw-bold mb-1 text-capitalize">{product.name}</h6>
                    <p className="mb-1 text-muted" style={{ fontSize: "0.85rem" }}>{product.quantity} Qty</p>
                    <p className="mb-0 text-muted small">
                      {product.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryManagement;
