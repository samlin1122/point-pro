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
import { Variant } from "@mui/material/styles/createTypography";

interface IMobileDialogLayout {
  title?: string;
  titleSize?: Variant;
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
    titleSize = "h4",
    children = null,
    isOpen,
    onCloseDialog,
    actionButton,
    dialogProps,
    dialogContentProps,
    dialogActionProps
  } = props;

  return (
    <Dialog
      {...dialogProps}
      fullScreen
      onClose={onCloseDialog}
      open={isOpen}
      sx={{ bgcolor: "#E1E1E1", width: "100vw", maxWidth: "768px", margin: "0 auto" }}
    >
      <DialogTitle>
        <Box sx={{ display: "flex" }}>
          <Typography variant={titleSize} sx={{ fontWeight: "900", flexGrow: 1 }}>
            {title}
          </Typography>
          <CancelIcon sx={{ fontSize: "2.5rem" }} onClick={onCloseDialog} />
        </Box>
      </DialogTitle>

      <DialogContent {...dialogContentProps}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            flexGrow: 1
          }}
        >
          {children}
        </Box>
      </DialogContent>

      {actionButton && (
        <DialogActions
          {...dialogActionProps}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            padding: "1rem",
            bgcolor: "common.white",
            "& .MuiButtonBase-root": {
              width: "100%",
              margin: 0,
              bgcolor: "primary.main",
              color: "common.black",
              fontWeight: 700,
              fontSize: "1.25rem"
            }
          }}
        >
          {actionButton}
        </DialogActions>
      )}
    </Dialog>
  );
};
