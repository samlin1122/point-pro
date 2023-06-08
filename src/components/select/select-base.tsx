import { useState } from "react";
import { MenuItem } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { handleChangeProps } from "~/components/layout";

interface SelectBasePropsType {
  list: Array<SelectItemType> | undefined;
  includeAll?: boolean;
  onChange?: (props: handleChangeProps) => void;
  [key: string]: any;
}

interface SelectItemType {
  id: string;
  title: string;
}

export default function SelectBase({ list, onChange, includeAll = false, ...props }: SelectBasePropsType) {
  const [select, setSelect] = useState("");

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    let payload = { id: props.id, value: event.target.value };
    // console.log({ payload });

    setSelect(event.target.value);
    onChange && onChange(payload);
  };

  return (
    <Select value={select} onChange={handleSelectChange} {...props}>
      {includeAll ? <MenuItem value="all">全部</MenuItem> : null}
      {list?.map((item) => (
        <MenuItem key={`${item.id}`} value={item.id}>
          {item.title}
        </MenuItem>
      ))}
    </Select>
  );
}
