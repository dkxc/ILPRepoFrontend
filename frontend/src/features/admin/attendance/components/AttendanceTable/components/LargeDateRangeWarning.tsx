import { EmptyState } from "@ui/emptystate/EmptyState";
import { Button } from "@ui/button/Button";

interface LargeDateRangeWarningProps {
  /** The maximum number of days allowed in the range, to display in the message. */
  maxDays: number;
  /** Callback function to trigger when the user chooses to render the table anyway. */
  onRenderAnyway: () => void;
  /** Callback function to trigger the data export. */
  onExport: () => void;
}

function LargeDateRangeWarning({
  maxDays,
  onRenderAnyway,
  onExport,
}: LargeDateRangeWarningProps) {
  return (
    <div className="py-8">
      <EmptyState size="lg">
        <EmptyState.Header>
          <EmptyState.Illustration type="documents" />
        </EmptyState.Header>
        <EmptyState.Content>
          <EmptyState.Title>Large Date Range Selected</EmptyState.Title>
          <EmptyState.Description>
            Rendering over {maxDays} days at once may cause performance issues.
            Exporting the data is recommended.
          </EmptyState.Description>
        </EmptyState.Content>
        <EmptyState.Footer>
          <Button color="secondary" onClick={onRenderAnyway}>
            Render Anyway
          </Button>
          <Button color="primary" onClick={onExport}>
            Export Data
          </Button>
        </EmptyState.Footer>
      </EmptyState>
    </div>
  );
}

export default LargeDateRangeWarning;
