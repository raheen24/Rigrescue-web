import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import PublicRoutes from "./PublicRoutes";
import RoleSelectionPage from "../pages/RoleSelectionPage";
import SignIn from "../auth/SignIn";
import CreateAccount from "../auth/CreateAccount";
import ForgotPassword from "../auth/ForgotPassword";
import OTPVerificationPage from "../auth/OTPVerificationPage";
import ChangePassword from "../auth/ChangePassword";
import TermsAndConditions from "../components/TermsAndConditions";
import PrivacyPolicy from "../components/PrivacyPolicy";
import Dashboard from "../pages/Dashboard";
import ShopDashboard from "../pages/ShopDashboard";
import MyDrivers from "../pages/MyDrivers";
import Layout from "../components/Layout";
import DriverDetails from "../pages/DriverDetails";
import EditDriversAccount from "../pages/EditDriversAccount";
import AddNewDriver from "../pages/AddNewDriver";
import TrackDriver from "../pages/TrackDriver";
import JobsPageFleet from "../pages/JobsPageFleet";
import JobDetails from "../pages/JobDetails";
import BudgetRuquests from "../pages/BudgetRequests";
import Messages from "../pages/Messages";
import SettingsPage from "../pages/SettingsPage";
import MyProfile from "../pages/MyProfile";
import EditMyProfile from "../pages/EditMyProfile";
import MyMechanics from "../pages/MyMechanics";
import OrdersManagement from "../pages/OrdersManagement";
import MechanicJobs from "../pages/MechanicJobs";
import InventoryManagement from "../pages/InventoryManagement";
import MechanicAccountPage from "../pages/MechanicAccountPage";
import TrackMechanic from "../pages/TrackMechanic";
import AddNewMechanic from "../pages/AddNewMechanic";
import EditMechanicsAccount from "../pages/EditMechanicsAccount";
import RatingsAndReviews from "../pages/RatingsAndReviews";
import OrderDetails from "../pages/OrderDetailsPage";
import MechanicJobDetail from "../pages/MechanicJobDetail";
import PreviousMechanicJobDetail from "../pages/PreviousMechanicJobDetail";
import ProductRequest from "../pages/ProductRequest";
import AddProduct from "../pages/AddProduct";
import ProductDetails from "../pages/ProductDetails";
import EditProduct from "../pages/EditProduct";
import ProfileSetup from "../pages/ProfileSetup";
import AddAccountModal from "../components/AddAccountModal";
import AccountDetails from "../pages/AccountDetails";
import ApprovalScreen from "../pages/ApprovalScreen";
import AddDriver from "../pages/AddDriver";
import AddMechanic from "../pages/AddMechanic";
const Navigation = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoutes />}>
          <Route path={"/"} element={<RoleSelectionPage />} />
          <Route path={"/auth/sign-in-fleet"} element={<SignIn />} />
          <Route path={"/auth/create-account"} element={<CreateAccount />} />
          <Route path={"/auth/create-account-shop"} element={<CreateAccount />} />
          <Route
            path={"/auth/forgot-password"}
            element={<ForgotPassword />}
          />
          <Route
            path={"/auth/verification-page"}
            element={<OTPVerificationPage />}
          />
          <Route
            path={"/auth/change-password"}
            element={<ChangePassword />}
          />
          <Route
            path={"/terms-and-conditions"}
            element={<TermsAndConditions />}
          />
          <Route path={"/privacy-policy"} element={<PrivacyPolicy />} />

          <Route path={"/auth/sign-in-shop"} element={<SignIn />} />
          <Route path={"/profile-setup"} element={<ProfileSetup />} />
          <Route path={"/account-details"} element={<AccountDetails />} />
          <Route path={"/approval-screen"} element={<ApprovalScreen />} />
          <Route path={"/add-driver"} element={<AddDriver />} />
          <Route path={"/shop-owner/add-mechanic"} element={<AddMechanic />} />

          <Route
            path={"/components/add-account-modal"}
            element={<AddAccountModal />}
          />
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route element={<Layout />}>
            <Route path={"/fleet/dashboard"} element={<Dashboard />} />
            <Route path={"/fleet/my-drivers"} element={<MyDrivers />} />
            <Route
              path={"/fleet/my-drivers-detail/:id"}
              element={<DriverDetails />}
            />
            <Route
              path={"/fleet/edit-drivers-account/:id"}
              element={<EditDriversAccount />}
            />
            <Route path={"/fleet/add-new-driver"} element={<AddNewDriver />} />
            <Route path={"/fleet/track-driver"} element={<TrackDriver />} />
            <Route path={"/fleet/jobs-page"} element={<JobsPageFleet />} />
            <Route path={"/fleet/jobs-details"} element={<JobDetails />} />
            <Route path={"/fleet/budget-requests"} element={<BudgetRuquests />} />
            <Route path={"/fleet/messages"} element={<Messages />} />
            <Route path={"/fleet/settings"} element={<SettingsPage />} />
            <Route path={"/fleet/my-profile"} element={<MyProfile />} />
            <Route path={"/fleet/edit-profile"} element={<EditMyProfile />} />

            {/* shop routes */}
            <Route path="/shop/dashboard" element={<Navigate to="/shop-owner/dashboard" replace />} />
            <Route path={"/shop-owner/dashboard"} element={<ShopDashboard />} />

            <Route path={"/shop-owner/messages"} element={<Messages />} />
            <Route path={"/shop-owner/settings"} element={<SettingsPage />} />
            <Route path={"/shop-owner/my-profile"} element={<MyProfile />} />
            <Route path={"/shop-owner/edit-profile"} element={<EditMyProfile />} />
            <Route path={"/shop-owner/my-mechanics"} element={<MyMechanics />} />
            <Route
              path={"/shop-owner/orders-management"}
              element={<OrdersManagement />}
            />
            <Route path={"/shop-owner/mechanic-jobs"} element={<MechanicJobs />} />
            <Route
              path={"/shop-owner/inventory-management"}
              element={<InventoryManagement />}
            />
            <Route path={"/shop-owner/add-new-mechanic"} element={<AddNewMechanic />} />
            <Route
              path={"/shop-owner/mechanic-account/:id"}
              element={<MechanicAccountPage />}
            />
            <Route path={"/shop-owner/track-mechanic"} element={<TrackMechanic />} />
            <Route
              path={"/shop-owner/edit-mechanics-account/:id"}
              element={<EditMechanicsAccount />}
            />
            <Route
              path={"/shop-owner/ratings-and-reviews"}
              element={<RatingsAndReviews />}
            />
            <Route path={"/shop-owner/order-details"} element={<OrderDetails />} />
            <Route
              path={"/shop-owner/mechanic-job-details"}
              element={<MechanicJobDetail />}
            />
            <Route
              path={"/shop-owner/previous-mechanic-job-details"}
              element={<PreviousMechanicJobDetail />}
            />
            <Route path={"/shop-owner/product-request"} element={<ProductRequest />} />
            <Route path={"/shop-owner/add-product"} element={<AddProduct />} />
            <Route path={"/shop-owner/product-details/:id"} element={<ProductDetails />} />
            <Route path={"/shop-owner/edit-product/:id"} element={<EditProduct />} />

            {/* end */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Navigation;
