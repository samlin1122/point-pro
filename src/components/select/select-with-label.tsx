import { useState } from "react";
import { MenuItem, InputLabel, FormControl, FormHelperText } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface BasicSelectPropsType {
  label: string;
  list: Array<SelectItemType>;
  onChange: (props: string) => void;
}

interface SelectItemType {
  id: string;
  label: string;
}

export default function BasicSelect({ label, list, onChange }: BasicSelectPropsType) {
  const [select, setSelect] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setSelect(event.target.value as string);
    onChange(event.target.value as string);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id={`select-label-${label}`}>{label}</InputLabel>
      <Select
        labelId={`select-label-${label}`}
        id={`select-${label}`}
        value={select}
        label={label}
        onChange={handleChange}
      >
        {list.map((item) => (
          <MenuItem key={`${item.id}`} value={item.id}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
      {/* <FormHelperText>With label + helper text</FormHelperText> */}
    </FormControl>
  );
}
