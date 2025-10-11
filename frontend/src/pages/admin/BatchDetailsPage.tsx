import { useState } from "react";
import { Badge, ActionIcon } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { Trash2 } from "lucide-react";
import DataTable, { type ColumnDef } from "../../features/ui/Table";
import Button from "../../features/ui/Button";
import BatchDetailsCard from "../../features/admin/batches/BatchDetailsCard";
import { useNavigate } from "react-router";

interface Trainee {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  status: "Live" | "Not Live";
}

export default function BatchDetailsPage() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  const traineesData: Trainee[] = [
    {
      id: 1,
      name: "John Dover",
      email: "john.dover@gmail.com",
      phoneNumber: "9043568213",
      status: "Not Live",
    },
    {
      id: 2,
      name: "Mary Varghese",
      email: "mary.varghese@gmail.com",
      phoneNumber: "9845623178",
      status: "Live",
    },
    {
      id: 3,
      name: "Jake Gruton",
      email: "jake.gruton@gmail.com",
      phoneNumber: "9876543210",
      status: "Live",
    },
    {
      id: 4,
      name: "Anjali Nair",
      email: "anjali.nair@gmail.com",
      phoneNumber: "9865321478",
      status: "Live",
    },
    {
      id: 5,
      name: "Vijay Kumar",
      email: "vijay.kumar@gmail.com",
      phoneNumber: "9056741235",
      status: "Not Live",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Live":
        return "green";
      case "Not Live":
        return "red";
      default:
        return "gray";
    }
  };

  const handleDelete = (trainee: Trainee) => {
    modals.openConfirmModal({
      title: "Delete Trainee",
      centered: true,
      children: (
        <p>
          Are you sure you want to delete <b>{trainee.name}</b>?
        </p>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        notifications.show({
          title: "Deleted",
          message: `${trainee.name} was removed.`,
          color: "red",
        });
      },
    });
  };

  const handleRowClick = (row: Trainee) => {
    console.log("Clicked trainee:", row);
    navigate(`/traineeDetails/${row.id}`);
  };

  const columns: ColumnDef<Trainee>[] = [
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
  ];

  const filteredData = selectedStatus
    ? traineesData.filter((trainee) => trainee.status === selectedStatus)
    : traineesData;

  return (
    <div className="p-8 bg-gray-50 flex-grow">
      {/* 1️⃣ Batch Details Card */}
      <div className="mb-8 flex justify-center">
        {" "}
        {/* 🔹 Center the card & limit width dynamically */}
        <BatchDetailsCard
          batchName="ILP 2025-26 BATCH 7"
          status="Ongoing"
          startDate="09/12/2025"
          endDate="04/08/2025"
          batchType="Developer Trainee"
          totalTrainees={traineesData.length}
          totalTrainingHours={48}
        />
      </div>

      {/* 2️⃣ Action Buttons */}
      <div className="flex justify-between items-center mb-8">
        {/* <h1 className="text-2xl font-bold text-[#565E6C]">Trainees</h1> */}

        <div className="flex gap-3">
          <Button
            variant="default"
            className="!bg-blue-600 hover:!bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-md h-8"
          >
            + Upload Trainees
          </Button>
          <Button
            variant="default"
            className="!bg-white hover:!bg-gray-100 !text-blue-600 border border-blue-600 font-medium px-4 py-2 rounded-lg shadow-sm h-10"
            onClick={() => navigate("/addTrainee")}
          >
            + Add A Trainee
          </Button>
        </div>
      </div>

      {/* 3️⃣ Trainee Table */}
      <div className="bg-white shadow-sm rounded-lg p-0">
        {" "}
        {/* 🔹 p-0 removes all inner padding */}
        <DataTable
          columns={columns}
          data={filteredData}
          showHeaderSection={true}
          headerTitle="All Trainees"
          headerTitleStyle={{ fontSize: "16px", fontWeight: 500 }}
          enableFilter={true}
          filterColumn="status"
          filterOptions={["Live", "Not Live"]}
          enableSearch={true}
          enablePagination={true}
          pageSize={5}
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
      </div>
    </div>
  );
}
