import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  currentUser: {
    name: "",
    id: "",
    role: "",
    locality: "",
    isFirst: false,
    expires: "",
  },
  setCurrentUser: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const token = localStorage.getItem("token");
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [currentUser, setCurrentUser] = useState({
    name: "",
    id: "",
    role: "",
    locality: "",
    isFirst: false,
    expires: "",
  });

  const handleTokenExpiry = () => {
    setIsAuthenticated(false);
    setCurrentUser({
      name: "",
      id: "",
      role: "",
      locality: "",
      isFirst: false,
      expires: "",
    });
    localStorage.removeItem("token");
    localStorage.removeItem("location");
  };

  useEffect(() => {
    const UserData = () => {
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp < currentTime) {
            handleTokenExpiry();
          } else {
            setCurrentUser({
              name: decodedToken[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
              ],
              id: parseInt(
                decodedToken[
                  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
                ]
              ),
              role: decodedToken[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
              ],
              isFirst: decodedToken.FirstLogin === "True",
              expires: decodedToken.exp,
            });
            localStorage.setItem("location", decodedToken.Location);
            // Set a timer to log out the user when the token expires
            const expiryTime = (decodedToken.exp - currentTime) * 1000;
            setTimeout(handleTokenExpiry, expiryTime);
          }
        } catch (error) {
          console.error("Error decoding token: ", error);
          handleTokenExpiry();
        }
      } else {
        handleTokenExpiry();
      }
    };
    UserData();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
