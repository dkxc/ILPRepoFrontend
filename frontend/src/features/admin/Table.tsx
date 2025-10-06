// ============================================
// FILE: components/DataTable.tsx
// ============================================

import { useState, type ReactNode } from "react";
import {
  Table,
  Badge,
  ActionIcon,
  Group,
  Text,
  Paper,
  TextInput,
  Select,
  Pagination,
  Progress,
  Tooltip,
  Checkbox,
  Stack,
  Box,
} from "@mantine/core";
import { Search } from "lucide-react";

// Column definition type
export interface ColumnDef<T = any> {
  key: string;
  header: string;
  width?: number | string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T, index: number) => ReactNode;
}

// Table props type
export interface DataTableProps<T = any> {
  columns: ColumnDef<T>[];
  data: T[];
  // Styling options
  striped?: boolean;
  highlightOnHover?: boolean;
  withBorder?: boolean;
  withPadding?: boolean;
  headerBgColor?: string;
  headerTextColor?: string;
  hideHeader?: boolean;
  // Feature toggles
  enableSearch?: boolean;
  enableFilter?: boolean;
  enableSort?: boolean;
  enablePagination?: boolean;
  enableSelection?: boolean;
  // Pagination options
  pageSize?: number;
  pageSizeOptions?: number[];
  // Filter options
  filterColumn?: string;
  filterOptions?: string[];
  filterPlaceholder?: string;
  enableMultipleFilters?: boolean;
  columnFilters?: { [key: string]: string[] };
  // Search options
  searchPlaceholder?: string;
  searchColumns?: string[];
  // Callbacks
  onRowClick?: (row: T, index: number) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  // Custom empty state
  emptyState?: ReactNode;
  // Additional styles
  tableStyle?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  rowStyle?: React.CSSProperties;
  hideRowBorders?: boolean;
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  striped = true,
  highlightOnHover = true,
  withBorder = true,
  withPadding = true,
  headerBgColor = "#f8f9fa",
  headerTextColor = "#000",
  hideHeader = false,
  enableSearch = true,
  enableFilter = false,
  enableSort = true,
  enablePagination = true,
  enableSelection = false,
  hideRowBorders = false,
  pageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
  filterColumn,
  filterOptions = [],
  filterPlaceholder = "Filter...",
  enableMultipleFilters = false,
  columnFilters = {},
  searchPlaceholder = "Search...",
  searchColumns = [],
  onRowClick,
  onSelectionChange,
  emptyState,
  tableStyle,
  headerStyle,
  rowStyle,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [filterValue, setFilterValue] = useState<string | null>(null);
  const [multipleFilters, setMultipleFilters] = useState<{
    [key: string]: string | null;
  }>({});
  const [activePage, setActivePage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Handle sorting
  const handleSort = (key: string) => {
    if (!enableSort) return;
    const column = columns.find((col) => col.key === key);
    if (!column?.sortable) return;

    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  // Handle row selection
  const toggleRowSelection = (index: number) => {
    const newSelection = selectedRows.includes(index)
      ? selectedRows.filter((i) => i !== index)
      : [...selectedRows, index];

    setSelectedRows(newSelection);

    if (onSelectionChange) {
      const selected = newSelection.map((i) => filteredData[i]);
      onSelectionChange(selected);
    }
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
      onSelectionChange?.([]);
    } else {
      const allIndices = filteredData.map((_, i) => i);
      setSelectedRows(allIndices);
      onSelectionChange?.(filteredData);
    }
  };

  // Filter data
  let filteredData = [...data];

  // Apply search
  if (enableSearch && search) {
    filteredData = filteredData.filter((row) => {
      const columnsToSearch =
        searchColumns.length > 0
          ? searchColumns
          : columns.map((col) => col.key);
      return columnsToSearch.some((key) => {
        const value = row[key];
        return value?.toString().toLowerCase().includes(search.toLowerCase());
      });
    });
  }

  // Apply single filter
  if (enableFilter && !enableMultipleFilters && filterValue && filterColumn) {
    filteredData = filteredData.filter(
      (row) => row[filterColumn] === filterValue,
    );
  }

  // Apply multiple filters
  if (enableMultipleFilters) {
    filteredData = filteredData.filter((row) => {
      return Object.entries(multipleFilters).every(([key, value]) => {
        if (!value) return true;
        return row[key] === value;
      });
    });
  }

  // Apply sorting
  if (enableSort && sortBy) {
    filteredData.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }

  // Pagination
  const totalPages = enablePagination
    ? Math.ceil(filteredData.length / currentPageSize)
    : 1;
  const paginatedData = enablePagination
    ? filteredData.slice(
        (activePage - 1) * currentPageSize,
        activePage * currentPageSize,
      )
    : filteredData;

  return (
    <Stack gap="md">
      {/* Search and Filter Bar */}
      {(enableSearch || enableFilter || enableMultipleFilters) && (
        <Group justify="apart">
          {enableSearch && (
            <TextInput
              placeholder={searchPlaceholder}
              leftSection={<Search size={16} />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              style={{ width: 300 }}
            />
          )}

          {/* Single Filter */}
          {enableFilter && !enableMultipleFilters && filterColumn && (
            <Select
              placeholder={filterPlaceholder}
              data={filterOptions}
              value={filterValue}
              onChange={setFilterValue}
              clearable
              style={{ width: 200 }}
            />
          )}

          {/* Multiple Filters */}
          {enableMultipleFilters && (
            <Group gap="xs">
              {Object.entries(columnFilters).map(([key, options]) => {
                const column = columns.find((col) => col.key === key);
                return (
                  <Select
                    key={key}
                    placeholder={`Filter ${column?.header || key}`}
                    data={options}
                    value={multipleFilters[key] || null}
                    onChange={(value) =>
                      setMultipleFilters((prev) => ({ ...prev, [key]: value }))
                    }
                    clearable
                    style={{ width: 180 }}
                  />
                );
              })}
            </Group>
          )}
        </Group>
      )}

      {/* Selection info */}
      {enableSelection && selectedRows.length > 0 && (
        <Text size="sm" color="dimmed">
          {selectedRows.length} row(s) selected
        </Text>
      )}

      {/* Table */}
      <Paper withBorder={withBorder} p={withPadding ? "md" : 0}>
        <Box style={{ overflowX: "auto" }}>
          <Table
            striped={striped}
            highlightOnHover={highlightOnHover}
            style={tableStyle}
          >
            {!hideHeader && (
              <thead>
                <tr
                  style={{
                    backgroundColor: headerBgColor,
                    color: headerTextColor,
                    ...headerStyle,
                  }}
                >
                  {enableSelection && (
                    <th
                      style={{
                        width: 40,
                        textAlign: "center", // ✅ Fixed - just use a hardcoded value
                        borderBottom: hideRowBorders ? "none" : undefined,
                      }}
                    >
                      <Checkbox
                        checked={
                          selectedRows.length === filteredData.length &&
                          filteredData.length > 0
                        }
                        onChange={toggleSelectAll}
                      />
                    </th>
                  )}
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      style={{
                        width: column.width,
                        textAlign: column.align || "left",
                        cursor:
                          column.sortable && enableSort ? "pointer" : "default",
                      }}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      {column.header}
                      {enableSort &&
                        column.sortable &&
                        sortBy === column.key && (
                          <span style={{ marginLeft: 4 }}>
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (enableSelection ? 1 : 0)}
                    style={{ textAlign: "center", padding: 40 }}
                  >
                    {emptyState || <Text color="dimmed">No data found</Text>}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => (
                  <tr
                    key={index}
                    onClick={() => onRowClick?.(row, index)}
                    style={{
                      cursor: onRowClick ? "pointer" : "default",
                      ...rowStyle,
                    }}
                  >
                    {enableSelection && (
                      <td>
                        <Checkbox
                          checked={selectedRows.includes(index)}
                          onChange={() => toggleRowSelection(index)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        style={{ textAlign: column.align || "left" }}
                      >
                        {column.render
                          ? column.render(row[column.key], row, index)
                          : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Box>
      </Paper>

      {/* Pagination */}
      {enablePagination && filteredData.length > 0 && (
        <Group justify="apart">
          <Group gap="xs">
            <Text size="sm" color="dimmed">
              Showing {(activePage - 1) * currentPageSize + 1} to{" "}
              {Math.min(activePage * currentPageSize, filteredData.length)} of{" "}
              {filteredData.length} entries
            </Text>
            <Select
              value={currentPageSize.toString()}
              onChange={(value) => {
                setCurrentPageSize(Number(value));
                setActivePage(1);
              }}
              data={pageSizeOptions.map((size) => ({
                value: size.toString(),
                label: `${size} per page`,
              }))}
              style={{ width: 140 }}
            />
          </Group>
          <Pagination
            total={totalPages}
            value={activePage}
            onChange={setActivePage}
          />
        </Group>
      )}
    </Stack>
  );
}

// ============================================
// SAMPLE USAGE EXAMPLES
// ============================================

// Example 1: Simple User Table
export function UserTableExample() {
  const columns: ColumnDef[] = [
    { key: "id", header: "ID", width: 60, sortable: true },
    { key: "name", header: "Name", sortable: true },
    { key: "email", header: "Email", sortable: true },
    { key: "role", header: "Role", width: 120 },
  ];

  const data = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
    { id: 3, name: "Bob Wilson", email: "bob@example.com", role: "Manager" },
  ];

  return <DataTable columns={columns} data={data} />;
}

// Example 2: Projects Table with Custom Rendering
export function ProjectsTableExample() {
  const columns: ColumnDef[] = [
    {
      key: "id",
      header: "ID",
      width: 60,
      sortable: true,
      align: "center",
    },
    {
      key: "projectName",
      header: "Project Name",
      sortable: true,
      render: (value) => <Text fw={600}>{value}</Text>,
    },
    {
      key: "status",
      header: "Status",
      width: 120,
      sortable: true,
      render: (value) => (
        <Badge color={value === "LIVE" ? "green" : "blue"} variant="light">
          {value}
        </Badge>
      ),
    },
    {
      key: "progress",
      header: "Progress",
      width: 150,
      render: (value) => (
        <Group gap="xs">
          <Progress value={value} style={{ width: 80 }} size="sm" />
          <Text size="xs" color="dimmed">
            {value}%
          </Text>
        </Group>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: 100,
      render: (_, row) => (
        <Group gap={4}>
          <Tooltip label="Edit">
            <ActionIcon variant="subtle" color="blue">
              <span>✏️</span>
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete">
            <ActionIcon variant="subtle" color="red">
              <span>🗑️</span>
            </ActionIcon>
          </Tooltip>
        </Group>
      ),
    },
  ];

  const data = [
    { id: 1, projectName: "ILP Repo", status: "LIVE", progress: 85 },
    {
      id: 2,
      projectName: "Parking System",
      status: "IN PROGRESS",
      progress: 45,
    },
    { id: 3, projectName: "Admin Portal", status: "LIVE", progress: 100 },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      enableSearch
      hideHeader={true}
      enableFilter
      enableSelection
      filterColumn="status"
      filterOptions={["LIVE", "IN PROGRESS"]}
      filterPlaceholder="Filter by status"
      searchColumns={["projectName"]}
      enableMultipleFilters={true}
      columnFilters={{
        status: ["LIVE", "IN PROGRESS", "COMPLETED"],
        batchName: ["ILP Batch 1- 2025-26", "ILP Batch 2- 2025-26"],
        mentor: ["John Doe", "Jane Smith", "Bob Wilson", "Alice Brown"],
      }}
      onRowClick={(row) => console.log("Clicked:", row)}
      onSelectionChange={(rows) => console.log("Selected:", rows)}
    />
  );
}

// Example 3: Minimal Table (No Features)
export function MinimalTableExample() {
  const columns: ColumnDef[] = [
    { key: "name", header: "Name" },
    { key: "value", header: "Value", align: "right" },
  ];

  const data = [
    { name: "Total Users", value: "1,234" },
    { name: "Active Projects", value: "45" },
    { name: "Completed Tasks", value: "789" },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      enableSearch={false}
      enableSort={false}
      enablePagination={false}
      striped={false}
    />
  );
}

// Example 4: Styled Table
export function StyledTableExample() {
  const columns: ColumnDef[] = [
    { key: "product", header: "Product", sortable: true },
    { key: "price", header: "Price", align: "right", sortable: true },
    { key: "stock", header: "Stock", align: "center" },
  ];

  const data = [
    { product: "Laptop", price: "$999", stock: 25 },
    { product: "Mouse", price: "$29", stock: 150 },
    { product: "Keyboard", price: "$79", stock: 80 },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      headerBgColor="#2563eb"
      headerTextColor="#ffffff"
      striped
      highlightOnHover
      pageSize={5}
      headerStyle={{ fontWeight: 700, fontSize: 14 }}
      rowStyle={{
        fontSize: 13,
        borderBottom: "none",
        borderTop: "none",
      }}
      hideRowBorders={true}
    />
  );
}
