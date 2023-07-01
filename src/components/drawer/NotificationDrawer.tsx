import React from "react";
import { DrawerBase } from "./drawer-base";
import { Box, Button, Card, CardActionArea, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import {
  NotificationReservationMssage,
  NotificationsMenuMessage,
  NotificationsOrderMessage,
  SocketTopic,
  clearNotifications,
  removeNotification
} from "~/app/slices/socket";
import { OrderType } from "~/types/common";
import appDayjs from "~/utils/dayjs.util";
import { genderObj } from "~/features/booking/index.styles";
import { BookingType } from "~/features/orders/type";
import { useNavigate } from "react-router-dom";

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
    case "PAY_ORDER":
      return "結帳";
    default:
      return "";
  }
};
const reservationTitle = (key: NotificationReservationMssage, type: BookingType) => {
  switch (key) {
    case "CREATE_RESERVATION":
      return `新的預約 (${type === "OnlineBooking" ? "線上訂位" : "電話訂位"})`;
    case "UPDATE_RESERVATION":
      return "更新預約資訊";
    default:
      return "";
  }
};

const NotificationDrawer = (props: NotificationDrawerType) => {
  const { open, setOpen } = props;

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const notifications = useAppSelector(({ socket }) => socket.notifications);

  const handleClickNotification = (notiType: SocketTopic, idx: number) => {
    switch (notiType) {
      case SocketTopic.MENU:
        navigate("/admin/meal/list");
        break;
      case SocketTopic.ORDER:
        navigate("/admin/orders");
        break;
      case SocketTopic.RESERVATION:
        navigate("/admin/seat");
        break;
      default:
        break;
    }
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
            {notifications.map(({ message, result, notiType }, idx) => (
              <Card
                key={`${message}-${idx}`}
                sx={{
                  boxShadow: "rgba(0, 0, 0, 0.5) 0px 1px 4px",
                  margin: ".5rem",
                  padding: ".5rem"
                }}
              >
                <CardActionArea disableRipple onClick={() => handleClickNotification(notiType, idx)}>
                  {/* MENU */}
                  {notiType === SocketTopic.MENU && (
                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: "1rem" }}>
                        <Typography fontWeight={700}>菜單 ({menuTitle(message)})</Typography>
                        <Typography variant="small">{appDayjs(result?.updatedAt).format("HH:mm")}</Typography>
                      </Box>
                      <Box>{result.title}</Box>
                    </Box>
                  )}

                  {/* ORDER */}
                  {notiType === SocketTopic.ORDER &&
                    (result.type === OrderType.DineIn ? (
                      // DINE IN
                      <Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: "1rem" }}>
                          <Typography fontWeight={700}>內用訂單 ({orderTitle(message)})</Typography>
                          <Typography variant="small">{appDayjs(result.updatedAt).format("HH:mm")}</Typography>
                        </Box>
                        <Typography variant="small">
                          桌號：
                          {message === NotificationsOrderMessage.PAY_ORDER
                            ? result.seats?.join(", ")
                            : result?.reservationsLogs?.bookedSeats
                                ?.map(({ seat }) => `${seat.prefix}-${seat.no}`)
                                .join(",")}
                        </Typography>
                      </Box>
                    ) : (
                      // TAKE OUT
                      <Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: "1rem" }}>
                          <Typography fontWeight={700}>外帶訂單 ({orderTitle(message)})</Typography>
                          <Typography variant="small">{appDayjs(result.updatedAt).format("HH:mm")}</Typography>
                        </Box>
                        <Typography variant="small">訂單編號：{result.id.slice(-5)}</Typography>
                      </Box>
                    ))}

                  {/* RESERVATION */}
                  {notiType === SocketTopic.RESERVATION && (
                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: "1rem" }}>
                        <Typography fontWeight={700}>{reservationTitle(message, result.type)}</Typography>
                        <Typography variant="small">{appDayjs(result.reservedAt).format("HH:mm")}</Typography>
                      </Box>
                      <Typography variant="small">
                        姓名：{result.options.name}{" "}
                        {result.options.gender !== 2 ? genderObj[result.options.gender] : ""}
                      </Typography>
                      <Typography variant="small">
                        日期：{appDayjs(result.periodStartedAt).format("MM/DD HH:mm")}
                      </Typography>
                      <Typography variant="small">人數：{result.options.adults}</Typography>
                    </Box>
                  )}
                </CardActionArea>
              </Card>
            ))}
          </Box>
          <Button
            sx={{ bgcolor: "primary.main", color: "common.black", height: "4rem" }}
            onClick={handleReadAllNotifications}
          >
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
