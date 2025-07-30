import React from 'react';
import { NavLink } from 'react-router-dom';

const sidebarItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Users', path: '/users' },
  { name: 'Settings', path: '/settings' },
];

const AdminSidebar = () => {
  return (
    <div style={{ width: 220, background: '#222', color: '#fff', minHeight: '100vh', padding: '2rem 1rem' }}>
      <h2 style={{ color: '#61dafb', marginBottom: '2rem' }}>Admin</h2>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {sidebarItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              color: isActive ? '#61dafb' : '#fff',
              textDecoration: 'none',
              fontWeight: isActive ? 'bold' : 'normal',
              fontSize: '1.1rem',
            })}
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar; 