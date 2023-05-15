import React, { useState } from "react";
import { Box, InputAdornment } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { ButtonBase } from "~/components/buttons";
import { InputDate, InputText } from "~/components/input";
import { DatePicker, DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import appDayjs from "~/utils/dayjs.util";

interface ISeatSearchBarProps {
  view: number;
  setView: React.Dispatch<React.SetStateAction<number>>;
}

const SeatSearchBar = (props: ISeatSearchBarProps) => {
  const { view, setView } = props;

  const [date, setDate] = useState(appDayjs());

  const handleChangeBookingDate = (value: appDayjs.Dayjs | null) => {
    setDate(value ?? appDayjs());
  };

  return (
    <Box sx={{ display: "flex", width: "100%", gap: "1rem", height: "4.5rem", padding: "1rem" }}>
      <ButtonBase sx={{ border: "1px solid", borderColor: "common.black_40", color: "common.black", fontWeight: 900 }}>
        現在
      </ButtonBase>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
          value={date}
          format="YYYY年MM月DD日 (星期dd)"
          onChange={handleChangeBookingDate}
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
      <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
        <InputText
          sx={{ width: "25rem", bgcolor: "common.black_20" }}
          placeholder="搜尋訂單編號/姓名/電話/mail"
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        />
      </Box>
      {view === 2 && (
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "row-reverse"
          }}
        >
          <ButtonBase
            onClick={() => setView(0)}
            sx={{ color: "common.black", bgcolor: "primary.main", width: "12rem" }}
          >
            <AddIcon sx={{ fontSize: "h6.fontSize" }} />
            新增
          </ButtonBase>
        </Box>
      )}
    </Box>
  );
};

export default SeatSearchBar;
