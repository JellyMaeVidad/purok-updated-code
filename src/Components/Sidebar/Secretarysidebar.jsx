import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const Presidentsidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[1]; // Extract the first part of the pathname
  const navigate = useNavigate();
  const {  logout, removeUser } = useAuth();
  const [activeLink, setActiveLink] = useState('');
  const [unreadAnnouncements, setUnreadAnnouncements] = useState(0); 

  useEffect(() => {
    setActiveLink(currentPath || 'admindashboard'); 
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


      <NavLink to="/secretaryprofile" onClick={() => setActiveLink('dashboard')}>
        <span className="material-icons-sharp">account_circle</span>
        <h3>Profile</h3>
      </NavLink>
      <NavLink to="/secretaryrequest" onClick={() => { setActiveLink('dashboard')}}>
        <span className="material-icons-sharp">outbox</span>
        <h3>Request</h3>
      </NavLink>
      <NavLink to="/sendrequest" onClick={() => { setActiveLink('dashboard')}}>
        <span className="material-icons-sharp">announcement</span>
        <h3>Send request</h3>
      </NavLink>


      <NavLink onClick={() => handleLogout}>
        <span className="material-icons-sharp" onClick={handleLogout}>logout</span>
        <h3 onClick={handleLogout}>Logout</h3>
      </NavLink>
    </div>
  );
};

export default Presidentsidebar;
