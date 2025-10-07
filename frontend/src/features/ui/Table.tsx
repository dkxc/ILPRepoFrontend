import { useRef, useState, type ReactNode } from "react";
import { DatePickerInput } from "@mantine/dates";
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
import { Search, X } from "lucide-react";

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
  // Table header section (optional)
  showHeaderSection?: boolean; // enable/disable the top header bar
  headerTitle?: string; // text for the header (like "All Trainees")
  headerTitleStyle?: React.CSSProperties; // optional custom style for the title
  headerRightContent?: ReactNode; // allow user to inject extra actions (e.g. add button)
  // Date Filter Options
  enableDateFilter?: boolean;
  dateFilterColumn?: string; // which column to apply it on
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
  showHeaderSection = false,
  headerTitle = "Table",
  headerTitleStyle,
  headerRightContent,
  enableDateFilter = false,
  dateFilterColumn,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [filterValue, setFilterValue] = useState<string | null>(null);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [multipleFilters, setMultipleFilters] = useState<{
    [key: string]: string | null;
  }>({});
  const [activePage, setActivePage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const searchInputRef = useRef<HTMLInputElement>(null);

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
  const [dateFilter, setDateFilter] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: null,
    to: null,
  });

  if (
    enableDateFilter &&
    dateFilterColumn &&
    (dateFilter.from || dateFilter.to)
  ) {
    filteredData = filteredData.filter((row) => {
      const cellValue = row[dateFilterColumn];
      if (!cellValue) return false;
      const rowDate = new Date(cellValue);
      if (dateFilter.from && rowDate < dateFilter.from) return false;
      if (dateFilter.to && rowDate > dateFilter.to) return false;
      return true;
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
    <Stack gap="md" className="bg-white ml-10 mr-10">
      {/* Search and Filter Bar */}
      {/* ✅ Header Section with Title + Search/Filters */}
      {showHeaderSection && (
        <>
          <div className="flex items-center justify-between ml-5 mr-5 pt-4">
            {/* Left side: Header Title */}
            <h2
              className="text-lg font-medium"
              style={{
                color: "#565E6C",
                ...(headerTitleStyle || {}),
                // paddingLeft:"20px"
              }}
            >
              {headerTitle || "Table"}
            </h2>

            {/* Right side: Search + Filters + Custom content */}
            <div className="flex items-center ">
              {/* Allow external content like buttons */}
              {headerRightContent}
              {/* Search */}
              {enableSearch && (
                <div
                  className="relative flex  items-center rounded-md transition-all duration-300 ease-in-out cursor-pointer"
                  style={{
                    width: searchExpanded ? "250px" : "40px",
                    // backgroundColor: searchExpanded ? "#F3F4F6" : "transparent",
                  }}
                  onMouseEnter={() => setSearchExpanded(true)}
                  onMouseLeave={() => {
                    if (document.activeElement !== searchInputRef.current) {
                      setSearchExpanded(false);
                    }
                  }}
                  onClick={() => {
                    if (searchExpanded) {
                      searchInputRef.current?.focus();
                    }
                  }}
                >
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 transition-opacity"
                    size={16}
                  />
                  <input
                    ref={searchInputRef}
                    type="search"
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={(e) => setSearch(e.currentTarget.value)}
                    className="h-full w-full bg-transparent pl-9 pr-3 text-sm transition-opacity duration-200 ease-in-out focus:outline-none"
                    style={{
                      opacity: searchExpanded ? 1 : 0,
                    }}
                    onFocus={() => setSearchExpanded(true)}
                    onBlur={() => {
                      if (document.activeElement !== searchInputRef.current) {
                        setSearchExpanded(false);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        e.preventDefault();
                        setSearchExpanded(false);
                        searchInputRef.current?.blur();
                      }
                    }}
                  />
                </div>
              )}
              {/* Multiple Filters */}
              {/* Single Filter */}
              {/* {enableFilter && !enableMultipleFilters && filterColumn && (
                <Select
                  placeholder={filterPlaceholder}
                  data={filterOptions}
                  value={filterValue}
                  onChange={setFilterValue}
                  clearable
                  style={{ width: 200 }}
                />
              )} */}
              {/* ✅ Date Range Filter (Independent) */}
              {enableDateFilter && dateFilterColumn && (
                <div className="flex gap-2 items-end">
                  {/* From Date */}
                  <div className="flex flex-row items-center gap-2">
                    <label className="text-sm text-gray-700">From: </label>
                    <input
                      type="date"
                      value={
                        dateFilter.from
                          ? dateFilter.from.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setDateFilter({
                          ...dateFilter,
                          from: e.target.value
                            ? new Date(e.target.value)
                            : null,
                        })
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  {/* To Date */}
                  <div className="flex flex-row items-center gap-2">
                    <label className="text-sm text-gray-700">To: </label>
                    <input
                      type="date"
                      value={
                        dateFilter.to
                          ? dateFilter.to.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setDateFilter({
                          ...dateFilter,
                          to: e.target.value ? new Date(e.target.value) : null,
                        })
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
              )}
              {enableMultipleFilters && (
                <>
                  {Object.entries(columnFilters).map(([key, options]) => {
                    const column = columns.find((col) => col.key === key);
                    return (
                      <Select
                        key={key}
                        placeholder={`Filter ${column?.header || key}`}
                        data={options}
                        value={multipleFilters[key] || null}
                        onChange={(value) =>
                          setMultipleFilters((prev) => ({
                            ...prev,
                            [key]: value,
                          }))
                        }
                        clearable
                        style={{ width: 180 }}
                      />
                    );
                  })}
                </>
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
            </div>
          </div>

          {/* Divider below header */}
          <div className="h-0 border-t border-gray-300 ml-5 mr-5"></div>
        </>
      )}

      {/* Selection info */}
      {enableSelection && selectedRows.length > 0 && (
        <Text size="sm" color="dimmed">
          {selectedRows.length} row(s) selected
        </Text>
      )}

      {/* Table */}
      <Paper withBorder={false} p={withPadding ? "md" : 0}>
        <Box
          style={{
            overflowX: "auto",
            // borderTop: "2px solid #E5E7EB",
          }}
        >
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
                        fontWeight: "700",
                        color: "#565E6C",
                        textAlign: column.align || "left",
                        paddingLeft: "20px",
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
                        style={{
                          textAlign: column.align || "left",
                          paddingLeft: "20px",
                        }}
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
