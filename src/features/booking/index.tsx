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
import { getPeriods } from "./slice";
import { NameSpace, useSocket } from "~/hooks/useSocket";

const stepTitle = ["人數及時間", "訂位人資訊", "請確認輸入資訊"];

const Booking = () => {
  const dispatch = useAppDispatch();

  useSocket({ ns: NameSpace.main });

  const step = useAppSelector(({ customerReservation }) => customerReservation.step);

  useEffect(() => {
    dispatch(getPeriods());
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

      {/* 預訂查詢 */}
      <BookingRecordQueryModal />
      {/* 隱私權政策 */}
      <PrivacyPolicyModal />
      {/* 已為您安排訂位 */}
      <BookingReminderModal />
      {/* 請出示此畫面 QR Code */}
      <BookingQRCodeModal />
    </>
  );
};

export default Booking;
