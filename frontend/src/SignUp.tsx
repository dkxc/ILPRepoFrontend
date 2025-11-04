import { useState } from "react";
import experionLogo from "./assets/experionlogo.svg";

// You can import your logo like this:
// import experionLogo from "./assets/experionlogo.svg";

const ForgotPasswordFlow = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Step 1: Initiate Password Setup (Send OTP)
  const handleSendOtp = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://localhost:7224/api/Auth/initiate-password-setup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (data.succeeded || response.ok) {
        setSuccessMessage("OTP sent successfully to your email!");
        setTimeout(() => {
          setStep(2);
          setSuccessMessage("");
        }, 1500);
      } else {
        setError(data.message || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://localhost:7224/api/Auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        },
      );

      const data = await response.json();

      if (data.succeeded || response.ok) {
        setToken(data.token);
        setUserId(data.userId);
        setSuccessMessage("OTP verified successfully!");
        setTimeout(() => {
          setStep(3);
          setSuccessMessage("");
        }, 1500);
      } else {
        setError(data.message || "Invalid or expired OTP. Please try again.");
      }
    } catch (err) {
      setError("Invalid or expired OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Set New Password
  const handleSetPassword = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Validate password strength (add your requirements)
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://localhost:7224/api/Auth/set-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            newPassword,
            confirmPassword,
            email,
          }),
        },
      );

      const data = await response.json();

      if (data.succeeded || response.ok) {
        setSuccessMessage(
          "Password reset successfully! Redirecting to login...",
        );
        setTimeout(() => {
          // Navigate to login page
          window.location.href = "/login";
        }, 2000);
      } else {
        setError(data.message || "Failed to reset password. Please try again.");
      }
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep(1);
    setOtp("");
    setError("");
    setSuccessMessage("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        {/* Logo Section */}
        <div className="flex flex-col items-center">
          {/* Replace with your actual logo */}
          <img
            src={experionLogo}
            alt="Experion Logo"
            width={140}
            className="mb-2"
          />
          <p className="text-sm text-gray-500 font-medium">
            ILP Repository Portal
          </p>
        </div>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <div className="mt-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                {/* Forgot Password? */}
              </h2>
              <p className="text-sm text-center text-gray-600">
                Enter your email address and we'll send you an OTP to reset your
                password.
              </p>
            </div>

            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white placeholder-gray-500 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-blue-600"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 font-medium">{error}</p>
            )}
            {successMessage && (
              <p className="text-sm text-green-600 font-medium">
                {successMessage}
              </p>
            )}

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isLoading}
              className="flex w-full justify-center rounded-md bg-blue-600 py-2 px-4 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                  />
                </svg>
              ) : (
                "Send OTP"
              )}
            </button>

            <div className="text-center">
              <a
                href="/login"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Back to Login
              </a>
            </div>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <div className="mt-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                Verify OTP
              </h2>
              <p className="text-sm text-center text-gray-600">
                Enter the 6-digit code sent to <strong>{email}</strong>
              </p>
            </div>

            <div>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                maxLength={6}
                className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white placeholder-gray-500 text-gray-900 text-center text-2xl tracking-widest focus:border-blue-600 focus:outline-none focus:ring-blue-600"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 font-medium">{error}</p>
            )}
            {successMessage && (
              <p className="text-sm text-green-600 font-medium">
                {successMessage}
              </p>
            )}

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={isLoading || otp.length !== 6}
              className="flex w-full justify-center rounded-md bg-blue-600 py-2 px-4 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                  />
                </svg>
              ) : (
                "Verify OTP"
              )}
            </button>

            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={handleBackToEmail}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Set New Password */}
        {step === 3 && (
          <div className="mt-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                Set New Password
              </h2>
              <p className="text-sm text-center text-gray-600">
                Create a strong password for your account
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  id="new-password"
                  name="new-password"
                  type="password"
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white placeholder-gray-500 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-blue-600"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white placeholder-gray-500 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-blue-600"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="text-xs text-gray-600">
              Password must be at least 8 characters long and contain uppercase,
              lowercase, numbers, and special characters.
            </div>

            {error && (
              <p className="text-sm text-red-600 font-medium">{error}</p>
            )}
            {successMessage && (
              <p className="text-sm text-green-600 font-medium">
                {successMessage}
              </p>
            )}

            <button
              type="button"
              onClick={handleSetPassword}
              disabled={isLoading}
              className="flex w-full justify-center rounded-md bg-blue-600 py-2 px-4 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                  />
                </svg>
              ) : (
                "Reset Password"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordFlow;
