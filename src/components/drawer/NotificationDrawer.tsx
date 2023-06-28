import React, { useState } from "react";
import { DrawerBase } from "./drawer-base";
import { Box, Card, CardActionArea, Chip, DrawerProps, List, ListItem, Typography } from "@mui/material";
import { useSessionStorage } from "~/hooks/useSessionStorage";
import { useAppSelector } from "~/app/hook";
import { SocketTopic } from "~/hooks/useSocket";
import theme from "~/theme";

interface NotificationDrawerType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const NotificationDrawer = (props: NotificationDrawerType) => {
  const { open, setOpen } = props;

  const notifications = useAppSelector(({ socket }) => socket.notifications);

  const handleClickNotification = (notiType: SocketTopic) => {
    // [TODO]
  };

  return (
    <DrawerBase title="即時通知" open={open} onClose={() => setOpen(false)} width="300px">
      {notifications.length > 0 ? (
        <Box>
          {notifications
            .filter((notification) => !notification.isRead) // TODO: remove filter, filter when setsessionStorage
            .map((notification, idx) => (
              <Card
                key={idx}
                sx={{
                  boxShadow: "rgba(0, 0, 0, 0.5) 0px 1px 4px",
                  margin: ".5rem",
                  height: "3rem",
                  padding: ".5rem"
                }}
              >
                <CardActionArea disableRipple onClick={() => handleClickNotification(notification.notiType)}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    {notification.notiType === SocketTopic.MENU && <Typography variant="h6">菜單更新</Typography>}
                    {notification.notiType === SocketTopic.ORDER && <Typography variant="h6">訂單更新</Typography>}
                    {notification.notiType === SocketTopic.RESERVATION && (
                      <Typography variant="h6">訂位更新</Typography>
                    )}
                  </Box>
                </CardActionArea>
              </Card>
            ))}
        </Box>
      ) : (
        <Typography sx={{ margin: "auto" }}>無通知</Typography>
      )}
    </DrawerBase>
  );
};

export default NotificationDrawer;
