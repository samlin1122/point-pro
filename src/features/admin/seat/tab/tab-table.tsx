import { FC, Fragment } from "react";

import { Stack, Typography, Box } from "@mui/material";
import { ReactComponent as CircleTable } from "~/assets/images/table-circle.svg";
import { ReactComponent as NormalTable } from "~/assets/images/table-normal.svg";

interface TabTablePros {}

interface TablePros {
  number: string;
  gap?: boolean;
}

interface TableInfoProps {
  active: boolean;
  number: string;
}

const TableInfo = ({ active, number }: TableInfoProps) => {
  return active ? (
    <Fragment>
      <Typography variant="body1" fontWeight={700} lineHeight={"24px"}>
        {number}
      </Typography>
      <Typography variant="h6" fontWeight={900} lineHeight={"28.8px"}>
        黃2
      </Typography>
      <Typography variant="body1" fontWeight={400} lineHeight={"24px"}>
        17:42
      </Typography>
      <Typography variant="body1" fontWeight={700} lineHeight={"24px"}>
        12%
      </Typography>
    </Fragment>
  ) : (
    <Typography variant="h6" fontWeight={900}>
      {number}
    </Typography>
  );
};

const TableCircle = ({ number }: TablePros) => {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      width={260}
      minWidth={260}
      minHeight={260}
      sx={{ position: "relative" }}
    >
      <Box sx={{ position: "absolute", zIndex: -1 }}>
        <CircleTable color="#F7C324" />
      </Box>
      <TableInfo active number={number} />
    </Stack>
  );
};
const TableNormal = ({ number, gap }: TablePros) => {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      width={120}
      height={216}
      minWidth={120}
      minHeight={216}
      sx={{ position: "relative", mr: gap ? 6 : 0 }}
    >
      <Box sx={{ position: "absolute", zIndex: -1 }}>
        <NormalTable color="#F7C324" />
      </Box>
      <TableInfo active={false} number={number} />
    </Stack>
  );
};
const arr = [...Array(26).keys()].map((i) => String.fromCharCode(i + 65));

export const TabTable: FC<TabTablePros> = () => {
  return (
    <Stack direction="row" sx={{ p: 0, height: "calc(100vh - 88px - 49px - 72px)", width: "100%" }}>
      <Stack
        width={200}
        alignItems="center"
        justifyContent="center"
        sx={{ p: 2, overflow: "auto", borderRight: (theme) => `1px solid ${theme.palette.divider}`, minWidth: 200 }}
      >
        <Typography>上午 1:00</Typography>
        <Typography>上午 2:00</Typography>
        <Typography>上午 3:00</Typography>
      </Stack>
      <Stack sx={{ p: 3, width: "calc(100vw - 200px)", overflow: "auto" }}>
        <Stack direction="row" gap={5} justifyContent="space-between">
          {arr.map((e, key) => (key < 3 ? <TableCircle key={e} number={e} /> : null))}
        </Stack>
        {arr.map(
          (col, colKey) =>
            colKey < 3 && (
              <Stack
                key={`table-column-${colKey}`}
                direction="row"
                gap={13}
                sx={{ mt: 3 }}
                justifyContent="space-between"
              >
                {arr.map(
                  (row, rowkey) =>
                    rowkey < 3 && (
                      <Stack key={`${row}-${colKey}-${rowkey}`} direction="row" gap={1}>
                        <TableNormal number={`${row}-${colKey + 1}${rowkey + 1}`} />
                        <TableNormal number={`${row}-${colKey + 1}${rowkey + 2}`} />
                      </Stack>
                    )
                )}
              </Stack>
            )
        )}
      </Stack>
    </Stack>
  );
};

export default TabTable;
