// Libs
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Typography } from "@mui/material";
// Components

// Others
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { confirmLinePay } from "~/app/slices/payment";

export const PaymentReturn = () => {
  const [searchParams] = useSearchParams();
  console.log(searchParams.get("transactionId"));
  console.log(searchParams.get("orderId"));
  const dispatch = useAppDispatch();
  const linePayResponse = useAppSelector(({ payment }) => payment.linePayResponse);

  const transactionId = searchParams.get("transactionId");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (transactionId && orderId) {
      dispatch(confirmLinePay({ transactionId, orderId }));
    }
  }, [transactionId]);

  useEffect(() => {
    if (linePayResponse) {
      if (linePayResponse?.result.returnCode === "0000") {
        console.log(linePayResponse.result.info);
      }
    }
  }, [linePayResponse]);

  return (
    <div>
      <Typography variant="h1" textAlign={"center"}>
        完成付款
      </Typography>
    </div>
  );
};

export const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  return (
    <div>
      <Typography variant="h1" textAlign={"center"}>
        取消付款
      </Typography>
    </div>
  );
};
