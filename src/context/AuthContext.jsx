import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [username, setUsername] = useState("");

    useEffect(() => {
        async function checkAuth() {
            try {
                const response = await fetch("/api/user/isLoggedIn", {
                    credentials: "include",
                });
                const data = await response.json();
                if (response.ok && data.username) {
                    setUsername(data.username);
                }
            } catch {
                setUsername("");
            }
        }
        checkAuth();
    }, []);

    function login(newUsername) {
        setUsername(newUsername);
    }

    function logout() {
        setUsername("");
    }

    return (
        <AuthContext.Provider value={{ username, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}