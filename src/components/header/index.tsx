import { memo, useState, useEffect, FC } from "react";
// Components
import { Box, Button, Badge, AppBar, Toolbar, IconButton, Typography, Drawer } from "@mui/material";
import { DoubleArrow, NotificationsNone, PowerSettingsNew } from "@mui/icons-material";
import SideBar from "~/components/side-bar";
import HeaderLogo from "~/assets/images/header-logo.svg";
// Libs
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { getCategories } from "~/app/slices/category";
import { getSpecialties } from "~/app/slices/specialty";
import { Categories, Specialties } from "~/app/selector";
import { isEmpty } from "lodash";
import { RouterProps } from "~/types";
import appDayjs, { dateForm } from "~/utils/dayjs.util";
import { useSocket } from "~/hooks/useSocket";

const drawerWidth = "335px";

const Header: FC<RouterProps> = ({ location, navigate }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const categories = useAppSelector(Categories);
  const specialties = useAppSelector(Specialties);

  useSocket({ ns: "admin" });

  useEffect(() => {
    if (isEmpty(categories)) {
      dispatch(getCategories());
    }
    if (isEmpty(specialties)) {
      dispatch(getSpecialties());
    }
  }, []);

  const routerName = () => {
    switch (true) {
      case location.pathname.includes("/admin/orders"):
        return "訂單系統";
      case location.pathname.includes("/admin/menu"):
        return "點餐系統";
      case location.pathname.includes("/admin/seat"):
        return "座位系統";
      case location.pathname.includes("/admin/meal/list"):
        const id = location.pathname.split("/admin/meal/list/")[1];
        if (id) {
          return id === "create" ? "新增菜單" : "編輯菜單";
        } else {
          return "菜單列表";
        }
      case location.pathname.includes("/admin/meal/settings"):
        return "菜單設置";
      default:
        return location.pathname;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate({ pathname: "/admin" });
  };

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
            {routerName()}
          </Typography>
          <Typography component="p" sx={{ pr: 5 }}>
            {appDayjs().format(dateForm.dateWithTimeAMPM)}
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
            <IconButton onClick={handleLogout} color="inherit" edge="end">
              <PowerSettingsNew sx={{ width: "40px", height: "40px" }} />
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
