import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaChevronRight,
  FaChevronDown,
  FaTachometerAlt,
  FaBars,
  FaBox,
  FaUser,
  FaUserTie,
  FaSignOutAlt as FaLogout,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/AuthSlice/index.slice";
import "./index.css";

const navbarItems = [
  {
    name: "Employee Panel",
    path: "/employee/dashboard",
    icon: FaTachometerAlt,
    hasDropdown: false,
  },
  {
    name: "Manage Profile",
    icon: FaBox,
    hasDropdown: true,
    dropdownItems: [
      {
        name: "Reset Password",
        path: "/Employee/reset-password",
        icon: FaUser,
      },
      { name: "Edit Profile", path: "/Employee/edit-profile", icon: FaUserTie },
    ],
  },
  {
    name: "Manage Leave",
    icon: FaBox,
    hasDropdown: true,
    dropdownItems: [
      {
        name: "Leave Request",
        path: "/Employee/leave-request",
        icon: FaUser,
      },
    ],
  },
  {
    name: "Logout",
    icon: FaLogout,
    hasDropdown: false,
  },
];

const EmployeeSidebar = () => {
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = location.pathname + location.search;
    navbarItems.forEach((item) => {
      if (item.hasDropdown && item.dropdownItems) {
        const hasActiveChild = item.dropdownItems.some(
          (dropdownItem) => dropdownItem.path === currentPath
        );
        if (hasActiveChild) {
          setExpandedItems((prev) => new Set([...prev, item.name]));
        }
      }
    });
  }, [location]);

  const toggleDropdown = (itemName) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(itemName)) {
      // If clicking on an already open dropdown, close it
      newExpandedItems.delete(itemName);
    } else {
      // If clicking on a closed dropdown, close all others and open this one
      newExpandedItems.clear(); // Close all other dropdowns
      newExpandedItems.add(itemName); // Open only the clicked one
      newExpandedItems.add(itemName);
    }
    setExpandedItems(newExpandedItems);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    // Add/remove class to body to handle layout adjustments
    if (!isCollapsed) {
      document.body.classList.add("sidebar-collapsed");
    } else {
      document.body.classList.remove("sidebar-collapsed");
    }
  };

  const isDropdownItemActive = (dropdownPath) => {
    const currentPath = location.pathname + location.search;
    return currentPath === dropdownPath;
  };

  const isParentDropdownActive = (item) => {
    if (!item.hasDropdown || !item.dropdownItems) return false;
    const currentPath = location.pathname + location.search;
    return item.dropdownItems.some(
      (dropdownItem) => dropdownItem.path === currentPath
    );
  };

  const handleDropdownClick = (e, itemName) => {
    // Prevent text selection and default behavior
    e.preventDefault();
    e.stopPropagation();

    if (itemName) {
      toggleDropdown(itemName);
    }
  };

  const handleLogout = () => {
    dispatch(logout(navigate));
  };

  return (
    <div className={`employee-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div
        style={{
          background: "#101924",
          color: "#fff",
          padding: isCollapsed ? "10px" : "10px 10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #333",
        }}
      >
        {!isCollapsed && (
          <h2 style={{ color: "#61dafb", margin: 0, fontSize: "1.5rem" }}>
            SCPL
          </h2>
        )}
        <button
          className="toggle-button"
          onClick={toggleCollapse}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          style={{
            marginLeft: "auto",
            marginRight: isCollapsed ? "auto" : "0",
          }}
        >
          <FaBars />
        </button>
      </div>

      <nav className="employee-sidebar-nav">
        {navbarItems.map((item) => (
          <div key={item.path || item.name}>
            <div
              className="nav-item"
              onClick={(e) => {
                if (item.hasDropdown) {
                  handleDropdownClick(e, item.name);
                } else if (item.name === "Logout") {
                  handleLogout();
                } else if (item.path) {
                  // Handle navigation for regular menu items
                  navigate(item.path);
                }
              }}
              onDoubleClick={(e) => {
                // Prevent double-click text selection
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <div className="nav-item-content">
                <span className="nav-item-icon">
                  {React.createElement(item.icon)}
                </span>
                {!isCollapsed && (
                  <>
                    {item.hasDropdown ? (
                      <span
                        className={`nav-item-text ${
                          isParentDropdownActive(item) ? "active" : ""
                        }`}
                      >
                        {item.name}
                      </span>
                    ) : item.name === "Logout" ? (
                      <span className="nav-item-text">{item.name}</span>
                    ) : (
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `nav-item-text ${isActive ? "active" : ""}`
                        }
                      >
                        {item.name}
                      </NavLink>
                    )}
                  </>
                )}
              </div>
              {!isCollapsed && item.hasDropdown && (
                <span
                  className={`nav-item-dropdown-icon ${
                    isParentDropdownActive(item) ? "active" : ""
                  }`}
                >
                  {expandedItems.has(item.name) ? (
                    <FaChevronDown />
                  ) : (
                    <FaChevronRight />
                  )}
                </span>
              )}
            </div>

            {!isCollapsed &&
              item.hasDropdown &&
              expandedItems.has(item.name) && (
                <div className="dropdown-container">
                  {item.dropdownItems.map((dropdownItem, index) => {
                    const isActive = isDropdownItemActive(dropdownItem.path);
                    return (
                      <NavLink
                        key={dropdownItem.path}
                        to={dropdownItem.path}
                        className={`dropdown-item ${isActive ? "active" : ""}`}
                      >
                        <span className="dropdown-item-icon">
                          {React.createElement(dropdownItem.icon)}
                        </span>
                        {dropdownItem.name}
                      </NavLink>
                    );
                  })}
                </div>
              )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default EmployeeSidebar;
