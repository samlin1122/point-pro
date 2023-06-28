import { FC, useState } from "react";
import { Stack, Typography, styled, Button, Box, Divider } from "@mui/material";
import appDayjs, { formatTimeOnly } from "~/utils/dayjs.util";
import { DrawerBaseButtonType } from "~/components/drawer/drawer-base";
import { DrawerBase } from "~/components/drawer";
import TabsBase from "~/components/tabs";
import theme from "~/theme";
import { ReservationInfo, SeatDetails } from "~/types";
import UnDraw from "~/assets/images/undraw_login.svg";
import { reservationStatusConfig } from "./index.styles";

const enum SeatTab {
  CURRENT = "CURRENT",
  TODAY = "TODAY"
}

type SeatDetailProps = {
  open: boolean;
  onClose: () => void;
  state: SeatDetails;
};

type SeatProps = {
  seatTab: SeatTab;
  setSeatTab: (status: SeatTab) => void;
};

type ReservationProps = {
  info: ReservationInfo | undefined;
};

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

export const SeatStatusTabs: FC<SeatProps> = ({ seatTab, setSeatTab }) => {
  return (
    <TabsBase
      sx={{ position: "sticky", top: "0", zIndex: "10", backgroundColor: theme.palette.background.paper }}
      tabs={[
        {
          id: SeatTab.CURRENT,
          title: "當前桌況"
        },
        {
          id: SeatTab.TODAY,
          title: "今日排程"
        }
      ]}
      onChange={(_, value) => setSeatTab(value as SeatTab)}
      value={seatTab}
    />
  );
};

export const SeatInfo: FC<ReservationProps> = ({ info }) => {
  return (
    <Box height="inherit" sx={{ px: 3 }}>
      {info ? (
        <>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 2 }}>
            <Typography variant="body1" sx={{ pl: 2 }}>
              訂位編號
            </Typography>
            <Typography variant="h6" sx={{ pr: 2 }}>
              {info?.id}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 2 }}>
            <Typography variant="body1" sx={{ pl: 2 }}>
              姓名
            </Typography>
            <Typography variant="h6" sx={{ pr: 2 }}>
              {info?.options.name ?? "-"}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 2 }}>
            <Typography variant="body1" sx={{ pl: 2 }}>
              總人數
            </Typography>
            <Typography variant="h6" sx={{ pr: 2 }}>
              {info?.options.adult + info.options.child + "人"}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 2 }}>
            <Typography variant="body1" sx={{ pl: 2 }}>
              電話
            </Typography>
            <Typography variant="h6" sx={{ pr: 2 }}>
              {info?.options.phone ?? "-"}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 2 }}>
            <Typography variant="body1" sx={{ pl: 2 }}>
              信箱
            </Typography>
            <Typography variant="h6" sx={{ pr: 2 }}>
              {info?.options.email ?? "-"}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 2 }}>
            <Typography variant="body1" sx={{ pl: 2 }}>
              使用座位
            </Typography>
            <Typography variant="h6" sx={{ pr: 2 }}>
              {info.seats.join(", ")}
            </Typography>
          </Stack>
        </>
      ) : (
        <Stack alignItems="center" justifyContent="center" height="100%">
          <Box component="img" src={UnDraw} width={200} height={120} />
          <Typography variant="h6" sx={{ pr: 2 }}>
            等待客人上門中
          </Typography>
        </Stack>
      )}
    </Box>
  );
};

export const SeatDetail: FC<SeatDetailProps> = ({ open, onClose, state }) => {
  const [seatTab, setSeatTab] = useState(SeatTab.CURRENT);
  const [period, setPeriod] = useState<string>();

  const handlePeriodSelect = (periodId: string) => {
    setPeriod(periodId);
  };
  const info = state.history.find((reservation) => {
    if (seatTab === SeatTab.CURRENT) {
      return appDayjs().isAfter(reservation.periodStartedAt) && appDayjs().isBefore(reservation.periodEndedAt);
    } else {
      if (period) {
        return reservation.periodId === period;
      } else {
        setPeriod(reservation.periodId);
        return true;
      }
    }
  });
  const handleButtonClick = (key: string) => {
    console.log(key);
    switch (key) {
      case "start":
        break;
      case "edit":
        break;
      case "create":
        break;

      default:
        break;
    }
  };

  const getButtonList = () => {
    return seatTab === SeatTab.CURRENT
      ? info
        ? [
            {
              label: "編輯",
              onClick: () => handleButtonClick("edit"),
              isEnabled: state.status !== "OCCUPIED"
            },
            { label: "客到開始使用", onClick: () => handleButtonClick("start"), isEnabled: true }
          ]
        : [{ label: "新增現場使用", onClick: () => handleButtonClick("create"), isEnabled: true }]
      : info
      ? [
          {
            label: "編輯",
            onClick: () => handleButtonClick("edit"),
            isEnabled: appDayjs().isBefore(appDayjs(info.endOfMeal))
          }
        ]
      : [{ label: "新增預約", onClick: () => handleButtonClick("create"), isEnabled: true }];
  };
  return (
    <DrawerBase title="座位概況" open={open} onClose={onClose} buttonList={getButtonList()}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 2 }}>
        <Typography variant="h6" sx={{ pl: 3 }}>
          座位
        </Typography>
        <Typography variant="h4" sx={{ pr: 3 }}>
          {state.seatNo}
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 2 }}>
        <Typography variant="h6" sx={{ pl: 3 }}>
          座況
        </Typography>
        <Typography variant="h4" sx={{ pr: 3 }}>
          {reservationStatusConfig(state.status).name}
        </Typography>
      </Stack>
      {/* <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 2 }}>
        <Typography variant="h6" sx={{ pl: 3 }}>
          最近的預約
        </Typography>
        <Typography variant="h4" sx={{ pr: 3 }}>
          {formatFullDateWithTime(state.date)}
        </Typography>
      </Stack> */}
      <Divider sx={{ py: 1 }} />

      {/* tab */}
      <SeatStatusTabs seatTab={seatTab} setSeatTab={setSeatTab} />
      {/* period seletor */}
      {seatTab === SeatTab.TODAY ? (
        <Stack direction="row" alignItems="center" gap={2} px={3} py={2}>
          {state.history.map((reservation) => (
            <SelectTab
              key={reservation.id}
              onClick={() => {
                handlePeriodSelect(reservation.periodId);
              }}
              className={
                reservation.periodId === period
                  ? "Mui-selected"
                  : reservation.reservedAt.getTime() < new Date().getTime()
                  ? "disabled"
                  : ""
              }
            >
              <Typography variant="body1" fontWeight={700}>
                {formatTimeOnly(reservation.reservedAt)}
              </Typography>
            </SelectTab>
          ))}
        </Stack>
      ) : null}
      {/* seat info */}
      <SeatInfo info={info} />
    </DrawerBase>
  );
};
