import { Fragment, memo } from "react";

import { Stack, Typography, Box, ListItem, ListItemButton } from "@mui/material";
import { ReactComponent as CircleTable } from "~/assets/images/table-circle.svg";
import { ReactComponent as NormalTable } from "~/assets/images/table-normal.svg";

import { PeriodInfo, SeatInfo } from "~/types";
import appDayjs, { formatTimeOnly, percentOfUsed } from "~/utils/dayjs.util";
import { seatStatusListObj } from "~/utils/constants";

interface TablePros {
  state: SeatInfo;
  handleClick: (seatId: string) => void;
}

interface TableInfoProps {
  state: SeatInfo;
}

const TableInfo = ({ state }: TableInfoProps) => {
  if (!state) return <Fragment />;
  switch (state.status) {
    case "AVAILABLE":
      return (
        <Typography variant="h6" fontWeight={900}>
          {state.seatNo}
        </Typography>
      );
    case "RESERVED":
      return (
        <Fragment>
          <Typography variant="body2" fontWeight={700} lineHeight={"24px"}>
            {state.seatNo}
          </Typography>
          <Typography variant="body1" fontWeight={900} lineHeight={"28.8px"}>
            {state.currentReservation.options?.name}
          </Typography>
          <Typography variant="body2" fontWeight={400} lineHeight={"24px"}>
            {formatTimeOnly(state.period.startedAt)}
          </Typography>
          <Typography variant="body2" fontWeight={700} lineHeight={"24px"}>
            -
          </Typography>
        </Fragment>
      );
    case "OCCUPIED":
      return (
        <Fragment>
          <Typography variant="body2" fontWeight={700} lineHeight={"24px"}>
            {state.seatNo}
          </Typography>
          <Typography variant="body1" fontWeight={900} lineHeight={"28.8px"}>
            {state.currentReservation.options?.name}
          </Typography>
          <Typography variant="body2" fontWeight={400} lineHeight={"24px"}>
            {formatTimeOnly(state.currentReservation.startOfMeal)}
          </Typography>
          <Typography variant="body2" fontWeight={700} lineHeight={"24px"}>
            {percentOfUsed(state.currentReservation.startOfMeal, state.period.endedAt)}
          </Typography>
        </Fragment>
      );
    default:
      return <Fragment />;
  }
};

interface PeriodsProps {
  periods: PeriodInfo[];
  selected: string | undefined;
  handleClick: (id: string) => void;
}

export const TableCircle = memo(({ state, handleClick }: TablePros) => {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      width={150}
      height={150}
      sx={{ position: "relative", cursor: "pointer" }}
      onClick={() => handleClick(state.id)}
    >
      <Box sx={{ position: "absolute", zIndex: -1 }}>
        <CircleTable width={150} color={seatStatusListObj[state.status as string].color} />
      </Box>
      <TableInfo state={state} />
    </Stack>
  );
});

export const TableNormal = memo(({ state, handleClick }: TablePros) => {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      width={90}
      height={160}
      sx={{ position: "relative", cursor: "pointer" }}
      onClick={() => handleClick(state.id)}
    >
      <Box sx={{ position: "absolute", zIndex: -1 }}>
        <NormalTable width={90} height={160} color={seatStatusListObj[state.status as string].color} />
      </Box>
      <TableInfo state={state} />
    </Stack>
  );
});

export const Periods = ({ periods, selected, handleClick }: PeriodsProps) => {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{ p: 2, overflow: "auto", borderRight: (theme) => `1px solid ${theme.palette.divider}`, minWidth: 200 }}
    >
      {periods?.map((e) => (
        <Fragment key={e.id}>
          {appDayjs().isBefore(e.periodEndedAt) ? (
            <ListItem onClick={() => handleClick(e.id)}>
              <ListItemButton
                sx={{
                  justifyContent: "center",
                  borderRadius: "8px",
                  py: 2,
                  px: 3,
                  border: (theme) => `2px solid ${selected === e.id ? theme.palette.common.black : "none"}`,
                  bgcolor: (theme) => (selected === e.id ? theme.palette.primary.main : "none")
                }}
              >
                {formatTimeOnly(e.periodStartedAt)}
              </ListItemButton>
            </ListItem>
          ) : null}
        </Fragment>
      ))}
    </Stack>
  );
};
