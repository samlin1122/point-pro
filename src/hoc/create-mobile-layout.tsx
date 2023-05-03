// Libs
import { Box } from "@mui/material";
import React from "react";

type Props = {};

const withMobileLayout =
  <T extends Props>(WrappedComponent: React.ComponentType<T>) =>
  (props: T) => {
    return (
      <Box
        sx={{
          width: "100vw",
          maxWidth: "768px",
          minHeight: "100vh",
          padding: ".5rem",
          bgcolor: "background.paper",
          margin: "auto"
        }}
      >
        <WrappedComponent {...props} />
      </Box>
    );
  };

export default withMobileLayout;
