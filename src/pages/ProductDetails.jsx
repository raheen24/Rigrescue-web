import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import productImg from "../assets/images/bgprod.png";
import EditProd from "../assets/images/EditProd.png";
import DeleteProd from "../assets/images/deleteprod.png";
import DeleteProductModal from "../components/DeleteProductModal";
import DeleteAccountModal from "../components/DeleteAccountModal";
import { getProductDetails, deleteProduct } from "../services";
import { toast } from "react-toastify";

export default function ProductDetails() {
  const navigate = useNavigate();
  const isSideBarOpen = useOutletContext();
  const { id } = useParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleDeleteConfirm = async () => {
    const result = await deleteProduct(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Product deleted successfully.");
      navigate("/shop-owner/inventory-management");
    }
    setShowDeleteModal(false);
  };

  const handleDeleteAccountConfirm = () => {
    // Your delete account logic here (API call, state update, etc.)
    console.log("Account deleted");

    // Close the modal
    setShowDeleteAccountModal(false);
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      const result = await getProductDetails(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        const data = result.response.data.data;
        setProductData({
          title: data.name,
          price: `$${data.price}`,
          quantity: data.quantity,
          description: data.description,
          images: [data.image], // Single image, but swiper expects array
        });
      }
      setLoading(false);
    };
    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const handleEdit = () => {
    navigate(`/shop-owner/edit-product/${id}`);
  };

  const handleDelete = () => {
    console.log("Deleting product...");
  };

  if (loading || !productData) {
    return (
      <div
        className={`content_section ${
          isSideBarOpen ? "" : "content_section_close"
        } `}
        style={{ minHeight: "100vh" }}
      >
        <div className="innerWrapper rounded-3 shadow-sm productDetailsWrapper d-flex justify-content-center align-items-center">
          <div className="text-center">
            <div className="spinner-border" role="status" style={{ color: '#f55227' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`content_section ${
        isSideBarOpen ? "" : "content_section_close"
      } `}
      style={{ minHeight: "100vh" }}
    >
      <style>
        {`
          .swiper-pagination-bullet {
            background-color: #E25C28 !important;
          }
          .swiper-pagination-bullet-active {
            background-color: #E25C28 !important;
          }
        `}
      </style>
      <div className="innerWrapper rounded-3 shadow-sm productDetailsWrapper">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="fw-bold colorOrange">Product Details</h5>
          <div className="d-flex gap-3">
            <a onClick={() => setShowDeleteModal(true)} className="productIcon">
              <img src={DeleteProd} alt="" />
            </a>

            <a onClick={handleEdit} className="productIcon">
              <img src={EditProd} alt="" />
            </a>
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <div className="col-12 col-md-8 col-lg-8">
            <div className="bg-white rounded-4 shadow detailsBox text-center">
              <Swiper
                modules={[Pagination]}
                spaceBetween={50}
                slidesPerView={1}
                pagination={{ clickable: true }}
                className="mb-3"
              >
                {productData.images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={img}
                      alt={`product-${index}`}
                      className="rounded-4 prodimgofDetail"
                      style={{border:"1px solid #f55227"}}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="d-flex justify-content-between align-items-center mb-2 px-2">
                <h5 className="fw-bold text-start colorOrange m-0">
                  {productData.title}
                </h5>
                <em className="fw-bold text-end colorOrange m-0">
                  {productData.price}
                </em>
              </div>

              <div className="text-start px-2 mb-2">
                <div>
                  <strong className="colorOrange">Quantity:</strong>{" "}
                  <strong className="fw-bold fs-5 colorOrange">
                    {productData.quantity}
                  </strong>
                </div>
              </div>

              <p
                className="text-start colorOrange px-2"
                style={{ whiteSpace: "pre-line" }}
              >
                {productData.description}
              </p>
            </div>
          </div>
        </div>
        <DeleteProductModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
        />
        <DeleteAccountModal
          show={showDeleteAccountModal}
          onHide={() => setShowDeleteAccountModal(false)}
          onConfirm={handleDeleteAccountConfirm}
        />
      </div>
    </div>
  );
}
