import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import Ayaka from '../Admin/images/Ayaka.png';
import Residentsidebard from '../Sidebar/Residentsidebar';
import axios from 'axios';

const Requestdocument = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [reason, setReason] = useState('');
  const { currentUser } = useAuth();
  const [selectedItem, setSelectedItem] = useState('admindashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null); // Add requestStatus state
  const [documents, setDocuments] = useState([]);
  const handleSelectItem = (item) => {
    setSelectedItem(item === selectedItem ? null : item);
  };

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleRequestSubmit = async () => {
    // Open confirmation modal
    setIsConfirmationOpen(true);
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
  
        if (response.data && response.data.success) {
          if (response.data.userDetails) {
            const userDetails = JSON.parse(response.data.userDetails);
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

  const handleConfirmationNo = () => {
    // Close confirmation modal
    setIsConfirmationOpen(false);
  };

  const handleConfirmationYes = async () => {
    try {
      console.log('Yes button clicked'); // Log the button click
  
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
      };
  
      if (!userDetails || !userDetails.userDetails.id) {
        console.log('Invalid userDetails: Missing id property');
      }
  
      const requestData = {
        documentType,
        reason,
        userId: userDetails.userDetails.id,
      };
  
      console.log('Sending Request Data:', requestData);
  
      const response = await axios.post('http://localhost/purok/requestdocument.php', JSON.stringify(requestData), { headers: { ...headers, 'Content-Type': 'application/json' } });

  
      console.log('Response from server:', response.data);
  
      if (response.data.success) {
        console.log('Request sent successfully');
        setRequestStatus('success');
      } else {
        console.error('Server response indicates failure:', response.data.message);
        setRequestStatus('error');
      }
  
      setIsConfirmationOpen(false);
  
      // Clear form fields
      setDocumentType('');
      setReason('');
    } catch (error) {
      console.error('Error sending request:', error);
  
      setIsConfirmationOpen(false);
  
      // Set requestStatus to 'error' on any failure
      setRequestStatus('error');
    }
  };
  
  
  

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const name = location.state?.firstName || userData?.firstName || '';
    setFirstName(name || (currentUser ? currentUser.firstName : ''));
  }, [location.state, currentUser]);


  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // Fetch documents from the server
        const response = await axios.get('http://localhost/purok/FetchDocuments.php', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (response.data && response.data.success) {
          if (response.data.documents) {
            // Update the documents state with the fetched data
            setDocuments(response.data.documents);
          } else {
            console.error('Failed to fetch documents: "documents" property is missing in the response');
          }
        } else {
          console.error('Failed to fetch documents: Server response does not indicate success');
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };
  
    fetchDocuments();
  }, []);
  
  
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
          <Residentsidebard selectedItem={selectedItem} handleSelectItem={handleSelectItem} />
        </aside>
        <main>
          <div className='dashboardMainContent'>
            <div className='dashboardTopContent'></div>
            <h1>Request Document</h1>

            <div className="recent-orders">
              <form>
                <label>
                  Document Type:
                  <input type='text' value={documentType} onChange={(e) => setDocumentType(e.target.value)} />
                </label>
                <label>
                  Reason:
                  <input type='text' value={reason} onChange={(e) => setReason(e.target.value)} />
                </label>
                <button className='btn' type='button' onClick={handleRequestSubmit}>
                 Request
                </button>
              </form>

              {/* Confirmation modal outside the form */}
              {isConfirmationOpen && (
                <div className='confirmation-modal'>
                  <p>Are you sure you want to send this request?</p>
                  <button className='confirmButton' onClick={handleConfirmationYes}>Yes</button>
                  <button onClick={handleConfirmationNo}>No</button>
                </div>
              )}
            </div>
          </div>
          <div className="recent-orders">
  <h2>Document List</h2>
  <table>
    <thead>
      <tr>
        <th>Document Type</th>
        <th>Reason</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {documents.map((doc, index) => (
        <tr key={index}>
          <td>{doc.document_type}</td>
          <td>{doc.reason}</td>
          <td style={{ color: doc.is_confirmed === 'confirmed' ? 'green' : 'red' }}>
            {doc.is_confirmed}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
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
                <small className='text-muted'>Resident</small>
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

export default Requestdocument;
