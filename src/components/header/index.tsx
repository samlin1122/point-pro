import * as React from "react";
// Components
import Badge from "@mui/material/Badge";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
// Libs
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* 左側標題 */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Point Pro
        </Typography>
        {/* 右上角圖示 */}
        <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <IconButton size="large" edge="end" aria-label="account of current user" aria-haspopup="true" color="inherit">
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
