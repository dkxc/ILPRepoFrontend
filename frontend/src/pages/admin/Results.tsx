import { Trash2 } from "lucide-react";
import { ActionIcon } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import DataTable, { type ColumnDef } from "../../features/ui/Table";
import type { BatchAssessment } from "../../features/trainee/types/Batch.types";
import { useNavigate } from "react-router";

export default function Results() {
  const navigate = useNavigate();

  // Mock data - replace with API call
  const batchesData: BatchAssessment[] = [
    {
      id: 1,
      title: "ILP 2025-26 Batch 7",
      type: "Developer Trainee",
      totalTrainees: 36,
      status: "Pending",
    },
    {
      id: 2,
      title: "ILP 2025-26 Batch 7",
      type: "Developer Trainee",
      totalTrainees: 36,
      status: "Pending",
    },
    {
      id: 3,
      title: "ILP 2025-26 Batch 7",
      type: "Developer Trainee",
      totalTrainees: 36,
      status: "Completed",
    },
    {
      id: 4,
      title: "ILP 2025-26 Batch 7",
      type: "Developer Trainee",
      totalTrainees: 36,
      status: "Completed",
    },
    {
      id: 5,
      title: "ILP 2025-26 Batch 7",
      type: "Developer Trainee",
      totalTrainees: 36,
      status: "Completed",
    },
    {
      id: 6,
      title: "ILP 2025-26 Batch 7",
      type: "Developer Trainee",
      totalTrainees: 36,
      status: "Completed",
    },
    {
      id: 7,
      title: "ILP 2025-26 Batch 8",
      type: "Developer Trainee",
      totalTrainees: 40,
      status: "Pending",
    },
    {
      id: 8,
      title: "ILP 2025-26 Batch 9",
      type: "Developer Trainee",
      totalTrainees: 35,
      status: "Completed",
    },
  ];

  const handleDelete = (batch: BatchAssessment) => {
    modals.openConfirmModal({
      title: "Delete Batch",
      centered: true,
      children: (
        <p>
          Are you sure you want to delete <b>{batch.title}</b>?
        </p>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        notifications.show({
          title: "Deleted",
          message: `${batch.title} was removed.`,
          color: "red",
        });
      },
    });
  };

  const handleRowClick = (row: BatchAssessment) => {
    navigate(`/trainee-assessment/${row.id}`, { state: { batch: row } });
  };

  const columns: ColumnDef<BatchAssessment>[] = [
    {
      key: "title",
      header: "Name",
      sortable: true,
      width: "35%",
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      width: "25%",
    },
    {
      key: "totalTrainees",
      header: "Total Trainees",
      sortable: true,
      align: "center",
      width: "20%",
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      width: "15%",
      render: (value) => {
        const isCompleted = value === "Completed";
        return (
          <span
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              isCompleted
                ? "bg-[#EBFFE6] text-green-700"
                : "bg-[#E6E6E6] text-gray-700"
            }`}
            style={{
              display: "inline-block",
              minWidth: "90px",
              textAlign: "center",
            }}
          >
            {value}
          </span>
        );
      },
    },
    {
      key: "action",
      header: "Action",
      align: "center",
      width: "10%",
      render: (_, row) => (
        <ActionIcon
          variant="Subtle"
          color="gray"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(row);
          }}
          style={{
            transition: "0.2s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor = "#F0F4FE")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor =
              "transparent")
          }
        >
          <Trash2 size={18} />
        </ActionIcon>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between  sm:px-4 px-2 py-3  ">
        <h1
          className="text-2xl font-bold ml-10 text-[#565E6C] font-primary"
          style={{ color: "#565E6C" }}
        >
          Trainee Assessment
        </h1>
      </div>

      <div className=" p-2 sm:p-0 mb-4 rounded-lg overflow-x-auto">
        <DataTable
          columns={columns}
          data={batchesData}
          showHeaderSection={true}
          headerTitle="Select Batch"
          headerTitleStyle={{ fontSize: "16px", fontWeight: 500 }}
          enableSearch={true}
          searchPlaceholder="Search batches..."
          enablePagination={true}
          enableFilter={true}
          filterColumn="status"
          filterOptions={["Pending", "Completed"]}
          filterPlaceholder="Filter"
          pageSize={5}
          pageSizeOptions={[5, 10, 25, 50]}
          striped={false}
          highlightOnHover={true}
          withBorder={false}
          onRowClick={handleRowClick}
          tableStyle={{
            width: "100%",
            borderRadius: "8px",
            backgroundColor: "white",
            paddingLeft: "0",
            paddingRight: "0",
          }}
          rowStyle={{
            fontSize: "16px",
            height: "56px",
            lineHeight: "1",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          headerStyle={{
            fontWeight: 500,
            fontSize: "16px",
            height: "40px",
            background: "#F8F9FA",
            textAlign: "left",
          }}
          headerRightContent={
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              {/* filter + search go here */}
            </div>
          }
        />
      </div>
    </div>
  );
}
