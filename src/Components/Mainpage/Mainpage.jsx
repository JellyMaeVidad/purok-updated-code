import React,{useState} from 'react'
import { Link } from 'react-router-dom';
const Mainpage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
  return (
    <>
    <header>
    <a href="/" className="logo"><i class="fa fa-home" aria-hidden="true"></i> Purok Resident</a>
    <div id="menu" className="fas fa-bars" onClick={toggleSidebar}></div>
    <nav className={`navbar ${isSidebarOpen ? 'nav-toggle' : ''}`}>
   <ul>
           
         
           <li> <Link to='residentlogin'>Login</Link></li>
            </ul>
        </nav>
    </header>
 
<section className="about" id="about">
  <h2 className="heading">
    <i className="fas fa-user-alt"></i> Vision <span>Shessha</span>
  </h2>

  <div className="row">
 
    <div className="content">
      <h3>Purok</h3>
      <span className="tag">Elevate your purok through technology</span>
      <p>
      "The true wealth of the barangay is the unity of its people. Together, we are partners in the growth of our community."
      "In every corner of the barangay, there is a story of hope and success. Each one of us is a part of the colorful story of our community."
      </p>

        <p>The diversity in the educational landscape allows for tailored learning experiences based on individual needs and preferences.</p>
      <div className="resumebtn">
        <Link  className="btn" to='/addresident'>
     
          <span>Register</span>
          <i className="fas fa-chevron-right"></i>
          
          </Link>
      </div>
    </div>
  </div>
</section>

<section className="footer">

  <div className="box-container">

      <div className="box">
          <h3>Purok System</h3>
          <p>Thank you for visiting  our Purok website. Connect with us socials. <br/> <br/> Keep Rising 🚀. Connect with me over live chat!</p>
      </div>

      <div className="box">
          <h3>quick links</h3>
          <a href="#about"><i className="fas fa-chevron-circle-right"></i> home</a>
          <a href="#education"><i className="fas fa-chevron-circle-right"></i> about</a>
          <a href="#programs"><i className="fas fa-chevron-circle-right"></i> Programs</a>
          <a href="/studentlogin"><i className="fas fa-chevron-circle-right"></i> Login as a student</a>
          <a href="/adminlogin"><i className="fas fa-chevron-circle-right"></i> Login as a admin</a>
          <a href="/teacherlogin"><i className="fas fa-chevron-circle-right"></i> Login as a teacher</a>
      </div>

      <div className="box">
          <h3>contact info</h3>
          <p> <i className="fas fa-phone"></i>+639 XXX-XXX-XXXX</p>
          <p> <i className="fas fa-envelope"></i>Jelly@gmail.com</p>
          <p> <i className="fas fa-map-marked-alt"></i>Cordova Cebu City,</p>
          <div className="share">

             
              <a  className="fab fa-github" aria-label="GitHub" target="_blank"></a>
              <a  className="fas fa-envelope" aria-label="Mail" target="_blank"></a>
              <a  className="fab fa-twitter" aria-label="Twitter" target="_blank"></a>
              <a  className="fab fa-telegram-plane" aria-label="Telegram" target="_blank"></a>
          </div>
      </div>
  </div>

 

</section>

    
    </>
  )
}

export default Mainpage