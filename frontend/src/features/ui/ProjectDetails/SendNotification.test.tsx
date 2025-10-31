import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SendNotificationModal from "./SendNotification";
import * as api from "./api";

// Mock the API
vi.mock("./api");
const mockedApi = vi.mocked(api);

// Mock the Button component
vi.mock("../../ui/Button", () => ({
  default: ({ children, onClick, disabled, variant, ...props }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
      data-testid={props["data-testid"] || "button"}
      {...props}
    >
      {children}
    </button>
  ),
}));

describe("SendNotificationModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockTeamMembers = [
    { id: 1, name: "John Doe", mail: "john@example.com", role: "Developer" },
    { id: 2, name: "Jane Smith", mail: "jane@example.com", role: "Designer" },
  ];

  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    selectedRecipients: mockTeamMembers,
    notifySubject: "Test Subject",
    setNotifySubject: vi.fn(),
    notifyMessage: "Test Message",
    setNotifyMessage: vi.fn(),
    sendToOutlook: false,
    setSendToOutlook: vi.fn(),
    handleRemoveRecipient: vi.fn(),
    handleResetModal: vi.fn(),
  };

  it("should not render when isOpen is false", () => {
    render(<SendNotificationModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText("Send Message")).not.toBeInTheDocument();
  });

  it("should render modal when isOpen is true", () => {
    render(<SendNotificationModal {...defaultProps} />);

    expect(screen.getByText("Send Message")).toBeInTheDocument();
    expect(screen.getByText("Subject")).toBeInTheDocument();
    expect(screen.getByText("Message")).toBeInTheDocument();
  });

  it("should display selected recipients", () => {
    render(<SendNotificationModal {...defaultProps} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  it("should show current subject and message values", () => {
    render(<SendNotificationModal {...defaultProps} />);

    expect(screen.getByDisplayValue("Test Subject")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Message")).toBeInTheDocument();
  });

  it("should handle send button click with API success", async () => {
    mockedApi.sendNotification.mockResolvedValue(true);

    render(<SendNotificationModal {...defaultProps} />);

    const sendButton = screen.getByText("Send");
    await userEvent.click(sendButton);

    await waitFor(() => {
      expect(mockedApi.sendNotification).toHaveBeenCalledWith({
        recipients: mockTeamMembers,
        subject: "Test Subject",
        message: "Test Message",
        sendToOutlook: false,
      });
      expect(defaultProps.handleResetModal).toHaveBeenCalled();
    });
  });

  it("should handle send button click with API failure", async () => {
    mockedApi.sendNotification.mockResolvedValue(false);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<SendNotificationModal {...defaultProps} />);

    const sendButton = screen.getByText("Send");
    await userEvent.click(sendButton);

    await waitFor(() => {
      expect(mockedApi.sendNotification).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith("Failed to send notification");
      expect(defaultProps.handleResetModal).not.toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it("should show loading state when sending", async () => {
    let resolvePromise: (value: boolean) => void;
    const promise = new Promise<boolean>((resolve) => {
      resolvePromise = resolve;
    });
    mockedApi.sendNotification.mockReturnValue(promise);

    render(<SendNotificationModal {...defaultProps} />);

    const sendButton = screen.getByText("Send");
    await userEvent.click(sendButton);

    // Should show loading text
    expect(screen.getByText("Sending...")).toBeInTheDocument();
    expect(sendButton).toBeDisabled();

    // Resolve the promise
    resolvePromise!(true);

    await waitFor(() => {
      expect(screen.queryByText("Sending...")).not.toBeInTheDocument();
    });
  });

  it("should handle cancel button click", async () => {
    render(<SendNotificationModal {...defaultProps} />);

    const cancelButton = screen.getByText("Cancel");
    await userEvent.click(cancelButton);

    expect(defaultProps.handleResetModal).toHaveBeenCalled();
  });

  it("should handle close button click", async () => {
    render(<SendNotificationModal {...defaultProps} />);

    const closeButton = screen.getByText("×");
    await userEvent.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("should handle remove recipient functionality", async () => {
    render(<SendNotificationModal {...defaultProps} />);

    // Assuming there are remove buttons for each recipient
    const removeButtons = screen.getAllByText("×");
    // First × is the close button, subsequent ones are remove recipient buttons
    if (removeButtons.length > 1) {
      await userEvent.click(removeButtons[1]);
      expect(defaultProps.handleRemoveRecipient).toHaveBeenCalledWith(
        mockTeamMembers[0],
      );
    }
  });

  it("should handle outlook checkbox toggle", async () => {
    render(<SendNotificationModal {...defaultProps} />);

    const outlookCheckbox = screen.getByLabelText(/Send via Outlook/i);
    await userEvent.click(outlookCheckbox);

    expect(defaultProps.setSendToOutlook).toHaveBeenCalledWith(true);
  });

  it("should disable send button when no recipients selected", () => {
    render(<SendNotificationModal {...defaultProps} selectedRecipients={[]} />);

    const sendButton = screen.getByText("Send");
    expect(sendButton).toBeDisabled();
  });

  it("should disable send button when subject is empty", () => {
    render(<SendNotificationModal {...defaultProps} notifySubject="" />);

    const sendButton = screen.getByText("Send");
    expect(sendButton).toBeDisabled();
  });

  it("should disable send button when message is empty", () => {
    render(<SendNotificationModal {...defaultProps} notifyMessage="" />);

    const sendButton = screen.getByText("Send");
    expect(sendButton).toBeDisabled();
  });
});
