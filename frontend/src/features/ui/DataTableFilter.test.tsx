import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import DataTableFilter from "./DataTableFilter";

// Mock MUI components
vi.mock("@mui/material", () => ({
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  FormControl: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  InputLabel: ({ children, ...props }: any) => (
    <label {...props}>{children}</label>
  ),
  Select: ({ value, onChange, label, children, ...props }: any) => (
    <select
      data-testid={`select-${label}`}
      value={value}
      onChange={(e) => onChange({ target: { value: e.target.value } })}
      aria-label={label}
      {...props}
    >
      {children}
    </select>
  ),
  MenuItem: ({ value, children, ...props }: any) => (
    <option value={value} {...props}>
      {children}
    </option>
  ),
}));

describe("DataTableFilter", () => {
  describe("Single Filter Mode", () => {
    it("renders single filter when enableMultipleFilters is false", () => {
      render(
        <DataTableFilter
          filterColumn="status"
          filterOptions={["Active", "Inactive"]}
          filterPlaceholder="Filter by status"
          enableMultipleFilters={false}
        />,
      );

      expect(screen.getByTestId("select-Filter by status")).toBeInTheDocument();
    });

    it("displays correct placeholder text", () => {
      render(
        <DataTableFilter
          filterColumn="status"
          filterOptions={["Active", "Inactive"]}
          filterPlaceholder="Select Status"
          enableMultipleFilters={false}
        />,
      );

      expect(screen.getByText("Select Status")).toBeInTheDocument();
    });

    it("renders all filter options", () => {
      render(
        <DataTableFilter
          filterColumn="status"
          filterOptions={["Active", "Inactive", "Pending"]}
          filterPlaceholder="Filter"
          enableMultipleFilters={false}
        />,
      );

      expect(screen.getByText("Active")).toBeInTheDocument();
      expect(screen.getByText("Inactive")).toBeInTheDocument();
      expect(screen.getByText("Pending")).toBeInTheDocument();
    });

    it("includes 'None' option to clear filter", () => {
      render(
        <DataTableFilter
          filterColumn="status"
          filterOptions={["Active", "Inactive"]}
          filterPlaceholder="Filter"
          enableMultipleFilters={false}
        />,
      );

      expect(screen.getByText("None")).toBeInTheDocument();
    });

    it("calls onFilterChange when filter value changes", () => {
      const onFilterChange = vi.fn();
      render(
        <DataTableFilter
          filterColumn="status"
          filterOptions={["Active", "Inactive"]}
          filterPlaceholder="Filter"
          enableMultipleFilters={false}
          onFilterChange={onFilterChange}
        />,
      );

      const select = screen.getByTestId("select-Filter");
      fireEvent.change(select, { target: { value: "Active" } });

      expect(onFilterChange).toHaveBeenCalledWith("Active");
    });

    it("calls onFilterChange with null when cleared", () => {
      const onFilterChange = vi.fn();
      render(
        <DataTableFilter
          filterColumn="status"
          filterOptions={["Active", "Inactive"]}
          filterPlaceholder="Filter"
          enableMultipleFilters={false}
          onFilterChange={onFilterChange}
        />,
      );

      const select = screen.getByTestId("select-Filter");
      fireEvent.change(select, { target: { value: "" } });

      expect(onFilterChange).toHaveBeenCalledWith(null);
    });

    it("updates internal state when filter changes", () => {
      render(
        <DataTableFilter
          filterColumn="status"
          filterOptions={["Active", "Inactive"]}
          filterPlaceholder="Filter"
          enableMultipleFilters={false}
        />,
      );

      const select = screen.getByTestId("select-Filter") as HTMLSelectElement;
      fireEvent.change(select, { target: { value: "Active" } });

      expect(select.value).toBe("Active");
    });

    it("does not render when filterColumn is not provided", () => {
      render(
        <DataTableFilter
          filterOptions={["Active", "Inactive"]}
          filterPlaceholder="Filter"
          enableMultipleFilters={false}
        />,
      );

      expect(screen.queryByTestId("select-Filter")).not.toBeInTheDocument();
    });

    it("handles empty filter options array", () => {
      render(
        <DataTableFilter
          filterColumn="status"
          filterOptions={[]}
          filterPlaceholder="Filter"
          enableMultipleFilters={false}
        />,
      );

      expect(screen.getByTestId("select-Filter")).toBeInTheDocument();
      expect(screen.getByText("None")).toBeInTheDocument();
    });

    it("uses default placeholder when not provided", () => {
      render(
        <DataTableFilter
          filterColumn="status"
          filterOptions={["Active"]}
          enableMultipleFilters={false}
        />,
      );

      expect(screen.getByText("Filter...")).toBeInTheDocument();
    });
  });

  describe("Multiple Filters Mode", () => {
    const columnFilters = {
      status: ["Active", "Inactive"],
      priority: ["High", "Medium", "Low"],
    };

    it("renders multiple filters when enableMultipleFilters is true", () => {
      render(
        <DataTableFilter
          enableMultipleFilters={true}
          columnFilters={columnFilters}
        />,
      );

      expect(screen.getByTestId("select-status")).toBeInTheDocument();
      expect(screen.getByTestId("select-priority")).toBeInTheDocument();
    });

    it("displays correct labels for each filter", () => {
      render(
        <DataTableFilter
          enableMultipleFilters={true}
          columnFilters={columnFilters}
        />,
      );

      expect(screen.getByText("status")).toBeInTheDocument();
      expect(screen.getByText("priority")).toBeInTheDocument();
    });

    it("renders all options for each filter", () => {
      render(
        <DataTableFilter
          enableMultipleFilters={true}
          columnFilters={columnFilters}
        />,
      );

      expect(screen.getByText("Active")).toBeInTheDocument();
      expect(screen.getByText("Inactive")).toBeInTheDocument();
      expect(screen.getByText("High")).toBeInTheDocument();
      expect(screen.getByText("Medium")).toBeInTheDocument();
      expect(screen.getByText("Low")).toBeInTheDocument();
    });

    it("includes 'None' option for each filter", () => {
      render(
        <DataTableFilter
          enableMultipleFilters={true}
          columnFilters={columnFilters}
        />,
      );

      const noneOptions = screen.getAllByText("None");
      expect(noneOptions).toHaveLength(2);
    });

    it("calls onMultipleFilterChange when a filter changes", () => {
      const onMultipleFilterChange = vi.fn();
      render(
        <DataTableFilter
          enableMultipleFilters={true}
          columnFilters={columnFilters}
          multipleFilters={{}}
          onMultipleFilterChange={onMultipleFilterChange}
        />,
      );

      const statusSelect = screen.getByTestId("select-status");
      fireEvent.change(statusSelect, { target: { value: "Active" } });

      expect(onMultipleFilterChange).toHaveBeenCalledWith({
        status: "Active",
      });
    });

    it("preserves other filter values when one changes", () => {
      const onMultipleFilterChange = vi.fn();
      render(
        <DataTableFilter
          enableMultipleFilters={true}
          columnFilters={columnFilters}
          multipleFilters={{ status: "Active" }}
          onMultipleFilterChange={onMultipleFilterChange}
        />,
      );

      const prioritySelect = screen.getByTestId("select-priority");
      fireEvent.change(prioritySelect, { target: { value: "High" } });

      expect(onMultipleFilterChange).toHaveBeenCalledWith({
        status: "Active",
        priority: "High",
      });
    });

    it("sets filter to null when cleared", () => {
      const onMultipleFilterChange = vi.fn();
      render(
        <DataTableFilter
          enableMultipleFilters={true}
          columnFilters={columnFilters}
          multipleFilters={{ status: "Active" }}
          onMultipleFilterChange={onMultipleFilterChange}
        />,
      );

      const statusSelect = screen.getByTestId("select-status");
      fireEvent.change(statusSelect, { target: { value: "" } });

      expect(onMultipleFilterChange).toHaveBeenCalledWith({
        status: null,
      });
    });

    it("displays current filter values correctly", () => {
      render(
        <DataTableFilter
          enableMultipleFilters={true}
          columnFilters={columnFilters}
          multipleFilters={{ status: "Active", priority: "High" }}
        />,
      );

      const statusSelect = screen.getByTestId(
        "select-status",
      ) as HTMLSelectElement;
      const prioritySelect = screen.getByTestId(
        "select-priority",
      ) as HTMLSelectElement;

      expect(statusSelect.value).toBe("Active");
      expect(prioritySelect.value).toBe("High");
    });

    it("handles empty columnFilters object", () => {
      render(
        <DataTableFilter enableMultipleFilters={true} columnFilters={{}} />,
      );

      expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    });

    it("handles single column in multiple filters mode", () => {
      render(
        <DataTableFilter
          enableMultipleFilters={true}
          columnFilters={{ status: ["Active", "Inactive"] }}
        />,
      );

      expect(screen.getByTestId("select-status")).toBeInTheDocument();
      expect(screen.queryByTestId("select-priority")).not.toBeInTheDocument();
    });
  });

  describe("Mode Switching", () => {
    it("does not render single filter when in multiple filters mode", () => {
      render(
        <DataTableFilter
          enableMultipleFilters={true}
          filterColumn="status"
          filterOptions={["Active", "Inactive"]}
          columnFilters={{ priority: ["High", "Low"] }}
        />,
      );

      expect(screen.queryByTestId("select-Filter...")).not.toBeInTheDocument();
      expect(screen.getByTestId("select-priority")).toBeInTheDocument();
    });

    it("does not render multiple filters when in single filter mode", () => {
      render(
        <DataTableFilter
          enableMultipleFilters={false}
          filterColumn="status"
          filterOptions={["Active", "Inactive"]}
          filterPlaceholder="Filter"
          columnFilters={{ priority: ["High", "Low"] }}
        />,
      );

      expect(screen.getByTestId("select-Filter")).toBeInTheDocument();
      expect(screen.queryByTestId("select-priority")).not.toBeInTheDocument();
    });
  });

  describe("Default Props", () => {
    it("uses default filterOptions when not provided", () => {
      render(
        <DataTableFilter
          filterColumn="status"
          filterPlaceholder="Filter"
          enableMultipleFilters={false}
        />,
      );

      expect(screen.getByTestId("select-Filter")).toBeInTheDocument();
      expect(screen.getByText("None")).toBeInTheDocument();
    });

    it("uses default filterPlaceholder when not provided", () => {
      render(
        <DataTableFilter
          filterColumn="status"
          filterOptions={["Active"]}
          enableMultipleFilters={false}
        />,
      );

      expect(screen.getByText("Filter...")).toBeInTheDocument();
    });

    it("uses default multipleFilters when not provided", () => {
      render(
        <DataTableFilter
          enableMultipleFilters={true}
          columnFilters={{ status: ["Active"] }}
        />,
      );

      const select = screen.getByTestId("select-status") as HTMLSelectElement;
      expect(select.value).toBe("");
    });

    it("uses default columnFilters when not provided", () => {
      render(<DataTableFilter enableMultipleFilters={true} />);

      expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    });

    it("uses default enableMultipleFilters when not provided", () => {
      render(
        <DataTableFilter
          filterColumn="status"
          filterOptions={["Active"]}
          filterPlaceholder="Filter"
        />,
      );

      expect(screen.getByTestId("select-Filter")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles special characters in filter options", () => {
      render(
        <DataTableFilter
          filterColumn="status"
          filterOptions={["Active/Pending", "In-Progress", "Done!"]}
          filterPlaceholder="Filter"
          enableMultipleFilters={false}
        />,
      );

      expect(screen.getByText("Active/Pending")).toBeInTheDocument();
      expect(screen.getByText("In-Progress")).toBeInTheDocument();
      expect(screen.getByText("Done!")).toBeInTheDocument();
    });

    it("handles very long filter option names", () => {
      render(
        <DataTableFilter
          filterColumn="status"
          filterOptions={[
            "This is a very long filter option name that should still work",
          ]}
          filterPlaceholder="Filter"
          enableMultipleFilters={false}
        />,
      );

      expect(
        screen.getByText(
          "This is a very long filter option name that should still work",
        ),
      ).toBeInTheDocument();
    });

    it("handles numeric filter options", () => {
      render(
        <DataTableFilter
          filterColumn="status"
          filterOptions={["1", "2", "3"]}
          filterPlaceholder="Filter"
          enableMultipleFilters={false}
        />,
      );

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("handles duplicate filter options", () => {
      render(
        <DataTableFilter
          filterColumn="status"
          filterOptions={["Active", "Active", "Inactive"]}
          filterPlaceholder="Filter"
          enableMultipleFilters={false}
        />,
      );

      const activeOptions = screen.getAllByText("Active");
      expect(activeOptions.length).toBeGreaterThanOrEqual(1);
    });

    it("handles empty string as filter option", () => {
      render(
        <DataTableFilter
          filterColumn="status"
          filterOptions={["", "Active"]}
          filterPlaceholder="Filter"
          enableMultipleFilters={false}
        />,
      );

      expect(screen.getByText("Active")).toBeInTheDocument();
    });
  });

  describe("Callback Handling", () => {
    it("does not throw error when onFilterChange is not provided", () => {
      render(
        <DataTableFilter
          filterColumn="status"
          filterOptions={["Active", "Inactive"]}
          filterPlaceholder="Filter"
          enableMultipleFilters={false}
        />,
      );

      const select = screen.getByTestId("select-Filter");
      expect(() => {
        fireEvent.change(select, { target: { value: "Active" } });
      }).not.toThrow();
    });

    it("does not throw error when onMultipleFilterChange is not provided", () => {
      render(
        <DataTableFilter
          enableMultipleFilters={true}
          columnFilters={{ status: ["Active", "Inactive"] }}
        />,
      );

      const select = screen.getByTestId("select-status");
      expect(() => {
        fireEvent.change(select, { target: { value: "Active" } });
      }).not.toThrow();
    });

    it("calls onFilterChange multiple times correctly", () => {
      const onFilterChange = vi.fn();
      render(
        <DataTableFilter
          filterColumn="status"
          filterOptions={["Active", "Inactive", "Pending"]}
          filterPlaceholder="Filter"
          enableMultipleFilters={false}
          onFilterChange={onFilterChange}
        />,
      );

      const select = screen.getByTestId("select-Filter");
      fireEvent.change(select, { target: { value: "Active" } });
      fireEvent.change(select, { target: { value: "Inactive" } });
      fireEvent.change(select, { target: { value: "Pending" } });

      expect(onFilterChange).toHaveBeenCalledTimes(3);
      expect(onFilterChange).toHaveBeenNthCalledWith(1, "Active");
      expect(onFilterChange).toHaveBeenNthCalledWith(2, "Inactive");
      expect(onFilterChange).toHaveBeenNthCalledWith(3, "Pending");
    });
  });

  describe("Integration Scenarios", () => {
    it("handles complete filter workflow in single mode", () => {
      const onFilterChange = vi.fn();
      render(
        <DataTableFilter
          filterColumn="status"
          filterOptions={["Active", "Inactive"]}
          filterPlaceholder="Status"
          enableMultipleFilters={false}
          onFilterChange={onFilterChange}
        />,
      );

      const select = screen.getByTestId("select-Status");

      // Select a filter
      fireEvent.change(select, { target: { value: "Active" } });
      expect(onFilterChange).toHaveBeenCalledWith("Active");

      // Change filter
      fireEvent.change(select, { target: { value: "Inactive" } });
      expect(onFilterChange).toHaveBeenCalledWith("Inactive");

      // Clear filter
      fireEvent.change(select, { target: { value: "" } });
      expect(onFilterChange).toHaveBeenCalledWith(null);
    });

    it("handles complete filter workflow in multiple mode", () => {
      const onMultipleFilterChange = vi.fn();
      render(
        <DataTableFilter
          enableMultipleFilters={true}
          columnFilters={{
            status: ["Active", "Inactive"],
            priority: ["High", "Low"],
          }}
          multipleFilters={{}}
          onMultipleFilterChange={onMultipleFilterChange}
        />,
      );

      // Set first filter
      fireEvent.change(screen.getByTestId("select-status"), {
        target: { value: "Active" },
      });
      expect(onMultipleFilterChange).toHaveBeenLastCalledWith({
        status: "Active",
      });

      // Set second filter
      fireEvent.change(screen.getByTestId("select-priority"), {
        target: { value: "High" },
      });
      expect(onMultipleFilterChange).toHaveBeenLastCalledWith({
        priority: "High",
      });
    });

    it("handles filter with many options efficiently", () => {
      const manyOptions = Array.from(
        { length: 100 },
        (_, i) => `Option ${i + 1}`,
      );
      render(
        <DataTableFilter
          filterColumn="status"
          filterOptions={manyOptions}
          filterPlaceholder="Filter"
          enableMultipleFilters={false}
        />,
      );

      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 50")).toBeInTheDocument();
      expect(screen.getByText("Option 100")).toBeInTheDocument();
    });
  });
});
