import { ReactNode, FC } from "react";

import { Button, IconButton, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Drawer from "@mui/material/Drawer";

export type DrawerBaseButtonType = {
  label: string;
  onClick: (data: string) => void;
};

export type DrawerBaseProps = {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  buttonList: DrawerBaseButtonType[];
};

export const DrawerBase: FC<DrawerBaseProps> = ({ title, open, onClose, children, buttonList }) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        flexShrink: 0,
        "& .MuiDrawer-paper": { width: "500px", maxHeight: "100vh", pt: "88px", boxSizing: "border-box" }
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ height: "72px" }}>
        <Typography variant="h3" sx={{ px: 3 }}>
          {title}
        </Typography>
        <IconButton
          size="large"
          onClick={onClose}
          sx={{ bgcolor: (theme) => theme.palette.common.black, borderRadius: 0, width: "72px", height: "72px" }}
        >
          <CloseIcon sx={{ color: (theme) => theme.palette.common.white }} />
        </IconButton>
      </Stack>
      <Stack sx={{ height: "inherit" }} overflow="auto">
        {children}
      </Stack>
      <Stack
        direction="row"
        sx={{ py: 2, px: 3, borderTop: (theme) => `1px solid ${theme.palette.divider}` }}
        spacing={2}
      >
        {buttonList?.map((btn, key) => (
          <Button
            key={`drawer-button-${btn.label}`}
            fullWidth
            variant="contained"
            onClick={() => btn.onClick(btn.label)}
            sx={{ height: 80 }}
            color={key % 2 ? "secondary" : "primary"}
          >
            {btn.label}
          </Button>
        ))}
      </Stack>
    </Drawer>
  );
};

// export default DrawerBase;
