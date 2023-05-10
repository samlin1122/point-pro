import { styled } from "@mui/material/styles";
import { Box, Button, InputAdornment, Stack, Typography } from "@mui/material";
import { InputText, InputTextarea, InputDate } from "./input";
import File from "./file";
import { CheckboxBase } from "./checkbox";
import { SelectBase } from "./select";

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
  maxHeight: "calc(100vh - 88px)"
}));

interface FieldContainerPropsType {
  width: number;
  label: string;
  type: string;
  [name: string]: any;
}

export const FieldContainer: React.FC<FieldContainerPropsType> = ({ width = 500, label, type, list, ...props }) => {
  const Component: React.FC<{ width: number }> = ({ width }) => {
    const sx = { width: `${width}px` as string };
    switch (type) {
      case "text":
        return <InputText sx={sx} {...props} />;
      case "textarea":
        return <InputTextarea sx={sx} {...props} />;
      case "dollar":
        return (
          <InputText
            sx={sx}
            type="number"
            {...props}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
          />
        );
      case "file":
        return <File width={width} />;
      case "date":
        return <InputDate sx={sx} {...props} />;
      case "checkbox":
        return <CheckboxBase {...props} />;
      case "select":
        return <SelectBase list={list} sx={sx} {...props} />;
      case "button":
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
    <Stack direction="row" spacing={8} alignItems="center" flexWrap="wrap" sx={{ mb: 5 }}>
      <Typography width={130} variant="h3">
        {label}
      </Typography>
      <Component width={width} />
    </Stack>
  );
};
