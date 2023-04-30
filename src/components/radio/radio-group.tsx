import RadioBase from "./radio-base";
import { RadioGroup, FormControlLabel, FormControl, FormLabel } from "@mui/material";

interface RadioGroupType {
  title: string;
  list: Array<RadioItemType>;
  isRow: boolean | undefined;
}

interface RadioItemType {
  id: string;
  label: string;
  value: string | number;
  disabled: boolean;
}

export default function RadioButtonsGroup({ title, list, isRow }: RadioGroupType) {
  return (
    <FormControl>
      <FormLabel id={`${title}-radio-buttons-group-title`}>{title}</FormLabel>
      <RadioGroup
        row={isRow}
        aria-labelledby={`${title}-radio-buttons-group-title`}
        name={`${title}-radio-buttons-group`}
      >
        {list.map((item: RadioItemType) => (
          <FormControlLabel
            key={`${title}-radio-buttons-group-item-${item.id}`}
            value={item.value}
            control={<RadioBase />}
            label={item.label}
            disabled={item.disabled}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
