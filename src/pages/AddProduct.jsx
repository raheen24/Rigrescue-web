import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useOutletContext, useLocation } from "react-router-dom";
import CustomTextField from "../components/CustomTextField";
import CustomButton from "../components/GlobalBtn";
import { BiImageAlt } from "react-icons/bi";
import { useAddProductMutation } from "../services/apiQueries";
import { toast } from "react-toastify";

export default function AddProduct() {
  const navigate = useNavigate();
  const isSideBarOpen = useOutletContext();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const addProductMutation = useAddProductMutation();

  const [productData, setProductData] = useState({
    title: "",
    price: "",
    quantity: "",
    description: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (location.state && location.state.fromRequest && location.state.request) {
      const { request } = location.state;
      setProductData(prev => ({
        ...prev,
        title: request.product.name,
        quantity: request.quantity.toString(),
        description: request.description,
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProductData({
      ...productData,
      image: file,
    });
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", productData.title);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append("quantity", productData.quantity);
    if (productData.image) {
      formData.append("image", productData.image);
    }

    addProductMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Product added successfully.");
        navigate('/shop-owner/inventory-management');
      },
      onError: (error) => {
        toast.error(error.message || "Something went wrong.");
      },
    });
  };

  return (
    <div
      className={`content_section ${isSideBarOpen ? "" : "content_section_close"}`}
      // style={{ minHeight: "100vh", }}
    >
      <div className="innerWrapper rounded-3 shadow-sm ">
      <h5 className=" colorOrange fw-bold mb-4">Add Product</h5>

        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="shadow-lg bg-white detailsBox rounded-4">
              <h5 className="text-center colorOrange fw-bold mb-2">Add Product</h5>

              {/* Upload box */}
              <div className="text-center mb-4">
                <div
                  className="bgofTextFields border-dashed"
                  style={{
                    borderColor: "#E25C28",
                    borderRadius: "16px",
                    padding: "40px",
                    color: imagePreview ? "transparent" : "#E25C28",
                    cursor: "pointer",
                    backgroundImage: imagePreview ? `url(${imagePreview})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    minHeight: "120px",
                  }}
                  onClick={handleUploadClick}
                >
                  {!imagePreview && (
                    <>
                      <BiImageAlt size={40} className="mb-2" />
                      <div className="fw-bold">Upload Pictures/Videos</div>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  accept="image/*"
                />
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
                  label="Add Product"
                  // className="py-3"
                  onClick={handleSubmit}
                  disabled={addProductMutation.isPending}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
