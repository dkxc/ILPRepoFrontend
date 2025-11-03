import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DataTablePagination from "./DataTablePagination";

// Mock MUI components
vi.mock("@mui/material", () => ({
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Pagination: ({ count, page, onChange, ...props }: any) => (
    <div
      data-testid="pagination"
      data-page={page}
      data-count={count}
      {...props}
    >
      <button
        data-testid="prev-button"
        onClick={() => onChange(null, Math.max(1, page - 1))}
        disabled={page === 1}
      >
        Previous
      </button>
      {Array.from({ length: count }, (_, i) => i + 1).map((pageNum) => (
        <button
          key={pageNum}
          data-testid={`page-${pageNum}`}
          onClick={() => onChange(null, pageNum)}
          aria-current={page === pageNum ? "page" : undefined}
        >
          {pageNum}
        </button>
      ))}
      <button
        data-testid="next-button"
        onClick={() => onChange(null, Math.min(count, page + 1))}
        disabled={page === count}
      >
        Next
      </button>
    </div>
  ),
}));

describe("DataTablePagination", () => {
  describe("Rendering", () => {
    it("renders pagination component with correct page count", () => {
      render(
        <DataTablePagination
          totalEntries={50}
          currentPage={1}
          pageSize={10}
          onPageChange={vi.fn()}
        />,
      );

      const pagination = screen.getByTestId("pagination");
      expect(pagination).toBeInTheDocument();
      expect(pagination).toHaveAttribute("data-count", "5");
    });

    it("displays correct current page", () => {
      render(
        <DataTablePagination
          totalEntries={50}
          currentPage={3}
          pageSize={10}
          onPageChange={vi.fn()}
        />,
      );

      const pagination = screen.getByTestId("pagination");
      expect(pagination).toHaveAttribute("data-page", "3");
    });

    it("renders all page buttons", () => {
      render(
        <DataTablePagination
          totalEntries={30}
          currentPage={1}
          pageSize={10}
          onPageChange={vi.fn()}
        />,
      );

      expect(screen.getByTestId("page-1")).toBeInTheDocument();
      expect(screen.getByTestId("page-2")).toBeInTheDocument();
      expect(screen.getByTestId("page-3")).toBeInTheDocument();
    });

    it("highlights current page button", () => {
      render(
        <DataTablePagination
          totalEntries={30}
          currentPage={2}
          pageSize={10}
          onPageChange={vi.fn()}
        />,
      );

      const currentPageButton = screen.getByTestId("page-2");
      expect(currentPageButton).toHaveAttribute("aria-current", "page");
    });
  });

  describe("Visibility", () => {
    it("does not render when there is only one page", () => {
      render(
        <DataTablePagination
          totalEntries={10}
          currentPage={1}
          pageSize={10}
          onPageChange={vi.fn()}
        />,
      );

      expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
    });

    it("does not render when there are fewer entries than page size", () => {
      render(
        <DataTablePagination
          totalEntries={5}
          currentPage={1}
          pageSize={10}
          onPageChange={vi.fn()}
        />,
      );

      expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
    });

    it("renders when there are exactly two pages", () => {
      render(
        <DataTablePagination
          totalEntries={20}
          currentPage={1}
          pageSize={10}
          onPageChange={vi.fn()}
        />,
      );

      expect(screen.getByTestId("pagination")).toBeInTheDocument();
    });

    it("renders when there are multiple pages", () => {
      render(
        <DataTablePagination
          totalEntries={100}
          currentPage={1}
          pageSize={10}
          onPageChange={vi.fn()}
        />,
      );

      expect(screen.getByTestId("pagination")).toBeInTheDocument();
    });
  });

  describe("Page Calculation", () => {
    it("calculates correct total pages for exact division", () => {
      render(
        <DataTablePagination
          totalEntries={50}
          currentPage={1}
          pageSize={10}
          onPageChange={vi.fn()}
        />,
      );

      const pagination = screen.getByTestId("pagination");
      expect(pagination).toHaveAttribute("data-count", "5");
    });

    it("calculates correct total pages with remainder", () => {
      render(
        <DataTablePagination
          totalEntries={55}
          currentPage={1}
          pageSize={10}
          onPageChange={vi.fn()}
        />,
      );

      const pagination = screen.getByTestId("pagination");
      expect(pagination).toHaveAttribute("data-count", "6");
    });

    it("handles single entry correctly", () => {
      render(
        <DataTablePagination
          totalEntries={1}
          currentPage={1}
          pageSize={10}
          onPageChange={vi.fn()}
        />,
      );

      expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
    });

    it("handles large datasets correctly", () => {
      render(
        <DataTablePagination
          totalEntries={1000}
          currentPage={1}
          pageSize={25}
          onPageChange={vi.fn()}
        />,
      );

      const pagination = screen.getByTestId("pagination");
      expect(pagination).toHaveAttribute("data-count", "40");
    });

    it("handles small page sizes correctly", () => {
      render(
        <DataTablePagination
          totalEntries={100}
          currentPage={1}
          pageSize={5}
          onPageChange={vi.fn()}
        />,
      );

      const pagination = screen.getByTestId("pagination");
      expect(pagination).toHaveAttribute("data-count", "20");
    });
  });

  describe("Page Navigation", () => {
    it("calls onPageChange when page button is clicked", () => {
      const onPageChange = vi.fn();
      render(
        <DataTablePagination
          totalEntries={30}
          currentPage={1}
          pageSize={10}
          onPageChange={onPageChange}
        />,
      );

      fireEvent.click(screen.getByTestId("page-2"));

      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it("calls onPageChange with correct page number", () => {
      const onPageChange = vi.fn();
      render(
        <DataTablePagination
          totalEntries={50}
          currentPage={1}
          pageSize={10}
          onPageChange={onPageChange}
        />,
      );

      fireEvent.click(screen.getByTestId("page-4"));

      expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it("calls onPageChange when next button is clicked", () => {
      const onPageChange = vi.fn();
      render(
        <DataTablePagination
          totalEntries={30}
          currentPage={1}
          pageSize={10}
          onPageChange={onPageChange}
        />,
      );

      fireEvent.click(screen.getByTestId("next-button"));

      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it("calls onPageChange when previous button is clicked", () => {
      const onPageChange = vi.fn();
      render(
        <DataTablePagination
          totalEntries={30}
          currentPage={2}
          pageSize={10}
          onPageChange={onPageChange}
        />,
      );

      fireEvent.click(screen.getByTestId("prev-button"));

      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it("does not call onPageChange when clicking current page", () => {
      const onPageChange = vi.fn();
      render(
        <DataTablePagination
          totalEntries={30}
          currentPage={2}
          pageSize={10}
          onPageChange={onPageChange}
        />,
      );

      fireEvent.click(screen.getByTestId("page-2"));

      expect(onPageChange).toHaveBeenCalledWith(2);
    });
  });

  describe("Edge Cases", () => {
    it("handles zero entries", () => {
      render(
        <DataTablePagination
          totalEntries={0}
          currentPage={1}
          pageSize={10}
          onPageChange={vi.fn()}
        />,
      );

      expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
    });

    it("handles page size larger than total entries", () => {
      render(
        <DataTablePagination
          totalEntries={5}
          currentPage={1}
          pageSize={20}
          onPageChange={vi.fn()}
        />,
      );

      expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
    });

    it("handles current page at the end", () => {
      render(
        <DataTablePagination
          totalEntries={50}
          currentPage={5}
          pageSize={10}
          onPageChange={vi.fn()}
        />,
      );

      const pagination = screen.getByTestId("pagination");
      expect(pagination).toHaveAttribute("data-page", "5");
    });

    it("handles fractional page calculations", () => {
      render(
        <DataTablePagination
          totalEntries={47}
          currentPage={1}
          pageSize={10}
          onPageChange={vi.fn()}
        />,
      );

      const pagination = screen.getByTestId("pagination");
      expect(pagination).toHaveAttribute("data-count", "5");
    });

    it("disables previous button on first page", () => {
      render(
        <DataTablePagination
          totalEntries={30}
          currentPage={1}
          pageSize={10}
          onPageChange={vi.fn()}
        />,
      );

      const prevButton = screen.getByTestId("prev-button");
      expect(prevButton).toBeDisabled();
    });

    it("disables next button on last page", () => {
      render(
        <DataTablePagination
          totalEntries={30}
          currentPage={3}
          pageSize={10}
          onPageChange={vi.fn()}
        />,
      );

      const nextButton = screen.getByTestId("next-button");
      expect(nextButton).toBeDisabled();
    });

    it("enables both buttons on middle page", () => {
      render(
        <DataTablePagination
          totalEntries={50}
          currentPage={3}
          pageSize={10}
          onPageChange={vi.fn()}
        />,
      );

      const prevButton = screen.getByTestId("prev-button");
      const nextButton = screen.getByTestId("next-button");

      expect(prevButton).not.toBeDisabled();
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe("Props Validation", () => {
    it("works with different page sizes", () => {
      const { rerender } = render(
        <DataTablePagination
          totalEntries={100}
          currentPage={1}
          pageSize={10}
          onPageChange={vi.fn()}
        />,
      );

      expect(screen.getByTestId("pagination")).toHaveAttribute(
        "data-count",
        "10",
      );

      rerender(
        <DataTablePagination
          totalEntries={100}
          currentPage={1}
          pageSize={25}
          onPageChange={vi.fn()}
        />,
      );

      expect(screen.getByTestId("pagination")).toHaveAttribute(
        "data-count",
        "4",
      );
    });

    it("updates when totalEntries changes", () => {
      const { rerender } = render(
        <DataTablePagination
          totalEntries={30}
          currentPage={1}
          pageSize={10}
          onPageChange={vi.fn()}
        />,
      );

      expect(screen.getByTestId("pagination")).toHaveAttribute(
        "data-count",
        "3",
      );

      rerender(
        <DataTablePagination
          totalEntries={50}
          currentPage={1}
          pageSize={10}
          onPageChange={vi.fn()}
        />,
      );

      expect(screen.getByTestId("pagination")).toHaveAttribute(
        "data-count",
        "5",
      );
    });

    it("updates when currentPage changes", () => {
      const { rerender } = render(
        <DataTablePagination
          totalEntries={50}
          currentPage={1}
          pageSize={10}
          onPageChange={vi.fn()}
        />,
      );

      expect(screen.getByTestId("pagination")).toHaveAttribute(
        "data-page",
        "1",
      );

      rerender(
        <DataTablePagination
          totalEntries={50}
          currentPage={3}
          pageSize={10}
          onPageChange={vi.fn()}
        />,
      );

      expect(screen.getByTestId("pagination")).toHaveAttribute(
        "data-page",
        "3",
      );
    });
  });

  describe("Integration Scenarios", () => {
    it("handles navigation through all pages sequentially", () => {
      const onPageChange = vi.fn();
      const { rerender } = render(
        <DataTablePagination
          totalEntries={30}
          currentPage={1}
          pageSize={10}
          onPageChange={onPageChange}
        />,
      );

      fireEvent.click(screen.getByTestId("next-button"));
      expect(onPageChange).toHaveBeenCalledWith(2);

      rerender(
        <DataTablePagination
          totalEntries={30}
          currentPage={2}
          pageSize={10}
          onPageChange={onPageChange}
        />,
      );

      fireEvent.click(screen.getByTestId("next-button"));
      expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it("handles direct page jumps", () => {
      const onPageChange = vi.fn();
      render(
        <DataTablePagination
          totalEntries={100}
          currentPage={1}
          pageSize={10}
          onPageChange={onPageChange}
        />,
      );

      fireEvent.click(screen.getByTestId("page-7"));
      expect(onPageChange).toHaveBeenCalledWith(7);
    });

    it("maintains functionality after multiple clicks", () => {
      const onPageChange = vi.fn();
      render(
        <DataTablePagination
          totalEntries={50}
          currentPage={3}
          pageSize={10}
          onPageChange={onPageChange}
        />,
      );

      fireEvent.click(screen.getByTestId("page-1"));
      fireEvent.click(screen.getByTestId("page-5"));
      fireEvent.click(screen.getByTestId("page-2"));

      expect(onPageChange).toHaveBeenCalledTimes(3);
      expect(onPageChange).toHaveBeenNthCalledWith(1, 1);
      expect(onPageChange).toHaveBeenNthCalledWith(2, 5);
      expect(onPageChange).toHaveBeenNthCalledWith(3, 2);
    });
  });
});
