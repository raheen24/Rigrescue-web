import { useNavigate, useOutletContext } from "react-router-dom";
import CustomButton from "../components/GlobalBtn";
import profileImage from "../assets/images/profile-image.png";
import DeleteAccountModal from "../components/DeleteModal";
import { useState } from "react";
import { useProfileQuery, useDeleteProfileMutation } from "../services/apiQueries";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../redux/userslice";
import { deleteCookie } from "../utils";
import { _capitalize } from "chart.js/helpers";
import LoadingSpinner from "../components/LoadingSpinner";

export default function MyProfile() {
  const navigate = useNavigate();
  const isSideBarOpen = useOutletContext();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.user.role);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const { data: profileData, isLoading, error } = useProfileQuery();
  const deleteMutation = useDeleteProfileMutation();

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Account deleted successfully");
        dispatch(setLogout());
        deleteCookie("token");
        navigate("/");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
    setDeleteModalOpen(false);
  };
  if (isLoading) {
    return (
      <div
        className={`content_section ${
          isSideBarOpen ? "" : "content_section_close"
        } home_page`}
      >
        <div className="innerWrapper h-[100vh] rounded-3">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`content_section ${
          isSideBarOpen ? "" : "content_section_close"
        } home_page full-height`}
      >
        <div className="innerWrapper profileWrapper rounded-3 backgroundOfMY shadow-sm d-flex justify-content-center align-items-center">
          <h4>Error loading profile: {error.message}</h4>
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
      <div className="innerWrapper profileWrapper rounded-3 backgroundOfMY shadow-sm h-100">
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

            <img
              src={profileData?.data?.avatar || profileImage}
              alt="Profile"
              className="avatar rounded-circle position-absolute ms-4"
              style={{
                // width: "160px",
                // height: "160px",
                marginTop: "-80px",
              }}
            />
          </div>
        </div>

        {/* Profile Content */}
        <div className="row ">
          {/* Left Column - Basic Info */}
          <div className="d-flex align-items-end justify-content-between mb-4 mt-5 border-bottom py-2">
            <div>
              <h4
                className="name fw-bold m-0 text-center text-capitalize m-2"
              >
                {profileData?.data
                  ? `${profileData.data.first_name} ${profileData.data.last_name}`
                  : "N/A"}
              </h4>
            </div>
            <div className="d-flex align-items-center gap-2 w-fit">
              <CustomButton
                label=" Delete Account"
                className="cta py-2 secondary-btn whitespace-nowrap"
                onClick={() => setDeleteModalOpen(true)}
              />
              <DeleteAccountModal
                open={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
              />
              <CustomButton
                label="Edit Details"
                className="py-2 px-3"
                onClick={() => {
                  const editPath = role === "shop_owner" ? "/shop-owner/edit-profile" : "/fleet/edit-profile";
                  navigate(editPath);
                }}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-4">
              <div className="mb-4">
                <div className="mb-3 d-flex justify-content-between border-bottom gap-2">
                  <p className="text-muted mb-1">Email Address:</p>
                  <p className="fw-medium text-end">{profileData?.data?.email || "N/A"}</p>
                </div>

                <div className="mb-3 d-flex justify-content-between border-bottom gap-2">
                  <p className="text-muted mb-1">Phone Number:</p>
                  <p className="fw-medium text-end">{profileData?.data?.phone || "N/A"}</p>
                </div>

                {/* <div className="mb-3 d-flex justify-content-between border-bottom">
                  <p className="text-muted mb-1">Role:</p>
                  <p className="fw-medium">{profileData?.data?.role || "N/A"}</p>
                </div> */}

                <div className="mb-3 d-flex justify-content-between border-bottom gap-2">
                  <p className="text-muted mb-1">Website:</p>
                  <p className="fw-medium text-end">{profileData?.data?.website || "N/A"}</p>
                </div>

                <div className="mb-3 d-flex justify-content-between gap-2">
                  <p className="text-muted mb-1">Location:</p>
                  <p className="fw-medium text-end">{profileData?.data?.location || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 ps-md-4">
            <div className="mb-4">
              <p className="text-muted mb-1">Bio:</p>
              <p className="mb-3">{profileData?.data?.bio || "No bio available."}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
