  import React, { useState, useEffect } from 'react';
  import { useLocation, useNavigate,Link } from 'react-router-dom';
  import { useAuth } from '../../AuthContext';
  import Sidebar from '../Sidebar/Sidebar';
  import axios from 'axios';
  import QRCode from 'qrcode.react';

  // IMPORTED IMAGES //

  import Ayaka from './images/Ayaka.png'
  const Enrolledstudents = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const { currentUser, logout, removeUser, getToken } = useAuth();
    const [selectedItem, setSelectedItem] = useState('admindashboard');
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);
    // /////////////////////////////////////////////////////////////

    const [students, setstudents] = useState({ students: [] });
    const [filteredStudents, setFilteredStudents] = useState({ students: [] });

    const [searchQuery, setSearchQuery] = useState('');
  
    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };

    useEffect(() => {
      const keywords = searchQuery.toLowerCase().split(/\s+/);
      const filtered = students.students.filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        return keywords.every((keyword) => fullName.includes(keyword));
      });
      setFilteredStudents({ students: filtered });
    }, [students.students, searchQuery]);
  


    const DeleteConfirmationModal = ({ isOpen, onCancel, onConfirm, studentName }) => {
      if (!isOpen) return null;
  
      return (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this student {studentName}?</p>
            <button onClick={onCancel} className='btn'>Cancel</button>
            <button onClick={onConfirm} className='btn'>Delete</button>
          </div>
        </div>
      );
    };
    
    const handleDeleteStudent = (studentId, studentName) => {
      setStudentToDelete({ id: studentId, name: studentName });
      setShowDeleteModal(true);
    };
  
    // Function to cancel delete operation
    const handleCancelDelete = () => {
      setShowDeleteModal(false);
      setStudentToDelete(null);
    };

    const handleConfirmDelete = async (studentId) => {
      try {
        const response = await axios.delete(`http://localhost/PHP%20school%20system%20backend/delete-student.php?studentId=${studentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (response.data && response.data.success) {
          // Student deleted successfully, update the state
          setstudents((prevStudents) => ({
            students: prevStudents.students.filter((student) => student.student_id !== studentId),
          }));
          console.log('Student deleted successfully');
        } else {
          console.error('Failed to delete student:', response.data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        // Close the modal after deletion attempt
        setShowDeleteModal(false);
      }
    };


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
      try {
        const response = await axios.get('http://localhost/PHP%20school%20system%20backend/enrolledstudents.php', {
          headers: headers,
        });  
        if (response.data && response.data.success) {
          if (response.data.students) {
            const studentsArray = JSON.parse(response.data.students);
            setstudents(studentsArray); 
            console.log("oh my",studentsArray);
          } else {
            console.error('Failed to fetch user data: "students" property is missing in the response');
          }
        } else {
          console.error('Failed to fetch user data: "success" property is missing in the response');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    


    useEffect(() => {
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
    
    // QR CODE CANVAS //
    const handleDownloadQRCode = (firstName, studentId, qrCodeValue) => {
      const canvas = document.getElementById(`qrcode-canvas-${studentId}`);
      if (!canvas) {
        console.error('QR Code canvas not found');
        return;
      }
    
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `qrcode_${firstName}_${studentId}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
    


    

    return (
      <div className='fordashboard'>
      <div className="container" >
      <aside className={isMenuOpen ? 'open' : ''}>
      <div className="toggle">
      <div className="logo">
        <span className="material-icons-sharp">
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
        <DeleteConfirmationModal
                  isOpen={showDeleteModal}
                  onCancel={() => {
                    setShowDeleteModal(false);
                    setStudentToDelete(null);
                  }}
                  onConfirm={() => handleConfirmDelete(studentToDelete.id)}
                  studentName={studentToDelete ? studentToDelete.name : ''}
                />
        <div className="recent-orders">
        <h1>Enrolled Students</h1>
        <div className="search-bar">
                  <input className='edgilyn'
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>

        <div className="timetable">
        {Array.isArray(filteredStudents.students) && filteredStudents.students.length > 0 ? (
      <table className='studentsTable'>
        <thead>
          <tr>
              <th>Student ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th></th>
            <th></th>
            <th>Qr Code</th>
          </tr>
        </thead>
        <tbody>
        {filteredStudents.students.map((user) => (
            <tr key={user.admin_id}>
              <td>{user.student_id}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>
              <Link to={`/student-details/${user.student_id}`}>
              <div className="buttonDiv"> 
                  <button className='btn'>
                  <span className="material-icons-sharp">
                    visibility
                    </span>
                  </button>
              </div>
              </Link>
              </td>
              <td>
              <button className='btn' onClick={() => handleDeleteStudent(user.student_id, user.firstName)}>
                          <span className="material-icons-sharp">
                            delete
                          </span>
                        </button>
              </td>
              <td>
                <QRCode id={`qrcode-canvas-${user.student_id}`} value={user.qrCode} />
              </td>
              <td>
                <button
                  className='btn'
                  onClick={() => handleDownloadQRCode(user.firstName, user.student_id, user.qrCode)}
                >
                  Download QR Code
                </button>
              </td>
             

        
       
          
     
              {/* Add more user data fields as needed */}
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>No students available</p>
    )}
  </div>

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

  export default Enrolledstudents;
