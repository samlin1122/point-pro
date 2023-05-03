import * as React from "react";
// Components
import { Box, Container, Grid, Typography, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <Box sx={{ bgcolor: "common.black", }} py={3}>
      <Typography variant="small" color="white" align="center">
        © {new Date().getFullYear()} PointPro. 版權所有。保留一切權利。.
      </Typography>
    </Box>
  );
};

export default Footer;
