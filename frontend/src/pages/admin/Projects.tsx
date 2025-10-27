import { useState, forwardRef } from "react";
import { Badge, ActionIcon } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  Trash2,
  Pencil,
  FolderOpen,
  UserCheck,
  Users,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";
import DataTable, { type ColumnDef } from "../../features/ui/Table";
import { useNavigate } from "react-router";
import Button from "../../features/ui/Button";
import { logos } from "../../assets/projects-svg";

interface Project {
  id: number;
  name: string;
  batch: string;
  teamLead: string;
  status: "In Progress" | "Live" | "Not Live";
  startDate: string;
  endDate: string;
}

interface POC {
  id: number;
  projectName: string;
  pocs: string[];
  pocEmails: string[];
}

interface Mentor {
  id: number;
  projectName: string;
  codeMentor: string;
  projectMentor: string;
  baMentor: string;
}

interface ProjectDocument {
  id: number;
  projectName: string;
  brd: boolean;
  uat: boolean;
  sprintTracker: boolean;
}

export interface ProjectCardProps extends React.HTMLAttributes<HTMLDivElement> {
  type: keyof typeof logos;
  title: string;
  value: number | string;
}

const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(
  ({ className, type, title, value, ...props }, ref) => {
    const icon = logos[type];

    return (
      <div
        ref={ref}
        className={`flex items-center gap-4 p-2 rounded-md border border-gray-200 bg-white transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${className}`}
        {...props}
      >
        <div className="flex items-center justify-center">{icon}</div>
        <div className="flex flex-col">
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-semibold text-gray-800">{value}</p>
        </div>
      </div>
    );
  },
);

ProjectCard.displayName = "ProjectCard";

// Edit Modal Component
interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any;
  fields: {
    key: string;
    label: string;
    type?: string;
    options?: string[];
    isArray?: boolean;
  }[];
  onSave: (updatedData: any) => void;
}

