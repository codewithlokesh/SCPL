import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaUser, FaSignOutAlt } from 'react-icons/fa';

const navbarItems = [
  { name: 'Admin Panel', path: '/dashboard', icon: '📁' },
  { name: 'Manage Masters', path: '/masters', icon: '🔗' },
  { name: 'Logout', path: '/logout', icon: '🚪' },
];

const AdminNavbar = () => {
  return (
    <div style={{ 
      background: '#222', 
      color: '#fff', 
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #333'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h2 style={{ color: '#61dafb', margin: 0, fontSize: '1.5rem' }}>SCPL</h2>
        <button style={{
          background: 'none',
          border: 'none',
          color: '#fff',
          fontSize: '1.2rem',
          cursor: 'pointer',
          padding: '0.5rem'
        }}>
          <FaBars />
        </button>
      </div>

      {/* <nav style={{ display: 'flex', gap: '2rem' }}>
        {navbarItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              color: isActive ? '#61dafb' : '#fff',
              textDecoration: 'none',
              fontWeight: isActive ? 'bold' : 'normal',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            })}
          >
            <span>{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button style={{
          background: 'none',
          border: 'none',
          color: '#fff',
          fontSize: '1.2rem',
          cursor: 'pointer',
          padding: '0.5rem'
        }}>
          <FaUser />
        </button>
        <button style={{
          background: '#007bff',
          border: 'none',
          color: '#fff',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.9rem'
        }}>
          <FaSignOutAlt />
          Logout
        </button>
      </div> */}
    </div>
  );
};

export default AdminNavbar; 