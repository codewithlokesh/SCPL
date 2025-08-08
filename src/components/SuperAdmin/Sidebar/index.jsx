import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaSignOutAlt, 
  FaChevronRight, 
  FaChevronDown, 
  FaList, 
  FaCheck, 
  FaEdit, 
  FaBullhorn,
  FaEllipsisH,
  FaTachometerAlt,
  FaUsers,
  FaCog,
  FaBuilding,
  FaUserTie,
  FaGlobe,
  FaCalendarAlt,
  FaBox,
  FaChartBar,
  FaMoneyBillWave,
  FaHeadset,
  FaIndustry,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaClock,
  FaFlag,
  FaCalendarCheck,
  FaUserClock,
  FaBoxes,
  FaTags,
  FaRuler,
  FaPalette,
  FaCheckCircle,
  FaBars,
  FaSignOutAlt as FaLogout
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { logout } from '../../../redux/AuthSlice/index.slice';
import './index.css';

const sidebarItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Users', path: '/users' },
  { name: 'Settings', path: '/settings' },
];

const navbarItems = [
  { 
    name: 'Admin Panel', 
    path: '/superadmin/dashboard', 
    icon: FaTachometerAlt,
    hasDropdown: false
  },
  { 
    name: 'Account Master', 
    // path: '/superadmin/masters', 
    icon: FaMoneyBillWave,
    hasDropdown: true,
    dropdownItems: [
      { name: 'TransactionType', path: '/superadmin/masters?type=TransactionType', icon: FaList },
      { name: 'TransactionMethod', path: '/superadmin/masters?type=TransactionMethod', icon: FaCheck },
      { name: 'TaxTypeName', path: '/superadmin/masters?type=TaxTypeName', icon: FaChartBar },
      { name: 'BankName', path: '/superadmin/masters?type=BankName', icon: FaBuilding },
    ]
  },
  { 
    name: 'Company Master', 
    // path: '/superadmin/company', 
    icon: FaBuilding,
    hasDropdown: true,
    dropdownItems: [
      { name: 'Company', path: '/superadmin/company', icon: FaBuilding },
      { name: 'Division', path: '/superadmin/masters?type=Division', icon: FaBuilding },
    ]
  },
  { 
    name: 'CRM Master', 
    // path: '/superadmin/masters', 
    icon: FaHeadset,
    hasDropdown: true,
    dropdownItems: [
      { name: 'QueryStatus', path: '/superadmin/masters?type=QueryStatus', icon: FaCheckCircle },
      { name: 'QueryPriority', path: '/superadmin/masters?type=QueryPriority', icon: FaBullhorn },
      { name: 'QuerySource', path: '/superadmin/masters?type=QuerySource', icon: FaIndustry },
      { name: 'QueryDealStatus', path: '/superadmin/masters?type=QueryDealStatus', icon: FaChartBar },
    ]
  },
  { 
    name: 'Employee Master', 
    // path: '/superadmin/masters', 
    icon: FaUserTie,
    hasDropdown: true,
    dropdownItems: [
      { name: 'Department', path: '/superadmin/masters?type=Department', icon: FaBuilding },
      { name: 'Designation', path: '/superadmin/masters?type=Designation', icon: FaGraduationCap },
      { name: 'EmployeeType', path: '/superadmin/masters?type=EmployeeType', icon: FaUsers },
      { name: 'EmploymentStatus', path: '/superadmin/masters?type=EmploymentStatus', icon: FaCheckCircle },
      { name: 'WorkLocation', path: '/superadmin/masters?type=WorkLocation', icon: FaMapMarkerAlt },
      { name: 'Shift', path: '/superadmin/masters?type=Shift', icon: FaClock },
    ]
  },
  { 
    name: 'General Master', 
    // path: '/superadmin/masters', 
    icon: FaGlobe,
    hasDropdown: true,
    dropdownItems: [
      { name: 'Country', path: '/superadmin/country', icon: FaFlag },
      { name: 'State', path: '/superadmin/state', icon: FaMapMarkerAlt },
      { name: 'City', path: '/superadmin/city', icon: FaMapMarkerAlt },
    ]
  },
  { 
    name: 'HR Master', 
    // path: '/superadmin/masters', 
    icon: FaCalendarAlt,
    hasDropdown: true,
    dropdownItems: [
      { name: 'LeaveType', path: '/superadmin/masters?type=LeaveType', icon: FaCalendarCheck },
      { name: 'Holiday', path: '/superadmin/masters?type=Holiday', icon: FaCalendarAlt },
      { name: 'AttendanceStatus', path: '/superadmin/masters?type=AttendanceStatus', icon: FaUserClock },
    ]
  },
  { 
    name: 'Product Master', 
    // path: '/superadmin/masters', 
    icon: FaBox,
    hasDropdown: true,
    dropdownItems: [
      { name: 'ProductCategory', path: '/superadmin/masters?type=ProductCategory', icon: FaBoxes },
      { name: 'ProductSubCategory', path: '/superadmin/masters?type=ProductSubCategory', icon: FaTags },
      { name: 'ProductType', path: '/superadmin/masters?type=ProductType', icon: FaBox },
      { name: 'ProductBrand', path: '/superadmin/masters?type=ProductBrand', icon: FaIndustry },
      { name: 'ProductUOM', path: '/superadmin/masters?type=ProductUOM', icon: FaRuler },
      { name: 'ProductPackingType', path: '/superadmin/masters?type=ProductPackingType', icon: FaBoxes },
      { name: 'ProductSize', path: '/superadmin/masters?type=ProductSize', icon: FaRuler },
      { name: 'ProductColor', path: '/superadmin/masters?type=ProductColor', icon: FaPalette },
      { name: 'ProductStatus', path: '/superadmin/masters?type=ProductStatus', icon: FaCheckCircle },
    ]
  },
  { 
    name: 'Logout', 
    icon: FaLogout,
    hasDropdown: false,
  },
];

