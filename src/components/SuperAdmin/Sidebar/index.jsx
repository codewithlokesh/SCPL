import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaChevronRight, FaChevronDown, FaList, FaCheck, FaEdit, FaBullhorn } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { logout } from '../../../redux/AuthSlice/index.slice';

const sidebarItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Users', path: '/users' },
  { name: 'Settings', path: '/settings' },
];

const navbarItems = [
  { 
    name: 'Admin Panel', 
    // path: '/dashboard', 
    icon: '📁',
    hasDropdown: false
  },
  { 
    name: 'Manage Masters', 
    path: '/masters', 
    icon: '🔗',
    hasDropdown: true,
    dropdownItems: [
      { name: 'Brand Master', path: '/superadmin/masters?type=brand' },
      { name: 'Department Master', path: '/superadmin/masters?type=department' },
      { name: 'Division Master', path: '/superadmin/masters?type=division' },
      { name: 'Designation Master', path: '/superadmin/masters?type=designation' },
      { name: 'Document Master', path: '/superadmin/masters?type=document' },
      { name: 'Employee Type Master', path: '/superadmin/masters?type=employee-type' },
      { name: 'Financial Year Master', path: '/superadmin/masters?type=financial-year' },
      { name: 'Leave Type Master', path: '/superadmin/masters?type=leave-type' },
      { name: "Machinery's Master", path: '/superadmin/masters?type=machinery' },
    ]
  },
  { 
    name: 'Logout', 
    icon: '🚪',
    hasDropdown: false,
    // Remove the onClick from here since it can't access dispatch and navigate
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
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.pathname === '/superadmin/masters' && location.search.includes('type=')) {
      setExpandedItems(prev => new Set([...prev, 'Manage Masters']));
    }
  }, [location]);

  const toggleDropdown = (itemName) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(itemName)) {
      newExpandedItems.delete(itemName);
    } else {
      newExpandedItems.add(itemName);
    }
    setExpandedItems(newExpandedItems);
  };

  const toggleFab = () => {
    setIsFabExpanded(!isFabExpanded);
  };

  const isDropdownItemActive = (dropdownPath) => {
    const currentPath = location.pathname + location.search;
    return currentPath === dropdownPath;
  };

  const isMastersActive = () => {
    return location.pathname === '/superadmin/masters' && location.search.includes('type=');
  };

  const handleLogout = () => {
    dispatch(logout(navigate));
  };

  return (
    <div style={{
      background: '#222',
      color: '#fff',
      width: '250px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #333',
      position: 'relative'
    }}>
      <nav style={{ 
        flex: 1, 
        padding: '1rem 0',
        display: 'flex', 
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        {navbarItems.map(item => (
          <div key={item.path || item.name}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                color: '#fff',
                fontSize: '1rem',
                gap: '0.5rem'
              }}
              onClick={() => {
                if (item.hasDropdown) {
                  toggleDropdown(item.name);
                } else if (item.name === 'Logout') {
                  handleLogout();
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{item.icon}</span>
                {item.hasDropdown ? (
                  <span style={{
                    color: isMastersActive() ? '#61dafb' : '#fff',
                    fontWeight: isMastersActive() ? 'bold' : 'normal',
                  }}>
                    {item.name}
                  </span>
                ) : item.onClick ? (
                  // For items with onClick handlers (like logout), render as a span
                  <span style={{
                    color: '#fff',
                    textDecoration: 'none',
                    fontWeight: 'normal',
                  }}>
                    {item.name}
                  </span>
                ) : (
                  <NavLink
                    to={item.path}
                    style={({ isActive }) => ({
                      color: isActive ? '#61dafb' : '#fff',
                      textDecoration: 'none',
                      fontWeight: isActive ? 'bold' : 'normal',
                    })}
                  >
                    {item.name}
                  </NavLink>
                )}
              </div>
              {item.hasDropdown && (
                <span style={{ 
                  fontSize: '0.8rem',
                  color: isMastersActive() ? '#61dafb' : '#fff'
                }}>
                  {expandedItems.has(item.name) ? <FaChevronDown /> : <FaChevronRight />}
                </span>
              )}
            </div>
            
            {item.hasDropdown && expandedItems.has(item.name) && (
              <div style={{
                background: '#fff',
                margin: '0 1rem',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                {item.dropdownItems.map((dropdownItem, index) => {
                  const isActive = isDropdownItemActive(dropdownItem.path);
                  return (
                    <NavLink
                      key={dropdownItem.path}
                      to={dropdownItem.path}
                      style={{
                        color: isActive ? '#61dafb' : '#333',
                        textDecoration: 'none',
                        fontWeight: isActive ? 'bold' : 'normal',
                        fontSize: '0.9rem',
                        display: 'block',
                        padding: '0.5rem 1rem',
                        borderBottom: index < item.dropdownItems.length - 1 ? '1px solid #eee' : 'none',
                        transition: 'background 0.3s ease',
                        background: isActive ? 'rgba(97, 218, 251, 0.1)' : 'transparent'
                      }}
                    >
                      {dropdownItem.name}
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer - User Profile and Logout */}
      <div style={{ 
        padding: '1rem', 
        borderTop: '1px solid #333',
        display: 'flex', 
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        <button style={{
          background: 'none',
          border: 'none',
          color: '#fff',
          fontSize: '1rem',
          cursor: 'pointer',
          padding: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          width: '100%',
          borderRadius: '4px',
          transition: 'background 0.3s ease'
        }}>
          <FaUser />
          Profile
        </button>
        <button 
          onClick={handleLogout}
          style={{
            background: '#007bff',
            border: 'none',
            color: '#fff',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            width: '100%',
            transition: 'background 0.3s ease'
          }}
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      {/* <div style={{
        position: 'absolute',
        right: '-60px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        alignItems: 'center'
      }}>
        {isFabExpanded && fabItems.map((item, index) => (
          <button
            key={index}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              border: 'none',
              background: item.color,
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease',
              transform: `translateY(${index * 60}px)`,
              animation: 'slideIn 0.3s ease'
            }}
            title={item.tooltip}
          >
            <item.icon />
          </button>
        ))}
        
        <button
          onClick={toggleFab}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: 'none',
            background: '#007bff',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
            transform: isFabExpanded ? 'rotate(45deg)' : 'rotate(0deg)',
            zIndex: 1000
          }}
          title="Add"
        >
          <FaPlus />
        </button>
      </div> */}

      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default AdminSidebar; 