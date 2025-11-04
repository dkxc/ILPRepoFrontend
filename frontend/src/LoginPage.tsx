import { useState } from "react";
import axios from "axios";
import experionLogo from "./assets/experionlogo.svg";
import { useAuth } from "./context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://localhost:7224/api/Auth/login",
        {
          email,
          password,
        },
      );

      const { accessToken, userId, roleName } = response.data.data;
      console.log(accessToken, userId, roleName);
      login({ accessToken, userId, roleName });

      const redirectPath = location.state?.from?.pathname;
      let destination;

      if (redirectPath) destination = redirectPath;
      else if (roleName === "Admin") destination = "/admindash";
      else destination = "/";

      navigate(destination, { replace: true });
    } catch (err: any) {
      if (err.response?.data?.data?.accessToken) {
        const { accessToken, userId, roleName } = err.response.data.data;
        login({ accessToken, userId, roleName });

        const redirectPath = location.state?.from?.pathname;
        let destination;

        if (redirectPath) destination = redirectPath;
        else if (roleName === "Admin") destination = "/admindash";
        else destination = "/";

        navigate(destination, { replace: true });
        setIsLoading(false);
        return;
      }

      if (err.response?.status === 401) setError("Invalid email or password.");
      else setError("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        {/* ✅ Centered Logo */}
        <div className="flex flex-col items-center">
          <img
            src={experionLogo}
            alt="Experion Logo"
            width={140}
            className="mb-2"
          />
          <p className="text-sm text-gray-500 font-medium">ILP Repo</p>
        </div>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white placeholder-gray-500 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-blue-600"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white placeholder-gray-500 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-blue-600"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          {/* ✅ Visible Sign-In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center rounded-md bg-blue-600 py-2 px-4 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                />
              </svg>
            ) : (
              "Log in"
            )}
          </button>

          {/* ✅ NEW: Forgot Password Link */}
          <div className="text-center">
            <>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot Password?
              </Link>
              <div className="ml-2"></div>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign Up
              </Link>
            </>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
