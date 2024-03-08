import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import User from '../../img/user.png';
import Logo from '../../img/logo.png';
import { useAuth } from '../../AuthContext';

const Adminlogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost/PHP%20school%20system%20backend/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `email=${email}&password=${password}&role=admin`,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        document.cookie = `token=${data.token}; path=/; secure; HttpOnly;`;
        localStorage.setItem('user', JSON.stringify(data));

        setCurrentUser({ firstName: data.firstName, role: data.role });

        console.log('Login successful');
        navigate('/admindashboard');
      } else {
        setError('Invalid email or password. Please try again.'); // Set error message on login failure
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      setError('An error occurred. Please try again.'); // Set error message on fetch error
      console.error('Error:', error);
    }
  };

  return (
    <div className="forForms">
      <div className="container">
        <div className="img">
          <img src={User} alt="students" />
        </div>
        <div className="login-content">
          <form onSubmit={handleLogin}>
            <img src={Logo} alt="logo" />
            <h2 className="title">
              Welcome <span style={{ color: 'red' }}>Admin</span>
            </h2>
            {error && (
              <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{error}</p>
            )}
            <div className="input-div one">
              <div className="i">
                <i className="fas fa-user"></i>
              </div>
              <div className="div">
                <input
                  type="text"
                  placeholder="Email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="input-div pass">
              <div className="i">
                <i className="fas fa-lock"></i>
              </div>
              <div className="div">
                <input
                  type="password"
                  placeholder="Password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <input type="submit" className="btn" value="Login" />
            <div className="sta">
              <a href="/studentlogin" className="btn1">
                Student<button className="abtn"></button>
              </a>
              <a href="/teacherlogin" className="btn2">
                Teacher<button className="abtn"></button>
              </a>
              <a href="/adminlogin" className="btn3">
                Admin<button className="abtn"></button>
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Adminlogin;
