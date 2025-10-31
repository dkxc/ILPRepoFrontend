import { Table, TableCard } from "@ui/table/Table";
import Skeleton from "@ui/skeleton/Skeleton";
import { Fragment } from "react";
import { format } from "date-fns";

interface AttendanceTableLoadingProps {
  dateColumns: Date[];
  className?: string;
}

function AttendanceTableLoading({
  dateColumns,
  className,
}: AttendanceTableLoadingProps) {
  return (
    <TableCard.Root size="sm" className={className}>
      <TableCard.Header
        title="Attendance Records"
        badge={<Skeleton className="h-5 w-24 rounded-md" />}
        contentTrailing={<Skeleton className="h-9 w-48 rounded-lg" />}
      />

      <Table aria-label="Loading Attendance Records">
        <Table.Header>
          <Table.Head
            id="traineeName"
            label="Trainee Name"
            allowsSorting
            isRowHeader
          />
          {dateColumns.map((date) => (
            <Fragment key={date.toISOString()}>
              <Table.Head id={`fn_${date.toISOString()}`}>
                <div className="text-xs font-semibold whitespace-nowrap text-quaternary">
                  <div>{format(date, "MMM d")}</div>
                  <div>FN</div>
                </div>
              </Table.Head>
              <Table.Head id={`an_${date.toISOString()}`}>
                <div className="text-xs font-semibold whitespace-nowrap text-quaternary">
                  <div>{format(date, "MMM d")}</div>
                  <div>AN</div>
                </div>
              </Table.Head>
            </Fragment>
          ))}
        </Table.Header>

        <Table.Body>
          {Array.from({ length: 10 }, (_, index) => (
            <Table.Row key={`skeleton-row-${index}`}>
              <Table.Cell>
                <Skeleton className="h-5 w-32 rounded-md" />
              </Table.Cell>

              {dateColumns.map((date) => (
                <Fragment key={date.toISOString()}>
                  <Table.Cell>
                    <Skeleton className="h-[26px] w-[70px] rounded-full" />
                  </Table.Cell>
                  <Table.Cell className="border-r border-slate-200 dark:border-slate-700">
                    <Skeleton className="h-[26px] w-[70px] rounded-full" />
                  </Table.Cell>
                </Fragment>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </TableCard.Root>
  );
}

export default AttendanceTableLoading;
