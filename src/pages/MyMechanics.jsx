import React, { useState, useEffect } from "react";
import DriversProf from "../assets/images/driverProf.png";
import { Link, useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SearchIcon from "../assets/images/SearchIcon.png";
import { getMechanics } from "../services";
import LoadingSpinner from "../components/LoadingSpinner";

const MyMechanics = () => {
  const [activeTab, setActiveTab] = useState("active");
  const navigate = useNavigate();
  const isSideBarOpen = useOutletContext();
  const [search, setSearch] = useState("");
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddDriver = () => {
    navigate("/shop-owner/add-new-mechanic");
  };

  useEffect(() => {
    const fetchMechanics = async () => {
      setLoading(true);
      setError(null);
      const status = activeTab === "active" ? "active" : "inactive";
      const res = await getMechanics(status, search);
      if (res.error) {
        setError(res.error);
      } else {
        setMechanics(res.response.data.data);
      }
      setLoading(false);
    };
    fetchMechanics();
  }, [activeTab, search]);

  const renderDrivers = (mechanicList) => (
    <div className="row g-4">
      {mechanicList.map((mechanic) => (
        <div className="col-md-4 col-lg-3 col-sm-6" key={mechanic.id}>
          <div className="bg-white text-center p-3 rounded-4 shadow-sm">
            <img
              src={mechanic.avatar || DriversProf}
              alt="Mechanic"
              className="rounded-circle border border-orange mb-3"
              width="80"
              height="80"
              style={{ objectFit: "cover", borderWidth: "3px" }}
            />
            <h6 className="fw-bold colorOrange mb-1">{mechanic.first_name} {mechanic.last_name}</h6>
            <p className="text-muted small mb-3">{mechanic.email}</p>
            <Link
              to={`/shop-owner/mechanic-account/${mechanic.id}`}
              className="btn btn-sm backgroundColorGb text-white px-3"
            >
              View Profile
            </Link>{" "}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className={`content_section ${
        isSideBarOpen ? "" : "content_section_close"
      }  home_page`}
      style={{ minHeight: "100vh" }}
    >
      <div
        className="rounded-4 innerWrapper shadow-sm"
        // style={{ background: "#E9E9E9" }}
      >
        <div className="d-block d-md-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold colorOrange my-4 text-center">
            All Mechanics
          </h5>

          <div className="tabs d-flex gap-4 justify-content-center">
            <h5
              className={`fw-bold pb-1 ${
                activeTab === "active"
                  ? "colorOrange border-orange-act"
                  : "text-muted"
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => setActiveTab("active")}
            >
              Active Mechanic
            </h5>
            <h5
              className={`fw-bold pb-1 ${
                activeTab === "inactive"
                  ? "colorOrange  border-orange-act"
                  : "text-muted"
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => setActiveTab("inactive")}
            >
              Inactive Mechanic
            </h5>
          </div>
          <div className="justify-content-center d-flex ">
            <button
              className="btn backgroundColorGb text-white btn-sm px-4 "
              onClick={handleAddDriver}
            >
              Add Mechanic
            </button>
          </div>
        </div>
          <div className="searchfield mb-3">
            <input
              type="search"
              placeholder="Search mechanics..."
              className="custom-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <img src={SearchIcon} alt="Search" className="w-5 h-5" />
          </div>

        {/* Conditional mechanic rendering based on tab */}
        {loading && <LoadingSpinner />}
        {error && <p className="text-danger">{error}</p>}
        {!loading && !error && renderDrivers(mechanics)}
      </div>
    </div>
  );
};

export default MyMechanics;
