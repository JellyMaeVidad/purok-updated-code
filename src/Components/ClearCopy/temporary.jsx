import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import Sidebar from '../Sidebar/Sidebar';
import { AiFillCaretDown } from 'react-icons/ai';
import axios from 'axios';
import {CiLogout} from 'react-icons/ci'
import {IoMdSettings} from 'react-icons/io';
import {FcSupport} from 'react-icons/fc';

// IMPORTED IMAGES //

import Ayaka from './images/Ayaka.png'
const UserList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const { currentUser, logout, removeUser, getToken } = useAuth();
  const [selectedItem, setSelectedItem] = useState('admindashboard');
  const [users, setUsers] = useState({
    admins: { admins: [] },
    teachers: { teachers: [] },
    students: { students: [] },
  });
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };


  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleLogoutClick = () => {
    
    handleLogout();
    setDropdownOpen(false);
  };
  const token = getToken();
  console.log('Token:', token);

  const handleSelectItem = (item) => {
    if (item === selectedItem) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
    }
  };

  const fetchUserList = async () => {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
    };
  
    console.log('Request Headers:', headers);
  
    try {
      const response = await axios.get('http://localhost/PHP%20school%20system%20backend/userlist.php', {
        headers: headers,
      });
  
      console.log('Response:', response.data);
  
      if (response.data && response.data.success) {
        const usersArray = {
          admins: JSON.parse(response.data.admins),
          teachers: JSON.parse(response.data.teachers),
          students: JSON.parse(response.data.students),
        };
  
        console.log('Admins:', usersArray.admins);
        console.log('Teachers:', usersArray.teachers);
        console.log('Students:', usersArray.students);
  
       
        setUsers(usersArray);
      } else {
        console.error('Failed to fetch user data: "success" property is missing in the response');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  
  
  
  console.log('Users State:', users);

  useEffect(() => {
    console.log('Effect triggered'); // Add this line for debugging
    const userData = JSON.parse(localStorage.getItem('user'));
    const name = location.state?.firstName || userData?.firstName || '';
    setFirstName(name || (currentUser ? currentUser.firstName : ''));
    
    fetchUserList();
  }, [location.state, currentUser]);
  

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost/PHP%20school%20system%20backend/logout.php', {
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
        navigate('/adminlogin');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='fordashboard'>
    <div className="container" >
     <aside className={isMenuOpen ? 'open' : ''}>
     <div className="toggle">
     <div className="logo">
       <span class="material-icons-sharp">
          face
          </span>
           <h2>School<span className="danger">System</span></h2>
       </div>
       <div className="close" id="close-btn" onClick={handleCloseMenu}>
           <span className="material-icons-sharp">
               close
           </span>
       </div>
   </div>
    <Sidebar selectedItem={selectedItem} handleSelectItem={handleSelectItem} />
    </aside>
  

     <main>
     <div className="dashboardMainContent">
       <div className="dashboardTopContent">
  

<div className="recent-orders">
   <h2>Userlist</h2>

</div>

       </div>

     </div>
     </main>
     <div className="right-section">
    <div className="nav">
        <button id="menu-btn" onClick={handleToggleMenu}>
            <span className="material-icons-sharp">
                menu
            </span>
        </button>
        <div className="dark-mode">
            <span className="material-icons-sharp active">
                light_mode
            </span>
            <span className="material-icons-sharp">
                dark_mode
            </span>
        </div>

        <div className="profile">
            <div className="info">
                <p>Hey, <b>{firstName}</b></p>
                <small className="text-muted">Admin</small>
            </div>
            <div className="profile-photo">
            <img src={Ayaka} alt="Profile 1" />
            </div>
        </div>
    </div>
    </div>
     </div>
   </div>
  );  
};

export default UserList;
