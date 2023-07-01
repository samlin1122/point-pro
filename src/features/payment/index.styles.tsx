// Libs
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Button, List, ListItem, Typography } from "@mui/material";
// Components

// Others
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { confirmEcPay, confirmLinePay } from "~/app/slices/payment";
import { Column, Row } from "~/components/layout";
import { EcPayConfirmPayload, LinePayConfirmPayload, MealDetails } from "~/types/api";
import { useDeviceType } from "~/features/home/slice";
import theme from "~/theme";
import { OrderMeal } from "~/types";
import { getUserInfo } from "~/app/slices/auth";
import { getToken } from "~/utils/token.utils";
import { patchReservationById } from "~/app/slices/reservation";
import appDayjs from "~/utils/dayjs.util";

export const PaymentReturnContainer = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const linePayConfirmResponse = useAppSelector(({ payment }) => payment.linePayConfirmResponse);
  const ecPayConfirmResponse = useAppSelector(({ payment }) => payment.ecPayConfirmResponse);
  const userRole = useAppSelector(({ auth }) => auth.userRole);

  const transactionId = searchParams.get("transactionId");
  const orderId = searchParams.get("orderId");
  const from = searchParams.get("from");

  const navigate = useNavigate();

  const handleReturnMeal = () => {
    const token = getToken();
    userRole?.role === "USER" ? navigate(`/orders?token=${token}`) : navigate("/admin/orders");
  };

  useEffect(() => {
    const handleConfirmLinePay = async () => {
      if (transactionId && orderId) {
        await dispatch(confirmLinePay({ transactionId, orderId }));
      }
    };
    const handleConfirmEcPay = async () => {
      if (transactionId && orderId) {
        await dispatch(confirmEcPay({ transactionId, orderId }));
      }
    };
    const handleGetUserInfo = async () => {
      await dispatch(getUserInfo());
    };
    handleGetUserInfo();
    from === "linePay" && handleConfirmLinePay();
    from === "ecPay" && handleConfirmEcPay();
  }, []);

  useEffect(() => {
    if (linePayConfirmResponse.message === "訂單已付款" || ecPayConfirmResponse.message === "訂單已付款") {
      handleReturnMeal();
    }
  }, [linePayConfirmResponse, ecPayConfirmResponse]);

  return (
    <Column justifyContent={"space-between"} p={3} sx={{ height: "100%", minHeight: "90vh", userSelect: "none" }}>
      <Typography variant="h1" textAlign={"center"} fontWeight={900} marginBottom={1}>
        完成付款
      </Typography>
      {linePayConfirmResponse.message === "success" ||
        (ecPayConfirmResponse.message === "success" && (
          <PaymentReturnData
            message={linePayConfirmResponse.message || ecPayConfirmResponse.message}
            result={from === "linePay" ? linePayConfirmResponse.result : ecPayConfirmResponse.result}
          />
        ))}

      <Button variant="contained" color="primary" onClick={handleReturnMeal}>
        {userRole?.role === "USER" ? "返回繼續點餐" : "返回訂單頁面"}
      </Button>
    </Column>
  );
};

