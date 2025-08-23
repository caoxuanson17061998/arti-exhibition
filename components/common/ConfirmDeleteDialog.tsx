import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  itemName?: string;
  isDeleting?: boolean;
}

export default function ConfirmDeleteDialog({
  open,
  onCancel,
  onConfirm,
  itemName,
  isDeleting = false,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Bạn có chắc chắn muốn xóa mục này?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Hành động này không thể hoàn tác.
          {itemName && (
            <>
              <br />
              Mục: <strong>{itemName}</strong>
            </>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary" disabled={isDeleting}>
          Hủy
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={isDeleting}
        >
          {isDeleting ? "Đang xóa..." : "Xóa"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
