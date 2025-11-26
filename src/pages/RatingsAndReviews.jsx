import React, { useState } from "react";
import DriversProf from "../assets/images/driverProf.png";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useMechanicReviewsQuery } from "../services/apiQueries";
import LoadingSpinner from "../components/LoadingSpinner";

const RatingsAndReviews = () => {
  const [activeTab, setActiveTab] = useState("active");
  const navigate = useNavigate();
  const isSideBarOpen = useOutletContext();
  const { mechanicId } = useParams();

  const { data: reviewsData, error, isLoading } = useMechanicReviewsQuery(mechanicId);

  const totalReviews = reviewsData?.review_count || 0;
  const averageRating = reviewsData?.rating_avg || 0;
  const ratingsBreakdown = [
    { stars: 5, count: 556 },
    { stars: 4, count: 265 },
    { stars: 3, count: 124 },
    { stars: 2, count: 126 },
    { stars: 1, count: 102 },
  ]; // TODO: calculate from reviews if needed

  const renderReviewCards = () => (
    <div className="row g-4" style={{ height: "600px", overflowY: "auto" }}>
      {reviewsData?.reviews?.map((review) => (
      <div className="col-md-6 col-lg-4" key={review.id}>
        <Link
          to="/shop-owner/mechanic-account"
          className="text-decoration-none text-dark"
        >
          <div className="bg-white  reviewBox d-flex rounded-4 shadow-sm p-3 align-items-center gap-2">
            <div>
              <img
                src={review.driver.avatar || DriversProf}
                alt="Reviewer"
                className="rounded-circle border border-orange"
                width="60"
                height="60"
                style={{ objectFit: "cover", borderWidth: "2px" }}
              />
              <h6 className="fw-bold colorOrange mb-1 text-nowrap">
                {review.driver.first_name} {review.driver.last_name}
              </h6>
              <div className="colorOrange">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>
            </div>
            <div className="align-items-center">
              <p className="colorOrange fst-italic small mb-2">
                {review.comment}
              </p>
            </div>
          </div>
        </Link>
      </div>
      
       ))}
    </div>
  );

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
        <h5 className="fw-bold colorOrange mb-4">Rating & Reviews</h5>

        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
            <p className="mb-0 text-danger">{error.message}</p>
          </div>
        ) : (
          <>
            <div className="row g-4 mb-4">
              <div className="col-md-6 col-lg-4">
                <div className="bg-white rounded-4 shadow-sm p-3">
                  <h6 className="text-muted">Total Reviews</h6>
                  <h2 className="colorOrange fw-bold">{totalReviews}</h2>
                  {/* <p className="text-danger small">
                    21% ↑ Growth in reviews on this year
                  </p> */}
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="bg-white rounded-4 shadow-sm p-3">
                  <h6 className="text-muted">Average Rating</h6>
                  <h2 className="colorOrange fw-bold">
                    {averageRating}{" "}
                    <span className="text-orange">
                      {"★".repeat(4)}
                      {"☆"}
                    </span>
                  </h2>
                  <p className="text-muted small">Average rating on this year</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="bg-white rounded-4 shadow-sm p-3">
                  {ratingsBreakdown.map((item) => (
                    <div
                      key={item.stars}
                      className="d-flex align-items-center mb-1"
                    >
                      <span className="me-2">{item.stars}★</span>
                      <div
                        className="flex-grow-1 bg-light"
                        style={{ height: "6px", borderRadius: "4px" }}
                      >
                        <div
                          className="bg-orange"
                          style={{
                            width: `${(item.count / totalReviews) * 100}%`,
                            height: "6px",
                            borderRadius: "4px",
                          }}
                        ></div>
                      </div>
                      <span className="ms-2 small fst-italic">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {renderReviewCards()}
          </>
        )}
      </div>
    </div>
  );
};

export default RatingsAndReviews;
