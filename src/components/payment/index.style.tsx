// Lib
import { Fragment, useEffect, useState } from "react";
import { Box, Button, Divider, List, ListItem, Typography } from "@mui/material";
import MoneyIcon from "@mui/icons-material/Money";

// Components
import { Column, Row } from "~/components/layout";
import { MobileDialogLayout } from "../dialog";

import theme from "~/theme";
import { CashPaymentResponse, MealDetails, OrderMealWithMeal, PaymentLogsResponse } from "~/types/api";
import { useAppDispatch } from "~/app/hook";
import { clearCashPaymentResponse } from "~/app/slices/payment";
import { patchReservationById } from "~/app/slices/reservation";
import appDayjs from "~/utils/dayjs.util";

export const CashPaymentDialog = ({ result }: CashPaymentResponse) => {
  const dispatch = useAppDispatch();
  const [paymentLogs, setPaymentLogs] = useState<PaymentLogsResponse[]>([]);
  const [showMobileDialog, setShowMobileDialog] = useState(false);

  useEffect(() => {
    if (result.paymentLogs) {
      setPaymentLogs(result.paymentLogs);
      setShowMobileDialog(true);
      const reservationId = result.paymentLogs[0].order.reservationLogId;
      dispatch(
        patchReservationById({
          reservationId,
          payload: { endOfMeal: appDayjs().toDate() }
        })
      );
    }
  }, [result]);

  const handleCloseCashPayment = () => {
    setShowMobileDialog(false);
    setPaymentLogs([]);
    dispatch(clearCashPaymentResponse());
  };
  return (
    <MobileDialogLayout
      isOpen={showMobileDialog}
      onCloseDialog={handleCloseCashPayment}
      title="現金付款"
      actionButton={
        <Button variant="contained" color="primary" onClick={handleCloseCashPayment}>
          關閉
        </Button>
      }
      dialogContentProps={{
        sx: {
          p: 2
        }
      }}
    >
      <Column justifyContent={"space-between"} gap={2} height={"100%"} sx={{ userSelect: "none" }}>
        <Box borderBottom={`1px solid ${theme.palette.common.black_40}`}>
          <Typography
            variant="h2"
            fontWeight={700}
            paddingBottom={2}
            marginBottom={2}
            borderBottom={`1px solid ${theme.palette.common.black_40}`}
          >
            付款完成
          </Typography>
          {paymentLogs &&
            paymentLogs.map((paymentLog: PaymentLogsResponse) => (
              <Column
                key={paymentLog.paymentNo}
                border={"1px solid #d1d1d1"}
                borderRadius={1.5}
                marginBottom={2}
                p={2}
                gap={1}
              >
                <Row gap={1} justifyContent={"space-between"}>
                  <Typography fontSize={20}>訂單編號</Typography>
                  <Typography fontWeight={700} fontSize={24}>
                    {paymentLog.orderId.slice(-5)}
                  </Typography>
                </Row>
                <Divider />
                {paymentLog.order?.orderMeals?.map((orderMeal: OrderMealWithMeal) => (
                  <Fragment key={orderMeal.id}>
                    <Row gap={1} justifyContent={"space-between"}>
                      <Typography fontSize={20}>菜單名稱</Typography>
                      <Typography fontWeight={700} fontSize={24}>
                        {orderMeal.meal.title}
                      </Typography>
                    </Row>
                    <Row gap={1} justifyContent={"space-between"}>
                      <Typography fontSize={20}>菜單價格</Typography>
                      <Typography fontWeight={700} fontSize={24}>
                        {orderMeal.meal.price} x {orderMeal.amount}
                      </Typography>
                    </Row>
                    <List sx={{ margin: 0, padding: 0 }}>
                      {JSON.parse(orderMeal.mealDetails).map((mealDetail: MealDetails) => (
                        <ListItem
                          key={mealDetail.id}
                          sx={{
                            justifyContent: "flex-end",
                            margin: 0,
                            padding: 0,
                            color: theme.palette.text.secondary,
                            fontSize: "1rem",
                            fontWeight: 600
                          }}
                        >
                          [{mealDetail.title}]:{" "}
                          {mealDetail.items && mealDetail.items.map((item) => item.title).join("、")}
                        </ListItem>
                      ))}
                    </List>
                    <Divider />
                  </Fragment>
                ))}
                <Row justifyContent={"space-between"}>
                  <Row gap={1} justifyContent={"space-between"}>
                    <Typography fontSize={20}>付款方式</Typography>
                    <Typography fontWeight={700} fontSize={24}>
                      {paymentLog.gateway}
                    </Typography>
                  </Row>
                  <Row gap={1} justifyContent={"space-between"}>
                    <Typography fontSize={20}>付款金額</Typography>
                    <Typography fontWeight={700} fontSize={24}>
                      ${paymentLog.price}
                    </Typography>
                  </Row>
                </Row>
              </Column>
            ))}
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            結帳金額
          </Typography>
          <Row gap={2}>
            <MoneyIcon />
            <Typography variant="h6" fontWeight={900} fontSize={32}>
              ${paymentLogs && paymentLogs.reduce((acc, cur) => acc + cur.price, 0)}
            </Typography>
          </Row>
        </Box>
      </Column>
    </MobileDialogLayout>
  );
};
