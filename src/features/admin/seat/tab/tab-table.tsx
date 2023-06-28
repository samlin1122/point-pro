import { FC, memo, useEffect, useState } from "react";

import { Stack } from "@mui/material";
import { TableCircle, TableNormal, Periods } from "./index.styles";

import { headerHeight } from "~/components/header";
import { useAppDispatch } from "~/app/hook";
import { getSeatById, getSeats } from "~/app/slices/seat";
import { getPeriodByDate } from "~/app/slices/period";
import { PeriodInfo, ReservationHistory, SeatInfo, SeatDetails } from "~/types";
import appDayjs from "~/utils/dayjs.util";
import { SeatDetail } from "~/features/admin/seat/tab/SeatDetail";
import { BookingType } from "~/types/common";

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
    dispatchGetSeats();
    dispatchGetPeriodByDate();
    if (date.isToday()) {
      setSelectedPeriod(undefined);
    }
  }, [date]);

  useEffect(() => {
    console.log({ selectedPeriod });
    dispatchGetSeats();
  }, [selectedPeriod]);

  useEffect(() => {
    console.log({ selectedSeat });
    if (selectedSeat) {
      dispatchGetSeatById();
    }
  }, [selectedSeat]);

  const dispatchGetSeatById = async () => {
    let { result } = await dispatch(getSeatById(selectedSeat as string)).unwrap();
    console.log(result);
    result.history = resetvationshistory;
    setSeatDetail(result);
  };

  const dispatchGetSeats = async () => {
    let payload = { date: date.toDate() ?? appDayjs().toDate(), periodId: selectedPeriod };
    let { result } = await dispatch(getSeats(payload)).unwrap();
    setSeats(formatSeatResponseToData(result));
  };

  const formatSeatResponseToData = (res: []) => {
    let data: any = {};
    res.forEach((e: any) => {
      data[e.seatNo] = e;
    });
    return data;
  };

  const dispatchGetPeriodByDate = async () => {
    let { result } = await dispatch(getPeriodByDate(date.toDate())).unwrap();
    setPeriods(result?.periods);
    if (!date.isToday()) {
      setSelectedPeriod(result.periods[0]);
    }
  };

  const handlePeriodClick = (periodId?: string) => {
    if (periodId) {
      setSelectedPeriod(periodId);
    } else {
      setSelectedPeriod(undefined);
    }
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
      <Periods date={date} periods={periods} selected={selectedPeriod} handleClick={handlePeriodClick} />
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
      {!!seatDteail && <SeatDetail open={!!seatDteail} onClose={handleSeatDetailClose} state={seatDteail} />}
    </Stack>
  );
};

export default memo(TabTable);

const resetvationshistory: ReservationHistory[] = [
  {
    periodId: "123",
    id: "123123",
    reservedAt: new Date("2023-06-28 12:00"),
    type: BookingType["online-booking"],
    options: {
      name: "葉小姐",
      adult: 4,
      child: 2,
      phone: "0912345678",
      email: "test@email.com"
    },
    periodStartedAt: new Date("2023-06-28 12:00"),
    periodEndedAt: new Date("2023-06-28 14:00"),
    startOfMeal: new Date("2023-06-28 12:00"),
    endOfMeal: new Date("2023-06-28 12:00"),
    seats: ["A1", "A2", "A3"]
  },
  {
    periodId: "456",
    id: "1231232323",
    reservedAt: new Date("2023-06-28 14:00"),
    type: BookingType["online-booking"],
    options: {
      name: "葉小姐",
      adult: 4,
      child: 2,
      phone: "0912345678",
      email: "test@email.com"
    },
    periodStartedAt: new Date("2023-06-28 14:00"),
    periodEndedAt: new Date("2023-06-28 16:00"),
    startOfMeal: new Date("2023-06-28 14:00"),
    endOfMeal: new Date("2023-06-28 14:00"),
    seats: ["A1", "A2", "A3"]
  }
  // {
  //   reservedAt: new Date("2023-06-28 16:00"),
  //   id: "2",
  //   seats: ["A1", "A2", "A3"],
  //   options: {
  //     name: "曹小姐",
  //     adult: 3,
  //     child: 2,
  //     phone: "0912345678",
  //     email: "test@email.com"
  //   }
  // },
  // {
  //   reservedAt: new Date("2023-06-28 18:00"),
  //   id: "3",
  //   seats: ["A1", "A2", "A3"],
  //   options: {
  //     name: "宋小姐",
  //     adult: 4,
  //     child: 2,
  //     phone: "0912345678",
  //     email: "test@email.com"
  //   }
  // },
  // {
  //   reservedAt: new Date("2023-06-28 20:00"),
  //   id: "4",
  //   seats: ["A1", "A2", "A3"],
  //   options: {
  //     name: "田小姐",
  //     adult: 4,
  //     child: 2,
  //     phone: "0912345678",
  //     email: "test@email.com"
  //   }
  // }
];
