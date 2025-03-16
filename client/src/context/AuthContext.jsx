import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
  
      console.log("Login API Response:", response.data);
  
      if (response.data.token && response.data.user) {
        const userData = {
          _id: response.data.user._id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role, // ✅ Ensure role is included
          tasksAssigned: response.data.user.tasksAssigned,
          token: response.data.token,
        };
  
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
  
        return userData; // ✅ Return user data
      } else {
        console.error("Login failed: No token or user data received");
        return null;
      }
    } catch (error) {
      console.error("Login error:", error.response?.data?.message || error.message);
      return null;
    }
  };
  
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
