import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import Ayaka from '../Admin/images/Ayaka.png';
import axios from 'axios';
import Secretarysidebar from '../Sidebar/Secretarysidebar'
const Secretaryprofile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const { currentUser, getToken } = useAuth();
  const token = getToken();
  const [selectedItem, setSelectedItem] = useState('admindashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  const handleSelectItem = (item) => {
    setSelectedItem((prevItem) => (prevItem === item ? null : item));
  };

  const handleToggleMenu = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`,
        };
  
        console.log('Request Headers:', headers);
  
        const response = await axios.get('http://localhost/purok/UserDetails.php', {
          headers: headers,
        });
  
        console.log('Response:', response.data);
  
        if (response.data && response.data.success) {
          if (response.data.userDetails) {
            const userDetails = JSON.parse(response.data.userDetails);
            console.log('User Details:', userDetails);
            setUserDetails(userDetails);
          } else {
            console.error('Failed to fetch user details: "userDetails" property is missing in the response');
          }
        } else {
          console.error('Failed to fetch user details: "success" property is missing in the response');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
  
    fetchData();
  }, []);
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const name = location.state?.firstName || userData?.firstName || '';
    setFirstName(name || (currentUser ? currentUser.firstName : ''));
  }, [location.state, currentUser]);

  return (
    <div className='fordashboard'>
      <div className='container'>
        <aside className={isMenuOpen ? 'open' : ''}>
          <div className='toggle'>
            <div className='logo'>
              <span className='material-icons-sharp' onClick={handleCloseMenu}>
                home
              </span>
              <h2>Purok</h2>
            </div>
            <div className='close' id='close-btn' onClick={handleCloseMenu}>
              <span className='material-icons-sharp'>close</span>
            </div>
          </div>
          <Secretarysidebar selectedItem={selectedItem} handleSelectItem={handleSelectItem} />
        </aside>

        <main>
  <div className='dashboardMainContent'>
    <div className='dashboardTopContent'>
    </div>
    <div className="profileDivMain">
    <h1>Profile of Secretary <span style={{ color: 'green' }}>{firstName}</span></h1>
    </div>
  </div>
  <div className="recent-orders">
    {userDetails && userDetails.success ? (
      userDetails.userDetails ? (
        <table className='userDetailsTable'>
          <thead>
            <tr>
            <th>Name</th>
              <th>Email</th>
            
              {/* Add other headers as needed */}
            </tr>
          </thead>
          <tbody>
            <tr>
            <td>{userDetails.userDetails.firstName}</td>
              <td>{userDetails.userDetails.email}</td>
             
              {/* Add other data fields as needed */}
            </tr>
          </tbody>
        </table>
      ) : (
        <p>No user details available</p>
      )
    ) : (
      <p>No user details available</p>
    )}
  </div>
</main>

          
        <div className='right-section'>
          <div className='nav'>
            <button id='menu-btn' onClick={handleToggleMenu}>
              <span className='material-icons-sharp'>menu</span>
            </button>

            <div className='profile'>
              <div className='info'>
                <p>Hey, <b>{firstName}</b></p>
                <small className='text-muted'>President</small>
              </div>
              <div className='profile-photo'>
                <img src={Ayaka} alt='Profile 1' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Secretaryprofile;
