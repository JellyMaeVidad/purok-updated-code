import {CiLogout} from 'react-icons/ci'

const [isDropdownOpen, setDropdownOpen] = useState(false);

const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleLogoutClick = () => {
    
    handleLogout();
    setDropdownOpen(false); 
  };

  <div className="profileMainDiv" onClick={toggleDropdown}>
  <h1>
    Welcome, {firstName} <AiFillCaretDown className='logoutSettingsSvg' onClick={toggleDropdown} />
  </h1>
  {isDropdownOpen && (
    <div className="dropdownMenu">
      {/* Add your dropdown menu items here */}
      <div className="logoutMainDiv">
      <li onClick={handleLogoutClick}><CiLogout className='logoutLogo'/>Logout</li>
      </div>
      
      {/* Add more dropdown options if needed */}
    </div>
  )}
</div>