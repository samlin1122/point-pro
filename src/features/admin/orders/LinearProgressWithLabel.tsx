import { Typography, Box } from "@mui/material";
import { styled, LinearProgressProps, LinearProgress, linearProgressClasses } from "@mui/material";
import theme from "~/theme";

const LinearProgressWithLabel = (props: LinearProgressProps & { value: number }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress
          variant="determinate"
          value={props.value}
          sx={{
            height: "0.6875rem",
            borderRadius: "0.5rem",
            [`&.${linearProgressClasses.colorPrimary}`]: {
              backgroundColor: theme.palette.common.black_20
            },
            [`& .${linearProgressClasses.bar}`]: {
              borderRadius: "0.5rem"
            }
          }}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
};

export default LinearProgressWithLabel;
