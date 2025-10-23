import { useRef, useState, type ReactNode } from "react";
import { Table, Text, Paper, Checkbox, Stack, Box } from "@mantine/core";
import { Search } from "lucide-react";
import DataTablePagination from "./DataTablePagination";
import DataTableInfo from "./DataTableInfo";
import DataTableFilter from "./DataTableFilter";

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
  striped?: boolean;
  highlightOnHover?: boolean;
  withBorder?: boolean;
  withPadding?: boolean;
  headerBgColor?: string;
  headerTextColor?: string;
  hideHeader?: boolean;
  enableSearch?: boolean;
  enableFilter?: boolean;
  enableSort?: boolean;
  enablePagination?: boolean;
  enableSelection?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  filterColumn?: string;
  filterOptions?: string[];
  filterPlaceholder?: string;
  enableMultipleFilters?: boolean;
  columnFilters?: { [key: string]: string[] };
  searchPlaceholder?: string;
  searchColumns?: string[];
  onRowClick?: (row: T, index: number) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  emptyState?: ReactNode;
  tableStyle?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  rowStyle?: React.CSSProperties;
  hideRowBorders?: boolean;
  showHeaderSection?: boolean;
  headerTitle?: string;
  headerTitleStyle?: React.CSSProperties;
  headerRightContent?: ReactNode;
  enableDateFilter?: boolean;
  dateFilterColumn?: string;
  multipleFilters?: { [key: string]: string | null };
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  striped = true,
  highlightOnHover = true,
  withBorder = true,
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
  const [multipleFilters, setMultipleFilters] = useState<{
    [key: string]: string | null;
  }>({});
  const [activePage, setActivePage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [dateFilter, setDateFilter] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: null,
    to: null,
  });
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  let filteredData = [...data];

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

  if (enableFilter && !enableMultipleFilters && filterValue && filterColumn) {
    filteredData = filteredData.filter(
      (row) => row[filterColumn] === filterValue,
    );
  }

  if (enableMultipleFilters) {
    filteredData = filteredData.filter((row) => {
      return Object.entries(multipleFilters).every(([key, value]) => {
        if (!value) return true;
        return row[key] === value;
      });
    });
  }

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

  if (enableSort && sortBy) {
    filteredData.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }

  const paginatedData = enablePagination
    ? filteredData.slice(
        (activePage - 1) * currentPageSize,
        activePage * currentPageSize,
      )
    : filteredData;

  return (
    <Stack className="" gap="md" style={{ backgroundColor: "white" }}>
      <Box style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}>
        {/* Header Section */}
        {showHeaderSection && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "1rem",
              marginBottom: "1rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.125rem",
                fontWeight: 500,
                color: "#565E6C",
                margin: 0,
                ...headerTitleStyle,
              }}
            >
              {headerTitle || "Table"}
            </h2>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {headerRightContent}

              {enableSearch && (
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Search
                    size={16}
                    style={{
                      position: "absolute",
                      left: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#9CA3AF",
                    }}
                  />
                  <input
                    ref={searchInputRef}
                    type="search"
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={(e) => setSearch(e.currentTarget.value)}
                    style={{
                      height: "2rem",
                      paddingLeft: "2.25rem",
                      paddingRight: "0.75rem",
                      border: "1px solid #D1D5DB",
                      borderRadius: "0.375rem",
                    }}
                  />
                </div>
              )}

              {(enableFilter || enableMultipleFilters) && (
                <DataTableFilter
                  filterColumn={filterColumn}
                  filterOptions={filterOptions}
                  filterPlaceholder={filterPlaceholder}
                  enableMultipleFilters={enableMultipleFilters}
                  multipleFilters={multipleFilters}
                  columnFilters={columnFilters}
                  onFilterChange={(value) => setFilterValue(value)}
                  onMultipleFilterChange={(filters) =>
                    setMultipleFilters(filters)
                  }
                />
              )}

              {enableDateFilter && dateFilterColumn && (
                <div className="flex gap-2 items-end">
                  <div className="flex gap-2 items-center">
                    <label>From:</label>
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
                      className="border px-2 py-1 rounded"
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <label>To:</label>
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
                      className="border px-2 py-1 rounded"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Divider */}
        {showHeaderSection && (
          <div
            style={{
              height: "0",
              borderTop: "1px solid #E5E7EB",
              marginBottom: "1rem",
            }}
          />
        )}

        {/* Selection info */}
        {enableSelection && selectedRows.length > 0 && (
          <Text size="sm" c="dimmed" style={{ marginBottom: "0.5rem" }}>
            {selectedRows.length} row(s) selected
          </Text>
        )}

        {/* Table */}
        <Paper withBorder={withBorder} p={0}>
          <Box style={{ overflowX: "auto", width: "100%" }}>
            <Table
              striped={striped}
              highlightOnHover={highlightOnHover}
              style={{
                width: "100%",
                borderCollapse: "collapse",
                ...tableStyle,
              }}
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
                          width: "40px",
                          textAlign: "center",
                          padding: "12px",
                          verticalAlign: "middle",
                          borderBottom: hideRowBorders
                            ? "none"
                            : "1px solid #E5E7EB",
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
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          color: "#565E6C",
                          textAlign: column.align || "left",
                          padding: "12px 16px",
                          verticalAlign: "middle",
                          borderBottom: hideRowBorders
                            ? "none"
                            : "1px solid #E5E7EB",
                          cursor:
                            column.sortable && enableSort
                              ? "pointer"
                              : "default",
                          whiteSpace: "nowrap",
                        }}
                        onClick={() =>
                          column.sortable && handleSort(column.key)
                        }
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                              column.align === "center"
                                ? "center"
                                : column.align === "right"
                                  ? "flex-end"
                                  : "flex-start",
                            gap: "0.25rem",
                            width: "100%",
                          }}
                        >
                          {column.header}
                          {enableSort &&
                            column.sortable &&
                            sortBy === column.key && (
                              <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                            )}
                        </div>
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
                      style={{ textAlign: "center", padding: "40px" }}
                    >
                      {emptyState || <Text c="dimmed">No data found</Text>}
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
                        <td
                          style={{
                            textAlign: "center",
                            padding: "12px",
                            verticalAlign: "middle",
                            borderBottom: hideRowBorders
                              ? "none"
                              : "1px solid #E5E7EB",
                          }}
                        >
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
                            padding: "12px 16px",
                            verticalAlign: "middle",
                            borderBottom: hideRowBorders
                              ? "none"
                              : "1px solid #E5E7EB",
                            fontSize: "0.875rem",
                            color: "#374151",
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
          <div className="flex justify-between items-center mt-2">
            <DataTableInfo
              totalEntries={filteredData.length}
              currentPage={activePage}
              pageSize={currentPageSize}
              pageSizeOptions={pageSizeOptions}
              onPageSizeChange={(size) => {
                setCurrentPageSize(size);
                setActivePage(1);
              }}
            />
            <DataTablePagination
              totalEntries={filteredData.length}
              currentPage={activePage}
              pageSize={currentPageSize}
              onPageChange={setActivePage}
            />
          </div>
        )}
      </Box>
    </Stack>
  );
}
