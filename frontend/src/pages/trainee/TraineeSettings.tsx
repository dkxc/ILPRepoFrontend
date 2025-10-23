import { useState, type ChangeEvent } from "react";
import { ChevronDown, Eye, EyeOff, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../features/ui/Button";
import { AnimatedConfirmButton } from "../../features/ui/custombuttons/AnimatedConfirmButton";
import { toast } from "sonner";

interface Sections {
  password: boolean;
  dashboard: boolean;
}

interface PasswordData {
  current: string;
  new: string;
  confirm: string;
}

export default function TraineeSettings() {
  const [sections, setSections] = useState<Sections>({
    password: false,
    dashboard: false,
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
      toast.error("New passwords do not match!");
      return;
    }
    toast.success("Password updated successfully!");
    setPasswordData({ current: "", new: "", confirm: "" });
  };

  const onResetLayoutConfirm = () => {
    window.localStorage.removeItem("dashboard-layouts");
    toast.success("Dashboard layout has been reset.");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <div>
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-text-base">Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Trainee</p>
          </div>

          <div className="bg-card rounded-lg shadow-sm">
            {/* Change Password Section */}
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleSection("password")}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-menuitem transition-colors"
              >
                <div className="text-left">
                  <h2 className="text-lg font-medium text-text-base">
                    Change Password
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Update your account password
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: sections.password ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </motion.div>
              </button>

              <AnimatePresence>
                {sections.password && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="px-6 pb-6 space-y-4">
                      {(
                        ["current", "new", "confirm"] as (keyof PasswordData)[]
                      ).map((field) => (
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
                      ))}

                      <Button onClick={handleSavePassword}>
                        <Save className="w-4 h-4" />
                        Update Password
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-text-base">
              Additional Settings
            </h2>
          </div>

          <div className="bg-card rounded-lg shadow-sm">
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleSection("dashboard")}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-menuitem transition-colors"
              >
                <div className="text-left">
                  <h2 className="text-lg font-medium text-text-base">
                    Dashboard Settings
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Customize your dashboard experience
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: sections.dashboard ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {sections.dashboard && (
                  <motion.div
                    key="dashboard-content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <ul className="divide-y divide-gray-200">
                      <li className="px-6 py-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-text-base">
                            Reset Layout
                          </h3>
                          <p className="text-sm text-gray-500">
                            Restore the dashboard card layout to default layout.
                          </p>
                        </div>
                        <div>
                          <AnimatedConfirmButton
                            onConfirm={onResetLayoutConfirm}
                            variant="destructive"
                            size="sm"
                            confirmText="Confirm"
                            successText="Reset!"
                          >
                            Reset Layout
                          </AnimatedConfirmButton>
                        </div>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
