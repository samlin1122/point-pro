import { FC } from "react";
import { styled } from "@mui/material/styles";
import { Box, Button, InputAdornment, Stack, Typography } from "@mui/material";
import { InputText, InputTextarea, InputDate } from "./input";
import File from "./file";
import { CheckboxBase } from "./checkbox";
import { SelectBase } from "./select";
import { headerHeight } from "./header";

interface Props {
  length?: Number;
  align?: string;
}

export const Row = styled(Box)((props: Props) => ({
  display: "flex",
  position: "relative",
  alignItems: props.align || "center"
}));

export const Column = styled(Box)(() => ({
  display: "flex",
  position: "relative",
  flexDirection: "column"
}));

export const Base = styled(Box)(() => ({
  padding: "24px",
  minHeight: `calc(100vh - ${headerHeight})`
}));

interface FieldContainerPropsType {
  width: number;
  label: string;
  type: string;
  [name: string]: any;
}

export interface handleChangeProps {
  id: string | undefined;
  value: any;
}

export const FieldContainer: FC<FieldContainerPropsType> = ({ width = 500, label, type, list, ...props }) => {
  const sx = { width: `${width}px` };
  const Component = () => {
    switch (type) {
      case "text":
        return (
          <InputText
            sx={sx}
            {...props}
            onChange={(event) => props.onChange({ id: props.id, value: event.target.value })}
          />
        );
      case "textarea":
        delete props.error;
        return (
          <InputTextarea
            sx={sx}
            {...props}
            onChange={(event) => props.onChange({ id: props.id, value: event.target.value })}
          />
        );
      case "dollar":
        return (
          <InputText
            sx={sx}
            type="number"
            {...props}
            onChange={(event) => props.onChange({ id: props.id, value: event.target.value.replace(/^0+(?!$)/, "") })}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
          />
        );
      case "file":
        return <File width={width} handleChange={(value) => props.onChange({ id: props.id, value })} {...props} />;
      case "date":
        return <InputDate sx={sx} {...props} onChange={(value) => props.onChange({ id: props.id, value })} />;
      case "checkbox":
        delete props.error;
        return (
          <CheckboxBase
            {...props}
            checked={props.value}
            onChange={(event) => props.onChange({ id: props.id, value: event.target.checked })}
          />
        );
      case "select":
        return <SelectBase list={list} sx={sx} {...props} />;
      case "button":
        delete props.error;
        return (
          <Button variant="contained" sx={sx} {...props}>
            {props.text}
          </Button>
        );
      default:
        return <InputText sx={sx} />;
    }
  };
  return (
    <Stack direction="row" spacing={8} alignItems="center" flexWrap="wrap" sx={{ userSelect: "none" }}>
      <Typography width={130} variant="h3">
        {label}
      </Typography>
      {Component()}
    </Stack>
  );
};
