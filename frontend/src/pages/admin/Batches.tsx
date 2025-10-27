import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import Button from "../../features/ui/Button";
import DataTable, { type ColumnDef } from "../../features/ui/Table";
import BatchDetailsModal from "../../features/admin/batches/BatchDetailsModal";
import StatusBadge from "../../features/ui/StatusBadge";

// ---------------------- Types ----------------------
interface Batch {
  id: number;
  name: string;
  type: string;
  totalTrainees: number;
  totalTrainingHours: number;
  status: "Not Started" | "Ongoing" | "Completed";
  startDate?: string;
  endDate?: string;
}

export default function Batches() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

 const [batches, setBatches] = useState<Batch[]>([
  { id: 1, name: "ILP 2022-23 Batch 1", type: "Developer Batch", totalTrainees: 12, totalTrainingHours: 40, status: "Ongoing", startDate: "2022-07-01", endDate: "2022-07-30" },
  { id: 2, name: "ILP 2022-23 Batch 2", type: "BA Batch", totalTrainees: 10, totalTrainingHours: 32, status: "Not Started", startDate: "2023-01-05", endDate: "2023-01-25" },
  { id: 3, name: "ILP 2023-24 Batch 1", type: "SDET", totalTrainees: 15, totalTrainingHours: 45, status: "Completed", startDate: "2023-08-01", endDate: "2023-08-20" },
  { id: 4, name: "ILP 2023-24 Batch 2", type: "Developer Batch", totalTrainees: 14, totalTrainingHours: 42, status: "Ongoing", startDate: "2023-10-01", endDate: "2023-10-20" },
  { id: 5, name: "ILP 2023-24 Batch 3", type: "BA Batch", totalTrainees: 8, totalTrainingHours: 30, status: "Not Started", startDate: "2024-01-05", endDate: "2024-01-25" },
  { id: 6, name: "ILP 2024-25 Batch 1", type: "SDET", totalTrainees: 12, totalTrainingHours: 38, status: "Ongoing", startDate: "2024-07-01", endDate: "2024-07-25" },
  { id: 7, name: "ILP 2024-25 Batch 2", type: "Developer Batch", totalTrainees: 16, totalTrainingHours: 50, status: "Completed", startDate: "2024-09-01", endDate: "2024-09-20" },
  { id: 8, name: "ILP 2025-26 Batch 1", type: "BA Batch", totalTrainees: 9, totalTrainingHours: 28, status: "Ongoing", startDate: "2025-10-05", endDate: "2026-07-25" },
  { id: 9, name: "ILP 2025-26 Batch 2", type: "SDET", totalTrainees: 11, totalTrainingHours: 35, status: "Not Started", startDate: "2025-10-01", endDate: "2026-09-20" },
  { id: 10, name: "ILP 2025-26 Batch 3", type: "Developer Batch", totalTrainees: 13, totalTrainingHours: 40, status: "Completed", startDate: "2025-10-01", endDate: "2026-05-20" },
]);



  // Auto-update batch status
  const determineStatus = (startDate?: string, endDate?: string): Batch["status"] => {
    if (!startDate || !endDate) return "Not Started";
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (today < start) return "Not Started";
    if (today > end) return "Completed";
    return "Ongoing";
  };

  useEffect(() => {
    const updateStatuses = () => {
      setBatches((prev) =>
        prev.map((b) => ({ ...b, status: determineStatus(b.startDate, b.endDate) }))
      );
    };

    updateStatuses();
    const interval = setInterval(updateStatuses, 60000);
    return () => clearInterval(interval);
  }, []);

  // Add new batch
  const handleAddBatch = (data: { batchName: string; batchType: string; startDate: string; endDate: string; }) => {
    const newBatch: Batch = {
      id: Date.now(),
      name: data.batchName,
      type: data.batchType,
      totalTrainees: 0,
      totalTrainingHours: 0,
      status: determineStatus(data.startDate, data.endDate),
      startDate: data.startDate,
      endDate: data.endDate,
    };
    setBatches((prev) => [...prev, newBatch]);
    setIsModalOpen(false);
  };

  const columns: ColumnDef<Batch>[] = [
    { key: "name", header: "Batch Name", sortable: true, width: "30%" },
    { key: "type", header: "Batch Type", sortable: true, width: "20%" },
    { key: "totalTrainees", header: "Total Trainees", align: "center", sortable: true, width: "15%" },
    { key: "totalTrainingHours", header: "Training Hours", align: "center", sortable: true, width: "15%" },
    { key: "status", header: "Status", align: "center", sortable: true, width: "20%", render: (value) => <StatusBadge status={value as Batch["status"]} /> },
  ];

  // Unique options for filters
  const batchTypes = Array.from(new Set(batches.map((b) => b.type)));
  const statuses = Array.from(new Set(batches.map((b) => b.status)));

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <span className="text-[30px] font-semibold text-[#565E6C]">Batches</span>
        <Button onClick={() => setIsModalOpen(true)} size="sm" className="rounded-[18px]">
          <Plus size={16} /> Create new batch
        </Button>
      </div>

      <div className="pt-8">
        <DataTable
          columns={columns}
          data={batches}
          showHeaderSection={true}
          headerTitle="All Batches"
          headerTitleStyle={{ fontSize: "16px", fontWeight: 500 }}
          enableMultipleFilters={true}
          columnFilters={{
            type: batchTypes,
            status: statuses,
          }}
          enableSearch={true}
          enablePagination={true}
          pageSize={10}
          pageSizeOptions={[5, 10, 25, 50]}
          striped={false}
          highlightOnHover={true}
          withBorder={true}
          rowStyle={{ fontSize: "16px", height: "56px", lineHeight: "1", cursor: "pointer" }}
          headerStyle={{ fontWeight: 500, fontSize: "16px", height: "40px", background: "#F8F9FA" }}
          onRowClick={(row) => navigate(`/batches/${row.id}`)}
        />
      </div>

      <BatchDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddBatch}
        title="Create Batch"
      />
    </div>
  );
}


