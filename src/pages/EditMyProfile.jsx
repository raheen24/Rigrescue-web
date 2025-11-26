import { useNavigate, useOutletContext } from "react-router-dom";
import CustomButton from "../components/GlobalBtn";
import profileImage from "../assets/images/profile-image.png";
import CustomTextField from "../components/CustomTextField";
import UploadIcon from "../assets/images/uploadIcon.png";
import { useState, useEffect, useRef } from "react";
import { useProfileQuery } from "../services/apiQueries";
import { apiHelper } from "../services/index.js";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import LoadingSpinner from "../components/LoadingSpinner";

export default function EditMyProfile() {
  const navigate = useNavigate();
  const isSideBarOpen = useOutletContext();
  const fileInputRef = useRef(null);
  const role = useSelector((state) => state.user.role);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    location: "",
    latitude: "",
    longitude: "",
    website: "",
    bio: "",
    avatar: null,
  });
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(profileImage);

  const { data: profileData, isLoading } = useProfileQuery();

  useEffect(() => {
    if (profileData?.data) {
      const data = profileData.data;
      setFormData({
        firstName: data.first_name || "",
        lastName: data.last_name || "",
        phone: data.phone || "",
        location: data.location || "",
        latitude: data.latitude || "",
        longitude: data.longitude || "",
        website: data.website || "",
        bio: data.bio || "",
        avatar: null,
      });
      if (data.avatar) {
        setAvatarPreview(data.avatar);
      }
    }
  }, [profileData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setSaving(true);
    const data = new FormData();
    data.append("first_name", formData.firstName);
    data.append("last_name", formData.lastName);
    data.append("phone", formData.phone);
    data.append("location", formData.location);
    data.append("latitude", formData.latitude);
    data.append("longitude", formData.longitude);
    data.append("website", formData.website);
    data.append("bio", formData.bio);
    if (formData.avatar) {
      data.append("avatar", formData.avatar);
    }

    const customHeaders =
      data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};
    apiHelper("POST", "/web/profile/update", customHeaders, data)
      .then((res) => {
        if (res.error) {
          toast.error(res.error);
        } else {
          const profilePath =
            role === "shop_owner"
              ? "/shop-owner/my-profile"
              : "/fleet/my-profile";
          toast.success("Profile updated successfully");
          navigate(profilePath);
        }
        setSaving(false);
      })
      .catch((error) => {
        toast.error(error.message || "Something went wrong");
        setSaving(false);
      });
  };

  const handleClick = () => {
    const profilePath =
      role === "shop_owner" ? "/shop-owner/my-profile" : "/fleet/my-profile";
    navigate(profilePath);
  };
  if (isLoading) {
    return (
      <div
        className={`content_section ${
          isSideBarOpen ? "" : "content_section_close"
        } home_page`}
      >
        <div className="innerWrapper profileWrapper rounded-3 shadow-sm d-flex justify-content-center align-items-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`content_section ${
        isSideBarOpen ? "" : "content_section_close"
      } home_page`}
    >
      {" "}
      <div className="innerWrapper profileWrapper rounded-3  shadow-sm">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="m-0 colorOrange">My Profile</h4>
        </div>

        <div className="row">
          <div className="position-relative d-inline-block">
            <div
              className="bg-my-profile rounded-3"
              style={{
                height: "134px",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>

            <div
              className="position-relative d-inline-block ms-4"
              style={{ marginTop: "-80px" }}
            >
              <img
                src={avatarPreview}
                alt="Profile"
                className="avatar rounded-circle"
              />

              {/* Upload Icon Overlay */}
              <div
                className="position-absolute d-flex align-items-center justify-content-center bg-white border rounded-circle shadow"
                style={{
                  width: "35px",
                  height: "36px",
                  marginTop: "-50px",
                  right: "10px",
                  transform: "translate(25%, 25%)",
                  cursor: "pointer",
                }}
                onClick={() => fileInputRef.current.click()}
              >
                <img src={UploadIcon} alt="upload-icon" />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="row">
          {/* Left Column - Basic Info */}
          <div className="d-flex align-items-center justify-content-between mb-4 border-bottom">
            <div>
              <h4 className="name fw-bold m-0 text-center text-capitalize m-2">
                {profileData?.data
                  ? `${profileData.data.first_name} ${profileData.data.last_name}`
                  : "N/A"}
              </h4>{" "}
            </div>
            <div className="d-flex gap-2">
              <CustomButton
                label={saving ? "Saving..." : "Save Details"}
                onClick={handleSave}
                disabled={saving}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-4">
              <div className="mb-4">
                <div className="mb-2 d-flex justify-content-between">
                  <CustomTextField
                    label={"First Name"}
                    placeholder="First Name"
                    className="w-100"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                  />
                </div>

                <div className="mb-2 d-flex justify-content-between">
                  <CustomTextField
                    label={"Last Name"}
                    placeholder="Last Name"
                    className="w-100"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                  />
                </div>

                <div className="mb-2 d-flex justify-content-between">
                  <CustomTextField
                    label={"Phone Number:"}
                    placeholder="+1 234 567 890"
                    className="w-100"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>

                <div className="mb-2">
                  <label className="fw-bold mb-2">Location:</label>
                  <PlacesAutocomplete
                    value={formData.location}
                    onChange={(value) => handleInputChange("location", value)}
                    onSelect={async (value) => {
                      handleInputChange("location", value);
                      try {
                        const results = await geocodeByAddress(value);
                        const latLng = await getLatLng(results[0]);
                        handleInputChange("latitude", latLng.lat.toString());
                        handleInputChange("longitude", latLng.lng.toString());
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
                              ? {
                                  backgroundColor: "#fafafa",
                                  cursor: "pointer",
                                }
                              : {
                                  backgroundColor: "#ffffff",
                                  cursor: "pointer",
                                };
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
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="mb-2 d-flex justify-content-between">
              <CustomTextField
                label={"Website:"}
                placeholder="Website"
                className="w-100"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
              />
            </div>
            <div className="mb-3 d-flex justify-content-between">
              <div className="mb-3 w-100">
                <label className="form-label fw-semibold">Bio:</label>
                <textarea
                  className="form-control bgofTextFields"
                  rows={4}
                  placeholder="Bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
