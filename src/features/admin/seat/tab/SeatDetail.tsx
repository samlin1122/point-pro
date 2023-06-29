import { FC, useState } from "react";
import { Stack, Typography, styled, Button, Box, Divider } from "@mui/material";
import appDayjs, { formatTimeOnly } from "~/utils/dayjs.util";
import { DrawerBase } from "~/components/drawer";
import TabsBase from "~/components/tabs";
import theme from "~/theme";
import { SeatDetailsPeriod, SeatDetails } from "~/types";
import UnDraw from "~/assets/images/undraw_login.svg";
import { reservationStatusConfig } from "./index.styles";
import ReservationDetail from "./ReservationDetail";
import { genderListStringArray } from "~/utils/constants";

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
  info: SeatDetailsPeriod | undefined;
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
  const config = [
    { label: "訂位編號", value: info?.id.slice(0, 12) },
    {
      label: "姓名",
      value: info?.reservation?.options.name + genderListStringArray[info?.reservation?.options.gender]
    },
    { label: "總人數", value: info?.reservation?.options.adults + info?.reservation?.options.children },
    { label: "電話", value: info?.reservation?.options.phone },
    { label: "信箱", value: info?.reservation?.options.email },
    { label: "使用座位", value: info?.reservation?.seats.map((e) => e.seatNo).join(", ") }
  ];
  return (
    <Stack height="inherit" gap={2} sx={{ px: 4, py: 2 }}>
      {info?.reservation ? (
        <>
          {config.map((e) => (
            <Stack key={e.label} direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body1" whiteSpace="nowrap">
                {e.label}
              </Typography>
              <Typography variant="h6" textAlign="end">
                {e.value ?? "-"}
              </Typography>
            </Stack>
          ))}
        </>
      ) : (
        <Stack alignItems="center" justifyContent="center" height="100%">
          <Box component="img" src={UnDraw} width={200} height={120} />
          <Typography variant="h6" sx={{ pr: 2 }}>
            等待客人上門中
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

export const SeatDetail: FC<SeatDetailProps> = ({ open, onClose, state }) => {
  const [seatTab, setSeatTab] = useState(SeatTab.CURRENT);
  const [period, setPeriod] = useState<string>();
  const [editMode, setEditMode] = useState<string | undefined>();

  const handlePeriodSelect = (periodId: string) => {
    setPeriod(periodId);
  };
  const info = state.periods.find((e) => {
    if (seatTab === SeatTab.CURRENT) {
      return appDayjs().isAfter(e.startedAt) && appDayjs().isBefore(e.endedAt);
    } else {
      if (period) {
        return e.id === period;
      } else {
        setPeriod(e.id);
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
        setEditMode("edit");
        break;
      case "create":
        setEditMode("create");
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
              disabled: info.status === "INUSE"
            },
            { label: "客到開始使用", onClick: () => handleButtonClick("start") }
          ]
        : [{ label: "新增現場使用", onClick: () => handleButtonClick("create") }]
      : info?.reservation
      ? [
          {
            label: "編輯",
            onClick: () => handleButtonClick("edit"),
            disabled: appDayjs().isAfter(info.startedAt)
          }
        ]
      : [
          {
            label: "新增預約",
            onClick: () => handleButtonClick("create"),
            disabled: appDayjs().isAfter(info?.startedAt)
          }
        ];
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
          {reservationStatusConfig(info?.status as string).name}
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
        <Stack direction="row" alignItems="center" gap={2} px={3} pt={2}>
          {state.periods.map((e) => (
            <SelectTab
              key={e.id}
              onClick={() => {
                handlePeriodSelect(e.id);
              }}
              className={e.id === period ? "Mui-selected" : appDayjs().isAfter(appDayjs(e.startedAt)) ? "disabled" : ""}
            >
              <Typography variant="body1" fontWeight={700}>
                {formatTimeOnly(e.startedAt)}
              </Typography>
            </SelectTab>
          ))}
        </Stack>
      ) : null}
      {/* seat info */}
      <SeatInfo info={info} />
      <ReservationDetail
        isCreate={editMode === "create"}
        open={!!editMode}
        onClose={() => setEditMode(undefined)}
        date={appDayjs(state.date)}
      />
    </DrawerBase>
  );
};
