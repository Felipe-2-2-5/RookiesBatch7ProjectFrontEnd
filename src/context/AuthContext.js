import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  currentUser: { name: "", id: "", role: "", locality: "", isFirst: false },
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
  });

  useEffect(() => {
    console.log("into auth context");
    const UserData = () => {
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          setCurrentUser({
            name: decodedToken[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
            ],
            id: decodedToken[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
            ],
            role: decodedToken[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ],
            isFirst: decodedToken.FirstLogin === "True",
          });
          localStorage.setItem("location", decodedToken.Location);
        } catch (error) {
          console.error("Error decoding token: ", error);
          setIsAuthenticated(false);
          localStorage.removeItem("token");
        }
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
