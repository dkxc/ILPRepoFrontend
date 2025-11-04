import { useState, type ChangeEvent, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import ApiService from "../../services/apiService";

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
  username: string; // Changed from 'name' to 'username' to match API
  email: string;
  role: number; // Changed to number to match API (0 = Admin)
  isActive: boolean;
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
  serviceName: string;
  serviceDescription: string;
  daysBeforeDueDate: number;
  scheduledTime: string;
  emailSubject: string;
  emailBodyTemplate: string;
  isActive: boolean;
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

  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);
  const [isRemovingAdmin, setIsRemovingAdmin] = useState<number | null>(null);

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    role: "Admin",
  });

  const [isAddingAdmin, setIsAddingAdmin] = useState(false);

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

  // Default email configuration
  const defaultEmailConfig: EmailConfig = {
    serviceName: "DocumentRequestReminder",
    serviceDescription:
      "Sends reminder emails to team members about upcoming document submission deadlines",
    daysBeforeDueDate: 365,
    scheduledTime: "09:00",
    emailSubject: "Reminder: Document Submission Due in {DaysRemaining} Days",
    emailBodyTemplate: `Dear {RecipientName},\n\nThis is a friendly reminder that the following document is due soon:\n\nProject: {ProjectName}\nDocument: {DocumentName}\nDue Date: {DueDate}\nDays Remaining: {DaysRemaining}\nRequest Date: {RequestDate}\n\nPlease ensure you submit the required document before the deadline.\n\nIf you have any questions or need assistance, please contact your project coordinator.\n\nBest regards,\nILP Management Team`,
    isActive: true,
  };

  const [emailConfig, setEmailConfig] =
    useState<EmailConfig>(defaultEmailConfig);
  const [isLoadingEmailConfig, setIsLoadingEmailConfig] = useState(false);
  const [isSavingEmailConfig, setIsSavingEmailConfig] = useState(false);

  // Fetch email configuration and admins on component mount
  useEffect(() => {
    fetchEmailConfiguration();
    fetchAdmins();
  }, []);

  // Fetch all admins from API
  const fetchAdmins = async () => {
    setIsLoadingAdmins(true);
    try {
      const response = await ApiService.get("/User/admins");
      console.log("Admins API response:", response);

      if (response && Array.isArray(response.data)) {
        setAdmins(response.data);
      } else if (Array.isArray(response)) {
        // If response is directly the array
        setAdmins(response);
      } else {
        console.error("Unexpected response format:", response);
        toast.error("Failed to load admins: unexpected response format");
      }
    } catch (error: any) {
      console.error("Failed to fetch admins:", error);
      toast.error("Failed to load admins");
    } finally {
      setIsLoadingAdmins(false);
    }
  };

  const fetchEmailConfiguration = async () => {
    setIsLoadingEmailConfig(true);
    try {
      const response = await ApiService.get("/EmailConfiguration/1");
      console.log("hi");
      console.log("API Response:", response); // Debug log
      console.log(response.data);
      if (response && typeof response === "object") {
        // Ensure all required fields are present, fallback to defaults if missing
        setEmailConfig({
          serviceName:
            response.data.serviceName || defaultEmailConfig.serviceName,
          serviceDescription:
            response.data.serviceDescription ||
            defaultEmailConfig.serviceDescription,
          daysBeforeDueDate:
            response.data.daysBeforeDueDate ||
            defaultEmailConfig.daysBeforeDueDate,
          scheduledTime:
            response.data.scheduledTime || defaultEmailConfig.scheduledTime,
          emailSubject:
            response.data.emailSubject || defaultEmailConfig.emailSubject,
          emailBodyTemplate:
            response.data.emailBodyTemplate ||
            defaultEmailConfig.emailBodyTemplate,
          isActive: response.data.isActive,
        });
      } else {
        // If response is invalid, use defaults
        setEmailConfig(defaultEmailConfig);
      }
    } catch (error: any) {
      console.error("Failed to fetch email configuration:", error);
      toast.error("Failed to load email configuration");
      // Use defaults on error
      setEmailConfig(defaultEmailConfig);
    } finally {
      setIsLoadingEmailConfig(false);
    }
  };

  const toggleSection = (section: keyof Sections) => {
    setSections((prev) => ({ ...prev, [section]: !prev[section] }));

    // Fetch fresh admin data when opening admin management section
    if (section === "adminManagement" && !sections.adminManagement) {
      fetchAdmins();
    }
  };

  const handlePasswordChange = (field: keyof PasswordData, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePassword = async () => {
    if (passwordData.new !== passwordData.confirm) {
      toast.error("New passwords do not match!");
      return;
    }

    if (!passwordData.current || !passwordData.new) {
      toast.error("Please fill in all password fields!");
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const response = await ApiService.put("/User/update-password", {
        currentPassword: passwordData.current,
        newPassword: passwordData.new,
      });

      console.log("Password update response:", response);

      // Check if the response has the custom format
      if (response && typeof response === "object" && "status" in response) {
        if (response.succeeded) {
          toast.success("Password updated successfully!");
          setPasswordData({ current: "", new: "", confirm: "" });
        } else {
          toast.error(response.message || "Failed to update password");
        }
      } else {
        // Standard response format
        toast.success("Password updated successfully!");
        setPasswordData({ current: "", new: "", confirm: "" });
      }
    } catch (error: any) {
      console.error("Password update error:", error);
      toast.error(
        error.message || "Failed to update password. Please try again.",
      );
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsAddingAdmin(true);

    try {
      const response = await ApiService.post("/User", {
        username: newAdmin.name,
        email: newAdmin.email,
        password: newAdmin.password,
        role: 0, // 0 = Admin
        isActive: true,
      });

      console.log("Add admin response:", response);

      // Check if the response has the custom format
      if (response && typeof response === "object" && "status" in response) {
        if (response.succeeded) {
          toast.success("Admin added successfully!");
          // Refresh the admin list
          await fetchAdmins();
          setNewAdmin({ name: "", email: "", password: "", role: "Admin" });
        } else {
          toast.error(response.message || "Failed to add admin");
        }
      } else {
        // Standard response format
        toast.success("Admin added successfully!");
        await fetchAdmins();
        setNewAdmin({ name: "", email: "", password: "", role: "Admin" });
      }
    } catch (error: any) {
      console.error("Add admin error:", error);
      toast.error(error.message || "Failed to add admin. Please try again.");
    } finally {
      setIsAddingAdmin(false);
    }
  };

  const handleRemoveAdmin = async (id: number) => {
    setIsRemovingAdmin(id);

    try {
      const response = await ApiService.delete(`/User/${id}`);

      if (response && typeof response === "object" && "status" in response) {
        if (response.succeeded) {
          toast.success("Admin removed successfully!");
          setAdmins(admins.filter((admin) => admin.id !== id));
        } else {
          toast.error(response.message || "Failed to remove admin");
        }
      } else {
        // Standard response format
        toast.success("Admin removed successfully!");
        setAdmins(admins.filter((admin) => admin.id !== id));
      }
    } catch (error: any) {
      console.error("Remove admin error:", error);
      toast.error(error.message || "Failed to remove admin. Please try again.");
    } finally {
      setIsRemovingAdmin(null);
    }
  };

  const handleAddTrainee = () => {
    if (!newTrainee.name || !newTrainee.email || !newTrainee.days) {
      toast.error("Please fill in all fields");
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
    toast.success("Trainee access granted successfully!");
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
    toast.success("Timeline settings saved successfully!");
  };

  const handleEmailConfigChange = (
    field: keyof EmailConfig,
    value: string | number | boolean,
  ) => {
    setEmailConfig((prev) => ({
      ...prev,
      [field]:
        field === "daysBeforeDueDate" || field === "isActive"
          ? value
          : String(value),
    }));
  };

  const handleSaveEmailConfig = async () => {
    setIsSavingEmailConfig(true);

    try {
      // Prepare the data for API - only send editable fields
      const updateData = {
        daysBeforeDueDate: emailConfig.daysBeforeDueDate,
        scheduledTime: emailConfig.scheduledTime,
        emailSubject: emailConfig.emailSubject,
        emailBodyTemplate: emailConfig.emailBodyTemplate,
        isActive: emailConfig.isActive,
        // These fields should not be changed as per requirements
        serviceName: "DocumentRequestReminder",
        serviceDescription:
          "Sends reminder emails to team members about upcoming document submission deadlines",
      };

      const response = await ApiService.put(
        "/EmailConfiguration/1",
        updateData,
      );

      if (response && typeof response === "object") {
        toast.success("Email configuration saved successfully!");
      } else {
        toast.success("Email configuration saved successfully!");
      }
    } catch (error: any) {
      console.error("Failed to save email configuration:", error);
      toast.error("Failed to save email configuration");
    } finally {
      setIsSavingEmailConfig(false);
    }
  };

  // Safe preview function
  const getEmailPreview = () => {
    const template =
      emailConfig?.emailBodyTemplate || defaultEmailConfig.emailBodyTemplate;

    return template
      .replace(/{RecipientName}/g, "John Doe")
      .replace(/{ProjectName}/g, "Project Alpha")
      .replace(/{DocumentName}/g, "Quarterly Report")
      .replace(/{DueDate}/g, "2024-12-31")
      .replace(
        /{DaysRemaining}/g,
        (emailConfig?.daysBeforeDueDate || 365).toString(),
      )
      .replace(/{RequestDate}/g, "2024-01-01");
  };

  // Toggle switch component for isActive
  const ToggleSwitch = ({
    isActive,
    onToggle,
  }: {
    isActive: boolean;
    onToggle: (value: boolean) => void;
  }) => {
    return (
      <button
        type="button"
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          isActive ? "bg-blue-600" : "bg-gray-200"
        }`}
        onClick={() => onToggle(!isActive)}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isActive ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    );
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
                          disabled={isUpdatingPassword}
                        />
                        <button
                          onClick={() =>
                            setShowPasswords((prev) => ({
                              ...prev,
                              [field]: !prev[field],
                            }))
                          }
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                          disabled={isUpdatingPassword}
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
                  disabled={isUpdatingPassword}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {isUpdatingPassword ? "Updating..." : "Update Password"}
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
                  {isLoadingAdmins ? (
                    <div className="text-center py-4">
                      <p className="text-gray-500">Loading admins...</p>
                    </div>
                  ) : admins.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-gray-500">No admins found</p>
                    </div>
                  ) : (
                    admins.map((admin) => (
                      <div
                        key={admin.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {admin.username}
                          </p>
                          <p className="text-sm text-gray-500">{admin.email}</p>
                          <div className="flex gap-2 mt-1">
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                              {admin.role === 0
                                ? "Admin"
                                : `Role: ${admin.role}`}
                            </span>
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded ${
                                admin.isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {admin.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveAdmin(admin.id)}
                          disabled={isRemovingAdmin === admin.id}
                          className="text-red-600 hover:text-red-700 p-2 disabled:text-red-300 disabled:cursor-not-allowed"
                          title="Remove Admin"
                        >
                          {isRemovingAdmin === admin.id ? (
                            <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    ))
                  )}
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
                    placeholder="Enter username"
                    disabled={isAddingAdmin}
                  />
                  <input
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address"
                    disabled={isAddingAdmin}
                  />
                  <input
                    type="password"
                    value={newAdmin.password}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, password: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter password"
                    disabled={isAddingAdmin}
                  />
                  <select
                    value={newAdmin.role}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, role: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isAddingAdmin}
                  >
                    <option value="Admin">Admin</option>
                  </select>
                  <button
                    onClick={handleAddAdmin}
                    disabled={isAddingAdmin}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                    {isAddingAdmin ? "Adding..." : "Add Admin"}
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
                    placeholder="Enter full name"
                  />
                  <input
                    type="email"
                    value={newTrainee.email}
                    onChange={(e) =>
                      setNewTrainee({ ...newTrainee, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address"
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
                      placeholder="Enter number of days"
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
                    Trainee Active Days
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
                  Configure automatic reminder emails for document submission
                  deadlines
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
                {isLoadingEmailConfig ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">
                      Loading email configuration...
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Service Info (Read-only) */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Service Information
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-500">
                            Service Name
                          </label>
                          <p className="text-sm text-gray-900">
                            {emailConfig?.serviceName ||
                              defaultEmailConfig.serviceName}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500">
                            Service Description
                          </label>
                          <p className="text-sm text-gray-900">
                            {emailConfig?.serviceDescription ||
                              defaultEmailConfig.serviceDescription}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Enable Email Service
                        </label>
                        <p className="text-xs text-gray-500">
                          Turn on/off automatic email reminders
                        </p>
                      </div>
                      <ToggleSwitch
                        isActive={
                          emailConfig?.isActive ?? defaultEmailConfig.isActive
                        }
                        onToggle={(value) =>
                          handleEmailConfigChange("isActive", value)
                        }
                      />
                    </div>

                    {/* Editable Fields */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Days Before Due Date
                      </label>
                      <input
                        type="number"
                        value={
                          emailConfig?.daysBeforeDueDate ||
                          defaultEmailConfig.daysBeforeDueDate
                        }
                        onChange={(e) =>
                          handleEmailConfigChange(
                            "daysBeforeDueDate",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="1"
                        placeholder={`Current: ${emailConfig?.daysBeforeDueDate || defaultEmailConfig.daysBeforeDueDate} days`}
                        disabled={isSavingEmailConfig}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Send reminder email this many days before the document
                        due date
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Scheduled Time
                      </label>
                      <input
                        type="time"
                        value={
                          emailConfig?.scheduledTime ||
                          defaultEmailConfig.scheduledTime
                        }
                        onChange={(e) =>
                          handleEmailConfigChange(
                            "scheduledTime",
                            e.target.value,
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Current: ${emailConfig?.scheduledTime || defaultEmailConfig.scheduledTime}`}
                        disabled={isSavingEmailConfig}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Daily time to send reminder emails
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Subject
                      </label>
                      <input
                        type="text"
                        value={
                          emailConfig?.emailSubject ||
                          defaultEmailConfig.emailSubject
                        }
                        onChange={(e) =>
                          handleEmailConfigChange(
                            "emailSubject",
                            e.target.value,
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Current: ${emailConfig?.emailSubject || defaultEmailConfig.emailSubject}`}
                        disabled={isSavingEmailConfig}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Body Template
                      </label>
                      <textarea
                        value={
                          emailConfig?.emailBodyTemplate ||
                          defaultEmailConfig.emailBodyTemplate
                        }
                        onChange={(e) =>
                          handleEmailConfigChange(
                            "emailBodyTemplate",
                            e.target.value,
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={12}
                        placeholder={`Current template:\n${emailConfig?.emailBodyTemplate || defaultEmailConfig.emailBodyTemplate}`}
                        disabled={isSavingEmailConfig}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Available variables: {"{RecipientName}"},{" "}
                        {"{ProjectName}"}, {"{DocumentName}"}, {"{DueDate}"},{" "}
                        {"{DaysRemaining}"}, {"{RequestDate}"}
                      </p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Preview
                      </p>
                      <div className="bg-white p-4 rounded border border-gray-300">
                        <p className="text-sm font-semibold text-gray-600 mb-2">
                          Subject:{" "}
                          {emailConfig?.emailSubject ||
                            defaultEmailConfig.emailSubject}
                        </p>
                        <div className="text-sm text-gray-600 whitespace-pre-wrap">
                          {getEmailPreview()}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSaveEmailConfig}
                      disabled={isSavingEmailConfig}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      {isSavingEmailConfig
                        ? "Saving..."
                        : "Save Email Configuration"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
