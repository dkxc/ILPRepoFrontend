import { useState } from "react";
import { User, Briefcase, Phone, MapPin } from "lucide-react";
import InfoCard from "../../features/ui/TraineeProfile/InfoCard";
import EditModal from "../../features/ui/TraineeProfile/EditModel";

function TraineeProfile() {
  // Modal state
  const [modalState, setModalState] = useState({
    opened: false,
    type: null as
      | "personal"
      | "contact"
      | "emergency"
      | "address"
      | "official"
      | "status"
      | null,
    title: "",
    initialData: {} as any,
  });

  // Trainee active/inactive status
  const [isActive, setIsActive] = useState(true);

  // State for all data
  const [personalInfoData, setPersonalInfoData] = useState({
    fullName: "Arjun Sharma",
    bloodGroup: "B+",
    adhaarId: "123456789012",
    healthConditions: "None",
    personalInterests: "Cricket, Photography, Reading",
  });

  const [officialInfoData, setOfficialInfoData] = useState({
    batch: "ILP 2025-26 Batch-1",
    techStack: "React, Node.js, MongoDB",
    projectsInvolved: "Carbon Zero, HR Portal",
    buddy: "Rohit Verma",
    ojtMentor: "Anita Das",
    duAllocation: "Banking DU",
    location: "Bangalore",
  });

  const [contactInfoData, setContactInfoData] = useState({
    phoneNumber: "9876543210",
    email: "arjun.sharma@example.com",
  });

  const [emergencyContactData, setEmergencyContactData] = useState({
    contactNumber: "9876543211",
    relationship: "Father",
  });

  const [addressInfoData, setAddressInfoData] = useState({
    currentAddress: "123 MG Road, Bangalore, Karnataka 560001",
    contactNumber: "9876543210",
    permanentAddress: "45 Park Avenue, Chennai, Tamil Nadu 600001",
  });

  // Card data formatting
  const personalInfo = [
    {
      label: "Full Name",
      value: personalInfoData.fullName,
      gridCols: "single" as const,
    },
    {
      label: "Blood Group",
      value: personalInfoData.bloodGroup,
      gridCols: "single" as const,
    },
    {
      label: "Aadhaar ID",
      value: personalInfoData.adhaarId,
      gridCols: "single" as const,
    },
    {
      label: "Health Conditions",
      value: personalInfoData.healthConditions,
      gridCols: "single" as const,
    },
    {
      label: "Personal Interests",
      value: personalInfoData.personalInterests,
      gridCols: "double" as const,
    },
  ];

  const officialInfo = [
    {
      label: "Batch",
      value: officialInfoData.batch,
      gridCols: "double" as const,
    },
    {
      label: "Tech Stack",
      value: officialInfoData.techStack,
      gridCols: "single" as const,
    },
    {
      label: "Projects Involved",
      value: officialInfoData.projectsInvolved,
      gridCols: "single" as const,
    },
    {
      label: "Buddy",
      value: officialInfoData.buddy,
      gridCols: "single" as const,
    },
    {
      label: "OJT Mentor",
      value: officialInfoData.ojtMentor,
      gridCols: "single" as const,
    },
    {
      label: "DU Allocation",
      value: officialInfoData.duAllocation,
      gridCols: "single" as const,
    },
    {
      label: "Location",
      value: officialInfoData.location,
      gridCols: "single" as const,
    },
  ];

  const contactAndEmergencyInfo = [
    {
      type: "phone" as const,
      label: "Phone Number",
      value: contactInfoData.phoneNumber,
      gridCols: "single" as const,
    },
    {
      type: "email" as const,
      label: "Email",
      value: contactInfoData.email,
      gridCols: "single" as const,
    },
    {
      type: "phone" as const,
      label: "Emergency Contact Number",
      value: emergencyContactData.contactNumber,
      gridCols: "single" as const,
    },
    {
      type: "text" as const,
      label: "Relationship",
      value: emergencyContactData.relationship,
      gridCols: "single" as const,
    },
  ];

  const addressInfo = [
    {
      label: "Current Address",
      value: addressInfoData.currentAddress,
      gridCols: "single" as const,
    },
    {
      label: "Contact Number",
      value: addressInfoData.contactNumber,
      gridCols: "single" as const,
    },
    {
      label: "Permanent Address",
      value: addressInfoData.permanentAddress,
      gridCols: "double" as const,
    },
  ];

  // Modal handlers
  const openModal = (
    type:
      | "personal"
      | "contact"
      | "emergency"
      | "address"
      | "official"
      | "status",
    title: string,
    data: any
  ) => {
    setModalState({ opened: true, type, title, initialData: data });
  };

  const closeModal = () =>
    setModalState({ opened: false, type: null, title: "", initialData: {} });

  const handleSave = (data: any) => {
    switch (modalState.type) {
      case "personal":
        setPersonalInfoData(data);
        break;
      case "official":
        setOfficialInfoData(data);
        break;
      case "contact":
        setContactInfoData(data);
        break;
      case "emergency":
        setEmergencyContactData(data);
        break;
      case "address":
        setAddressInfoData(data);
        break;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-4xl flex items-center justify-center text-white font-semibold text-base"
            style={{ backgroundColor: "#2563EB" }}
          >
            AS
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#565E6C]">
              {personalInfoData.fullName}
            </h1>

            {/* ✅ Clickable Badge */}
            <div className="flex items-center mt-1">
              <button
                onClick={() =>
                  openModal(
                    "status",
                    isActive ? "Mark Inactive" : "Mark Active",
                    {}
                  )
                }
                className={`flex items-center px-3 py-1 rounded-full transition duration-200 ${
                  isActive
                    ? "bg-green-100 hover:bg-green-200"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    isActive ? "bg-green-400" : "bg-gray-500"
                  }`}
                ></div>
                <span
                  className={`text-xs font-medium ${
                    isActive ? "text-green-700" : "text-gray-700"
                  }`}
                >
                  {isActive ? "Active" : "Inactive"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* View Results Button */}
        <button
          onClick={() => console.log("View Results clicked")} // Replace with navigation logic
          className="px-3 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
        >
          View Results
        </button>
      </div>

      {/* === Row 1 === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <InfoCard
          title={
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-blue-500" />
              <span>Personal Information</span>
            </div>
          }
          items={personalInfo}
          onEdit={() =>
            openModal("personal", "Edit Personal Information", personalInfoData)
          }
        />

        <InfoCard
          title={
            <div className="flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-blue-500" />
              <span>Official Information</span>
            </div>
          }
          items={officialInfo}
          onEdit={() =>
            openModal("official", "Edit Official Information", officialInfoData)
          }
        />
      </div>

      {/* === Row 2 === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard
          title={
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-blue-500" />
              <span>Contact & Emergency Information</span>
            </div>
          }
          items={contactAndEmergencyInfo}
          onEdit={() =>
            openModal("contact", "Edit Contact & Emergency Information", {
              ...contactInfoData,
              ...emergencyContactData,
            })
          }
        />

        <InfoCard
          title={
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span>Address Information</span>
            </div>
          }
          items={addressInfo}
          onEdit={() =>
            openModal("address", "Edit Address Information", addressInfoData)
          }
        />
      </div>

      {/* === Modal Section === */}
      {modalState.opened &&
        modalState.type &&
        (modalState.type === "status" ? (
          // ✅ Status Confirmation Modal
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                {isActive
                  ? "Mark trainee as Inactive?"
                  : "Mark trainee as Active?"}
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                {isActive
                  ? "This will mark the trainee as inactive. They will no longer appear in the active trainees list."
                  : "This will mark the trainee as active again."}
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={closeModal}
                  className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsActive(!isActive);
                    closeModal();
                  }}
                  className={`px-3 py-1 text-sm rounded-lg text-white ${
                    isActive
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {isActive ? "Mark Inactive" : "Mark Active"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <EditModal
            opened={modalState.opened}
            onClose={closeModal}
            onSave={handleSave}
            title={modalState.title}
            type={modalState.type}
            initialData={modalState.initialData}
          />
        ))}
    </div>
  );
}

export default TraineeProfile;
