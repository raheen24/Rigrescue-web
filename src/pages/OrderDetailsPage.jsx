import Ellipse from "../assets/images/Ellipse1.png";
import productpic from "../assets/images/productimg.png";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";
import CustomButton from "../components/GlobalBtn";
import CustomerPic from "../assets/images/customer-pic.png";
import productImg from "../assets/images/product_img.png";

export default function OrderDetails() {
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleMapClick = () => {
    navigate("/shop-owner/track-mechanic");
  };

  const [showModal2, setShowModal2] = useState(false);

  const handleNavigate = () => {
    navigate("/shop-owner/orders-management");
  };
  const handleShow2 = () => setShowModal2(true);
  const handleHide2 = () => setShowModal2(false);
  const isSideBarOpen = useOutletContext();

  const handleConfirm = () => {
    console.log("Allucated budget");
    setShowModal2(false); // Hide the modal after confirmation
  };
  return (
    <div
      className={`content_section ${
        isSideBarOpen ? "" : "content_section_close"
      } p-4 home_page`}
      style={{ minHeight: "100vh" }}
    >
      <div
        className="p-4 rounded-3 shadow-sm"
        style={{ backgroundColor: "#E9E9E9" }}
      >
        <h5 className="mb-4 colorOrange">Order Details</h5>

        <div className="row">
          <div className="justify-content-center d-flex">
            {/* Right Column */}
            <div className="col-md-5">
              <div
                className="p-4 rounded-4 shadow-sm"
                style={{ backgroundColor: "#F3F4F8", height: "100%" }}
              >
                <h4 className="mb-3 fw-semibold">Customer:</h4>
                <div className="d-flex justify-content-between small mb-2">
                  <span className="colorOrange">
                    <img src={CustomerPic} alt="profile-image" />
                    John Smith:
                  </span>
                  <div style={{ height: "18px" }}>
                    <CustomButton
                      className="py-2"
                      label={"See Locations"}
                      onClick={handleMapClick}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-between small mb-2">
                  <span>Placed On:</span>{" "}
                  <strong>20-Jan-2024 | 10:30 AM</strong>
                </div>
                <div className="d-flex justify-content-between small mb-2">
                  <span>Mechanic:</span> <strong>John Smith</strong>
                </div>
                <div className="d-flex justify-content-between small mb-4">
                  <span>Total Amount:</span> <strong>$ 24.00</strong>
                </div>

                <h5 className="mb-3">Products:</h5>
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="d-flex bg-light p-2 rounded-3 mb-3 align-items-center shadow-sm"
                  >
                    <img
                      src={productImg}
                      alt="product"
                      className="me-3 rounded"
                    />
                    <div>
                      <strong>Lorem Ipsum Product</strong>
                      <p>
                        {" "}
                        <strong className="mb-0 text-muted small">
                          $15.30
                        </strong>
                      </p>
                      <p className="mb-0 text-muted small">
                        Lorem ipsum dolor sit amet adipiscing dignissim, risus
                        massa quam
                      </p>
                    </div>
                  </div>
                ))}
                <CustomButton className="w-100 py-3 fs-5" label={"Ready"} onClick={handleNavigate} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
