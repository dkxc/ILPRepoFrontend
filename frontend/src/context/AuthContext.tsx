import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export const UserRole = {
  Admin: 0,
  Trainee: 1,
  TeamLead: 2,
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

interface AuthData {
  accessToken: string;
  userId: number;
  roleName: UserRole;
}

interface AuthContextType {
  isLoggedIn: boolean;
  authData: AuthData | null;
  loading: boolean;
  login: (data: AuthData) => void;
  logout: () => void;
  isAdmin: () => boolean;
  isTrainee: () => boolean;
  isTeamLead: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'auth_data';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔍 Checking stored auth...");

    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!storedAuth) {
      console.log("❌ No auth data found in localStorage.");
      setLoading(false);
      return;
    }

    console.log("✅ Auth data found in storage. Parsing...");

    let parsed;
    try {
      parsed = JSON.parse(storedAuth);
    } catch (err) {
      console.error("❌ Failed to parse stored auth JSON:", err);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setLoading(false);
      return;
    }

    const token = parsed?.accessToken;

    if (!token) {
      console.log("❌ No token inside stored auth. Clearing...");
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setLoading(false);
      return;
    }

    console.log("➡️ Sending token to /validate-token API...");

    const validateToken = async () => {
      try {
        const response = await fetch("https://localhost:7224/api/Auth/validate-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        console.log("📡 Token validation status:", response.status);

        if (response.ok) {
          console.log("✅ Token valid → User logged in again");
          setAuthData(parsed);
        } else {
          console.warn("⚠️ Token expired/invalid. Clearing auth...");
          localStorage.removeItem(AUTH_STORAGE_KEY);
          setAuthData(null);
        }
      } catch (error) {
        console.error("🚫 Error validating token:", error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setAuthData(null);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  const login = (data: AuthData) => {
    console.log("🔐 Saving auth to localStorage & context");
    setAuthData(data);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  };

  const logout = () => {
    console.log("🚪 Logging out & clearing localStorage");
    setAuthData(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const isAdmin = () => authData?.roleName === UserRole.Admin;
  const isTrainee = () => authData?.roleName === UserRole.Trainee;
  const isTeamLead = () => authData?.roleName === UserRole.TeamLead;

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!authData,
        authData,
        loading,
        login,
        logout,
        isAdmin,
        isTrainee,
        isTeamLead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