// src/pages/Batches.tsx
// import { Plus, Trash2 } from "lucide-react";
// import { useState, useEffect } from "react";
// import { ActionIcon } from "@mantine/core";
// import { notifications } from "@mantine/notifications";
// import { useNavigate } from "react-router";

// import Button from "../../features/ui/Button";
// import DataTable, { type ColumnDef } from "../../features/ui/Table";
// import BatchDetailsModal from "../../features/admin/batches/BatchDetailsModal";
// import StatusBadge from "../../features/ui/StatusBadge";
// import { openDeleteModal } from "../../features/ui/DeleteConfirmModal";
// import { batchService, type BatchDto } from "../../services/batchService";

// interface Batch {
//   id: number;
//   name: string;
//   type: string;
//   totalTrainees: number;
//   totalTrainingHours: number;
//   status: "Not Started" | "Ongoing" | "Completed";
//   startDate?: string;
//   endDate?: string;
// }

// export default function Batches() {
//   const navigate = useNavigate();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [batches, setBatches] = useState<Batch[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Determine batch status based on dates
//   const determineStatus = (
//     startDate?: string,
//     endDate?: string
//   ): Batch["status"] => {
//     if (!startDate || !endDate) return "Not Started";
//     const today = new Date();
//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     if (today < start) return "Not Started";
//     if (today > end) return "Completed";
//     return "Ongoing";
//   };

//   // Fetch batches from backend
//   const fetchBatches = async () => {
//     try {
//       setLoading(true);
//       const data = await batchService.getAllBatches();

//       const mappedBatches: Batch[] = data.map((b: BatchDto) => ({
//         id: b.id,
//         name: b.name,
//         type: b.type,
//         totalTrainees: b.totalTrainees, // Now calculated from relationship
//         totalTrainingHours: b.totalTrainingHours, // Now calculated from dates
//         startDate: b.startDate,
//         endDate: b.endDate,
//         status: determineStatus(b.startDate, b.endDate),
//       }));

//       setBatches(mappedBatches);
//     } catch (error) {
//       notifications.show({
//         title: "Error",
//         message: "Failed to fetch batches",
//         color: "red",
//       });
//       console.error("Error fetching batches:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBatches();
//   }, []);

//   // Auto-update statuses every minute
//   useEffect(() => {
//     const updateStatuses = () => {
//       setBatches((prev) =>
//         prev.map((b) => ({
//           ...b,
//           status: determineStatus(b.startDate, b.endDate),
//         }))
//       );
//     };

//     updateStatuses();
//     const interval = setInterval(updateStatuses, 60000);
//     return () => clearInterval(interval);
//   }, []);

