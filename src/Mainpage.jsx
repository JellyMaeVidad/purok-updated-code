import React,{useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'
import pilipinaslogo from './img/pilipinaslogo.png'
const Mainpage = () => {
  const [student_id, setstudentId] = useState('');
  const [studentpassword, setstudentpassword] = useState('');
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth(); 
  const [error, setError] = useState('');


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost/purok/residentlogin.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `email=${student_id}&password=${studentpassword}`, // Remove the role parameter
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("this is the data", data);
  
      if (data.success) {
        localStorage.setItem('token', data.token);
        document.cookie = `token=${data.token}; path=/; secure; HttpOnly;`;
        localStorage.setItem('user', JSON.stringify(data));
  
        setCurrentUser({ firstName: data.firstName, role: data.role });
  
        console.log('Login successful');
  
        // Handle different roles
        switch (data.role) {
          case 'resident':
            navigate('/residentdashboard');
            break;
          case 'president':
            navigate('/presidentdashboard');
            break;
          case 'officer':
            navigate('/officerdashboard');
            break;
          case 'vicepresident':
            navigate('/vicepresidentdashboard');
            break;
          case 'secretary':
            navigate('/secretarydashboard');
            break;
          case 'treasurer':
            navigate('/treasurerdashboard');
            break;
          case '':
            navigate('/adminlogin');
            break;
          default:
            console.error('Unknown role:', data.role);
            break;
        }
      } else {
        if (data.message === 'Invalid Resident Gmail or password') {
          setError('Invalid Resident Gmail or password. Please try again.');
        } else if (data.message === 'Error in the system') {
          setError('Login failed due to an error in the system.');
        } else {
          setError(`Login failed: ${data.message}`);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  
  




  return (
    <div className="forForms">
    <div className="container">
    <div className="img">
      <img src={pilipinaslogo} alt="" srcset="" />
    </div>
    <div className="login-content">
        <form onSubmit={handleLogin}>
            {/* <img src={pilipinaslogo} alt="logo" /> */}
            <h2 className="title">
                {/* Login <span style={{ color: "green" }}>Resident</span> */}
            </h2>
            {error && (
            <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{error}</p>
          )}
            <div className="input-div one">
                <div className="i">
                    <i className="fas fa-user"></i>
                </div>
                <div className="div">
                    <input type="text" className="input" placeholder='Gmail' value={student_id} onChange={(e) => setstudentId(e.target.value)}/>
                </div>
            </div>
            <div className="input-div pass">
                <div className="i">
                    <i className="fas fa-lock"></i>
                </div>
                <div className="div">
             <input type="password" className="input" placeholder='Password' value={studentpassword}
          onChange={(e) => setstudentpassword(e.target.value)}/>
                </div>
            </div>
           
            <div className="sta">
            <input type="submit" className="btn2" value="Login" />
            <Link to="/" className="btn1">
               <button className="abtn">Back</button>
              </Link>
          
             
            </div>
        </form>
    </div>
</div>
</div>
  )
}

export default Mainpage