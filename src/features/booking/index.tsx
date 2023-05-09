// Libs
import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
// Components
import { Header } from "../orders/index.styles";
import {
  BookerInfo,
  BookingQRCodeModal,
  BookingRecordQueryModal,
  BookingReminderModal,
  BookingStep,
  ConfirmBookingInfo,
  PeopleAndTime,
  PrivacyPolicyModal
} from "./index.styles";
// Others
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { getAvailableBooking } from "./slice";

const stepTitle = ["人數及時間", "訂位人資訊", "請確認輸入資訊"];

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
        {stepTitle[step]}
      </Typography>

      <Box component="main">
        {step === 0 && <PeopleAndTime />}
        {step === 1 && <BookerInfo />}
        {step === 2 && <ConfirmBookingInfo />}
      </Box>

      <BookingStep stepLength={stepTitle.length} />

      <BookingRecordQueryModal />
      <PrivacyPolicyModal />
      <BookingReminderModal />
      <BookingQRCodeModal />
    </>
  );
};

export default Booking;
