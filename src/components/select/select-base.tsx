import { useState } from "react";
import { MenuItem } from "@mui/material";
import Select, { SelectChangeEvent, SelectProps } from "@mui/material/Select";

interface BasicSelectPropsType extends SelectProps {
  list: Array<SelectItemType> | undefined;
  handleChange?: (props: string) => void;
}

interface SelectItemType {
  id: string;
  label: string;
}

export default function BasicSelect({ list, handleChange, ...props }: BasicSelectPropsType) {
  const [select, setSelect] = useState("");

  const handleSelectChange = (event: SelectChangeEvent<unknown>) => {
    setSelect(event.target.value as string);
    handleChange && handleChange(event.target.value as string);
  };

  return (
    <Select value={select} onChange={handleSelectChange} {...props}>
      {list?.map((item) => (
        <MenuItem key={`${item.id}`} value={item.id}>
          {item.label}
        </MenuItem>
      ))}
    </Select>
  );
}
