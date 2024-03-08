import React, { useContext, createContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  
  const getToken = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const token = userData ? userData.token : null;
    return token;
};


  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  };

  const removeUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('user'); 
  };


  useEffect(() => {
    
  }, [currentUser]);

  useEffect(() => {
   
    const userData = JSON.parse(localStorage.getItem('user'));

    if (userData) {
     
      setCurrentUser(userData);
    }
  }, []);

  useEffect(() => {

    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));
    if (tokenCookie) {
      const token = tokenCookie.split('=')[1];
     
      fetch("http://localhost/PHP%20school%20system%20backend/residentlogin.php", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
            
          } else {
            return { success: false, message: "Invalid or expired token" };
            
          }
        })
        .then((data) => {
          if (data.success) {
            setCurrentUser({ firstName: data.firstName });
          } else {
            logout();
          }
        })
        .catch((error) => {
          logout();
          console.error("Error while fetching user data:", error);
        });
    }
  }, []);


  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, logout,removeUser,getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
