import { FC, memo, useEffect, useState } from "react";

import { Stack } from "@mui/material";
import { TableCircle, TableNormal, Periods } from "./index.styles";

import { headerHeight } from "~/components/header";
import { useAppDispatch } from "~/app/hook";
import { getSeatById, getSeats } from "~/app/slices/seat";
import { getPeriodByDate } from "~/app/slices/period";
import { PeriodInfo, SeatInfo, SeatDetails } from "~/types";
import appDayjs, { convertToDatePayload } from "~/utils/dayjs.util";
import { SeatDetail } from "~/features/admin/seat/tab/SeatDetail";
import { SeatsPayload } from "~/types/api";

interface TabTablePros {
  date: appDayjs.Dayjs;
}

const circleSeatList = ["G-1", "G-2", "G-3"];

const normalSeatList = [
  ["A-1", "A-2", "A-3", "A-4", "A-5", "A-6"],
  ["B-1", "B-2", "B-3", "B-4", "B-5", "B-6"],
  ["C-1", "C-2", "C-3", "C-4", "C-5", "C-6"]
];

export const TabTable: FC<TabTablePros> = ({ date }) => {
  const [seats, setSeats] = useState<{ [no: string]: SeatInfo }>();
  const [periods, setPeriods] = useState<PeriodInfo[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>();
  const [selectedSeat, setSelectedSeat] = useState<string>();
  const [seatDteail, setSeatDetail] = useState<SeatDetails>();

  const dispatch = useAppDispatch();

  useEffect(() => {
    // dispatchGetSeats();
    dispatchGetPeriodByDate();
  }, [date]);

  useEffect(() => {
    if (selectedPeriod) {
      dispatchGetSeats(selectedPeriod);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    if (selectedSeat) {
      dispatchGetSeatById();
    }
  }, [selectedSeat]);

  const dispatchGetSeatById = async () => {
    let { result } = await dispatch(getSeatById({ seatId: selectedSeat as string, date: date.toDate() })).unwrap();
    setSeatDetail(result);
  };

  const dispatchGetSeats = async (periodId?: string) => {
    let payload: SeatsPayload = { date: convertToDatePayload(date) };
    if (periodId) {
      payload.periodId = periodId;
    }
    let { result } = await dispatch(getSeats(payload)).unwrap();
    setSeats(formatSeatResponseToData(result));
  };

  const dispatchGetPeriodByDate = async () => {
    let { result } = await dispatch(getPeriodByDate({ date: convertToDatePayload(date) })).unwrap();
    let payload = result[0].periods.filter((e: PeriodInfo) => appDayjs().isBefore(e.periodEndedAt));
    setPeriods(payload);
    if (date.isToday()) {
      let defaultSelect = result[0].periods.find((e: PeriodInfo) =>
        appDayjs().isBetween(e.periodStartedAt, e.periodEndedAt)
      );
      if (!defaultSelect) {
        defaultSelect = payload[0];
      }
      setSelectedPeriod(defaultSelect.id);
    } else {
      setSelectedPeriod(result[0].periods[0].id);
    }
  };

  const formatSeatResponseToData = (res: []) => {
    let data: any = {};
    res.forEach((e: any) => {
      data[e.seatNo] = e;
    });
    return data;
  };

  const handlePeriodClick = (periodId: string) => {
    setSelectedPeriod(periodId);
  };

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeat(seatId);
  };

  const handleSeatDetailClose = () => {
    setSelectedSeat(undefined);
    setSeatDetail(undefined);
  };

  return (
    <Stack direction="row" sx={{ p: 0, height: `calc(100vh - ${headerHeight} - 50px - 72px)`, width: "100%" }}>
      <Periods periods={periods} selected={selectedPeriod} handleClick={handlePeriodClick} />
      {seats ? (
        <Stack sx={{ p: 3, width: "calc(100vw - 200px)", overflow: "auto" }}>
          <Stack direction="row" justifyContent="space-around">
            {circleSeatList.map((g) => (
              <TableCircle key={g} state={seats[g]} handleClick={handleSeatSelect} />
            ))}
          </Stack>
          {normalSeatList.map((row, key) => (
            <Stack
              key={`row-${String.fromCharCode(key + 65)}`}
              direction="row"
              sx={{ mt: 3 }}
              justifyContent="space-evenly"
            >
              {row.map((e) => (
                <TableNormal key={e} state={seats[e]} handleClick={handleSeatSelect} />
              ))}
            </Stack>
          ))}
        </Stack>
      ) : null}
      {!!seatDteail && (
        <SeatDetail
          open={!!seatDteail}
          onClose={handleSeatDetailClose}
          state={seatDteail}
          update={dispatchGetSeatById}
          selectedPeriod={selectedPeriod}
        />
      )}
    </Stack>
  );
};

export default memo(TabTable);
