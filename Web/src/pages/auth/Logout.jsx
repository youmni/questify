import { useEffect } from "react";
import authService from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    authService.logout()
      .then(() => {
        setUser(null);
        navigate("/auth/login");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">Logging out...</p>
    </div>
  );
};

export default Logout;