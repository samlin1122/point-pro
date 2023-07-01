import { useEffect, useState } from "react";
import { Box, InputAdornment } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { ButtonBase } from "~/components/buttons";
import { InputText } from "~/components/input";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import appDayjs, { formatDateOnly } from "~/utils/dayjs.util";
import ReservationDetail from "./tab/ReservationDetail";
import { useAppDispatch } from "~/app/hook";
import { getPeriods } from "~/app/slices/period";

interface ISeatSearchBarProps {
  view: number;
  date: appDayjs.Dayjs;
  handleDateChange: (value: appDayjs.Dayjs | null) => void;
  handleSearchChange: (value: string) => void;
}

const SeatSearchBar = ({ view, date, handleDateChange, handleSearchChange }: ISeatSearchBarProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [periods, setPeriods] = useState<string[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    diaptchGetPeriods();
  }, []);

  const diaptchGetPeriods = async () => {
    let { result } = await dispatch(getPeriods()).unwrap();
    let availableDay = [...new Set(result.map((item: any) => formatDateOnly(item.periodStartedAt)))];
    setPeriods(availableDay as string[]);
  };

  const handleCloseDrawer = () => {
    setOpen(false);
  };
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        gap: "1rem",
        height: "72px",
        padding: "1rem",
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`
      }}
    >
      <ButtonBase
        sx={{ border: "1px solid", borderColor: "common.black_40", color: "common.black", fontWeight: 900 }}
        onClick={() => handleDateChange(appDayjs())}
      >
        現在
      </ButtonBase>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
          value={date}
          format="YYYY年MM月DD日 (星期dd)"
          onChange={handleDateChange}
          minDate={appDayjs()}
          shouldDisableDate={(day) => !periods.includes(formatDateOnly(day))}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontWeight: 900
            },
            "& .MuiInputBase-input": {
              padding: ".5rem"
            }
          }}
        />
      </LocalizationProvider>
      {view === 1 && (
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <InputText
            sx={{ width: "25rem", bgcolor: "common.black_20" }}
            placeholder="輸入電話號碼搜尋"
            onChange={(event) => handleSearchChange(event.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
          />
        </Box>
      )}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "row-reverse"
        }}
      >
        <ButtonBase
          onClick={() => setOpen(true)}
          sx={{ color: "common.black", bgcolor: "primary.main", width: "12rem" }}
        >
          <AddIcon sx={{ fontSize: "h6.fontSize" }} />
          新增預約
        </ButtonBase>
      </Box>
      <ReservationDetail isCreate={true} open={open} onClose={handleCloseDrawer} date={date} />
    </Box>
  );
};

export default SeatSearchBar;
