import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Mainpage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            <header>
    <a href="/" className="logo"><i className="fa fa-home" aria-hidden="true"></i> Purok Resident</a>
    <div id="menu" className="fas fa-bars" onClick={toggleSidebar}></div>
    <nav className={`navbar ${isSidebarOpen ? 'nav-toggle' : ''}`}>
        <ul>
            <li style={{ fontSize: "25px", borderWidth: "2px", width: "120px", textAlign: 'center' }}> <Link to='residentlogin'>Login</Link></li>
        </ul>
    </nav>
</header>


            <section className="about" id="about" style={{ fontSize: "30px" }}>
    <h2 className="heading">
        <i className="fas fa-user-alt"></i> PUROK <span>REGISTRATION</span>
    </h2>

    <div className="row">
        <div className="content">
            <h3 style={{ fontSize: "40px" }}>Purok</h3>
            <span className="tag" style={{ fontSize: "20px" }}>Elevate your purok through technology</span>
            <p style={{ fontSize: "20px" }}>
                "The true wealth of the barangay is the unity of its people. Together, we are partners in the growth of our community.
                In every corner of the barangay, there is a story of hope and success. Each one of us is a part of the colorful story of our community."
            </p>

            <p style={{ fontSize: "20px" }}>The diversity in the educational landscape allows for tailored learning experiences based on individual needs and preferences.</p>
            <div className="resumebtn">
                <Link className="btn" to='/addresident'>
                    <span style={{ fontSize: "25px" }}>Register</span>
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
                        <p>Thank you for visiting  our Purok website. Connect with us on socials. <br/> <br/> Keep Rising 🚀. Connect with me over live chat!</p>
                    </div>
                    <div className="box">
                        <h3>quick links</h3>
                        <a href="/residentlogin"><i className="fas fa-chevron-circle-right"></i> home</a>
                        <a href="/about"><i className="fas fa-chevron-circle-right"></i> about</a>
                    </div>
                    <div className="box">
                        <h3>contact info</h3>
                        <p><i className="fas fa-phone"></i> <a href="tel:+639504680599">Phone Number</a></p>
                        <p><i className="fas fa-envelope"></i> <a href="mailto:jellymaevidad60@gmail.com">Jelly Mae Vidad</a></p>
                        <p><i className="fab fa-telegram-plane"></i> <a href="https://t.me/@puroko123">Telegram</a></p>
                        <p><i className="fab fa-twitter"></i> <a href="https://x.com/PinoteShar92381?t=5SC-vcEYAfkrx5ZiBzC-jw&s=07">Twitter</a></p>
                        <p><i className="fas fa-map-marked-alt"></i> Cordova Cebu City</p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Mainpage;
