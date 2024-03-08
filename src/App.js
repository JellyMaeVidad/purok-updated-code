import React, { useEffect } from 'react';
import './CSS/all.css'
import Studentlogin from './Mainpage';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import { useAuth } from './AuthContext'; 
import Mainpage from './Components/Mainpage/Mainpage'

// LOGIN //
import Adminlogin from './Components/Admin/Adminlogin';
// SIGN UP //
import Addstudent from './Components/Admin/AddUsers';
// DASHBOARDS //
import Residentdashboard from './Components/Admin/residentdashboard';
import Officerdashboard from './Components/Admin/Officerdashboard';
import Presidentdashboard from './Components/Admin/Presidentdashboard';
import Vicepresidentdashboard from './Components/Admin/Vicepresidentdashboard';
import Secretarydashboard from './Components/Admin/Secretarydashboard';
import Treasurerdashboard from './Components/Admin/Treasurerdashboard';
// MAIN VIEW//
import Residentprofile from './Components/Resident/Residentprofile';
import Requestdocument from './Components/Resident/Requestdocument';
import Residentannouncement from './Components/Resident/Residentannouncement';
// PRESIDENT VIEW //
import Presidentprofile from './Components/President/Presidentprofile';
import Residentlist from './Components/President/Residentlist'
import Presidentannouncement from './Components/President/Presidentannouncement';
import Confirmedrequest from './Components/President/Confirmedrequest';
// SECRETARY VIEW //
import Secretaryprofile from './Components/Secretary/Secretaryprofile'
import Secretaryrequest from './Components/Secretary/Secretaryrequest';
import Sendrequest from './Components/Secretary/Sendrequest';
// TREASURER VIEW // 
import Treasurerprofile from './Components/Treasurer/Treasurerprofile';
import Treasurerpayment from './Components/Treasurer/Treasurerpayment';
import Paymenthistory from './Components/Treasurer/Paymenthistory';

function App() {
  
  return (
    <div className="App">
    
      <Routes>
        {/* RESIDENT */}
        <Route path='/addresident' element={<PublicRoute><Addstudent /></PublicRoute>} />

        {/* LOGIN ROUTES */}
        <Route path='/' element={<PublicRoute><Mainpage /></PublicRoute>} />
        <Route path='/residentlogin' element={<PublicRoute><Studentlogin /></PublicRoute>} />
        <Route path='/presidentlogin' element={<PublicRoute><Adminlogin /></PublicRoute>} />
         {/* DASHBOARD ROUTES */}
        <Route path='/residentdashboard' element={<ProtectedRoute roles={['resident']}><Residentdashboard /></ProtectedRoute>} />
        <Route path='/officerdashboard' element={<ProtectedRoute roles={['officer']}><Officerdashboard /></ProtectedRoute>} />
        <Route path='/presidentdashboard' element={<ProtectedRoute roles={['president']}><Presidentdashboard /></ProtectedRoute>} />
        <Route path='/vicepresidentdashboard' element={<ProtectedRoute roles={['vicepresident']}><Vicepresidentdashboard /></ProtectedRoute>} />
        <Route path='/secretarydashboard' element={<ProtectedRoute roles={['secretary']}><Secretarydashboard /></ProtectedRoute>} />
        <Route path='/treasurerdashboard' element={<ProtectedRoute roles={['treasurer']}><Treasurerdashboard /></ProtectedRoute>} />
        {/* RESIDENTS MAIN */}
        <Route path='/residentprofile' element={<ProtectedRoute roles={['resident']}><Residentprofile /></ProtectedRoute>} />
        <Route path='/requestdocument' element={<ProtectedRoute roles={['resident']}><Requestdocument /></ProtectedRoute>} />
        <Route path='/Announcement' element={<ProtectedRoute roles={['resident']}><Residentannouncement /></ProtectedRoute>} />
        {/* PRESIDENT MAIN */}
        <Route path='/presidentprofile' element={<ProtectedRoute roles={['president']}><Presidentprofile /></ProtectedRoute>} />
        <Route path='/presidentlist' element={<ProtectedRoute roles={['president']}><Residentlist /></ProtectedRoute>} />
        <Route path='/presidentannouncement' element={<ProtectedRoute roles={['president']}><Presidentannouncement /></ProtectedRoute>} />
        <Route path='/confirmdocuments' element={<ProtectedRoute roles={['president']}><Confirmedrequest /></ProtectedRoute>} />
        {/* SECRETARY MAIN */}
        <Route path='/secretaryprofile' element={<ProtectedRoute roles={['secretary']}><Secretaryprofile /></ProtectedRoute>} />
        <Route path='/secretaryrequest' element={<ProtectedRoute roles={['secretary']}><Secretaryrequest /></ProtectedRoute>} />
        <Route path='/sendrequest' element={<ProtectedRoute roles={['secretary']}><Sendrequest /></ProtectedRoute>} />
        {/* TREASURER MAIN */}
        <Route path='/treasurerprofile' element={<ProtectedRoute roles={['treasurer']}><Treasurerprofile /></ProtectedRoute>} />
        <Route path='/treasurerpayment' element={<ProtectedRoute roles={['treasurer']}><Treasurerpayment /></ProtectedRoute>} />
        <Route path='/paymenthistory' element={<ProtectedRoute roles={['treasurer']}><Paymenthistory /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
