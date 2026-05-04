import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");

      // 🔥 THIS LINE FIXES YOUR BUG
      if (!storedUser || storedUser === "undefined") return null;

      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Invalid user in localStorage");
      return null;
    }
  });

  const login = (userData, token) => {
    localStorage.setItem("token", token);

    // 🔥 ALWAYS stringify
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}