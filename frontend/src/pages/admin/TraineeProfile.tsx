//pages/TraineeProfilee.tsx
import { useState } from "react";
import InfoCard from "../../features/ui/TraineeProfile/InfoCard";
import EditModal from "../../features/ui/TraineeProfile/EditModel";

function TraineeProfile() {
  // Modal state
  const [modalState, setModalState] = useState({
    opened: false,
    type: null as "personal" | "contact" | "emergency" | "address" | null,
    title: "",
    initialData: {} as any,
  });

  // State for all the data
  const [personalInfoData, setPersonalInfoData] = useState({
    fullName: "Arjun Sharma",
    batch: "ILP 2025-26 Batch-1",
    bloodGroup: "B+",
    adhaarId: "123456789012",
    healthConditions: "None",
    personalInterests: "Cricket, Photography, Reading",
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
    residentialAddress: "123 MG Road, Bangalore, Karnataka 560001",
  });

  // Convert data to display format for InfoCard
  const personalInfo = [
    {
      label: "Full Name",
      value: personalInfoData.fullName,
      gridCols: "single" as const,
    },
    {
      label: "Batch",
      value: personalInfoData.batch,
      gridCols: "single" as const,
    },
    {
      label: "Blood Group",
      value: personalInfoData.bloodGroup,
      gridCols: "single" as const,
    },
    {
      label: "Adhaar ID",
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

  const contactInfo = [
    {
      type: "phone" as const,
      label: "Phone Number",
      value: contactInfoData.phoneNumber,
    },
    { type: "email" as const, label: "Email", value: contactInfoData.email },
  ];

  const emergencyContact = [
    {
      type: "phone" as const,
      label: "Contact Number",
      value: emergencyContactData.contactNumber,
    },
    {
      type: "text" as const,
      label: "Relationship",
      value: emergencyContactData.relationship,
    },
  ];

  const addressInfo = [
    {
      label: "Residential Address",
      value: addressInfoData.residentialAddress,
      gridCols: "double" as const,
    },
  ];

  // Modal handlers
  const openModal = (
    type: "personal" | "contact" | "emergency" | "address",
    title: string,
    data: any
  ) => {
    console.log("Opening modal:", { type, title, data });
    setModalState({
      opened: true,
      type,
      title,
      initialData: data,
    });
  };

  const closeModal = () => {
    console.log("Closing modal");
    setModalState({
      opened: false,
      type: null,
      title: "",
      initialData: {},
    });
  };

  const handleSave = (data: any) => {
    console.log("Saving data for type:", modalState.type, data);

    switch (modalState.type) {
      case "personal":
        setPersonalInfoData(data);
        console.log("Updated personal info:", data);
        break;
      case "contact":
        setContactInfoData(data);
        console.log("Updated contact info:", data);
        break;
      case "emergency":
        setEmergencyContactData(data);
        console.log("Updated emergency contact:", data);
        break;
      case "address":
        setAddressInfoData(data);
        console.log("Updated address info:", data);
        break;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div
          className="w-10 h-10 rounded-4xl flex items-center justify-center text-white font-semibold text-base"
          style={{ backgroundColor: "#2563EB" }}
        >
          AS
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#565E6C" }}>
            {personalInfoData.fullName}
          </h1>
          <div className="flex items-center mt-1">
            <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span className="text-xs text-green-700 font-medium">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Personal Information and Address */}
        <div className="lg:col-span-2 space-y-4">
          <InfoCard
            title="Personal Information"
            items={personalInfo}
            onEdit={() =>
              openModal(
                "personal",
                "Edit Personal Information",
                personalInfoData
              )
            }
            titleIcon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            }
          />

          <InfoCard
            title="Address Information"
            items={addressInfo}
            onEdit={() =>
              openModal("address", "Edit Address Information", addressInfoData)
            }
            titleIcon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            }
          />
        </div>

        {/* Right Column - Contact Information */}
        <div className="space-y-4">
          <InfoCard
            title="Contact Information"
            contacts={contactInfo}
            onEdit={() =>
              openModal("contact", "Edit Contact Information", contactInfoData)
            }
            titleIcon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            }
          />

          <InfoCard
            title="Emergency Contact"
            contacts={emergencyContact}
            onEdit={() =>
              openModal(
                "emergency",
                "Edit Emergency Contact",
                emergencyContactData
              )
            }
            titleIcon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            }
          />
        </div>
      </div>

      {/* Edit Modal */}
      {modalState.opened && modalState.type && (
        <EditModal
          opened={modalState.opened}
          onClose={closeModal}
          onSave={handleSave}
          title={modalState.title}
          type={modalState.type}
          initialData={modalState.initialData}
        />
      )}
    </div>
  );
}

export default TraineeProfile;
