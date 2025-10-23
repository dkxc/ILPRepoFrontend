import { useState } from "react";
import { ActionIcon } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import DataTable, { type ColumnDef } from "../../features/ui/Table";
import Button from "../../features/ui/Button";
import BatchDetailsCard from "../../features/admin/batches/BatchDetailsCard";
import BatchDetailsModal from "../../features/admin/batches/BatchDetailsModal";
import StatusBadge from "../../features/ui/StatusBadge";
import AddTraineeModal from "../../features/admin/batches/AddTraineeModal";
import EditDetailsModal from "../../features/admin/batches/EditDetailsModal"; // new modal component
import { useParams, useNavigate } from "react-router";
import { openDeleteModal } from "../../features/ui/DeleteConfirmModal";
import {
  Users,
  Briefcase,
  Building2,
  LayoutDashboard,
  Trash2,
  Pencil,
} from "lucide-react";

interface Trainee {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  status: "Active" | "Inactive";
}

interface TraineeFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
}

interface Batch {
  id: number;
  batchName: string;
  startDate: string;
  endDate: string;
  batchType: string;
  status: "Ongoing" | "Completed" | "Not Started";
  totalTrainees: number;
  totalTrainingHours: number;
  techStack: string;
}

interface BatchUpdateData {
  batchName: string;
  startDate: string;
  endDate: string;
  batchType: string;
  techStack: string;
}

interface Specialization {
  id: number;
  traineeName: string;
  techStack: string;
  project: string;
}

interface BusinessOrientation {
  id: number;
  traineeName: string;
  buddy: string;
  du: string;
}

interface DUData {
  id: number;
  traineeName: string;
  duAllocated: string;
  location: string;
  ojtMentor: string;
}