function EditModal({
  isOpen,
  onClose,
  title,
  data,
  fields,
  onSave,
}: EditModalProps) {
  const [formData, setFormData] = useState(data);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleArrayChange = (key: string, value: string) => {
    const items = value.split("\n").filter((item) => item.trim() !== "");
    setFormData({ ...formData, [key]: items });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.key} className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {field.label}
              </label>
              {field.isArray ? (
                <textarea
                  value={
                    Array.isArray(formData[field.key])
                      ? formData[field.key].join("\n")
                      : formData[field.key]
                  }
                  onChange={(e) => handleArrayChange(field.key, e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  rows={4}
                  placeholder="Enter one item per line"
                />
              ) : field.options ? (
                <select
                  value={formData[field.key]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.key]: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                >
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : field.type === "date" ? (
                <input
                  type="date"
                  value={formData[field.key]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.key]: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              ) : field.type === "checkbox" ? (
                <input
                  type="checkbox"
                  checked={formData[field.key]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.key]: e.target.checked })
                  }
                  className="w-5 h-5 rounded"
                />
              ) : (
                <input
                  type="text"
                  value={formData[field.key]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.key]: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              )}
            </div>
          ))}
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Projects() {
  const [selectedBatch, setSelectedBatch] = useState<string | null>("");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Projects");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditData, setCurrentEditData] = useState<any>(null);
  const [currentEditType, setCurrentEditType] = useState<string>("");

  const [projectsData, setProjectsData] = useState<Project[]>([
    {
      id: 1,
      name: "ILP Repo Project",
      batch: "ILP 2025-26 Batch 7",
      teamLead: "Alex Jose",
      status: "In Progress",
      startDate: "2025-01-15",
      endDate: "2025-06-30",
    },
    {
      id: 2,
      name: "Project Management Tool",
      batch: "ILP 2025-26 Batch 7",
      teamLead: "Amal Babu",
      status: "Live",
      startDate: "2024-09-01",
      endDate: "2025-03-15",
    },
    {
      id: 3,
      name: "Car Parking",
      batch: "ILP 2025-26 Batch 7",
      teamLead: "George Mathew",
      status: "Not Live",
      startDate: "2025-02-01",
      endDate: "2025-07-31",
    },
    {
      id: 4,
      name: "E-Commerce Platform",
      batch: "ILP 2025-26 Batch 6",
      teamLead: "Rohan Menon",
      status: "In Progress",
      startDate: "2025-03-01",
      endDate: "2025-08-30",
    },
    {
      id: 5,
      name: "Chat App",
      batch: "ILP 2025-26 Batch 6",
      teamLead: "Sara Mathew",
      status: "Live",
      startDate: "2024-10-15",
      endDate: "2025-04-15",
    },
    {
      id: 6,
      name: "Inventory System",
      batch: "ILP 2025-26 Batch 5",
      teamLead: "Vikram Singh",
      status: "In Progress",
      startDate: "2025-01-01",
      endDate: "2025-06-15",
    },
    {
      id: 7,
      name: "Fitness Tracker",
      batch: "ILP 2025-26 Batch 9",
      teamLead: "Anita Rao",
      status: "Not Live",
      startDate: "2025-02-10",
      endDate: "2025-07-20",
    },
    {
      id: 8,
      name: "Banking App",
      batch: "ILP 2025-26 Batch 8",
      teamLead: "Praveen Kumar",
      status: "Live",
      startDate: "2024-11-01",
      endDate: "2025-05-30",
    },
    {
      id: 9,
      name: "Weather Dashboard",
      batch: "ILP 2025-26 Batch 8",
      teamLead: "Leena George",
      status: "In Progress",
      startDate: "2025-01-20",
      endDate: "2025-06-15",
    },
    {
      id: 10,
      name: "Blog Platform",
      batch: "ILP 2025-26 Batch 5",
      teamLead: "Raghav Iyer",
      status: "Live",
      startDate: "2024-09-15",
      endDate: "2025-03-30",
    },
    {
      id: 11,
      name: "Task Manager",
      batch: "ILP 2025-26 Batch 6",
      teamLead: "Meera Nair",
      status: "In Progress",
      startDate: "2025-02-01",
      endDate: "2025-07-31",
    },
    {
      id: 12,
      name: "Food Delivery App",
      batch: "ILP 2025-26 Batch 7",
      teamLead: "Kiran Rao",
      status: "Not Live",
      startDate: "2025-03-15",
      endDate: "2025-08-15",
    },
    {
      id: 13,
      name: "Expense Tracker",
      batch: "ILP 2025-26 Batch 9",
      teamLead: "Anil Joshi",
      status: "Live",
      startDate: "2024-12-01",
      endDate: "2025-06-01",
    },
    {
      id: 14,
      name: "Portfolio Website",
      batch: "ILP 2025-26 Batch 5",
      teamLead: "Sneha Reddy",
      status: "In Progress",
      startDate: "2025-01-10",
      endDate: "2025-05-30",
    },
    {
      id: 15,
      name: "Music Streaming App",
      batch: "ILP 2025-26 Batch 6",
      teamLead: "Rakesh Nair",
      status: "Live",
      startDate: "2024-10-01",
      endDate: "2025-03-31",
    },
    {
      id: 16,
      name: "Online Quiz System",
      batch: "ILP 2025-26 Batch 7",
      teamLead: "Divya Menon",
      status: "Not Live",
      startDate: "2025-02-05",
      endDate: "2025-07-05",
    },
    {
      id: 17,
      name: "Real Estate App",
      batch: "ILP 2025-26 Batch 8",
      teamLead: "Sunil Kumar",
      status: "Live",
      startDate: "2024-11-10",
      endDate: "2025-05-20",
    },
    {
      id: 18,
      name: "Ticket Booking App",
      batch: "ILP 2025-26 Batch 9",
      teamLead: "Nisha Agarwal",
      status: "In Progress",
      startDate: "2025-01-25",
      endDate: "2025-07-10",
    },
    {
      id: 19,
      name: "Hotel Management System",
      batch: "ILP 2025-26 Batch 6",
      teamLead: "Pradeep Singh",
      status: "Live",
      startDate: "2024-09-20",
      endDate: "2025-03-25",
    },
    {
      id: 20,
      name: "Travel Planner",
      batch: "ILP 2025-26 Batch 5",
      teamLead: "Anita Desai",
      status: "In Progress",
      startDate: "2025-02-15",
      endDate: "2025-07-25",
    },
  ]);

  const [pocData, setPocData] = useState<POC[]>([
    {
      id: 1,
      projectName: "ILP Repo Project",
      pocs: ["John Doe", "Jane Smith"],
      pocEmails: ["john.doe@example.com", "jane.smith@example.com"],
    },
    {
      id: 2,
      projectName: "Project Management Tool",
      pocs: ["Michael Brown", "Sarah Johnson", "Robert Lee"],
      pocEmails: [
        "michael.b@example.com",
        "sarah.j@example.com",
        "robert.l@example.com",
      ],
    },
    {
      id: 3,
      projectName: "Car Parking",
      pocs: ["David Wilson"],
      pocEmails: ["david.w@example.com"],
    },
    {
      id: 4,
      projectName: "E-Commerce Platform",
      pocs: ["Aisha Khan", "Rohit Verma"],
      pocEmails: ["aisha.k@example.com", "rohit.v@example.com"],
    },
    {
      id: 5,
      projectName: "Chat App",
      pocs: ["Nina Patel"],
      pocEmails: ["nina.p@example.com"],
    },
    {
      id: 6,
      projectName: "Inventory System",
      pocs: ["Kamal Roy", "Deepa Iyer"],
      pocEmails: ["kamal.r@example.com", "deepa.i@example.com"],
    },
    {
      id: 7,
      projectName: "Fitness Tracker",
      pocs: ["Ravi Sharma"],
      pocEmails: ["ravi.s@example.com"],
    },
    {
      id: 8,
      projectName: "Banking App",
      pocs: ["Sneha Gupta", "Vikas Mehta"],
      pocEmails: ["sneha.g@example.com", "vikas.m@example.com"],
    },
    {
      id: 9,
      projectName: "Weather Dashboard",
      pocs: ["Ananya Roy"],
      pocEmails: ["ananya.r@example.com"],
    },
    {
      id: 10,
      projectName: "Blog Platform",
      pocs: ["Tarun Bhatia"],
      pocEmails: ["tarun.b@example.com"],
    },
    {
      id: 11,
      projectName: "Task Manager",
      pocs: ["Priya Nair"],
      pocEmails: ["priya.n@example.com"],
    },
    {
      id: 12,
      projectName: "Food Delivery App",
      pocs: ["Manish Sharma"],
      pocEmails: ["manish.s@example.com"],
    },
    {
      id: 13,
      projectName: "Expense Tracker",
      pocs: ["Ritu Singh"],
      pocEmails: ["ritu.s@example.com"],
    },
    {
      id: 14,
      projectName: "Portfolio Website",
      pocs: ["Vineet Kumar"],
      pocEmails: ["vineet.k@example.com"],
    },
    {
      id: 15,
      projectName: "Music Streaming App",
      pocs: ["Alok Jain"],
      pocEmails: ["alok.j@example.com"],
    },
    {
      id: 16,
      projectName: "Online Quiz System",
      pocs: ["Megha Sharma"],
      pocEmails: ["megha.s@example.com"],
    },
    {
      id: 17,
      projectName: "Real Estate App",
      pocs: ["Harish Iyer"],
      pocEmails: ["harish.i@example.com"],
    },
    {
      id: 18,
      projectName: "Ticket Booking App",
      pocs: ["Kavita Reddy"],
      pocEmails: ["kavita.r@example.com"],
    },
    {
      id: 19,
      projectName: "Hotel Management System",
      pocs: ["Rohit Kumar"],
      pocEmails: ["rohit.k@example.com"],
    },
    {
      id: 20,
      projectName: "Travel Planner",
      pocs: ["Anjali Desai"],
      pocEmails: ["anjali.d@example.com"],
    },
  ]);

  const [mentorData, setMentorData] = useState<Mentor[]>([
    {
      id: 1,
      projectName: "ILP Repo Project",
      codeMentor: "Rahul Kumar",
      projectMentor: "Priya Sharma",
      baMentor: "Anita Desai",
    },
    {
      id: 2,
      projectName: "Project Management Tool",
      codeMentor: "Vijay Singh",
      projectMentor: "Sneha Reddy",
      baMentor: "Amit Patel",
    },
    {
      id: 3,
      projectName: "Car Parking",
      codeMentor: "Kiran Rao",
      projectMentor: "Meera Nair",
      baMentor: "Suresh Iyer",
    },
    {
      id: 4,
      projectName: "E-Commerce Platform",
      codeMentor: "Arjun Das",
      projectMentor: "Maya Pillai",
      baMentor: "Shyam Kumar",
    },
    {
      id: 5,
      projectName: "Chat App",
      codeMentor: "Pooja Verma",
      projectMentor: "Anil Joshi",
      baMentor: "Tina Thomas",
    },
    {
      id: 6,
      projectName: "Inventory System",
      codeMentor: "Rakesh Nair",
      projectMentor: "Simran Kaur",
      baMentor: "Manish Choudhary",
    },
    {
      id: 7,
      projectName: "Fitness Tracker",
      codeMentor: "Divya Menon",
      projectMentor: "Kartik Sharma",
      baMentor: "Rajeev Rao",
    },
    {
      id: 8,
      projectName: "Banking App",
      codeMentor: "Sunil Kumar",
      projectMentor: "Nisha Agarwal",
      baMentor: "Pradeep Singh",
    },
    {
      id: 9,
      projectName: "Weather Dashboard",
      codeMentor: "Rohit Mehta",
      projectMentor: "Ananya Sharma",
      baMentor: "Vikram Iyer",
    },
    {
      id: 10,
      projectName: "Blog Platform",
      codeMentor: "Leena George",
      projectMentor: "Tarun Bhatia",
      baMentor: "Ritu Singh",
    },
    {
      id: 11,
      projectName: "Task Manager",
      codeMentor: "Priya Nair",
      projectMentor: "Raghav Iyer",
      baMentor: "Meera Mathew",
    },
    {
      id: 12,
      projectName: "Food Delivery App",
      codeMentor: "Manish Sharma",
      projectMentor: "Kavita Reddy",
      baMentor: "Anil Joshi",
    },
    {
      id: 13,
      projectName: "Expense Tracker",
      codeMentor: "Ritu Singh",
      projectMentor: "Harish Iyer",
      baMentor: "Sneha Reddy",
    },
    {
      id: 14,
      projectName: "Portfolio Website",
      codeMentor: "Vineet Kumar",
      projectMentor: "Anjali Desai",
      baMentor: "Rajeev Rao",
    },
    {
      id: 15,
      projectName: "Music Streaming App",
      codeMentor: "Alok Jain",
      projectMentor: "Megha Sharma",
      baMentor: "Sunil Kumar",
    },
    {
      id: 16,
      projectName: "Online Quiz System",
      codeMentor: "Megha Sharma",
      projectMentor: "Vikram Iyer",
      baMentor: "Anita Rao",
    },
    {
      id: 17,
      projectName: "Real Estate App",
      codeMentor: "Harish Iyer",
      projectMentor: "Nisha Agarwal",
      baMentor: "Pradeep Singh",
    },
    {
      id: 18,
      projectName: "Ticket Booking App",
      codeMentor: "Kavita Reddy",
      projectMentor: "Sunil Kumar",
      baMentor: "Rakesh Nair",
    },
    {
      id: 19,
      projectName: "Hotel Management System",
      codeMentor: "Rohit Kumar",
      projectMentor: "Leena George",
      baMentor: "Vineet Kumar",
    },
    {
      id: 20,
      projectName: "Travel Planner",
      codeMentor: "Anjali Desai",
      projectMentor: "Rajeev Rao",
      baMentor: "Meera Nair",
    },
  ]);

  const [documentsData, setDocumentsData] = useState<ProjectDocument[]>([
    {
      id: 1,
      projectName: "ILP Repo Project",
      brd: true,
      uat: true,
      sprintTracker: true,
    },
    {
      id: 2,
      projectName: "Project Management Tool",
      brd: true,
      uat: true,
      sprintTracker: false,
    },
    {
      id: 3,
      projectName: "Car Parking",
      brd: false,
      uat: false,
      sprintTracker: true,
    },
    {
      id: 4,
      projectName: "E-Commerce Platform",
      brd: true,
      uat: false,
      sprintTracker: true,
    },
    {
      id: 5,
      projectName: "Chat App",
      brd: true,
      uat: true,
      sprintTracker: true,
    },
    {
      id: 6,
      projectName: "Inventory System",
      brd: true,
      uat: false,
      sprintTracker: false,
    },
    {
      id: 7,
      projectName: "Fitness Tracker",
      brd: false,
      uat: false,
      sprintTracker: false,
    },
    {
      id: 8,
      projectName: "Banking App",
      brd: true,
      uat: true,
      sprintTracker: true,
    },
    {
      id: 9,
      projectName: "Weather Dashboard",
      brd: true,
      uat: false,
      sprintTracker: true,
    },
    {
      id: 10,
      projectName: "Blog Platform",
      brd: true,
      uat: true,
      sprintTracker: false,
    },
    {
      id: 11,
      projectName: "Task Manager",
      brd: true,
      uat: true,
      sprintTracker: true,
    },
    {
      id: 12,
      projectName: "Food Delivery App",
      brd: false,
      uat: false,
      sprintTracker: true,
    },
    {
      id: 13,
      projectName: "Expense Tracker",
      brd: true,
      uat: true,
      sprintTracker: true,
    },
    {
      id: 14,
      projectName: "Portfolio Website",
      brd: true,
      uat: false,
      sprintTracker: false,
    },
    {
      id: 15,
      projectName: "Music Streaming App",
      brd: true,
      uat: true,
      sprintTracker: true,
    },
    {
      id: 16,
      projectName: "Online Quiz System",
      brd: false,
      uat: false,
      sprintTracker: false,
    },
    {
      id: 17,
      projectName: "Real Estate App",
      brd: true,
      uat: true,
      sprintTracker: true,
    },
    {
      id: 18,
      projectName: "Ticket Booking App",
      brd: true,
      uat: false,
      sprintTracker: true,
    },
    {
      id: 19,
      projectName: "Hotel Management System",
      brd: true,
      uat: true,
      sprintTracker: false,
    },
    {
      id: 20,
      projectName: "Travel Planner",
      brd: true,
      uat: false,
      sprintTracker: true,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "yellow";
      case "Live":
        return "green";
      case "Not Live":
        return "red";
      default:
        return "gray";
    }
  };

  const handleEdit = (data: any, type: string) => {
    setCurrentEditData(data);
    setCurrentEditType(type);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedData: any) => {
    if (currentEditType === "Projects") {
      setProjectsData((prev) =>
        prev.map((p) => (p.id === updatedData.id ? updatedData : p)),
      );
    } else if (currentEditType === "POC") {
      setPocData((prev) =>
        prev.map((p) => (p.id === updatedData.id ? updatedData : p)),
      );
    } else if (currentEditType === "Mentors") {
      setMentorData((prev) =>
        prev.map((m) => (m.id === updatedData.id ? updatedData : m)),
      );
    } else if (currentEditType === "Documents") {
      setDocumentsData((prev) =>
        prev.map((d) => (d.id === updatedData.id ? updatedData : d)),
      );
    }
    notifications.show({
      title: "Success",
      message: "Updated successfully",
      color: "green",
    });
  };

  const handleDelete = (item: any, type: string) => {
    modals.openConfirmModal({
      title: `Delete ${type}`,
      centered: true,
      children: <p>Are you sure you want to delete this item?</p>,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        if (type === "Projects") {
          setProjectsData((prev) => prev.filter((p) => p.id !== item.id));
        } else if (type === "POC") {
          setPocData((prev) => prev.filter((p) => p.id !== item.id));
        } else if (type === "Mentors") {
          setMentorData((prev) => prev.filter((m) => m.id !== item.id));
        } else if (type === "Documents") {
          setDocumentsData((prev) => prev.filter((d) => d.id !== item.id));
        }
        notifications.show({
          title: "Deleted",
          message: "Item was removed successfully.",
          color: "red",
        });
      },
    });
  };

  const handleRowClick = (row: Project) => {
    navigate(`/admin/projectsDetailsAdmin/${row.id}`);
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "Projects":
        return <FolderOpen size={16} />;
      case "POC":
        return <UserCheck size={16} />;
      case "Mentors":
        return <Users size={16} />;
      case "Documents":
        return <FileText size={16} />;
      default:
        return null;
    }
  };

  const projectColumns: ColumnDef<Project>[] = [
    { key: "name", header: "Name", sortable: true, width: "25%" },
    { key: "batch", header: "Batch", sortable: true, width: "25%" },
    { key: "teamLead", header: "Team Lead", sortable: true, width: "20%" },
    {
      key: "status",
      header: "Status",
      sortable: true,
      width: "15%",
      render: (value) => (
        <Badge
          color={getStatusColor(value)}
          variant="light"
          size="lg"
          radius="sm"
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "action",
      header: "Action",
      align: "center",
      width: "15%",
      render: (_, row) => (
        <div className="flex gap-2 justify-center">
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row, "Projects");
            }}
          >
            <Pencil size={18} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row, "Projects");
            }}
          >
            <Trash2 size={18} />
          </ActionIcon>
        </div>
      ),
    },
  ];

  const pocColumns: ColumnDef<POC>[] = [
    {
      key: "projectName",
      header: "Project Name",
      sortable: true,
      width: "30%",
    },
    {
      key: "pocs",
      header: "POC Names",
      sortable: false,
      width: "35%",
      render: (value: string[]) => (
        <div className="flex flex-col gap-1">
          {value.map((poc, index) => (
            <span key={index} className="text-sm">
              {poc}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "pocEmails",
      header: "POC Emails",
      sortable: false,
      width: "30%",
      render: (value: string[]) => (
        <div className="flex flex-col gap-1">
          {value.map((email, index) => (
            <a
              key={index}
              href={`mailto:${email}`}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {email}
            </a>
          ))}
        </div>
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
          onClick={() => handleEdit(row, "POC")}
        >
          <Pencil size={18} />
        </ActionIcon>
      ),
    },
  ];

  const mentorColumns: ColumnDef<Mentor>[] = [
    {
      key: "projectName",
      header: "Project Name",
      sortable: true,
      width: "25%",
    },
    { key: "codeMentor", header: "Code Mentor", sortable: true, width: "25%" },
    {
      key: "projectMentor",
      header: "Project Mentor",
      sortable: true,
      width: "25%",
    },
    { key: "baMentor", header: "BA Mentor", sortable: true, width: "20%" },
    {
      key: "action",
      header: "Action",
      align: "center",
      width: "10%",
      render: (_, row) => (
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={() => handleEdit(row, "Mentors")}
        >
          <Pencil size={18} />
        </ActionIcon>
      ),
    },
  ];

  const documentsColumns: ColumnDef<ProjectDocument>[] = [
    {
      key: "projectName",
      header: "Project Name",
      sortable: true,
      width: "40%",
    },
    {
      key: "brd",
      header: "BRD",
      sortable: true,
      width: "15%",
      align: "center",
      render: (value: boolean) =>
        value ? (
          <CheckCircle size={20} className="text-green-600" />
        ) : (
          <XCircle size={20} className="text-red-500" />
        ),
    },
    {
      key: "uat",
      header: "UAT",
      sortable: true,
      width: "15%",
      align: "center",
      render: (value: boolean) =>
        value ? (
          <CheckCircle size={20} className="text-green-600" />
        ) : (
          <XCircle size={20} className="text-red-500" />
        ),
    },
    {
      key: "sprintTracker",
      header: "Sprint Tracker",
      sortable: true,
      width: "20%",
      align: "center",
      render: (value: boolean) =>
        value ? (
          <CheckCircle size={20} className="text-green-600" />
        ) : (
          <XCircle size={20} className="text-red-500" />
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
          onClick={() => handleEdit(row, "Documents")}
        >
          <Pencil size={18} />
        </ActionIcon>
      ),
    },
  ];

  const filteredProjects = selectedBatch
    ? projectsData.filter((project) => project.batch === selectedBatch)
    : projectsData;

  const stats = {
    all: projectsData.length,
    inProgress: projectsData.filter((p) => p.status === "In Progress").length,
    live: projectsData.filter((p) => p.status === "Live").length,
    notLive: projectsData.filter((p) => p.status === "Not Live").length,
  };

  const getEditFields = () => {
    if (currentEditType === "Projects") {
      return [
        { key: "name", label: "Project Name" },
        {
          key: "batch",
          label: "Batch",
          options: [
            "ILP 2025-26 Batch 5",
            "ILP 2025-26 Batch 6",
            "ILP 2025-26 Batch 7",
            "ILP 2025-26 Batch 8",
            "ILP 2025-26 Batch 9",
          ],
        },
        { key: "teamLead", label: "Team Lead" },
        {
          key: "status",
          label: "Status",
          options: ["In Progress", "Live", "Not Live"],
        },
        { key: "startDate", label: "Start Date", type: "date" },
        { key: "endDate", label: "End Date", type: "date" },
      ];
    } else if (currentEditType === "POC") {
      return [
        { key: "projectName", label: "Project Name" },
        { key: "pocs", label: "POC Names (one per line)", isArray: true },
        { key: "pocEmails", label: "POC Emails (one per line)", isArray: true },
      ];
    } else if (currentEditType === "Mentors") {
      return [
        { key: "projectName", label: "Project Name" },
        { key: "codeMentor", label: "Code Mentor" },
        { key: "projectMentor", label: "Project Mentor" },
        { key: "baMentor", label: "BA Mentor" },
      ];
    } else if (currentEditType === "Documents") {
      return [
        { key: "projectName", label: "Project Name" },
        { key: "brd", label: "BRD Available", type: "checkbox" },
        { key: "uat", label: "UAT Available", type: "checkbox" },
        {
          key: "sprintTracker",
          label: "Sprint Tracker Available",
          type: "checkbox",
        },
      ];
    }
    return [];
  };

  return (
    <>
      <div className="p-4 bg-gray-50 flex-grow mb-">
        <h1
          className="text-2xl font-bold ml-10 text-[#565E6C] font-primary"
          style={{ color: "#565E6C" }}
        >
          Projects
        </h1>
        <div className="pr-6 mr-6">
          {/* <Button
            size="sm"
            className="font-secondary"
            onClick={() => navigate("/createProject")}
          >
            + Create Project
          </Button> */}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 bg-slate-50 p-6 bg-w ml-4">
        <ProjectCard
          type="all"
          title="All Projects"
          value={stats.all}
          className="text-sm w-60 h-16"
        />
        <ProjectCard
          type="inProgress"
          title="Projects In Progress"
          value={stats.inProgress}
          className="text-sm w-60 h-16"
        />
        <ProjectCard
          type="live"
          title="Live Projects"
          value={stats.live}
          className="text-sm w-60 h-16"
        />
        <ProjectCard
          type="notLive"
          title="Not Live Projects"
          value={stats.notLive}
          className="text-sm w-60 h-16"
        />
      </div>

      {/* Tab Navigation */}
      <div className="bg-white px-3 pt-2 ml-10 mr-10">
        <div className="flex justify-between gap-3 bg-bg-results-tabs px-3 py-0 rounded-lg">
          {["Projects", "POC", "Mentors", "Documents"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-1 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                tab === activeTab
                  ? "bg-blue-50 text-brand-600 my-1"
                  : "text-gray-600 hover:bg-gray-100 my-1"
              }`}
            >
              {getTabIcon(tab)}
              <span>{tab}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conditional Table Rendering */}
      <div className="bg ml-10 mr-10">
        {activeTab === "Projects" && (
          <DataTable
            columns={projectColumns}
            data={filteredProjects}
            showHeaderSection={true}
            headerTitle="All Projects"
            headerTitleStyle={{ fontSize: "16px", fontWeight: 500 }}
            enableFilter={true}
            filterColumn="batch"
            filterOptions={[
              "ILP 2025-26 Batch 5",
              "ILP 2025-26 Batch 6",
              "ILP 2025-26 Batch 7",
              "ILP 2025-26 Batch 8",
              "ILP 2025-26 Batch 9",
            ]}
            enableSearch={true}
            enablePagination={true}
            enableDateFilter={true}
            dateFilterColumn="startDate"
            pageSize={10}
            pageSizeOptions={[5, 10, 25, 50]}
            striped={false}
            highlightOnHover={true}
            withBorder={true}
            onRowClick={handleRowClick}
            rowStyle={{
              fontSize: "16px",
              height: "56px",
              lineHeight: "1",
            }}
            headerStyle={{
              fontWeight: 500,
              fontSize: "16px",
              height: "40px",
              background: "#F8F9FA",
            }}
          />
        )}

        {activeTab === "POC" && (
          <DataTable
            columns={pocColumns}
            data={pocData}
            showHeaderSection={true}
            headerTitle="Project POCs"
            enableSearch={true}
            enablePagination={true}
            pageSize={10}
            highlightOnHover={true}
            withBorder={true}
            rowStyle={{
              fontSize: "16px",
              minHeight: "56px",
            }}
          />
        )}

        {activeTab === "Mentors" && (
          <DataTable
            columns={mentorColumns}
            data={mentorData}
            showHeaderSection={true}
            headerTitle="Project Mentors"
            enableSearch={true}
            enablePagination={true}
            pageSize={10}
            highlightOnHover={true}
            withBorder={true}
          />
        )}

        {activeTab === "Documents" && (
          <DataTable
            columns={documentsColumns}
            data={documentsData}
            showHeaderSection={true}
            headerTitle="Project Documents"
            enableSearch={true}
            enablePagination={true}
            pageSize={10}
            highlightOnHover={true}
            withBorder={true}
            rowStyle={{
              fontSize: "16px",
              height: "56px",
            }}
            headerStyle={{
              fontWeight: 500,
              fontSize: "16px",
              height: "40px",
              background: "#F8F9FA",
            }}
          />
        )}
      </div>

      {/* Edit Modal */}
      {currentEditData && (
        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setCurrentEditData(null);
            setCurrentEditType("");
          }}
          title={`Edit ${currentEditType}`}
          data={currentEditData}
          fields={getEditFields()}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
}
