import React from 'react';

const About = () => {
  return (
    <div className='about-container' style={{ backgroundColor: '#e6ffe6', padding: '20px', borderRadius: '10px', fontSize:'30px' }}>
      <div className="about-content" style={{ fontFamily: 'handwritten', fontSize: '27px', color: '#555' }}>
        
        <h1 className='h' style={{textAlign:'center'}}>Welcome to our Purok Management System!</h1>
        <br /><br /><br />

        <p> Our system aims to streamline the management of residential areas known as puroks, providing efficient solutions for various tasks such as resident registration, facilities management, event organization, and communication.With our system, purok leaders and administrators can easily keep track of residents, manage community facilities, organize events to foster community engagement, and communicate important announcements effectively. We are committed to enhancing community living experiences and promoting stronger bonds among residents through our Purok Management System.
        Our platform offers a user-friendly interface that simplifies complex tasks, allowing purok leaders to focus more on community building rather than administrative burdens.
        Residents can also benefit from our system by having access to important community information, participating in events, and contributing to the betterment of their neighborhood.
        Moreover, our system ensures data security and privacy, adhering to the highest standards of confidentiality to protect sensitive information of residents and the community.
        At Purok Management System, we believe in the power of technology to transform communities, foster inclusivity, and create vibrant living spaces where everyone feels connected and supported.</p>
      </div>
    </div>
  );
};

export default About;
