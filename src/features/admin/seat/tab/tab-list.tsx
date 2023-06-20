import React, { ReactNode } from "react";
import {
  Avatar,
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
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

const rows: GridRowsProp = [
  {
    id: 1,
    status: "使用中",
    reservationId: "DJGV-2345",
    name: "王小明",
    phone: "0987654321",
    startedAt: 1684077191503,
    endedAt: null,
    seatNo: "A1",
    people: 2
  },
  {
    id: 2,
    status: "未入席",
    reservationId: "GJED-5559",
    name: "瘦子",
    phone: "0988438586",
    startedAt: null,
    endedAt: null,
    seatNo: "A1,A2,A3",
    people: 6
  },
  {
    id: 3,
    status: "已完成",
    reservationId: "QOVJ-3902",
    name: "Stephen Curry",
    phone: "0938275873",
    startedAt: 1683077191503,
    endedAt: 1683084451503,
    seatNo: "A1,A2,A3,A4,A5",
    people: 10
  },
  {
    id: 4,
    status: "使用中",
    reservationId: "POPO-4534",
    name: "周杰倫",
    phone: "0912345678",
    startedAt: 1684077191503,
    endedAt: null,
    seatNo: "B1,B2,B3,B4,B5,B6",
    people: 11
  },
  {
    id: 5,
    status: "未入席",
    reservationId: "XPKC-1231",
    name: "張惠妹",
    phone: "0938475833",
    startedAt: null,
    endedAt: null,
    seatNo: "B1,B2,B3",
    people: 5
  },
  {
    id: 6,
    status: "已完成",
    reservationId: "DOIG-3774",
    name: "Kevin Durant",
    phone: "0975384834",
    startedAt: 1683077191503,
    endedAt: 1683084451503,
    seatNo: "B1,B2,B3,B4",
    people: 8
  },
  {
    id: 7,
    status: "使用中",
    reservationId: "XKCJ-8677",
    name: "裴俊翔",
    phone: "0989586756",
    startedAt: 1684077191503,
    endedAt: null,
    seatNo: "A1",
    people: 2
  },
  {
    id: 8,
    status: "未入席",
    reservationId: "SIUX-1234",
    name: "賴京夫",
    phone: "0918287588",
    startedAt: null,
    endedAt: null,
    seatNo: "A1,A2,A3",
    people: 6
  },
  {
    id: 9,
    status: "已完成",
    reservationId: "VOIC-7977",
    name: "李智強",
    phone: "0999384758",
    startedAt: 1683077191503,
    endedAt: 1683084451503,
    seatNo: "A1,A2,A3,A4,A5",
    people: 10
  },
  {
    id: 10,
    status: "使用中",
    reservationId: "EUIR-1892",
    name: "	John Velazquez",
    phone: "0918283748",
    startedAt: 1684077191503,
    endedAt: null,
    seatNo: "B1,B2,B3,B4,B5,B6",
    people: 11
  },
  {
    id: 11,
    status: "未入席",
    reservationId: "VCJH-5643",
    name: "Alfredo McMann",
    phone: "0988776655",
    startedAt: null,
    endedAt: null,
    seatNo: "B1,B2,B3",
    people: 5
  },
  {
    id: 12,
    status: "已完成",
    reservationId: "QUHX-3214",
    name: "Brandon Brookes",
    phone: "0922384758",
    startedAt: 1683077191503,
    endedAt: 1683084451503,
    seatNo: "B1,B2,B3,B4",
    people: 8
  }
];

const columns: GridColDef[] = [
  {
    field: "status",
    headerName: "狀態",
    minWidth: 120,
    flex: 0.5,
    renderCell: (params: GridRenderCellParams<any, string>) => {
      const bgcolor = () => {
        switch (params.value) {
          case "使用中":
            return "#FEE391";
          case "未入席":
            return "#CFF561";
          case "已完成":
          default:
            return "#D1D1D1";
        }
      };

      return (
        <Avatar
          sx={{
            bgcolor: bgcolor(),
            fontSize: "small.fontSize",
            height: "2rem",
            width: "4rem",
            borderRadius: "5px",
            color: "common.black"
          }}
          variant="square"
        >
          {params.value}
        </Avatar>
      );
    }
  },
  { field: "reservationId", headerName: "訂單編號", minWidth: 140, flex: 0.5 },
  { field: "name", headerName: "姓名", minWidth: 140, flex: 1 },
  { field: "phone", headerName: "電話號碼", minWidth: 140, flex: 0.5 },
  {
    field: "startedAt",
    headerName: "開始時間",
    minWidth: 140,
    flex: 0.5,
    valueFormatter: (params: GridValueFormatterParams<number>) => {
      return params.value ? formatTimeOnly(params.value) : "-";
    }
  },
  {
    field: "endedAt",
    headerName: "結束時間",
    minWidth: 140,
    flex: 0.5,
    valueFormatter: (params: GridValueFormatterParams<number>) => {
      return params.value ? formatTimeOnly(params.value) : "-";
    }
  },
  {
    field: "totalTime",
    headerName: "總時長",
    minWidth: 130,
    flex: 0.5,
    valueGetter: (params: GridValueGetterParams) => {
      return {
        startedAt: params.row.startedAt,
        endedAt: params.row.endedAt
      };
    },
    valueFormatter: (params: GridValueFormatterParams<{ startedAt: number; endedAt: number }>) => {
      const { startedAt, endedAt } = params.value;
      if (startedAt && endedAt) {
        const diff = appDayjs(endedAt).diff(appDayjs(startedAt));
        const duration = appDayjs.duration(diff);
        const finalFormat = appDayjs
          .duration({
            hours: duration.hours(),
            minutes: duration.minutes()
          })
          .format("HH:mm");

        return finalFormat;
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
  { field: "people", headerName: "人數", minWidth: 110, flex: 0.3 }
];

interface ISeatTableProps {}

const TabList = (props: ISeatTableProps) => {
  return (
    <Box
      sx={{
        height: `calc(100vh - ${headerHeight} - 50px - 72px)`,
        width: "100%",
        overflow: "auto"
      }}
    >
      <DataGrid
        rows={rows}
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

export default TabList;
