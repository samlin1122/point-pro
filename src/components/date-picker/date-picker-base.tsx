import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface DatePickerPropsType {
  label: string;
  defaultValue: string;
  value: string;
  onChange: () => void;
}

function DatePickerBase({ label, defaultValue, value, onChange }: DatePickerPropsType) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker label={label} defaultValue={defaultValue} value={value} onChange={onChange} />
    </LocalizationProvider>
  );
}

export default DatePickerBase;