const fabItems = [
  { icon: FaList, color: '#dc3545', tooltip: 'List' },
  { icon: FaCheck, color: '#28a745', tooltip: 'Check' },
  { icon: FaEdit, color: '#ffc107', tooltip: 'Edit' },
  { icon: FaBullhorn, color: '#17a2b8', tooltip: 'Announce' },
];

const AdminSidebar = () => {
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [isFabExpanded, setIsFabExpanded] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
   
  useEffect(() => {
    const currentPath = location.pathname + location.search;
    navbarItems.forEach(item => {
      if (item.hasDropdown && item.dropdownItems) {
        const hasActiveChild = item.dropdownItems.some(dropdownItem => 
          dropdownItem.path === currentPath
        );
        if (hasActiveChild) {
          setExpandedItems(prev => new Set([...prev, item.name]));
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
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  };

  const toggleFab = () => {
    setIsFabExpanded(!isFabExpanded);
  };

  const isDropdownItemActive = (dropdownPath) => {
    const currentPath = location.pathname + location.search;
    return currentPath === dropdownPath;
  };

  const isParentDropdownActive = (item) => {
    if (!item.hasDropdown || !item.dropdownItems) return false;
    const currentPath = location.pathname + location.search;
    return item.dropdownItems.some(dropdownItem => dropdownItem.path === currentPath);
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
    <div className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div style={{ 
        background: '#101924', 
        color: '#fff', 
        padding: isCollapsed ? '10px' : '10px 10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #333'
      }}>
        {!isCollapsed && (
          <h2 style={{ color: '#61dafb', margin: 0, fontSize: '1.5rem' }}>SCPL</h2>
        )}
        <button 
          className="toggle-button"
          onClick={toggleCollapse}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          style={{ 
            marginLeft: 'auto',
            marginRight: isCollapsed ? 'auto' : '0'
          }}
        >
           <FaBars />
        </button>
      </div>

      <nav className="admin-sidebar-nav">
        {navbarItems.map(item => (
          <div key={item.path || item.name}>
            <div
              className="nav-item"
              onClick={(e) => {
                if (item.hasDropdown) {
                  handleDropdownClick(e, item.name);
                } else if (item.name === 'Logout') {
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
                      <span className={`nav-item-text ${isParentDropdownActive(item) ? 'active' : ''}`}>
                        {item.name}
                      </span>
                    ) : item.name === 'Logout' ? (
                      <span className="nav-item-text">
                        {item.name}
                      </span>
                    ) : (
                      <NavLink
                        to={item.path}
                        className={({ isActive }) => `nav-item-text ${isActive ? 'active' : ''}`}
                      >
                        {item.name}
                      </NavLink>
                    )}
                  </>
                )}
              </div>
              {!isCollapsed && item.hasDropdown && (
                <span className={`nav-item-dropdown-icon ${isParentDropdownActive(item) ? 'active' : ''}`}>
                  {expandedItems.has(item.name) ? <FaChevronDown /> : <FaChevronRight />}
                </span>
              )}
            </div>
            
            {!isCollapsed && item.hasDropdown && expandedItems.has(item.name) && (
              <div className="dropdown-container">
                {item.dropdownItems.map((dropdownItem, index) => {
                  const isActive = isDropdownItemActive(dropdownItem.path);
                  return (
                    <NavLink
                      key={dropdownItem.path}
                      to={dropdownItem.path}
                      className={`dropdown-item ${isActive ? 'active' : ''}`}
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

export default AdminSidebar; 