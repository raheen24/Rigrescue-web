import React, { useState } from "react";
import DriversProf from "../assets/images/profile-image.png";
import cameraIcon from "../assets/images/camera.png";
import CustomTextField from "../components/CustomTextField";
import CustomButton from "../components/GlobalBtn";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { apiHelper } from "../services";
import { toast } from "react-toastify";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { setUser } from "../redux/userslice";
import LoadingSpinner from "../components/LoadingSpinner";

const ProfileSetup = ({ onClose }) => {
  const [logo, setLogo] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const user = useSelector((state) => state.user.user);
  const [name, setName] = useState(
    user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() : ""
  );
  const [website, setWebsite] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [bio, setBio] = useState("");
  const navigate = useNavigate();
  const role = useSelector((state) => state.user.role);
  const dispatch = useDispatch();
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
      setLogoFile(file);
    }
  };
  const handleAccountSetup = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!location.trim()) {
      toast.error("Location is required");
      return;
    }
    if (!latitude || !longitude) {
      toast.error("Please select a valid location from the suggestions");
      return;
    }

    // Split name into first & last
    const [first_name, ...rest] = name.split(" ");
    const last_name = rest.join(" ");

    const formData = new FormData();
    formData.append("first_name", first_name);
    formData.append("last_name", last_name || "");
    formData.append("phone", businessPhone);
    formData.append("website", website);
    formData.append("bio", bio);
    formData.append("location", location);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);

    if (logoFile) {
      formData.append("avatar", logoFile);
    }

    const { error, response } = await apiHelper(
      "POST",
      "/web/profile/create",
      { "Content-Type": "multipart/form-data" },
      formData
    );

    if (error) {
      toast.error(error);
    } else {
      toast.success("Profile created successfully");
      dispatch(setUser(response.data.data.user));
      // Navigate based on role
      if (role === "shop_owner") {
        navigate("/shop-owner/add-mechanic");
      } else {
        navigate("/add-driver");
      }
    }
  };

  return (
    <div
      className="profilesetup_bg bg-overlay-all"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(5px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1050,
      }}
    >
      <div
        className="photoSetup_container m-0 md:m-2 lg:m-4"
        style={{
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: "12px",
          position: "relative",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          height: "90vh",
          overflowY: "auto",
          padding: "24px",
        }}
      >
        <h3
          className="text-center mb-4"
          style={{
            fontWeight: "700",
            fontSize: "20px",
            lineHeight: "28px",
            color: "#000",
            marginBottom: "24px",
          }}
        >
          Profile Setup
        </h3>
        {/* Upload Business Logo */}
        <div className="text-center mb-6">
          <label
            htmlFor="logo-upload"
            style={{
              display: "inline-block",
              width: "180px",
              height: "180px",
              cursor: "pointer",
              overflow: "hidden",
              marginBottom: "8px",
            }}
            className="w-20 h-20"
          >
            <div
              style={{ position: "relative", width: "100%", height: "100%" }}
            >
              <img
                src={logo || DriversProf}
                alt="Business Logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                  border: "2px solid #f45228",
                }}
              />
              <img
                src={cameraIcon}
                alt="Camera"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "45px",
                  height: "auto",
                  cursor: "pointer",
                }}
              />
            </div>
          </label>
          <input
            id="logo-upload"
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            style={{ display: "none" }}
          />
          <div
            className="mt-2"
            style={{
              fontWeight: "600",
              fontSize: "14px",
              lineHeight: "20px",
            }}
          >
            Upload Business Logo
          </div>
        </div>
        {/* Name Section */}
        <div className="row my-3">
          <div className="col-md-12 col-lg-6">
            <CustomTextField
              label={role === "shop_owner" ? "Shop Name" : "Fleet Name"}
              placeholder="Lorem Ipsum"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-md-12 col-lg-6">
            <CustomTextField
              label={"Website"}
              placeholder="https://example.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              type="url"
            />
          </div>

          <div className="col-md-12 col-lg-6">
            <CustomTextField
              label={"Business Email"}
              placeholder="Lorem ipsum dolor sit amet"
              value={businessEmail}
              onChange={(e) => setBusinessEmail(e.target.value)}
            />
          </div>
          <div className="col-md-12 col-lg-6">
            <CustomTextField
              label={"Business Phone Number"}
              placeholder="esteba lorem ipsum"
              value={businessPhone}
              onChange={(e) => setBusinessPhone(e.target.value)}
            />
          </div>
          <div className="col-md-12 col-lg-6">
            <label className="fw-bold">Location</label>
            <PlacesAutocomplete
              value={location}
              onChange={setLocation}
              onSelect={async (value) => {
                setLocation(value);
                try {
                  const results = await geocodeByAddress(value);
                  const latLng = await getLatLng(results[0]);
                  setLatitude(latLng.lat);
                  setLongitude(latLng.lng);
                } catch (error) {
                  console.error("Error", error);
                }
              }}
            >
              {({
                getInputProps,
                suggestions,
                getSuggestionItemProps,
                loading,
              }) => (
                <div>
                  <input
                    {...getInputProps({
                      placeholder: "Search Places ...",
                      className: "form-control w-100 bgofTextFields py-3",
                    })}
                  />
                  <div className="autocomplete-dropdown-container">
                    {loading && <LoadingSpinner />}
                    {suggestions.map((suggestion) => {
                      const className = suggestion.active
                        ? "suggestion-item--active"
                        : "suggestion-item";
                      const style = suggestion.active
                        ? { backgroundColor: "#fafafa", cursor: "pointer" }
                        : { backgroundColor: "#ffffff", cursor: "pointer" };
                      return (
                        <div
                          {...getSuggestionItemProps(suggestion, {
                            className,
                            style,
                          })}
                        >
                          <span>{suggestion.description}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
          </div>
          <div className="col-md-12 col-lg-6">
            <label className="fw-bold" htmlFor="">
              Bio
            </label>
            <textarea
              className="form-control w-100 bgofTextFields py-3"
              rows={4}
              placeholder="Lorem ipsum dolor sit amet consectetur adipiscing elit, ut
ullamcorper felis blandit tellus, a luctus in cursus litora rhos.
Nostra pulvinar pellentesque rhoncus tristique placerat cubilia
enim mattis"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          {/* Business Phone Number field */}
          <div className="col-md-12 d-flex justify-content-start">
            <div className="col-md-1 justify-content-start"></div>
          </div>
        </div>
        <hr
          className="my-4"
          style={{ borderTop: "1px solid #000", margin: "24px 0" }}
        />
        <div className="d-flex justify-content-center">
          <CustomButton
            className=" w-50 py-2"
            label={"Continue"}
            onClick={handleAccountSetup}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
