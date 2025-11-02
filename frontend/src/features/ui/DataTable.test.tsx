import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DataTable, { type ColumnDef } from "./Table"

// Mock Mantine components used
vi.mock("@mantine/core", () => ({
  Table: (props: any) => <table {...props} />,
  Text: (props: any) => <div {...props} />,
  Paper: (props: any) => <div {...props} />,
  Checkbox: (props: any) => <input type="checkbox" {...props} />,
  Stack: (props: any) => <div {...props} />,
  Box: (props: any) => <div {...props} />,
}));

// Mock child components
vi.mock("./DataTablePagination", () => ({
  default: () => <div data-testid="pagination">Pagination</div>,
}));
vi.mock("./DataTableInfo", () => ({
  default: () => <div data-testid="info">Info</div>,
}));
vi.mock("./DataTableFilter", () => ({
  default: () => <div data-testid="filter">Filter</div>,
}));

const columns: ColumnDef[] = [
  { key: "name", header: "Name" },
  { key: "age", header: "Age" },
];

const data = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
];

describe("DataTable", () => {
  it("renders column headers", () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
  });

  it("renders data rows", () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("shows 'No data found' when empty", () => {
    render(<DataTable columns={columns} data={[]} />);
    expect(screen.getByText("No data found")).toBeInTheDocument();
  });

  it("filters data using search", () => {
    render(<DataTable columns={columns} data={data} enableSearch showHeaderSection />);

    fireEvent.change(screen.getByPlaceholderText("Search..."), {
      target: { value: "Alice" },
    });

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
  });

  it("triggers onRowClick when a row is clicked", () => {
    const onRowClick = vi.fn();
    render(<DataTable columns={columns} data={data} onRowClick={onRowClick} />);

    fireEvent.click(screen.getByText("Alice"));

    expect(onRowClick).toHaveBeenCalledWith({ name: "Alice", age: 25 }, 0);
  });

  it("renders pagination & table info when data exists", () => {
    render(<DataTable columns={columns} data={data} />);

    expect(screen.getByTestId("pagination")).toBeInTheDocument();
    expect(screen.getByTestId("info")).toBeInTheDocument();
  });

  it("does not show search input if enableSearch=false", () => {
    render(<DataTable columns={columns} data={data} enableSearch={false} showHeaderSection />);

    expect(screen.queryByPlaceholderText("Search...")).not.toBeInTheDocument();
  });
  
});
