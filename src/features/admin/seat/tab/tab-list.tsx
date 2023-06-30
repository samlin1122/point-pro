import { useEffect, useState, memo } from "react";
import { Avatar, Box } from "@mui/material";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridValueFormatterParams,
  GridValueGetterParams,
  GridRenderCellParams
} from "@mui/x-data-grid";
import appDayjs, { formatTimeOnly } from "~/utils/dayjs.util";
import { headerHeight } from "~/components/header";
import { ReservationInfo } from "~/types";
import { useAppDispatch } from "~/app/hook";
import { getReservations } from "~/app/slices/reservation";
import { reservationStatusConfig } from "./index.styles";
import { genderListStringArray } from "~/utils/constants";

interface TabListProps {
  date: appDayjs.Dayjs;
  search: string;
}

const TabList = ({ date, search }: TabListProps) => {
  const dispatch = useAppDispatch();
  const [reservations, setReservations] = useState<GridRowsProp>([]);

  useEffect(() => {
    dispatchGetReservation();
  }, [date]);

  const dispatchGetReservation = async () => {
    const { result } = await dispatch(getReservations(date.toDate())).unwrap();
    const list = result?.map((e: ReservationInfo) => ({
      id: e.id,
      type: e.type,
      ...e.options,
      startOfMeal: e.startOfMeal,
      endOfMeal: e.endOfMeal,
      seatNo: e.seats.map((seat) => seat.seatNo).join(", "),
      people: e.options
    })) as GridRowsProp;

    setReservations(list);
  };
  const phoneRegex = new RegExp(search, "i");
  return (
    <Box
      sx={{
        height: `calc(100vh - ${headerHeight} - 50px - 72px)`,
        width: "100%",
        overflow: "auto"
      }}
    >
      <DataGrid
        rows={reservations.filter((e) => phoneRegex.test(e.phone))}
        columns={columns}
        getRowHeight={() => "auto"}
        disableRowSelectionOnClick
        isRowSelectable={() => false}
        sx={{
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 700
          },
          "& .MuiDataGrid-cell": {
            paddingTop: ".5rem",
            paddingBottom: ".5rem"
          }
        }}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 100 }
          }
        }}
        pageSizeOptions={[5, 10, 25, 50, 100]}
      />
    </Box>
  );
};

const columns: GridColDef[] = [
  {
    field: "type",
    headerName: "狀態",
    minWidth: 120,
    flex: 0.5,
    renderCell: (params: GridRenderCellParams<any, string>) => {
      return (
        <Avatar
          sx={{
            bgcolor: reservationStatusConfig(params.value as string).color,
            fontSize: "small.fontSize",
            height: "2rem",
            width: "4rem",
            borderRadius: "5px",
            color: "common.black"
          }}
          variant="square"
        >
          {reservationStatusConfig(params.value as string).name}
        </Avatar>
      );
    }
  },
  {
    field: "name",
    headerName: "姓名",
    minWidth: 120,
    flex: 0.5,
    valueGetter: (params: GridValueGetterParams) => {
      return {
        name: params.row.name,
        gender: params.row.gender
      };
    },
    valueFormatter: (params: GridValueFormatterParams<{ name: string; gender: number }>) => {
      const { name, gender } = params.value;
      return name + genderListStringArray[gender];
    }
  },
  { field: "phone", headerName: "電話號碼", minWidth: 120, flex: 0.5 },
  {
    field: "startOfMeal",
    headerName: "開始時間",
    minWidth: 100,
    flex: 0.5,
    valueFormatter: (params: GridValueFormatterParams<number>) => {
      return params.value ? formatTimeOnly(params.value) : "-";
    }
  },
  {
    field: "endOfMeal",
    headerName: "結束時間",
    minWidth: 100,
    flex: 0.5,
    valueFormatter: (params: GridValueFormatterParams<number>) => {
      return params.value ? formatTimeOnly(params.value) : "-";
    }
  },
  {
    field: "totalTime",
    headerName: "總時長",
    minWidth: 100,
    flex: 0.5,
    valueGetter: (params: GridValueGetterParams) => {
      return {
        startOfMeal: params.row.startOfMeal,
        endOfMeal: params.row.endOfMeal
      };
    },
    valueFormatter: (params: GridValueFormatterParams<{ startOfMeal: number; endOfMeal: number }>) => {
      const { startOfMeal, endOfMeal } = params.value;
      if (startOfMeal && endOfMeal) {
        const diff = appDayjs(endOfMeal).diff(appDayjs(startOfMeal));
        const duration = appDayjs.duration(diff).format("HH:mm");
        return duration;
      }
      return "-";
    }
  },
  {
    field: "seatNo",
    headerName: "座位",
    minWidth: 140,
    flex: 1,
    renderCell: (params: GridRenderCellParams<any, string>) => {
      const seatArr = params.value?.split(",") ?? [];
      return (
        <Box sx={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
          {seatArr.map((seat, idx) => (
            <Box key={`${seat}-${idx}`}>
              {seat}
              {idx !== seatArr.length - 1 && "、"}
            </Box>
          ))}
        </Box>
      );
    }
  },
  {
    field: "people",
    headerName: "人數",
    minWidth: 110,
    flex: 0.3,
    valueFormatter: (params: GridValueFormatterParams<{ adults: number; children: number }>) => {
      try {
        const { adults, children } = params.value;
        return adults + children;
      } catch (error) {
        return "-";
      }
    }
  },
  { field: "remark", headerName: "備註", minWidth: 100, flex: 0.5 }
];
export default memo(TabList);
