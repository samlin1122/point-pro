// Libs
import React from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogActionsProps,
  DialogContent,
  DialogContentProps,
  DialogProps,
  DialogTitle,
  Typography
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

interface IMobileDialogLayout {
  title?: string;
  children?: React.ReactNode;
  isOpen: boolean;
  onCloseDialog: () => void;
  actionButton?: React.ReactNode;
  dialogProps?: DialogProps;
  dialogContentProps?: DialogContentProps;
  dialogActionProps?: DialogActionsProps;
}

export const MobileDialogLayout = (props: IMobileDialogLayout) => {
  const {
    title = "",
    children = null,
    isOpen,
    onCloseDialog,
    actionButton,
    dialogProps,
    dialogContentProps,
    dialogActionProps
  } = props;

  return (
    <Dialog {...dialogProps} fullScreen onClose={onCloseDialog} open={isOpen}>
      <DialogTitle>
        <Box sx={{ display: "flex" }}>
          <Typography sx={{ fontWeight: "bold", fontSize: "2rem", flexGrow: "1" }}>{title}</Typography>
          <CancelIcon sx={{ fontSize: "2rem" }} onClick={onCloseDialog} />
        </Box>
      </DialogTitle>

      <DialogContent {...dialogContentProps}>
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%", flexGrow: "1" }}>{children}</Box>
      </DialogContent>

      {actionButton && (
        <DialogActions
          {...dialogActionProps}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            "& .MuiButtonBase-root": { width: "100%", margin: 0, bgcolor: "#F7E252" }
          }}
        >
          {actionButton}
        </DialogActions>
      )}
    </Dialog>
  );
};
