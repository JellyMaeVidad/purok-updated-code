import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext'; 
import Sidebar from '../Sidebar/Sidebar';
import Ayaka from './images/Ayaka.png'
// ////////////////////////////////////////////////////////////////////
const Vicepresidentdashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const { currentUser} = useAuth(); 
  const [selectedItem, setSelectedItem] = useState('admindashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleSelectItem = (item) => {
    if (item === selectedItem) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
    }
  };

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const name = location.state?.firstName || userData?.firstName || '';
    setFirstName(name || (currentUser ? currentUser.firstName : ''));
    
  }, [location.state, currentUser]);
 

  return (
    <div className='fordashboard'>
    <div className="container" >
     <aside className={isMenuOpen ? 'open' : ''}>
     <div className="toggle">
     <div className="logo">
       <span className="material-icons-sharp">
          home
          </span>
           <h2>Purok</h2>
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
     </div>
        <h1>Hello Vice President <span>{firstName}</span></h1>


            
     </div>
     </main>
     <div className="right-section">
    <div className="nav">
        <button id="menu-btn" onClick={handleToggleMenu}>
            <span className="material-icons-sharp">
                menu
            </span>
        </button>
       

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

export default Vicepresidentdashboard;
