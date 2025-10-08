import { Box, Typography, Select, MenuItem } from "@mui/material";

interface DataTableInfoProps {
  totalEntries: number;
  currentPage: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageSizeChange: (size: number) => void;
}

export default function DataTableInfo({
  totalEntries,
  currentPage,
  pageSize,
  pageSizeOptions = [5, 10, 25, 50],
  onPageSizeChange,
}: DataTableInfoProps) {
  const start = totalEntries === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalEntries);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      mt={2}
      sx={{ fontSize: 13 }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
        Showing {start} to {end} of {totalEntries} entries
      </Typography>

      <Select
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        size="small"
        sx={{
          fontSize: 13,
          height: 31,
          width: 120,
          ml: 0.5, // small nudge spacing if needed
        }}
      >
        {pageSizeOptions.map((size) => (
          <MenuItem key={size} value={size}>
            {size} per page
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
