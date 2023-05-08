// Libs
import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
// Components
import { Header } from "../orders/index.styles";
import {
  BookingQRCodeModal,
  BookingRecordQueryModal,
  BookingReminderModal,
  BookingStep,
  PrivacyPolicyModal,
  bookingSteps
} from "./index.styles";
// Others
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { getAvailableBooking } from "./slice";

const Booking = () => {
  const dispatch = useAppDispatch();

  const step = useAppSelector(({ customerBooking }) => customerBooking.step);

  useEffect(() => {
    dispatch(getAvailableBooking());
  }, []);

  return (
    <>
      <Header />
      <Typography variant="h4" fontWeight={900} sx={{ marginBottom: "1rem" }}>
        {bookingSteps[step].title}
      </Typography>

      <Box component="main">{bookingSteps[step].page()}</Box>

      <BookingStep />

      <BookingRecordQueryModal />
      <PrivacyPolicyModal />
      <BookingReminderModal />
      <BookingQRCodeModal />
    </>
  );
};

export default Booking;
