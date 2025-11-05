import { useState, useEffect } from "react";
import { User, Briefcase, Phone, MapPin, FileText } from "lucide-react";
import InfoCard from "../../features/ui/TraineeProfile/InfoCard";
import EditModal from "../../features/ui/TraineeProfile/EditModel";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { traineeService } from "../../services/traineeService";
import { notifications } from "@mantine/notifications";

function TraineeProfile() {
  const { id } = useParams<{ id: string }>();
  const traineeId = id ? parseInt(id) : null;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Store the actual trainee ID from backend (different from userId)
  const [actualTraineeId, setActualTraineeId] = useState<number | null>(null);

  // Fetch all trainees and filter by ID
  const {
    data: apiTraineesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["allTrainees"],
    queryFn: () => traineeService.getAllTrainees(),
    staleTime: 30000,
  });

  // Fetch trainee training details
  const { data: apiTrainingDetails } = useQuery({
    queryKey: ["trainingDetails", actualTraineeId],
    queryFn: () => traineeService.getTraineeTrainingDetails(actualTraineeId!),
    enabled: !!actualTraineeId,
    staleTime: 30000,
  });

  // Fetch trainee specialization data (tech stack and projects involved)
  const { data: apiSpecializationData } = useQuery({
    queryKey: ["specializationData", actualTraineeId],
    queryFn: () =>
      traineeService.getTraineeSpecializationData(actualTraineeId!),
    enabled: !!actualTraineeId,
    staleTime: 30000,
  });

  // Update trainee mutation
  const updateTraineeMutation = useMutation({
    mutationFn: (data: any) => {
      if (!actualTraineeId) {
        throw new Error("Trainee ID not found");
      }
      return traineeService.updateTrainee(actualTraineeId, data);
    },
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Trainee details updated successfully",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["allTrainees"] });
    },
    onError: (error: any) => {
      notifications.show({
        title: "Error",
        message:
          error.response?.data?.message || "Failed to update trainee details",
        color: "red",
      });
    },
  });

  // Update training details mutation
  const updateTrainingMutation = useMutation({
    mutationFn: (data: any) => {
      if (!actualTraineeId) {
        throw new Error("Trainee ID not found");
      }
      return traineeService.updateTraineeTrainingDetails(actualTraineeId, data);
    },
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Training information updated successfully",
        color: "green",
      });
      queryClient.invalidateQueries({
        queryKey: ["trainingDetails", actualTraineeId],
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: "Error",
        message:
          error.response?.data?.message ||
          "Failed to update training information",
        color: "red",
      });
    },
  });

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
    batch: "Loading...",
    techStack: "Loading...",
    projectsInvolved: "Loading...",
    buddy: "Loading...",
    ojtMentor: "Loading...",
    duAllocation: "Loading...",
    location: "Loading...",
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

  // Update state when API data is loaded
  useEffect(() => {
    if (apiTraineesData && traineeId) {
      const traineesArray = (apiTraineesData as any).data || apiTraineesData;

      if (Array.isArray(traineesArray)) {
        const trainee = traineesArray.find((t: any) => t.userId === traineeId);

        if (trainee) {
          // Store the actual trainee ID from backend
          setActualTraineeId(trainee.id);

          // Update personal info
          setPersonalInfoData({
            fullName: trainee.username || "N/A",
            bloodGroup: trainee.bloodGroup || "N/A",
            adhaarId: trainee.aadhaarId || "N/A",
            healthConditions: trainee.healthCondition || "None",
            personalInterests: trainee.personalInterest || "N/A",
          });

          // Update contact info
          setContactInfoData({
            phoneNumber: trainee.phoneNo || "N/A",
            email: trainee.email || "N/A",
          });

          // Update emergency contact
          setEmergencyContactData({
            contactNumber: trainee.emergencyContactNo || "N/A",
            relationship: trainee.emergencyContactRelationship || "N/A",
          });

          // Update address info
          setAddressInfoData({
            currentAddress: trainee.currentAddress || "N/A",
            contactNumber: trainee.contactNumber || trainee.phoneNo || "N/A",
            permanentAddress: trainee.address || "N/A",
          });

          // Update trainee status
          setIsActive(trainee.status === "Active");
        }
      }
    }
  }, [apiTraineesData, traineeId]);

  // Update official/training info when API data is loaded
  useEffect(() => {
    if (apiTrainingDetails) {
      const trainingData =
        (apiTrainingDetails as any).data || apiTrainingDetails;

      if (trainingData) {
        setOfficialInfoData((prev) => ({
          ...prev,
          batch: trainingData.batchName || "N/A",
          buddy: trainingData.buddyName || "N/A",
          ojtMentor: trainingData.ojtMentor || "N/A",
          duAllocation: trainingData.duAllocated || "N/A",
          location: trainingData.location || "N/A",
        }));
      }
    }
  }, [apiTrainingDetails]);

  // Update tech stack and projects when specialization data is loaded
  useEffect(() => {
    if (apiSpecializationData) {
      setOfficialInfoData((prev) => ({
        ...prev,
        techStack: apiSpecializationData.techStack || "Not Assigned",
        projectsInvolved: apiSpecializationData.project || "Not Assigned",
      }));
    }
  }, [apiSpecializationData]);

  // Card data formatting
  const personalInfo = [
    {
      label: "Full Name",
      value: personalInfoData.fullName,
      gridCols: "single" as const,
    },
    {
      label: "Aadhaar ID",
      value: personalInfoData.adhaarId,
      gridCols: "single" as const,
    },
    {
      label: "Blood Group",
      value: personalInfoData.bloodGroup,
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
    data: any,
  ) => {
    setModalState({ opened: true, type, title, initialData: data });
  };

  const closeModal = () =>
    setModalState({ opened: false, type: null, title: "", initialData: {} });

  const handleSave = (data: any) => {
    console.log("handleSave called with data:", data);
    console.log("Modal type:", modalState.type);
    console.log("User ID (route param):", traineeId);
    console.log("Actual Trainee ID (backend):", actualTraineeId);

    // Handle training/official information update
    if (actualTraineeId && modalState.type === "official") {
      const trainingPayload: any = {};

      // Only include fields that have changed and are not "N/A"
      if (data.buddy && data.buddy !== "N/A") {
        trainingPayload.buddyName = data.buddy;
      }
      if (data.duAllocation && data.duAllocation !== "N/A") {
        trainingPayload.duName = data.duAllocation;
      }
      if (data.ojtMentor && data.ojtMentor !== "N/A") {
        trainingPayload.ojtMentor = data.ojtMentor;
      }
      if (data.location && data.location !== "N/A") {
        trainingPayload.location = data.location;
      }

      console.log("Training update payload:", trainingPayload);
      updateTrainingMutation.mutate(trainingPayload);
    }

    // Prepare API payload based on modal type
    if (
      actualTraineeId &&
      (modalState.type === "personal" ||
        modalState.type === "contact" ||
        modalState.type === "emergency" ||
        modalState.type === "address")
    ) {
      const updatePayload: any = {
        id: actualTraineeId,
        email:
          modalState.type === "contact" ? data.email : contactInfoData.email, // Use updated email if contact modal
        phoneNo:
          modalState.type === "contact"
            ? data.phoneNumber
            : contactInfoData.phoneNumber,
        status: (isActive ? "Active" : "Inactive") as
          | "Active"
          | "Inactive"
          | "OnLeave",
      };

      // Map fields based on modal type
      if (modalState.type === "personal") {
        updatePayload.bloodGroup = data.bloodGroup;
        updatePayload.aadhaarId = data.adhaarId;
        updatePayload.healthCondition = data.healthConditions;
        updatePayload.personalInterest = data.personalInterests;
      } else if (modalState.type === "contact") {
        updatePayload.email = data.email;
        updatePayload.phoneNo = data.phoneNumber;
        // Also update emergency contact fields from contact modal
        updatePayload.emergencyContactNo = data.emergencyContactNumber;
        updatePayload.emergencyContactRelationship =
          data.emergencyContactRelationship;
      } else if (modalState.type === "emergency") {
        updatePayload.emergencyContactNo = data.contactNumber;
        updatePayload.emergencyContactRelationship = data.relationship;
      } else if (modalState.type === "address") {
        updatePayload.currentAddress = data.currentAddress;
        updatePayload.contactNumber = data.contactNumber;
        updatePayload.address = data.permanentAddress;
      }

      console.log("Update payload:", updatePayload);
      updateTraineeMutation.mutate(updatePayload);
    }

    // Handle status toggle
    if (actualTraineeId && modalState.type === "status") {
      const newStatus = !isActive;
      const statusPayload: any = {
        id: actualTraineeId,
        email: contactInfoData.email,
        phoneNo: contactInfoData.phoneNumber,
        status: (newStatus ? "Active" : "Inactive") as
          | "Active"
          | "Inactive"
          | "OnLeave",
      };

      console.log("Status update payload:", statusPayload);
      updateTraineeMutation.mutate(statusPayload);
      setIsActive(newStatus);
    }

    // Update local state after API call
    switch (modalState.type) {
      case "personal":
        setPersonalInfoData(data);
        break;
      case "official":
        setOfficialInfoData(data);
        break;
      case "contact":
        // Update both contact and emergency contact data
        setContactInfoData({
          phoneNumber: data.phoneNumber,
          email: data.email,
        });
        setEmergencyContactData({
          contactNumber: data.emergencyContactNumber,
          relationship: data.emergencyContactRelationship,
        });
        break;
      case "emergency":
        setEmergencyContactData(data);
        break;
      case "address":
        setAddressInfoData(data);
        break;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-4 flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading trainee details...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
          <div className="text-lg text-red-600">
            Failed to load trainee details
          </div>
          <div className="text-sm text-gray-600">
            {(error as Error).message}
          </div>
        </div>
      </div>
    );
  }

  // No trainee ID
  if (!traineeId) {
    return (
      <div className="max-w-6xl mx-auto p-4 flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">No trainee selected</div>
      </div>
    );
  }

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
                    {},
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
        <div>
          <button
            onClick={() => navigate("/results")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            <FileText className="w-4 h-4 mr-2" />
            View Results
          </button>
        </div>
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
              <span>Training Information</span>
            </div>
          }
          items={officialInfo}
          onEdit={() =>
            openModal("official", "Edit Training Information", officialInfoData)
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
              phoneNumber: contactInfoData.phoneNumber,
              email: contactInfoData.email,
              emergencyContactNumber: emergencyContactData.contactNumber,
              emergencyContactRelationship: emergencyContactData.relationship,
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
                    handleSave({});
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
