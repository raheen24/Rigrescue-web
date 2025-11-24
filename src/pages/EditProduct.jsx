import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import CustomTextField from "../components/CustomTextField";
import CustomButton from "../components/GlobalBtn";
import { BiImageAlt } from "react-icons/bi";
import { IoCloseCircle } from "react-icons/io5";
import { getProductDetails, updateProduct } from "../services";
import { toast } from "react-toastify";
export default function EditProduct() {
  const navigate = useNavigate();
  const isSideBarOpen = useOutletContext();
  const { id } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  // Handle clicking on the upload box
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Create a preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      const result = await getProductDetails(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        const data = result.response.data.data;
        setProductData({
          title: data.name,
          price: data.price,
          quantity: data.quantity.toString(),
          description: data.description,
        });
        setPreviewUrl(data.image);
      }
      setLoading(false);
    };
    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Cleanup preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const [productData, setProductData] = useState({
    title: "",
    price: "",
    quantity: "",
    description: "",
  });

  const handleChange = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("product_id", id);
    formData.append("name", productData.title);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append("quantity", productData.quantity);
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    const result = await updateProduct(formData);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Product updated successfully.");
      navigate(`/shop-owner/inventory-management`);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    fileInputRef.current.value = null; 
  };

  if (loading) {
    return (
      <div
        className={`content_section ${
          isSideBarOpen ? "" : "content_section_close"
        } `}
        style={{ minHeight: "100vh" }}
      >
        <div className="innerWrapper rounded-3 shadow-sm d-flex justify-content-center align-items-center">
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
      // style={{ minHeight: "100vh" }}
    >
      <div className=" rounded-3 shadow-sm innerWrapper">
        <h5 className=" colorOrange fw-bold mb-4">Edit Product</h5>

        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="shadow-lg bg-white detailsBox rounded-4">
              <h5 className="text-center colorOrange fw-bold mb-4">
                Edit Details
              </h5>

              <div className="text-center mb-4">
                {/* Uploadable Box */}
                <div
                  className="bgofTextFields border-dashed"
                  onClick={handleUploadClick}
                  style={{
                    borderColor: "#E25C28",
                    borderRadius: "16px",
                    padding: "40px",
                    color: previewUrl ? "transparent" : "#E25C28",
                    cursor: "pointer",
                    userSelect: "none",
                    backgroundImage: previewUrl ? `url(${previewUrl})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    minHeight: "120px",
                  }}
                >
                  {!previewUrl && (
                    <>
                      <BiImageAlt size={40} className="mb-2" />
                      <div className="fw-bold">Upload Pictures/Videos</div>
                    </>
                  )}
                  {selectedFile && (
                    <div className="mt-2 text-muted small">
                      {selectedFile.name}
                    </div>
                  )}
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  accept="image/*,video/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />

                {/* Preview Section */}
                {previewUrl && selectedFile && (
                 <div
                 className="mt-4 d-flex position-relative"
                 style={{ justifyContent: "flex-start", alignItems: "center" }}
               >
                 {/* Remove Button */}
                 <button
                   onClick={handleRemoveFile}
                   className="btn btn-sm btn-light position-absolute"
                   style={{
                     top: "-10px",
                     zIndex: 10,
                     left: "100px",
                     borderRadius: "50%",
                     boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                     padding: 0,
                   }}
                 >
                   <IoCloseCircle size={22} color="#dc3545" />
                 </button>
               
                 {selectedFile.type.startsWith("image/") ? (
                   <img
                     src={previewUrl}
                     alt="Preview"
                     className="rounded-4"
                     style={{
                       maxWidth: "100px",
                       minWidth: "100px",
                       minHeight: "100px",
                       maxHeight: "100px",
                       objectFit: "contain",
                     }}
                   />
                 ) : (
                   <video
                     src={previewUrl}
                     controls
                     style={{
                       maxWidth: "100px",
                       maxHeight: "100px",
                       borderRadius: "12px",
                       objectFit: "contain",
                     }}
                   />
                 )}
               </div>
               
                )}
              </div>

              {/* Title */}
              <div className="mb-3">
                <CustomTextField
                  label="Title"
                  name="title"
                  value={productData.title}
                  onChange={handleChange}
                  placeholder="Lorem ipsum dolor sit"
                  className="w-100"
                />
              </div>

              {/* Price & Quantity */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <CustomTextField
                    label="Price"
                    name="price"
                    value={productData.price}
                    onChange={handleChange}
                    placeholder="$ 99.00"
                    className="w-100"
                  />
                </div>
                <div className="col-md-6">
                  <CustomTextField
                    label="Quantity"
                    name="quantity"
                    value={productData.quantity}
                    onChange={handleChange}
                    placeholder="20"
                    className="w-100"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <CustomTextField
                  label="Description"
                  name="description"
                  value={productData.description}
                  onChange={handleChange}
                  placeholder="Lorem ipsum dolor sit amet..."
                  className="w-100"
                  multiline
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <div className="d-grid">
                <CustomButton
                  label="Save Details"
                  // className="py-3"
                  onClick={handleSubmit}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
