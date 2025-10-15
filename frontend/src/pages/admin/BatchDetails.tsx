import { Upload, Plus, Edit } from "lucide-react";
import Button from "../../features/ui/Button";
import DataTable, { type ColumnDef } from "../../features/ui/Table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../features/ui/card";

// Define the data type
type Trainee = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
};

// Mock trainee data
const trainees: Trainee[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "9876543210",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "9876543222",
    status: "Inactive",
  },
];

// DataTable columns (typed and includes key)
const traineeColumns: ColumnDef<Trainee>[] = [
  {
    key: "name",
    header: "Name",
    //accessorKey: "name",
  },
  {
    key: "email",
    header: "Email",
    //accessorKey: "email",
  },
  {
    key: "phone",
    header: "Phone Number",
    //accessorKey: "phone",
  },
  {
    key: "status",
    header: "Status",
    //accessorKey: "status",
  },
  {
    key: "action",
    header: "Action",
    // cell: () => (
    //   <Button variant="default" size="sm">
    //     View
    //   </Button>
    // ),
  },
];

const BatchDetails = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">ILP 2025-24 Batch 7</h1>
        <div className="flex gap-3">
          <Button variant="default" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Trainees
          </Button>
          <Button variant="default" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add a Trainee
          </Button>
        </div>
      </div>

      {/* Batch Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <InfoCard title="Start Date" value="10 Oct 2025" />
        <InfoCard title="End Date" value="30 Dec 2025" />
        <InfoCard title="Type" value="Offline" />
        <InfoCard title="Total Trainees" value="28" />
        <InfoCard title="Training Hours" value="120" />
        <Card className="flex flex-col justify-center items-center">
          <CardContent className="p-4">
            <Button
              variant="default"
              size="sm"
              className="flex items-center gap-1"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Trainee List</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={traineeColumns} data={trainees} />
        </CardContent>
      </Card>
    </div>
  );
};

// Reusable InfoCard component
const InfoCard = ({ title, value }: { title: string; value: string }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm text-gray-500">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-lg font-medium">{value}</p>
    </CardContent>
  </Card>
);

export default BatchDetails;
