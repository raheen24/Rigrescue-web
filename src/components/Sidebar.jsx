import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../assets/images/rigrescue-logo.png";
import homeIcon from "../assets/images/dashboard-icon.png";
import homeIconActive from "../assets/images/home-icon.png";
import msgIcon from "../assets/images/messages-icon.png";
import msgActive from "../assets/images/messages-active.png";
import mydrivers from "../assets/images/mydrivers-icon.png";
import mydriversAc from "../assets/images/mydrivers-icon-active.png";
import stngsIcon from "../assets/images/Setting-icon.png";
import stngsActive from "../assets/images/Setting-active.png";
import LogoutIcon from "../assets/images/logout-icon.png";
import jobsIcon from "../assets/images/jobs-icon.png";
import jobsActive from "../assets/images/jobs-active.png";
import budgetIcon from "../assets/images/dollar-icon.png";
import budgetIconActive from "../assets/images/dollar-active.png";

import { NavLink } from "react-router-dom";

const Sidebar = ({ isSideBarOpen, toggleSidebar, closeSidebar, isMobile, logoutModalOpen, setLogoutModalOpen }) => {
  const location = useLocation();
  const role = useSelector((state) => state.user.role);
  const isShop = role && (role === "shop_owner" || role === "shop");
  const isFleet = role && (role === "fleet_manager" || role === "fleet");

  return (
    <aside className={`aside ${isSideBarOpen ? 'open' : 'closed'}`}>
      <div className="logoSect">
        <Link to={isFleet ? "/fleet/dashboard" : "/shop-owner/dashboard"}>
          <img src={logo} alt="logo" />
        </Link>
      </div>

      <ul className="nav__links">
        {isFleet && (
          <>
            <li>
              <NavLink
                to="/fleet/dashboard"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="icons">
                  <img src={homeIcon} className="default_icons" alt="" />
                  <img src={homeIconActive} className="active_icons" alt="" />
                </span>
                <span>Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/fleet/my-drivers"
                isActive={(match, location) => {
                  return location.pathname.startsWith('/fleet/') &&
                         (location.pathname.includes('drivers') || location.pathname.includes('driver'));
                }}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="icons">
                  <img src={mydrivers} className="default_icons" alt="" />
                  <img src={mydriversAc} className="active_icons" alt="" />
                </span>
                <span>My Drivers</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/fleet/jobs-page"
                isActive={(match, location) => {
                  return match || location.pathname === '/fleet/jobs-details';
                }}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="icons">
                  <img src={jobsIcon} className="default_icons" alt="" />
                  <img src={jobsActive} className="active_icons" alt="" />
                </span>
                <span>Jobs</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/fleet/budget-requests"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="icons">
                  <img src={budgetIcon} className="default_icons" alt="" />
                  <img src={budgetIconActive} className="active_icons" alt="" />
                </span>
                <span>Budget Request</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/fleet/messages"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="icons">
                  <img src={msgIcon} className="default_icons" alt="" />
                  <img src={msgActive} className="active_icons" alt="" />
                </span>
                <span>Messages</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/fleet/settings"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="icons">
                  <img src={stngsIcon} className="default_icons" alt="" />
                  <img src={stngsActive} className="active_icons" alt="" />
                </span>
                <span>Settings</span>
              </NavLink>
            </li>
          </>
        )}

        {isShop && (
          <>
            <li>
              <NavLink
                to="/shop-owner/dashboard"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="icons">
                  <img src={homeIcon} className="default_icons" alt="" />
                  <img src={homeIconActive} className="active_icons" alt="" />
                </span>
                <span>Home</span>
              </NavLink>
            </li>

            {/* Add more shop-specific links here */}
            <li>
              <NavLink
                to="/shop-owner/my-mechanics"
                isActive={(match, location) => {
                  return match ||
                         location.pathname === '/shop-owner/mechanic-account' ||
                         location.pathname === '/shop-owner/add-new-mechanic' ||
                         location.pathname === '/shop-owner/edit-mechanics-account' ||
                         location.pathname === '/shop-owner/track-mechanic' ||
                         location.pathname === '/shop-owner/ratings-and-reviews';
                }}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="icons">
                  <img src={mydrivers} className="default_icons" alt="" />
                  <img src={mydriversAc} className="active_icons" alt="" />
                </span>
                <span>My Mechanics</span>
              </NavLink>
            </li>
            {/* <li>
              <NavLink
                to="/shop-owner/order-management"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="icons">
                  <img src={jobsIcon} className="default_icons" alt="" />
                  <img src={jobsActive} className="active_icons" alt="" />
                </span>
                <span>Jobs</span>
              </NavLink>
            </li> */}
            {/* <li>
              <NavLink
                to="/shop-owner/orders-management"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="icons">
                  <img src={budgetIcon} className="default_icons" alt="" />
                  <img src={budgetIconActive} className="active_icons" alt="" />
                </span>
                <span>Order Management</span>
              </NavLink>
            </li> */}
            <li>
              <NavLink
                to="/shop-owner/mechanic-jobs"
                isActive={(match, location) => {
                  return match || location.pathname === '/shop-owner/mechanic-job-details' || location.pathname === '/shop-owner/previous-mechanic-job-details';
                }}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="icons">
                  <img src={budgetIcon} className="default_icons" alt="" />
                  <img src={budgetIconActive} className="active_icons" alt="" />
                </span>
                <span>Mechanic Jobs</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/shop-owner/inventory-management"
                isActive={(match, location) => {
                  return match ||
                         location.pathname === '/shop-owner/product-details' ||
                         location.pathname === '/shop-owner/edit-product' ||
                         location.pathname === '/shop-owner/add-product' ||
                         location.pathname === '/shop-owner/product-request';
                }}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="icons">
                  <img src={budgetIcon} className="default_icons" alt="" />
                  <img src={budgetIconActive} className="active_icons" alt="" />
                </span>
                <span>Inventory Management</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/shop-owner/messages"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="icons">
                  <img src={msgIcon} className="default_icons" alt="" />
                  <img src={msgActive} className="active_icons" alt="" />
                </span>
                <span>Messages</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/shop-owner/settings"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="icons">
                  <img src={stngsIcon} className="default_icons" alt="" />
                  <img src={stngsActive} className="active_icons" alt="" />
                </span>
                <span>Settings</span>
              </NavLink>
            </li>
          </>
        )}

        <li className="logOut">
          <button
            onClick={() => setLogoutModalOpen(true)}
            className="d-flex align-items-center justify-content-start text-decoration-none w-100 bg-transparent border-0"
          >
            <span className="icons me-2">
              <img src={LogoutIcon} alt="Logout" />
            </span>
            <span className="logoutColor">Logout</span>
          </button>
        </li>
      </ul>

      <button className="menuclose" onClick={closeSidebar}>
        x
      </button>
    </aside>
  );
};

export default Sidebar;