//   // Delete batch
//   const handleDelete = (batch: Batch) => {
//     openDeleteModal({
//       itemName: batch.name,
//       itemType: "Batch",
//       onConfirm: async () => {
//         try {
//           await batchService.deleteBatch(batch.id);
//           setBatches((prev) => prev.filter((b) => b.id !== batch.id));
//           notifications.show({
//             title: "Success",
//             message: "Batch deleted successfully",
//             color: "green",
//           });
//         } catch (error) {
//           notifications.show({
//             title: "Error",
//             message: "Failed to delete batch",
//             color: "red",
//           });
//           console.error("Error deleting batch:", error);
//         }
//       },
//     });
//   };

//   // Add new batch
//   const handleAddBatch = async (data: {
//     batchName: string;
//     batchType: string;
//     startDate: string;
//     endDate: string;
//   }) => {
//     try {
//       const newBatchDto = {
//         name: data.batchName,
//         type: data.batchType,
//         startDate: data.startDate,
//         endDate: data.endDate,
//       };

//       const createdBatch = await batchService.createBatch(newBatchDto);

//       const newBatch: Batch = {
//         id: createdBatch.id,
//         name: createdBatch.name,
//         type: createdBatch.type,
//         totalTrainees: createdBatch.totalTrainees,
//         totalTrainingHours: createdBatch.totalTrainingHours,
//         startDate: createdBatch.startDate,
//         endDate: createdBatch.endDate,
//         status: determineStatus(createdBatch.startDate, createdBatch.endDate),
//       };

//       setBatches((prev) => [...prev, newBatch]);
//       setIsModalOpen(false);

//       notifications.show({
//         title: "Success",
//         message: "Batch created successfully",
//         color: "green",
//       });
//     } catch (error) {
//       notifications.show({
//         title: "Error",
//         message: "Failed to create batch",
//         color: "red",
//       });
//       console.error("Error creating batch:", error);
//     }
//   };

//   const columns: ColumnDef<Batch>[] = [
//     { key: "name", header: "Batch Name", sortable: true, width: "25%" },
//     { key: "type", header: "Batch Type", sortable: true, width: "18%" },
//     {
//       key: "totalTrainees",
//       header: "Total Trainees",
//       align: "center",
//       sortable: true,
//       width: "15%",
//     },
//     {
//       key: "totalTrainingHours",
//       header: "Training Hours",
//       align: "center",
//       sortable: true,
//       width: "15%",
//     },
//     {
//       key: "status",
//       header: "Status",
//       align: "center",
//       sortable: true,
//       width: "15%",
//       render: (value) => <StatusBadge status={value as Batch["status"]} />,
//     },
//     {
//       key: "action",
//       header: "Action",
//       align: "center",
//       width: "12%",
//       render: (_, row) => (
//         <ActionIcon
//           variant="subtle"
//           color="gray"
//           onClick={(e) => {
//             e.stopPropagation();
//             handleDelete(row);
//           }}
//         >
//           <Trash2 size={18} />
//         </ActionIcon>
//       ),
//     },
//   ];

//   if (loading) {
//     return (
//       <div className="p-4 flex justify-center items-center h-64">
//         <div className="text-lg text-gray-600">Loading batches...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <span className="text-[30px] font-semibold text-[#565E6C]">
//           Batches
//         </span>
//         <Button
//           onClick={() => setIsModalOpen(true)}
//           size="sm"
//           className="rounded-[18px]"
//         >
//           <Plus size={16} /> Create new batch
//         </Button>
//       </div>

//       {/* Table */}
//       <div className="pt-8">
//         <DataTable
//           columns={columns}
//           data={batches}
//           showHeaderSection={true}
//           headerTitle="All Batches"
//           headerTitleStyle={{ fontSize: "16px", fontWeight: 500 }}
//           enableFilter={true}
//           filterColumn="status"
//           filterOptions={["Ongoing", "Completed", "Not Started"]}
//           enableSearch={true}
//           enablePagination={true}
//           pageSize={10}
//           pageSizeOptions={[5, 10, 25, 50]}
//           striped={false}
//           highlightOnHover={true}
//           withBorder={true}
//           rowStyle={{
//             fontSize: "16px",
//             height: "56px",
//             lineHeight: "1",
//             cursor: "pointer",
//           }}
//           headerStyle={{
//             fontWeight: 500,
//             fontSize: "16px",
//             height: "40px",
//             background: "#F8F9FA",
//           }}
//           onRowClick={(row) => navigate(`/batches/${row.id}`)}
//         />
//       </div>

//       {/* Create Batch Modal */}
//       <BatchDetailsModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSubmit={handleAddBatch}
//         title="Create Batch"
//       />
//     </div>
//   );
// }
