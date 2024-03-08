import React, { useState, useEffect } from 'react';
import { NavLink, useLocation,useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext'; 
const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[1]; // Extract the first part of the pathname
  const navigate = useNavigate();
  const { currentUser, logout, removeUser } = useAuth(); 
  const [activeLink, setActiveLink] = useState('');
  const [unreadAnnouncements, setUnreadAnnouncements] = useState(0); 


  useEffect(() => {
    setActiveLink(currentPath || 'admindashboard'); 
    fetchUnreadAnnouncements(); 
  }, [currentPath]);

  const fetchUnreadAnnouncements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost/purok/Fetchresidentannouncement.php', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUnreadAnnouncements(data.unreadAnnouncements || 0);
      } else {
        console.error('Failed to fetch unread announcements:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching unread announcements:', error);
    }
  };

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

      <NavLink to="/residentprofile"  onClick={() => setActiveLink('dashboard')}>
        <span className="material-icons-sharp">account_circle</span>
        <h3>Profile</h3>
      </NavLink>

      <NavLink to="/requestdocument"  onClick={() => setActiveLink('dashboard')}>
        <span className="material-icons-sharp">description</span>
        <h3>Request Document</h3>
      </NavLink>

      <NavLink to="/announcement"  onClick={() => { setActiveLink('dashboard'); setUnreadAnnouncements(0); }}>
        <span className="material-icons-sharp">announcement</span>
        <h3>Announcements {unreadAnnouncements > 0 && <span className="badge">{unreadAnnouncements}</span>}</h3>
      </NavLink>
    
      <NavLink   onClick={() => handleLogout}>
        <span className="material-icons-sharp" onClick={handleLogout}>logout</span>
        <h3 onClick={handleLogout}>Logout</h3>
      </NavLink>
    </div>
  );
};

export default Sidebar;
