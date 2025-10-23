//import { FC, ReactNode } from "react";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

interface DeleteConfirmModalProps {
  itemName: string;
  itemType: string;
  onConfirm: () => void;
}

export const openDeleteModal = ({ itemName, itemType, onConfirm }: DeleteConfirmModalProps) => {
  modals.openConfirmModal({
    title: `Delete ${itemType}`,
    centered: true,
    children: (
      <p>
        Are you sure you want to delete <b>{itemName}</b>?
      </p>
    ),
    labels: { confirm: "Delete", cancel: "Cancel" },
    confirmProps: { color: "red" },
    onConfirm: () => {
      onConfirm();
      notifications.show({
        title: "Deleted",
        message: `${itemName} was removed.`,
        color: "red",
      });
    },
  });
};
