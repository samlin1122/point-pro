import { FC, useState } from "react";
import { Stack, Typography, ListItem, styled, Button, Box, Divider } from "@mui/material";
import { Row } from "~/components/layout";
import dayjs from "dayjs";
import { DrawerBaseButtonType } from "~/components/drawer/drawer-base";
import { DrawerBase } from "~/components/drawer";
import TabsBase from "~/components/tabs";
import theme from "~/theme";
import { SeatReservationInfo, ReservationInfo, Seat } from "~/types";

const enum SeatTimeStatus {
  CURRENT = "CURRENT",
  TODAY = "TODAY"
}

type BookingModalProps = {
  open: boolean;
  onClose: () => void;
  seatReservation: Seat;
};

type SeatProps = {
  seatStatus: SeatTimeStatus;
  setSeatStatus: (status: SeatTimeStatus) => void;
};

type ReservationProps = {
  reservations: ReservationInfo[];
};

const selectedReservations: ReservationInfo[] = [
  {
    reservationTime: new Date("2023-05-16 12:00"),
    id: "1",
    seats: ["A1", "A2", "A3"],
    options: {
      name: "葉小姐",
      adult: 4,
      child: 2,
      phoneNumber: "0912345678",
      email: "test@email.com"
    }
  },
  {
    reservationTime: new Date("2023-05-16 16:00"),
    id: "2",
    seats: ["A1", "A2", "A3"],
    options: {
      name: "曹小姐",
      adult: 3,
      child: 2,
      phoneNumber: "0912345678",
      email: "test@email.com"
    }
  },
  {
    reservationTime: new Date("2023-05-16 18:00"),
    id: "3",
    seats: ["A1", "A2", "A3"],
    options: {
      name: "宋小姐",
      adult: 4,
      child: 2,
      phoneNumber: "0912345678",
      email: "test@email.com"
    }
  },
  {
    reservationTime: new Date("2023-05-16 20:00"),
    id: "4",
    seats: ["A1", "A2", "A3"],
    options: {
      name: "田小姐",
      adult: 4,
      child: 2,
      phoneNumber: "0912345678",
      email: "test@email.com"
    }
  }
];

const SelectTab = styled(Button)(({ theme }) => ({
  borderRadius: "1rem",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: ".1rem",
  padding: ".3rem .5rem",
  minWidth: "5rem",
  outline: `2px solid ${theme.palette.common.black_20}`,
  backgroundColor: theme.palette.common.white,
  fontWeight: 700,
  color: theme.palette.common.black,
  "&:hover": {
    backgroundColor: "transparent",
    outline: `2px solid ${theme.palette.common.black}`
  },
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    outline: `2px solid ${theme.palette.common.black}`
  },

  "&.disabled": {
    backgroundColor: theme.palette.common.black_20,
    outline: `2px solid ${theme.palette.common.black_20}`,
    color: theme.palette.common.black_40
  }
}));

export const SeatStatusTabs: FC<SeatProps> = ({ seatStatus, setSeatStatus }) => {
  const handleSelected = (seatStatus: SeatTimeStatus) => {
    setSeatStatus(seatStatus);
  };

  return (
    <TabsBase
      sx={{ position: "sticky", top: "0", zIndex: "10", backgroundColor: theme.palette.background.paper }}
      tabs={[
        {
          id: SeatTimeStatus.CURRENT,
          title: "當前桌況"
        },
        {
          id: SeatTimeStatus.TODAY,
          title: "今日排程"
        }
      ]}
      onChange={(_, value) => handleSelected(value as SeatTimeStatus)}
      value={seatStatus}
    />
  );
};

