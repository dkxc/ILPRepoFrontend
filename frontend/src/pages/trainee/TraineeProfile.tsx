import { useState, useEffect } from "react";
import { User, Briefcase, Phone, MapPin } from "lucide-react";
import InfoCard from "../../features/ui/TraineeProfile/InfoCard";
import TraineeEditModal from "../../features/ui/TraineeProfile/TraineeEditModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { traineeService } from "../../services/traineeService";
import { notifications } from "@mantine/notifications";
import { useAuth } from "../../context/AuthContext";

function TraineeProfile() {
  const queryClient = useQueryClient();
  const { authData } = useAuth();

  // Get logged-in user ID from auth context
  const loggedInUserId = authData?.userId;

  // Fetch all trainees and filter by logged-in user ID
  const {
    data: apiTraineesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["allTrainees"],
    queryFn: () => traineeService.getAllTrainees(),
    staleTime: 30000,
  });

  // Store the actual trainee ID from backend (different from userId)
  const [actualTraineeId, setActualTraineeId] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(true);

  // Fetch trainee training details
  const { data: apiTrainingDetails } = useQuery({
    queryKey: ["trainingDetails", actualTraineeId],
    queryFn: () => traineeService.getTraineeTrainingDetails(actualTraineeId!),
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
        message: "Profile updated successfully",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["allTrainees"] });
    },
    onError: (error: any) => {
      notifications.show({
        title: "Error",
        message: error.response?.data?.message || "Failed to update profile",
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
      | null,
    title: "",
    initialData: {} as any,
  });

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

  // Update state when API data is loaded
  useEffect(() => {
    if (apiTraineesData && loggedInUserId) {
      const traineesArray = (apiTraineesData as any).data || apiTraineesData;

      if (Array.isArray(traineesArray)) {
        const trainee = traineesArray.find(
          (t: any) => t.userId === loggedInUserId
        );

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
  }, [apiTraineesData, loggedInUserId]);

  // Update official/training info when API data is loaded
  useEffect(() => {
    if (apiTrainingDetails) {
      const trainingData =
        (apiTrainingDetails as any).data || apiTrainingDetails;

      if (trainingData) {
        setOfficialInfoData({
          batch: trainingData.batchName || "N/A",
          techStack: officialInfoData.techStack, // Keep existing as API doesn't provide this
          projectsInvolved: officialInfoData.projectsInvolved, // Keep existing as API doesn't provide this
          buddy: trainingData.buddyName || "N/A",
          ojtMentor: trainingData.ojtMentor || "N/A",
          duAllocation: trainingData.duAllocated || "N/A",
          location: trainingData.location || "N/A",
        });
      }
    }
  }, [apiTrainingDetails]);

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
      readOnly: true, // Mark email as read-only
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
    type: "personal" | "contact" | "emergency" | "address" | "official",
    title: string,
    data: any
  ) => {
    setModalState({ opened: true, type, title, initialData: data });
  };

  const closeModal = () =>
    setModalState({ opened: false, type: null, title: "", initialData: {} });

  const handleSave = (data: any) => {
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
        email: contactInfoData.email, // Always use existing email (read-only for trainees)
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
        // Email is read-only for trainees, so don't update it
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

      updateTraineeMutation.mutate(updatePayload);
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
          email: contactInfoData.email, // Keep existing email, don't update from form
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

  // Authentication check
  if (!authData || !loggedInUserId) {
    return (
      <div className="max-w-6xl mx-auto p-4 flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">
          Please log in to view your profile
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-4 flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading profile...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
          <div className="text-lg text-red-600">Failed to load profile</div>
          <div className="text-sm text-gray-600">
            {(error as Error).message}
          </div>
          <button
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["allTrainees"] })
            }
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Check if trainee profile was found
  if (!actualTraineeId) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
          <div className="text-lg text-gray-600">Profile not found</div>
          <div className="text-sm text-gray-500">
            Your trainee profile could not be found. Please contact your
            administrator.
          </div>
          <button
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["allTrainees"] })
            }
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Refresh
          </button>
        </div>
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
            {personalInfoData.fullName
              ? personalInfoData.fullName
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : "NA"}
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#565E6C]">
              {personalInfoData.fullName}
            </h1>

            {/* Status Badge */}
            <div className="flex items-center mt-1">
              <div
                className={`flex items-center px-3 py-1 rounded-full ${
                  isActive ? "bg-green-100" : "bg-gray-200"
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
              </div>
            </div>
          </div>
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
              <span>Training Details</span>
            </div>
          }
          items={officialInfo}
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
      {modalState.opened && modalState.type && (
        <TraineeEditModal
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
