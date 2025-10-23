import { useState, type ChangeEvent } from "react";
import { ChevronDown, ChevronUp, Eye, EyeOff, Save } from "lucide-react";

interface Sections {
  password: boolean;
  adminManagement: boolean;
  traineeAccess: boolean;
  timeline: boolean;
}

interface PasswordData {
  current: string;
  new: string;
  confirm: string;
}

export default function TraineeSettings() {
  const [sections, setSections] = useState<Sections>({
    password: true,
    adminManagement: false,
    traineeAccess: false,
    timeline: false,
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    current: "",
    new: "",
    confirm: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const toggleSection = (section: keyof Sections) => {
    setSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePasswordChange = (field: keyof PasswordData, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePassword = () => {
    if (passwordData.new !== passwordData.confirm) {
      alert("New passwords do not match!");
      return;
    }
    alert("Password updated successfully!");
    setPasswordData({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Admin</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          {/* Change Password Section */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleSection("password")}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="text-left">
                <h2 className="text-lg font-medium text-gray-900">
                  Change Password
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Update your account password
                </p>
              </div>
              {sections.password ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {sections.password && (
              <div className="px-6 pb-6 space-y-4">
                {(["current", "new", "confirm"] as (keyof PasswordData)[]).map(
                  (field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {field === "confirm"
                          ? "Confirm New Password"
                          : `${field} Password`}
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords[field] ? "text" : "password"}
                          value={passwordData[field]}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handlePasswordChange(field, e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Enter ${field} password`}
                        />
                        <button
                          onClick={() =>
                            setShowPasswords((prev) => ({
                              ...prev,
                              [field]: !prev[field],
                            }))
                          }
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords[field] ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ),
                )}

                <button
                  onClick={handleSavePassword}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Update Password
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
