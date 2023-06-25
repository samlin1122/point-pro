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
  DialogTitleProps,
  Typography,
  styled
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { Variant } from "@mui/material/styles/createTypography";
import { ButtonBase } from "../buttons";

// [TODO] move to mobile-dialog file
interface IMobileDialogLayout {
  title?: React.ReactNode;
  titleSize?: Variant;
  isShowCloseIcon?: boolean;
  children?: React.ReactNode;
  isOpen: boolean;
  onCloseDialog: () => void;
  actionButton?: React.ReactNode;
  dialogProps?: DialogProps;
  dialogTitleProps?: DialogTitleProps;
  dialogContentProps?: DialogContentProps;
  dialogActionProps?: DialogActionsProps;
}

export const MobileDialogLayout = (props: IMobileDialogLayout) => {
  const {
    title = "",
    titleSize = "h4",
    isShowCloseIcon = true,
    children = null,
    isOpen,
    onCloseDialog,
    actionButton,
    dialogProps,
    dialogTitleProps,
    dialogContentProps,
    dialogActionProps
  } = props;

  return (
    <Dialog
      {...dialogProps}
      fullScreen
      onClose={onCloseDialog}
      open={isOpen}
      sx={{ bgcolor: "#E1E1E1", width: "100vw", maxWidth: "768px", margin: "0 auto", userSelect: "none" }}
    >
      <DialogTitle {...dialogTitleProps}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Typography variant={titleSize} fontWeight={900} sx={{ flexGrow: 1 }}>
            {title}
          </Typography>

          {isShowCloseIcon && <CancelIcon sx={{ fontSize: "2.5rem", cursor: "pointer" }} onClick={onCloseDialog} />}
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
            ".MuiButtonBase-root": {
              width: "100%",
              margin: 0,
              bgcolor: "primary.main",
              color: "common.black",
              fontWeight: 700,
              fontSize: "1.25rem"
            },
            ".MuiButtonBase-root:hover": {
              backgroundColor: "primary.main"
            },
            ".Mui-disabled": {
              backgroundColor: "common.black_20",
              color: "common.black_60"
            }
          }}
        >
          {actionButton}
        </DialogActions>
      )}
    </Dialog>
  );
};

export const MobileButton = styled(ButtonBase)(({ theme }) => ({
  width: "100%",
  margin: 0,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.black,
  fontWeight: 700,
  fontSize: "1.25rem",
  "&:hover": {
    backgroundColor: theme.palette.primary.main
  },
  "&.Mui-disabled": {
    backgroundColor: theme.palette.common.black_20,
    color: theme.palette.common.black_60
  }
}));

export { default as DialogType } from "./mobile-dialog";
