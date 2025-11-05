import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function LogOut() {
  const navigate = useNavigate();

  useEffect(() => {
    const AUTH_STORAGE_KEY = "auth_data";
    sessionStorage.removeItem(AUTH_STORAGE_KEY);

    navigate("/login"); // Redirect to login page
  }, [navigate]);

  return null; // Nothing to render
}
