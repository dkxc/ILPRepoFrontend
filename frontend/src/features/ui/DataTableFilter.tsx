import { useState } from "react";
import { Select, MenuItem, FormControl, InputLabel, Box } from "@mui/material";

interface DataTableFilterProps {
  filterColumn?: string;
  filterOptions?: string[];
  filterPlaceholder?: string;
  multipleFilters?: { [key: string]: string | null };
  columnFilters?: { [key: string]: string[] };
  enableMultipleFilters?: boolean;
  onFilterChange?: (filterValue: string | null) => void;
  onMultipleFilterChange?: (filters: { [key: string]: string | null }) => void;
}

export default function DataTableFilter({
  filterColumn,
  filterOptions = [],
  filterPlaceholder = "Filter...",
  multipleFilters = {},
  columnFilters = {},
  enableMultipleFilters = false,
  onFilterChange,
  onMultipleFilterChange,
}: DataTableFilterProps) {
  const [filterValue, setFilterValue] = useState<string | null>(null);

  return (
    <Box display="flex" gap={1} alignItems="center">
      {/* Multiple Filters */}
      {enableMultipleFilters &&
        Object.entries(columnFilters).map(([key, options]) => (
          <FormControl
            key={key}
            size="small"
            sx={{
              minWidth: 120,
              "& .MuiInputBase-root": {
                height: 32,
                fontSize: 13,
                paddingTop: 0,
                paddingBottom: 0,
              },
            }}
          >
            <InputLabel sx={{ fontSize: 13 }}>{key}</InputLabel>
            <Select
              value={multipleFilters[key] || ""}
              onChange={(e) =>
                onMultipleFilterChange?.({
                  ...multipleFilters,
                  [key]: e.target.value || null,
                })
              }
              label={key}
              sx={{ fontSize: 13 }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}

      {/* Single Filter */}
      {!enableMultipleFilters && filterColumn && (
        <FormControl
          size="small"
          sx={{
            minWidth: 120,
            "& .MuiInputBase-root": {
              height: 32,
              fontSize: 13,
              paddingTop: 0,
              paddingBottom: 0,
            },
          }}
        >
          <InputLabel sx={{ fontSize: 13 }}>{filterPlaceholder}</InputLabel>
          <Select
            value={filterValue || ""}
            onChange={(e) => {
              const value = e.target.value || null;
              setFilterValue(value);
              onFilterChange?.(value);
            }}
            label={filterPlaceholder}
            sx={{ fontSize: 13 }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {filterOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
}
