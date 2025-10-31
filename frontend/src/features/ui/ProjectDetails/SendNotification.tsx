import React, { useState } from "react";
import Button from "../../ui/Button";
import { X } from "lucide-react";
import type { TeamMember } from "./TeamList";
import { sendNotification } from "./api";

interface SendNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRecipients: TeamMember[];
  notifySubject: string;
  setNotifySubject: React.Dispatch<React.SetStateAction<string>>;
  notifyMessage: string;
  setNotifyMessage: React.Dispatch<React.SetStateAction<string>>;
  sendToOutlook: boolean;
  setSendToOutlook: React.Dispatch<React.SetStateAction<boolean>>;
  handleRemoveRecipient: (member: TeamMember) => void;
  handleResetModal: () => void;
}

const SendNotificationModal: React.FC<SendNotificationModalProps> = ({
  isOpen,
  onClose,
  selectedRecipients,
  notifySubject,
  setNotifySubject,
  notifyMessage,
  setNotifyMessage,
  sendToOutlook,
  setSendToOutlook,
  handleRemoveRecipient,
  handleResetModal,
}) => {
  const [sending, setSending] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    setSending(true);
    try {
      const success = await sendNotification({
        recipients: selectedRecipients,
        subject: notifySubject,
        message: notifyMessage,
        sendToOutlook: sendToOutlook,
      });

      if (success) {
        console.log("Notification sent successfully");
        handleResetModal();
      } else {
        console.error("Failed to send notification");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    } finally {
      setSending(false);
    }
  };

  const isDisabled =
    selectedRecipients.length === 0 ||
    !notifySubject.trim() ||
    !notifyMessage.trim();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#565E6C]">Send Message</h3>
          <Button
            variant="link"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Recipients Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-[#565E6C]">
            Recipients ({selectedRecipients.length})
          </label>
          <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-md min-h-[60px] bg-gray-50">
            {selectedRecipients.length > 0 ? (
              selectedRecipients.map((member) => (
                <span
                  key={member.mail}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  <span className="font-medium">{member.name}</span>
                  <span className="text-xs text-blue-600">({member.mail})</span>
                  <button
                    onClick={() => handleRemoveRecipient(member)}
                    className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                    title="Remove recipient"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-400 italic">
                No recipients selected
              </span>
            )}
          </div>
        </div>

        {/* Subject */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-[#565E6C]">
            Subject
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
            value={notifySubject}
            onChange={(e) => setNotifySubject(e.target.value)}
            placeholder="Enter subject"
          />
        </div>

        {/* Message */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-[#565E6C]">
            Message
          </label>
          <textarea
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
            value={notifyMessage}
            onChange={(e) => setNotifyMessage(e.target.value)}
            placeholder="Enter message"
            rows={4}
          />
        </div>

        {/* Outlook Checkbox */}
        <div className="mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={sendToOutlook}
              onChange={(e) => setSendToOutlook(e.target.checked)}
              className="w-4 h-4 text-brand border-gray-300 rounded focus:ring-brand focus:ring-2"
            />
            <span className="text-sm text-[#565E6C]">
              Send via Outlook (in addition to IAPP mail)
            </span>
          </label>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            variant="secondary"
            className="px-4 py-2"
            onClick={handleResetModal}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            className="px-4 py-2"
            onClick={handleSend}
            disabled={isDisabled || sending}
          >
            {sending ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SendNotificationModal;
