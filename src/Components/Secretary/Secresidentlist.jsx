import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../AuthContext';
// IMPORTED IMAGES //
import Ayaka from '../Admin/images/Ayaka.png';
import Secretarysidebar from '../Sidebar/Secretarysidebar';

const ResidentList = () => {
  const location = useLocation();
  const [firstName, setFirstName] = useState('');
  const [selectedItem, setSelectedItem] = useState('admindashboard');
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [residentToDelete, setResidentToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser, getToken } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const token = getToken();
  // Modal component
  const DeleteConfirmationModal = ({ isOpen, onCancel, onConfirm, residentName }) => {
    if (!isOpen) return null;

    return (
      <div className="modal">
        <div className="modal-content">
          <p>Are you sure you want to delete {residentName}?</p>
          <button onClick={onCancel} className='btn'>Cancel</button>
          <button onClick={onConfirm} className='btn'>Delete</button>
        </div>
      </div>
    );
  };

  const handleSelectItem = (item) => {
    setSelectedItem((prevItem) => (prevItem === item ? null : item));
  };

  const handleToggleMenu = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleDeleteResident = (residentId, residentName) => {
    setResidentToDelete({ id: residentId, name: residentName });
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    // Cancel the delete operation
    setShowDeleteModal(false);
    setResidentToDelete(null);
  };

  const fetchResidentList = async () => {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
    };

    console.log('Request Headers:', headers);

    try {
      const response = await axios.get('http://localhost/purok/Fetchresident.php', {
        headers: headers,
      });

      console.log('Response:', response.data);

      if (response.data && response.data.success) {
        if (response.data.residents) {
          const residentsArray = JSON.parse(response.data.residents);
          console.log('residents:', residentsArray);
          // Filter residents with the role of 'resident'
          const filteredResidents = residentsArray.residents.filter(resident => resident.role === 'resident');
          console.log('Filtered Residents:', filteredResidents);
          setResidents(filteredResidents || []); // Ensure residents is an array
        } else {
          console.error('Failed to fetch user data: "residents" property is missing in the response');
        }
      } else {
        console.error('Failed to fetch user data: "success" property is missing in the response');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    console.log('Effect triggered');
    const userData = JSON.parse(localStorage.getItem('user'));
    const name = location.state?.firstName || userData?.firstName || '';
    setFirstName(name || (currentUser ? currentUser.firstName : ''));

    setLoading(true);

    try {
      fetchResidentList();
    } catch (error) {
      console.error('Error fetching resident list:', error);
    } finally {
      setLoading(false);
    }
  }, [location.state]);

  const handleConfirmDelete = async (residentId) => {
    console.log('Deleting resident with ID:', residentId);
    try {
      console.log('Sending request to delete resident...');
      const response = await axios.delete(`http://localhost/purok/delete-resident.php?residentId=${residentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data && response.data.success) {
        // Resident deleted successfully, update the state
        setResidents((prevResidents) => prevResidents.filter((resident) => resident.id !== residentId));
        console.log('Resident deleted successfully.');
      } else {
        console.error('Failed to delete resident:', response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      // Close the modal after deletion attempt
      setShowDeleteModal(false);
    }
  };

  // Function to handle search
  const handleSearch = () => {
    // Filter the residents based on the search query
    const filteredResidents = residents.filter((resident) =>
      `${resident.firstName} ${resident.lastName} } `.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filteredResidents;
  };

  return (
    <div className='fordashboard'>
      <div className="container">
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
          <div className="dashboardMainContent">
            <div className="dashboardTopContent">
              <div className="recent-orders">
                <DeleteConfirmationModal
                  isOpen={showDeleteModal}
                  onCancel={() => {
                    setShowDeleteModal(false);
                    setResidentToDelete(null);
                  }}
                  onConfirm={() => {
                    if (residentToDelete && residentToDelete.id) {
                      handleConfirmDelete(residentToDelete.id);
                    }
                  }}
                  residentName={residentToDelete ? residentToDelete.name : ''}
                />
               <h2>Resident List</h2>
<div className="search" style={{ textAlign: 'right' }}>
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search Resident"
    style={{ height: '40px', border: '2px solid #ccc', borderRadius: '5px', padding: '5px 10px', marginRight: '10px' }}
  />
  <button onClick={handleSearch} className="btn" >
    Search
  </button>
</div>

                {
                  Array.isArray(residents) && residents.length > 0 ? (
                    <table className='residentsTable'>
                      <thead>
                        <tr>
                          <th>Last Name</th>
                          <th>First Name</th>
                          <th>Email</th>
                          <th>Middle Name</th>
                          <th>Birthdate</th>
                          <th>Parent Contact</th>
                          <th>Role</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {handleSearch().map((resident) => (
                          <tr key={resident.id}>
                            <td>{resident.lastName}</td>
                            <td>{resident.firstName}</td>
                            <td>{resident.email}</td>
                            <td>{resident.middlename}</td>
                            <td>{resident.birthdate}</td>
                            <td>{resident.parentcontactnumber}</td>
                            <td>{resident.role}</td>
                            <td>
                              <button
                                className='btn'
                                onClick={() => handleDeleteResident(resident.id, resident.firstName)}
                              >
                                <span className="material-icons-sharp">
                                  delete
                                </span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>{residents ? 'No residents available' : 'Error fetching resident data'}</p>
                  )
                }
              </div>
            </div>
          </div>
        </main>
        <div className="right-section">
          <div className="nav">
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

export default ResidentList;