export default function BatchDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isAddTraineeModalOpen, setIsAddTraineeModalOpen] = useState(false);
  const [isEditBatchModalOpen, setIsEditBatchModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activePhase, setActivePhase] = useState("Trainees");

  const [currentBatch, setCurrentBatch] = useState<Batch>({
    id: 1,
    batchName: "ILP Batch 7",
    startDate: "2025-04-08",
    endDate: "2025-09-08",
    batchType: "Developer Trainee",
    status: "Ongoing",
    totalTrainees: 5,
    totalTrainingHours: 48,
    techStack: "React, Angular, .Net, Python, Django",
  });

  const [trainees, setTrainees] = useState<Trainee[]>([
    {
      id: 1,
      name: "John Dover",
      email: "john.dover@gmail.com",
      phoneNumber: "9043568213",
      status: "Inactive",
    },
    {
      id: 2,
      name: "Mary Varghese",
      email: "mary.varghese@gmail.com",
      phoneNumber: "9845623178",
      status: "Active",
    },
    {
      id: 3,
      name: "Jake Gruton",
      email: "jake.gruton@gmail.com",
      phoneNumber: "9876543210",
      status: "Active",
    },
    {
      id: 4,
      name: "Anjali Nair",
      email: "anjali.nair@gmail.com",
      phoneNumber: "9865321478",
      status: "Active",
    },
    {
      id: 5,
      name: "Vijay Kumar",
      email: "vijay.kumar@gmail.com",
      phoneNumber: "9056741235",
      status: "Inactive",
    },
  ]);

  // Specialization, Business Orientation, DU data (stateful for editing)
  const [specializationData, setSpecializationData] = useState<
    Specialization[]
  >([
    {
      id: 1,
      traineeName: "John Dover",
      techStack: "React, Node.js",
      project: "Carbon Zero Portal",
    },
    {
      id: 2,
      traineeName: "Mary Varghese",
      techStack: "Angular, .NET",
      project: "Internal Dashboard",
    },
    {
      id: 3,
      traineeName: "Jake Gruton",
      techStack: "Python, Django",
      project: "AI Chat Support",
    },
    {
      id: 4,
      traineeName: "Anjali Nair",
      techStack: "React Native",
      project: "Mobile Analytics",
    },
  ]);

  const [businessOrientationData, setBusinessOrientationData] = useState<
    BusinessOrientation[]
  >([
    {
      id: 1,
      traineeName: "John Dover",
      buddy: "Arun Kumar",
      du: "Digital Engineering",
    },
    {
      id: 2,
      traineeName: "Mary Varghese",
      buddy: "Sneha Thomas",
      du: "Cloud Services",
    },
    {
      id: 3,
      traineeName: "Jake Gruton",
      buddy: "Rahul Nair",
      du: "AI & Analytics",
    },
    {
      id: 4,
      traineeName: "Anjali Nair",
      buddy: "Meera Dev",
      du: "Cybersecurity",
    },
  ]);

  const [duData, setDuData] = useState<DUData[]>([
    {
      id: 1,
      traineeName: "John Dover",
      duAllocated: "Digital Engineering",
      location: "Kochi",
      ojtMentor: "Rahul Nair",
    },
    {
      id: 2,
      traineeName: "Mary Varghese",
      duAllocated: "Cloud Services",
      location: "Trivandrum",
      ojtMentor: "Sneha Thomas",
    },
    {
      id: 3,
      traineeName: "Jake Gruton",
      duAllocated: "AI & Analytics",
      location: "Bangalore",
      ojtMentor: "Arjun Menon",
    },
    {
      id: 4,
      traineeName: "Anjali Nair",
      duAllocated: "Cybersecurity",
      location: "Kochi",
      ojtMentor: "Meera Dev",
    },
  ]);

  // ----- Edit Phase Modal State -----
  const [isEditPhaseModalOpen, setIsEditPhaseModalOpen] = useState(false);
  const [currentEditRow, setCurrentEditRow] = useState<any>(null);
  const [currentEditPhase, setCurrentEditPhase] = useState<
    "Specialization" | "Business Orientation" | "DU" | null
  >(null);

  const handleEditRow = (
    row: any,
    phase: "Specialization" | "Business Orientation" | "DU",
  ) => {
    setCurrentEditRow(row);
    setCurrentEditPhase(phase);
    setIsEditPhaseModalOpen(true);
  };

  const handleSavePhaseEdit = (updatedRow: any) => {
    if (currentEditPhase === "Specialization") {
      setSpecializationData((prev) =>
        prev.map((r) => (r.id === updatedRow.id ? updatedRow : r)),
      );
    } else if (currentEditPhase === "Business Orientation") {
      setBusinessOrientationData((prev) =>
        prev.map((r) => (r.id === updatedRow.id ? updatedRow : r)),
      );
    } else if (currentEditPhase === "DU") {
      setDuData((prev) =>
        prev.map((r) => (r.id === updatedRow.id ? updatedRow : r)),
      );
    }
    setIsEditPhaseModalOpen(false);
    notifications.show({
      title: "Success",
      message: "Updated successfully",
      color: "green",
    });
  };

  // ----- Other existing handlers -----
  const handleEditBatch = () => setIsEditBatchModalOpen(true);
  const handleUpdateBatch = (updatedData: BatchUpdateData) => {
    setCurrentBatch((prev) => ({ ...prev, ...updatedData }));
    notifications.show({
      title: "Success",
      message: "Batch details updated successfully.",
      color: "green",
    });
  };

  const handleDelete = (trainee: Trainee) => {
    openDeleteModal({
      itemName: trainee.name,
      itemType: "Trainee",
      onConfirm: () => {
        setTrainees((prev) => prev.filter((t) => t.id !== trainee.id));
        setCurrentBatch((prev) => ({
          ...prev,
          totalTrainees: prev.totalTrainees - 1,
        }));
      },
    });
  };

  const handleAddTrainee = (traineeData: TraineeFormData) => {
    const newTrainee: Trainee = {
      id: Math.max(...trainees.map((t) => t.id)) + 1,
      name: traineeData.fullName,
      email: traineeData.email,
      phoneNumber: traineeData.phoneNumber,
      status: "Inactive",
    };
    setTrainees((prev) => [...prev, newTrainee]);
    setCurrentBatch((prev) => ({
      ...prev,
      totalTrainees: prev.totalTrainees + 1,
    }));
    notifications.show({
      title: "Success",
      message: `${traineeData.fullName} has been added successfully.`,
      color: "green",
    });
  };

  const handleRowClick = (row: Trainee) => navigate(`/batchDetails/${row.id}`);

  const filteredData = selectedStatus
    ? trainees.filter((t) => t.status === selectedStatus)
    : trainees;

  // --- Helper Functions ---
  const formatDateForDisplay = (isoDate: string) =>
    new Date(isoDate).toLocaleDateString("en-GB");

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case "Trainees":
        return <Users size={16} />;
      case "Specialization":
        return <Briefcase size={16} />;
      case "Business Orientation":
        return <Building2 size={16} />;
      case "DU":
        return <LayoutDashboard size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 bg-gray-50 flex-grow">
      {/* Batch Details Card */}
      <div className="mb-4 flex justify-center relative">
        <BatchDetailsCard
          batchName={currentBatch.batchName}
          startDate={formatDateForDisplay(currentBatch.startDate)}
          endDate={formatDateForDisplay(currentBatch.endDate)}
          batchType={currentBatch.batchType}
          totalTrainees={trainees.length}
          totalTrainingHours={currentBatch.totalTrainingHours}
          techStack={currentBatch.techStack}
          onEdit={handleEditBatch}
          onAddTrainee={() => setIsAddTraineeModalOpen(true)}
          onUploadTrainees={() => setIsUploadModalOpen(true)}
        />
      </div>

      {/* Phase Tabs */}
      <div className="bg-white px-3 pt-2">
        <div className="flex justify-between gap-3 bg-bg-results-tabs px-3 py-0 rounded-lg">
          {["Trainees", "Specialization", "Business Orientation", "DU"].map(
            (phase) => (
              <button
                key={phase}
                onClick={() => setActivePhase(phase)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-1 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  phase === activePhase
                    ? "bg-blue-50 text-brand-600 my-1"
                    : "text-gray-600 hover:bg-gray-100 my-1"
                }`}
              >
                {getPhaseIcon(phase)}
                <span>{phase}</span>
              </button>
            ),
          )}
        </div>
      </div>

      {/* Conditional Phase Table */}
      {activePhase === "Trainees" && (
        <DataTable
          columns={[
            { key: "name", header: "Name", sortable: true, width: "25%" },
            {
              key: "email",
              header: "Email",
              sortable: true,
              width: "25%",
              render: (value) => (
                <a
                  href={`mailto:${value}`}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  {value}
                </a>
              ),
            },
            {
              key: "phoneNumber",
              header: "Phone Number",
              sortable: true,
              width: "25%",
            },
            {
              key: "status",
              header: "Status",
              sortable: true,
              width: "15%",
              render: (value) => (
                <StatusBadge status={value as "Active" | "Inactive"} />
              ),
            },
            {
              key: "action",
              header: "Action",
              align: "center",
              width: "10%",
              render: (_, row) => (
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(row);
                  }}
                >
                  <Trash2 size={18} />
                </ActionIcon>
              ),
            },
          ]}
          data={filteredData}
          showHeaderSection
          headerTitle="All Trainees"
          enableFilter
          filterColumn="status"
          filterOptions={["Active", "Inactive"]}
          enableSearch
          enablePagination
          pageSize={5}
          highlightOnHover
          withBorder
          onRowClick={handleRowClick}
        />
      )}

      {/* Specialization Phase */}
      {activePhase === "Specialization" && (
        <DataTable
          columns={[
            {
              key: "traineeName",
              header: "Trainee Name",
              sortable: true,
              width: "30%",
            },
            {
              key: "techStack",
              header: "Tech Stack",
              sortable: true,
              width: "25%",
            },
            {
              key: "project",
              header: "Project Involved",
              sortable: true,
              width: "25%",
            },
            {
              key: "action",
              header: "Action",
              width: "10%",
              align: "center",
              render: (_, row) => (
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={() => handleEditRow(row, "Specialization")}
                >
                  <Pencil size={18} />
                </ActionIcon>
              ),
            },
          ]}
          data={specializationData}
          showHeaderSection
          headerTitle="Specialization Phase"
          enableSearch
          enablePagination
          pageSize={5}
          highlightOnHover
          withBorder
          enableMultipleFilters={true}
          columnFilters={{
            techStack: Array.from(
              new Set(specializationData.map((d) => d.techStack)),
            ),
            project: Array.from(
              new Set(specializationData.map((d) => d.project)),
            ),
          }}
        />
      )}

      {/* Business Orientation Phase */}
      {activePhase === "Business Orientation" && (
        <DataTable
          columns={[
            {
              key: "traineeName",
              header: "Trainee Name",
              sortable: true,
              width: "30%",
            },
            {
              key: "buddy",
              header: "Buddy",
              sortable: true,
              width: "25%",
            },
            {
              key: "du",
              header: "DU",
              sortable: true,
              width: "25%",
            },
            {
              key: "action",
              header: "Action",
              width: "10%",
              align: "center",
              render: (_, row) => (
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={() => handleEditRow(row, "Business Orientation")}
                >
                  <Pencil size={18} />
                </ActionIcon>
              ),
            },
          ]}
          data={businessOrientationData}
          showHeaderSection
          headerTitle="Business Orientation"
          enableSearch
          enablePagination
          pageSize={5}
          highlightOnHover
          withBorder
          enableMultipleFilters={true}
          columnFilters={{
            buddy: Array.from(
              new Set(businessOrientationData.map((d) => d.buddy)),
            ),
            du: Array.from(new Set(businessOrientationData.map((d) => d.du))),
          }}
        />
      )}

      {/* DU Phase */}
      {activePhase === "DU" && (
        <DataTable
          columns={[
            {
              key: "traineeName",
              header: "Trainee Name",
              sortable: true,
              width: "25%",
            },
            {
              key: "duAllocated",
              header: "DU Allocated",
              sortable: true,
              width: "25%",
            },
            {
              key: "location",
              header: "Location",
              sortable: true,
              width: "25%",
            },
            {
              key: "ojtMentor",
              header: "OJT Mentor",
              sortable: true,
              width: "15%",
            },
            {
              key: "action",
              header: "Action",
              width: "10%",
              align: "center",
              render: (_, row) => (
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={() => handleEditRow(row, "DU")}
                >
                  <Pencil size={18} />
                </ActionIcon>
              ),
            },
          ]}
          data={duData}
          showHeaderSection
          headerTitle="DU Phase"
          enableSearch
          enablePagination
          pageSize={5}
          highlightOnHover
          withBorder
          enableMultipleFilters={true}
          columnFilters={{
            duAllocated: Array.from(new Set(duData.map((d) => d.duAllocated))),
            location: Array.from(new Set(duData.map((d) => d.location))),
          }}
        />
      )}

      {/* Batch Edit Modal */}
      <BatchDetailsModal
        isOpen={isEditBatchModalOpen}
        onClose={() => setIsEditBatchModalOpen(false)}
        onSubmit={handleUpdateBatch}
        isEditing
        initialData={{
          batchName: currentBatch.batchName,
          startDate: currentBatch.startDate,
          endDate: currentBatch.endDate,
          batchType: currentBatch.batchType,
          techStack: currentBatch.techStack,
        }}
      />

      {/* Add Trainee */}
      <AddTraineeModal
        isOpen={isAddTraineeModalOpen}
        onClose={() => setIsAddTraineeModalOpen(false)}
        onSubmit={handleAddTrainee}
      />

      {/* Edit Phase Modal */}
      {isEditPhaseModalOpen && currentEditRow && currentEditPhase && (
        <EditDetailsModal
          isOpen={true}
          onClose={() => {
            setIsEditPhaseModalOpen(false);
            setCurrentEditRow(null);
            setCurrentEditPhase(null);
          }}
          title={`Edit ${currentEditPhase} Data`}
          data={currentEditRow}
          fields={
            currentEditPhase === "Specialization"
              ? [
                  { key: "traineeName", label: "Trainee Name" },
                  { key: "techStack", label: "Tech Stack" },
                  { key: "project", label: "Project Involved" },
                ]
              : currentEditPhase === "Business Orientation"
                ? [
                    { key: "traineeName", label: "Trainee Name" },
                    { key: "buddy", label: "Buddy" },
                    { key: "du", label: "DU" },
                  ]
                : [
                    // DU Phase
                    { key: "traineeName", label: "Trainee Name" },
                    { key: "duAllocated", label: "DU Allocated" },
                    { key: "location", label: "Location" },
                    { key: "ojtMentor", label: "OJT Mentor" },
                  ]
          }
          onSave={handleSavePhaseEdit}
        />
      )}
    </div>
  );
}
