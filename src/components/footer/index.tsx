import * as React from "react";
// Components
import { Box, Typography } from "@mui/material";

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <Box sx={{ bgcolor: "common.black" }} py={3}>
      <Typography variant="small" color="white" align="center">
        © {new Date().getFullYear()} PointPro. 版權所有。保留一切權利。
      </Typography>
    </Box>
  );
};

export default Footer;
