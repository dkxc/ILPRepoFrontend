import { useState, type ChangeEvent } from "react";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Save,
  Mail,
} from "lucide-react";

interface Sections {
  password: boolean;
  adminManagement: boolean;
  traineeAccess: boolean;
  timeline: boolean;
  emailConfig: boolean;
}

interface PasswordData {
  current: string;
  new: string;
  confirm: string;
}

interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Trainee {
  id: number;
  name: string;
  email: string;
  daysRemaining: number;
}

interface TimelineSettings {
  activeStateDuration: number;
  sessionTimeout: number;
  autoLogoutAfter: number;
}

interface EmailConfig {
  subject: string;
  message: string;
  daysBeforeDue: number;
}

export default function AdminSettings() {
  const [sections, setSections] = useState<Sections>({
    password: false,
    adminManagement: false,
    traineeAccess: false,
    timeline: false,
    emailConfig: false,
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

  const [admins, setAdmins] = useState<Admin[]>([
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Admin" },
  ]);

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    role: "Admin",
  });

  const [trainees, setTrainees] = useState<Trainee[]>([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      daysRemaining: 15,
    },
  ]);

  const [newTrainee, setNewTrainee] = useState<{
    name: string;
    email: string;
    days: number | string;
  }>({
    name: "",
    email: "",
    days: 30,
  });

  const [timeline, setTimeline] = useState<TimelineSettings>({
    activeStateDuration: 700,
    sessionTimeout: 60,
    autoLogoutAfter: 120,
  });

  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    subject: "Project Due Date Reminder",
    message:
      "Hello,\n\nThis is a reminder that your project is due in 5 days.\n\nPlease ensure all work is completed on time.\n\nBest regards,\nAdmin Team",
    daysBeforeDue: 5,
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

  const handleAddAdmin = () => {
    if (!newAdmin.name || !newAdmin.email) {
      alert("Please fill in all fields");
      return;
    }
    setAdmins([...admins, { ...newAdmin, id: Date.now() }]);
    setNewAdmin({ name: "", email: "", role: "Admin" });
  };

  const handleRemoveAdmin = (id: number) => {
    setAdmins(admins.filter((admin) => admin.id !== id));
  };

  const handleAddTrainee = () => {
    if (!newTrainee.name || !newTrainee.email || !newTrainee.days) {
      alert("Please fill in all fields");
      return;
    }
    setTrainees([
      ...trainees,
      {
        ...newTrainee,
        id: Date.now(),
        daysRemaining: Number(newTrainee.days) || 0,
      },
    ]);
    setNewTrainee({ name: "", email: "", days: 30 });
  };

  const handleRemoveTrainee = (id: number) => {
    setTrainees(trainees.filter((trainee) => trainee.id !== id));
  };

  const handleTimelineChange = (
    field: keyof TimelineSettings,
    value: string,
  ) => {
    setTimeline((prev) => ({ ...prev, [field]: Number(value) || 0 }));
  };

  const handleSaveTimeline = () => {
    alert("Timeline settings saved successfully!");
  };

  const handleEmailConfigChange = (
    field: keyof EmailConfig,
    value: string | number,
  ) => {
    setEmailConfig((prev) => ({
      ...prev,
      [field]: field === "daysBeforeDue" ? Number(value) || 0 : value,
    }));
  };

  const handleSaveEmailConfig = () => {
    alert("Email configuration saved successfully!");
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

          {/* Admin Management Section */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleSection("adminManagement")}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="text-left">
                <h2 className="text-lg font-medium text-gray-900">
                  Admin Management
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Add or remove admin users
                </p>
              </div>
              {sections.adminManagement ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {sections.adminManagement && (
              <div className="px-6 pb-6">
                <div className="space-y-3 mb-4">
                  {admins.map((admin) => (
                    <div
                      key={admin.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {admin.name}
                        </p>
                        <p className="text-sm text-gray-500">{admin.email}</p>
                        <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {admin.role}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveAdmin(admin.id)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <h3 className="font-medium text-gray-900">Add New Admin</h3>
                  <input
                    type="text"
                    value={newAdmin.name}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Full Name"
                  />
                  <input
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Email Address"
                  />
                  <select
                    value={newAdmin.role}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, role: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                  <button
                    onClick={handleAddAdmin}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Admin
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Trainee Access Section */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleSection("traineeAccess")}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="text-left">
                <h2 className="text-lg font-medium text-gray-900">
                  Trainee Access Extension
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Grant temporary access to trainees
                </p>
              </div>
              {sections.traineeAccess ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {sections.traineeAccess && (
              <div className="px-6 pb-6">
                <div className="space-y-3 mb-4">
                  {trainees.map((trainee) => (
                    <div
                      key={trainee.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {trainee.name}
                        </p>
                        <p className="text-sm text-gray-500">{trainee.email}</p>
                        <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                          {trainee.daysRemaining} days remaining
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveTrainee(trainee.id)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <h3 className="font-medium text-gray-900">
                    Grant Trainee Access
                  </h3>
                  <input
                    type="text"
                    value={newTrainee.name}
                    onChange={(e) =>
                      setNewTrainee({ ...newTrainee, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Full Name"
                  />
                  <input
                    type="email"
                    value={newTrainee.email}
                    onChange={(e) =>
                      setNewTrainee({ ...newTrainee, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Email Address"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Access Duration (Days)
                    </label>
                    <input
                      type="number"
                      value={newTrainee.days}
                      onChange={(e) =>
                        setNewTrainee({ ...newTrainee, days: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="30"
                      min="1"
                    />
                  </div>
                  <button
                    onClick={handleAddTrainee}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Grant Access
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Timeline Settings Section */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleSection("timeline")}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="text-left">
                <h2 className="text-lg font-medium text-gray-900">
                  Ongoing Trainee Access
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Configure access for trainee in ongoing batchs
                </p>
              </div>
              {sections.timeline ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {sections.timeline && (
              <div className="px-6 pb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Active State Duration (days)
                  </label>
                  <input
                    type="number"
                    value={timeline.activeStateDuration}
                    onChange={(e) =>
                      handleTimelineChange(
                        "activeStateDuration",
                        e.target.value,
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    How long an account remains active before requiring
                    reactivation for ongoing trainee
                  </p>
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    value={timeline.sessionTimeout}
                    onChange={(e) =>
                      handleTimelineChange('sessionTimeout', e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="5"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Duration of inactivity before session expires
                  </p>
                </div> */}

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auto Logout After (minutes)
                  </label>
                  <input
                    type="number"
                    value={timeline.autoLogoutAfter}
                    onChange={(e) =>
                      handleTimelineChange('autoLogoutAfter', e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="10"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum session duration before forced logout
                  </p>
                </div> */}

                <button
                  onClick={handleSaveTimeline}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Timeline Settings
                </button>
              </div>
            )}
          </div>

          {/* Email Configuration Section */}
          <div>
            <button
              onClick={() => toggleSection("emailConfig")}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="text-left">
                <h2 className="text-lg font-medium text-gray-900">
                  Automatic Email Configuration
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Configure automatic reminder emails for project due dates
                </p>
              </div>
              {sections.emailConfig ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {sections.emailConfig && (
              <div className="px-6 pb-6 space-y-4">
                {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-2">
                    <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        Automatic Email Reminders
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        Emails will be sent automatically before project due dates. Use {'{days}'} in your message to insert the number of days remaining.
                      </p>
                    </div>
                  </div>
                </div> */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Days Before Due Date
                  </label>
                  <input
                    type="number"
                    value={emailConfig.daysBeforeDue}
                    onChange={(e) =>
                      handleEmailConfigChange("daysBeforeDue", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    placeholder="5"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Send reminder email this many days before the project due
                    date
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Subject
                  </label>
                  <input
                    type="text"
                    value={emailConfig.subject}
                    onChange={(e) =>
                      handleEmailConfigChange("subject", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Project Due Date Reminder"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Message
                  </label>
                  <textarea
                    value={emailConfig.message}
                    onChange={(e) =>
                      handleEmailConfigChange("message", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={8}
                    placeholder="Enter your email message here. Use {days} to insert the number of days remaining."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {/* Use {'{days}'} as a placeholder for the number of days remaining before the due date */}
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </p>
                  <div className="bg-white p-3 rounded border border-gray-300">
                    <p className="text-xs font-semibold text-gray-600 mb-1">
                      Subject: {emailConfig.subject}
                    </p>
                    <p className="text-xs text-gray-600 whitespace-pre-wrap">
                      {emailConfig.message.replace(
                        "{days}",
                        emailConfig.daysBeforeDue.toString(),
                      )}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleSaveEmailConfig}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Email Configuration
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
