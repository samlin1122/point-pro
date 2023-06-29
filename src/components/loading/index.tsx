import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";

type LoadingProps = {
  open: boolean;
};
const Loading = (props: LoadingProps) => {
  const { open } = props;
  return (
    <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 1 }} open={open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;
