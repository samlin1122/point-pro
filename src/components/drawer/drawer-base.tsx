import { ReactNode, FC } from "react";

import { Button, IconButton, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Drawer, { DrawerProps } from "@mui/material/Drawer";
import { headerHeight } from "../header";

export type DrawerBaseButtonType = {
  label: string;
  onClick: (data: string) => void;
  disabled?: boolean;
};

export interface DrawerBaseProps extends DrawerProps {
  title?: string;
  children: ReactNode;
  onClose: () => void;
  buttonList?: DrawerBaseButtonType[];
  width?: string;
  hideCloseButton?: boolean;
}

export const DrawerBase: FC<DrawerBaseProps> = ({
  title = "",
  open,
  onClose,
  children,
  buttonList = [],
  width = "500px",
  hideCloseButton = false,
  sx,
  ...props
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        flexShrink: 0,
        userSelect: "none",
        "& .MuiDrawer-paper": { width, pt: headerHeight, boxSizing: "border-box" },
        "& .MuiIconButton-sizeLarge": { width: "46px", height: "46px" },
        ...sx
      }}
      {...props}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        {title && (
          <Typography variant="h3" sx={{ px: 2 }}>
            {title}
          </Typography>
        )}
        {!hideCloseButton && (
          <IconButton
            size="large"
            onClick={onClose}
            sx={{
              bgcolor: (theme) => theme.palette.common.black,
              borderRadius: 0,
              width: "36px",
              height: "36px",
              "&:hover": { bgcolor: (theme) => theme.palette.common.black_60 }
            }}
          >
            <CloseIcon sx={{ color: (theme) => theme.palette.common.white }} />
          </IconButton>
        )}
      </Stack>
      <Stack sx={{ height: "inherit" }} overflow="auto">
        {children}
      </Stack>
      {buttonList.length > 0 && (
        <Stack
          direction="row"
          sx={{ py: 2, px: 3, borderTop: (theme) => `1px solid ${theme.palette.divider}` }}
          spacing={2}
        >
          {buttonList.map((btn, key) => (
            <Button
              key={`drawer-button-${btn.label}`}
              fullWidth
              variant="contained"
              onClick={() => btn.onClick(btn.label)}
              disabled={btn.disabled}
              sx={{ height: 80 }}
              color={key % 2 ? "secondary" : "primary"}
            >
              {btn.label}
            </Button>
          ))}
        </Stack>
      )}
    </Drawer>
  );
};

// export default DrawerBase;
