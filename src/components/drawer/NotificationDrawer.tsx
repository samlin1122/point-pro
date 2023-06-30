import React from "react";
import { DrawerBase } from "./drawer-base";
import { Box, Button, Card, CardActionArea, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import {
  NotificationsMenuMessage,
  NotificationsOrderMessage,
  SocketTopic,
  clearNotifications,
  removeNotification
} from "~/app/slices/socket";
import { OrderType } from "~/types/common";
import appDayjs from "~/utils/dayjs.util";

type NotificationDrawerType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const menuTitle = (key: NotificationsMenuMessage) => {
  switch (key) {
    case "CREATE_MEAL":
      return "新增";
    case "UPDATE_MEAL":
      return "更新";
    case "DELETE_MEAL":
      return "刪除";
    default:
      return "";
  }
};
const orderTitle = (key: NotificationsOrderMessage) => {
  switch (key) {
    case "CREATE_ORDER":
      return "新單";
    case "UPDATE_ORDER":
      return "出餐";
    case "CANCEL_ORDER":
      return "取消";
    default:
      return "";
  }
};

const NotificationDrawer = (props: NotificationDrawerType) => {
  const { open, setOpen } = props;

  const dispatch = useAppDispatch();

  const notifications = useAppSelector(({ socket }) => socket.notifications);

  const handleClickNotification = (notification: any, idx: number) => {
    dispatch(removeNotification(idx));
  };

  const handleReadAllNotifications = () => {
    dispatch(clearNotifications());
  };

  return (
    <DrawerBase title="即時通知" open={open} onClose={() => setOpen(false)} width="300px">
      {notifications.length > 0 ? (
        <>
          <Box sx={{ flexGrow: 1, overflowY: "scroll" }}>
            {notifications.map((notification, idx) => (
              <Card
                key={`${notification.message}-${idx}`}
                sx={{
                  boxShadow: "rgba(0, 0, 0, 0.5) 0px 1px 4px",
                  margin: ".5rem",
                  padding: ".5rem"
                }}
              >
                <CardActionArea disableRipple onClick={() => handleClickNotification(notification, idx)}>
                  {/* MENU */}
                  {notification.notiType === SocketTopic.MENU && (
                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: "1rem" }}>
                        <Typography fontWeight={700}>菜單 ({menuTitle(notification.message)})</Typography>
                        <Typography variant="small">
                          {appDayjs(notification.result?.updatedAt).format("HH:mm")}
                        </Typography>
                      </Box>
                      <Box>{notification.result.title}</Box>
                    </Box>
                  )}

                  {/* ORDER */}
                  {notification.notiType === SocketTopic.ORDER &&
                    (notification.result.type === OrderType.DineIn ? (
                      // DINE IN
                      <Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: "1rem" }}>
                          <Typography fontWeight={700}>內用訂單 ({orderTitle(notification.message)})</Typography>
                          <Typography variant="small">
                            {appDayjs(notification.result.updatedAt).format("HH:mm")}
                          </Typography>
                        </Box>
                        <Typography variant="small">
                          桌號：
                          {notification.result?.reservationsLogs?.bookedSeats
                            ?.map(({ seat }) => `${seat.prefix}-${seat.no}`)
                            .join(",")}
                        </Typography>
                      </Box>
                    ) : (
                      // TAKE OUT
                      <Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: "1rem" }}>
                          <Typography fontWeight={700}>外帶訂單 ({orderTitle(notification.message)})</Typography>
                          <Typography variant="small">
                            {appDayjs(notification.result.updatedAt).format("HH:mm")}
                          </Typography>
                        </Box>
                        <Typography variant="small">訂單編號：{notification.result.id.slice(-5)}</Typography>
                      </Box>
                    ))}

                  {/* RESERVATION */}
                  {notification.notiType === SocketTopic.RESERVATION && (
                    <>
                      <Typography fontWeight={700}>訂位更新</Typography>
                      <Box>{JSON.stringify(notification.result)}</Box>
                    </>
                  )}
                </CardActionArea>
              </Card>
            ))}
          </Box>
          <Button sx={{ bgcolor: "primary.main", color: "common.black" }} onClick={handleReadAllNotifications}>
            已讀所有通知
          </Button>
        </>
      ) : (
        <Typography sx={{ margin: "auto" }}>無通知</Typography>
      )}
    </DrawerBase>
  );
};

export default NotificationDrawer;
