import { memo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
// Components
import { Box, Button, Badge, AppBar, Toolbar, IconButton, Typography, Drawer } from "@mui/material";
import { AccountCircle, DoubleArrow, NotificationsNone } from "@mui/icons-material";
import SideBar from "~/components/side-bar";
// Libs
import HeaderLogo from "~/assets/images/header-logo.svg";
import dayjs from "dayjs";

const drawerWidth = "335px";

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  let countRef = useRef(0);
  console.log("header", countRef);
  if (countRef.current === null) {
    countRef.current = 0;
  }
  countRef.current++;

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="static"
        sx={{
          bgcolor: (theme) => theme.palette.background.paper,
          zIndex: (theme) => theme.zIndex.drawer + 100,
          height: "88px",
          boxShadow: "none",
          borderBottom: 0.5,
          borderColor: "divider"
        }}
      >
        <Toolbar sx={{ paddingLeft: "0 !important" }}>
          {/* left */}
          <Button
            onClick={() => setOpen((val) => !val)}
            sx={{
              bgcolor: (theme) => theme.palette.primary.main,
              width: open ? drawerWidth : "136px",
              p: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              borderRadius: 0,
              transition: "225ms cubic-bezier(0, 0, 0.2, 1) ",
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              "&:hover": {
                bgcolor: (theme) => theme.palette.primary.dark
              }
            }}
          >
            <Box component="img" src={HeaderLogo} sx={{ width: "40px", height: "40px" }} />
            <DoubleArrow
              color="secondary"
              sx={{
                ml: 1,
                width: "24px",
                height: "24px",
                transition: "0.5s cubic-bezier(0, 0, 0.2, 1) ",
                transform: `rotateY(${open ? 180 : 0}deg)`
              }}
            />
          </Button>
          {/* middle */}
          <Typography variant="h2" component="div" sx={{ flexGrow: 1, pl: 5 }}>
            {location.pathname}
          </Typography>
          <Typography component="p" sx={{ pr: 5 }}>
            {dayjs().format("M月D日 Ahh:mm")}
          </Typography>
          {/* right */}
          <Box
            sx={{
              px: 3,
              display: "flex",
              alignItems: "center",
              gap: 3,
              borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
              height: "100%"
            }}
          >
            <IconButton color="inherit">
              <Badge badgeContent={17} color="error">
                <NotificationsNone sx={{ width: "40px", height: "40px" }} />
              </Badge>
            </IconButton>
            <IconButton color="inherit" edge="end">
              <AccountCircle sx={{ width: "40px", height: "40px" }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        open={open}
        onClose={() => {
          setOpen(false);
          console.log("close");
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" }
        }}
      >
        <SideBar path={location.pathname} />
      </Drawer>
    </Box>
  );
};

export default memo(Header);
