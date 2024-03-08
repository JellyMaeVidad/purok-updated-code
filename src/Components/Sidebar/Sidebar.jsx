import React, { useState, useEffect } from 'react';
import { NavLink, useLocation,useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext'; 
const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[1]; // Extract the first part of the pathname
  const navigate = useNavigate();
  const { currentUser, logout, removeUser } = useAuth(); 
  const [activeLink, setActiveLink] = useState('');


  useEffect(() => {
    setActiveLink(currentPath || 'admindashboard'); // Default to 'admindashboard' if currentPath is empty
  }, [currentPath]);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost/purok/logout.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.ok) {

         logout();
         removeUser();
        console.log('Logout successful');
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        navigate('/'); 
      } else {
    
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="sidebar">
      <NavLink to="/residentdashboard"  onClick={() => setActiveLink('dashboard')}>
        <span className="material-icons-sharp">dashboard</span>
        <h3>Dashboard</h3>
      </NavLink>
    
      <NavLink   onClick={() => handleLogout}>
        <span className="material-icons-sharp" onClick={handleLogout}>logout</span>
        <h3 onClick={handleLogout}>Logout</h3>
      </NavLink>
    </div>
  );
};

export default Sidebar;
