import { Box, Pagination } from "@mui/material";

interface DataTablePaginationProps {
  totalEntries: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function DataTablePagination({
  totalEntries,
  currentPage,
  pageSize,
  onPageChange,
}: DataTablePaginationProps) {
  const totalPages = Math.ceil(totalEntries / pageSize);
  if (totalPages <= 1) return null;

  return (
    <Box display="flex" justifyContent="center" mt={2}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => onPageChange(page)}
        color="primary"
      />
    </Box>
  );
}
