import { useState } from "react"
import { MenuItem, InputLabel, FormControl, FormHelperText } from "@mui/material"
import Select, { SelectChangeEvent } from "@mui/material/Select"

interface BasicSelectPropsType {
  title: string
  list: Array<SelectItemType>
  onChange: (props: string) => void
}

interface SelectItemType {
  id: string
  label: string
}

export default function BasicSelect({ title, list, onChange }: BasicSelectPropsType) {
  const [select, setSelect] = useState("")

  const handleChange = (event: SelectChangeEvent) => {
    setSelect(event.target.value as string)
    onChange(event.target.value as string)
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id={`select-title-${title}`}>{title}</InputLabel>
      <Select
        labelId={`select-title-${title}`}
        id={`select-${title}`}
        value={select}
        label={title}
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
  )
}