export const SeatStatusBlock: FC<ReservationProps> = ({ reservations }) => {
  const [selectedReservation, setSelectedReservation] = useState<string>("");

  const handleClick = (reservationId: string) => {
    setSelectedReservation(reservationId);
  };

  const currentReservation = reservations.find((reservation) => reservation.id === selectedReservation);

  return (
    <>
      <Row component={"ul"}>
        {reservations.map((reservation) => (
          <ListItem key={reservation.id} sx={{ justifyContent: "center" }}>
            <SelectTab
              onClick={() => {
                handleClick(reservation.id);
              }}
              className={
                reservation.id === selectedReservation
                  ? "Mui-selected"
                  : reservation.reservationTime.getTime() < new Date().getTime()
                  ? "disabled"
                  : ""
              }
            >
              <Typography variant="body1" fontWeight={700}>
                {dayjs(reservation.reservationTime).format("HH:mm")}
              </Typography>
            </SelectTab>
          </ListItem>
        ))}
      </Row>
      <Box sx={{ px: 3 }}>
        {currentReservation && (
          <>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 2 }}>
              <Typography variant="body1" sx={{ pl: 2 }}>
                訂位編號
              </Typography>
              <Typography variant="h6" sx={{ pr: 2 }}>
                {currentReservation?.id}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 2 }}>
              <Typography variant="body1" sx={{ pl: 2 }}>
                姓名
              </Typography>
              <Typography variant="h6" sx={{ pr: 2 }}>
                {currentReservation?.options["name"]}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 2 }}>
              <Typography variant="body1" sx={{ pl: 2 }}>
                總人數/人數分配
              </Typography>
              <Typography variant="h6" sx={{ pr: 2 }}>
                {currentReservation?.options["adult"] +
                  currentReservation.options["child"] +
                  "人/" +
                  currentReservation?.options["adult"] +
                  "大" +
                  currentReservation?.options["child"] +
                  "小"}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 2 }}>
              <Typography variant="body1" sx={{ pl: 2 }}>
                電話
              </Typography>
              <Typography variant="h6" sx={{ pr: 2 }}>
                {currentReservation?.options["phoneNumber"]}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 2 }}>
              <Typography variant="body1" sx={{ pl: 2 }}>
                信箱
              </Typography>
              <Typography variant="h6" sx={{ pr: 2 }}>
                {currentReservation?.options["email"]}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 2 }}>
              <Typography variant="body1" sx={{ pl: 2 }}>
                使用座位
              </Typography>
              <Typography variant="h6" sx={{ pr: 2 }}>
                {currentReservation.seats.join(", ")}
              </Typography>
            </Stack>
          </>
        )}
      </Box>
    </>
  );
};

export const BookingModal: React.FC<BookingModalProps> = ({ open, onClose, seatReservation }) => {
  const [seatStatus, setSeatStatus] = useState(SeatTimeStatus.CURRENT);

  const buttons: DrawerBaseButtonType[] = [
    {
      label: "編輯",
      onClick: () => {}
    },
    {
      label: "客到開始使用",
      onClick: () => {}
    }
  ];
  return (
    <DrawerBase title="座位概況" open={open} onClose={onClose} buttonList={buttons}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 2 }}>
        <Typography variant="h6" sx={{ pl: 3 }}>
          座位
        </Typography>
        <Typography variant="h4" sx={{ pr: 3 }}>
          {seatReservation.seatNo}
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 2 }}>
        <Typography variant="h6" sx={{ pl: 3 }}>
          座況
        </Typography>
        <Typography variant="h4" sx={{ pr: 3 }}>
          目前可使用
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 2 }}>
        <Typography variant="h6" sx={{ pl: 3 }}>
          最近的預約
        </Typography>
        <Typography variant="h4" sx={{ pr: 3 }}>
          {dayjs().format("YY/MM/DD HH:mm")}
        </Typography>
      </Stack>
      <Divider sx={{ py: 1 }} />

      <SeatStatusTabs seatStatus={seatStatus} setSeatStatus={setSeatStatus} />
      <SeatStatusBlock reservations={selectedReservations} />
    </DrawerBase>
  );
};