const PaymentReturnData = (props: { message: string; result: LinePayConfirmPayload | EcPayConfirmPayload }) => {
  const { result, message } = props;
  const deviceType = useDeviceType();
  const dispatch = useAppDispatch();

  if (message !== "success") {
    return (
      <Column>
        <Typography variant="h2" textAlign={"center"}>
          確認付款 資料讀取中...
        </Typography>
      </Column>
    );
  }
  useEffect(() => {
    if (message === "success") {
      const reservationId = result?.paymentLogs[0]?.parentOrder?.reservationLogId;
      reservationId &&
        dispatch(
          patchReservationById({
            reservationId,
            payload: { endOfMeal: appDayjs().toDate() }
          })
        );
    }
  }, [result]);
  return (
    <>
      <Column marginBottom={5}>
        {result &&
          result.paymentLogs.map((paymentLog) =>
            paymentLog.order.orderMeals.map((orderMeal: OrderMeal) => (
              <Column
                key={orderMeal.id}
                bgcolor={"white"}
                borderBottom={`1px solid ${theme.palette.common.black_20}`}
                p={3}
              >
                <Column justifyContent={"flex-start"} gap={2} marginBottom={2}>
                  <Row justifyContent={"space-between"} flexWrap={deviceType === "mobile" ? "wrap" : "nowrap"} gap={2}>
                    <Box
                      sx={{ aspectRatio: deviceType === "mobile" ? "2/1" : "1/1" }}
                      maxHeight={deviceType === "tablet" ? "6rem" : "100%"}
                      maxWidth={deviceType === "tablet" ? "6rem" : "100%"}
                    >
                      <img
                        src={orderMeal.meal?.coverUrl as string}
                        alt={orderMeal.mealTitle}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                      />
                    </Box>
                    <Row gap={2} justifyContent={"space-between"} width={"100%"}>
                      <Column alignItems={"flex-start"} gap={1}>
                        <Typography
                          variant="h3"
                          fontWeight={700}
                          fontSize={deviceType === "tablet" ? "2rem" : "1.25rem"}
                        >
                          {orderMeal.mealTitle}
                        </Typography>
                        <Typography
                          variant="h4"
                          fontWeight={700}
                          fontSize={deviceType === "tablet" ? "2rem" : "1.25rem"}
                        >
                          ${orderMeal.meal?.price}
                        </Typography>
                      </Column>
                      <Typography
                        variant="h4"
                        textAlign={"center"}
                        fontWeight={700}
                        marginLeft={"auto"}
                        whiteSpace={"nowrap"}
                        fontSize={deviceType === "tablet" ? "2rem" : "1.25rem"}
                      >
                        x {orderMeal.amount}
                      </Typography>
                    </Row>
                  </Row>
                  <List sx={{ margin: 0, padding: 0 }}>
                    {JSON.parse(orderMeal.mealDetails as string).map((mealDetail: MealDetails) => (
                      <ListItem
                        key={mealDetail.id}
                        sx={{
                          justifyContent: "flex-start",
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
                </Column>
                <Row justifyContent={"flex-end"} gap={2}>
                  <Typography
                    variant="h4"
                    textAlign={"center"}
                    fontWeight={700}
                    fontSize={deviceType === "tablet" ? "2rem" : "1.5rem"}
                  >
                    小計
                  </Typography>
                  <Typography
                    variant="h4"
                    textAlign={"center"}
                    fontWeight={700}
                    fontSize={deviceType === "tablet" ? "1.5rem" : "1.25rem"}
                  >
                    ${orderMeal.price}
                  </Typography>
                </Row>
              </Column>
            ))
          )}
      </Column>
      {result && (
        <Row justifyContent={"space-between"} marginBottom={2} bgcolor={"white"} p={3}>
          <Row
            justifyContent={"flex-start"}
            alignItems={"center"}
            flexWrap={deviceType === "tablet" ? "nowrap" : "wrap"}
            gap={1}
          >
            <Typography
              variant="h3"
              textAlign={"center"}
              fontWeight={400}
              color={"common.black_60"}
              fontSize={deviceType === "tablet" ? "2rem" : "1.5rem"}
            >
              付款方式
            </Typography>
            <Typography
              variant="h4"
              textAlign={"center"}
              fontWeight={700}
              fontSize={deviceType === "tablet" ? "2rem" : "1.5rem"}
            >
              {result.paymentLogs[0].gateway === "LINE_PAY" ? "LINE Pay" : "EC Pay"}
            </Typography>
          </Row>
          <Typography
            variant="h4"
            textAlign={"center"}
            fontWeight={900}
            fontSize={deviceType === "tablet" ? "2rem" : "1.5rem"}
          >
            ${result.paymentLogs.reduce((total, paymentLog) => total + paymentLog.price, 0)}
          </Typography>
        </Row>
      )}
    </>
  );
};

export const PaymentCancel = () => {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const userRole = useAppSelector(({ auth }) => auth.userRole);

  const handleReturnMeal = () => {
    const token = getToken();
    userRole?.role === "USER" ? navigate(`/orders?token=${token}`) : navigate("/admin/orders");
  };
  return (
    <Column justifyContent={"space-between"} p={3} sx={{ height: "100%", minHeight: "90vh", userSelect: "none" }}>
      <Typography variant="h1" textAlign={"center"}>
        取消付款
      </Typography>
      <Button variant="contained" color="primary" onClick={handleReturnMeal}>
        {userRole?.role === "USER" ? "返回繼續點餐" : "返回訂單頁面"}
      </Button>
    </Column>
  );
};
