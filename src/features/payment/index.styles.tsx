// Libs
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Typography } from "@mui/material";
// Components

// Others
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { confirmLinePay } from "~/app/slices/payment";
import { Column, Row } from "~/components/layout";
import { LinePayConfirmPayload } from "~/types/api";
import theme from "~/theme";
import { MealDetail, OrderMeal } from "~/types";

export const LinePayPaymentReturn = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const linePayConfirmResponse = useAppSelector(({ payment }) => payment.linePayConfirmResponse);

  const transactionId = searchParams.get("transactionId");
  const orderId = searchParams.get("orderId");

  const navigate = useNavigate();

  const handleReturnMeal = () => {
    navigate("/admin/orders");
  };

  useEffect(() => {
    const handleConfirmLinePay = async () => {
      if (transactionId && orderId) {
        await dispatch(confirmLinePay({ transactionId, orderId }));
      }
    };
    handleConfirmLinePay();
  }, []);

  return (
    <Column justifyContent={"space-between"} p={3} sx={{ height: "100%", minHeight: "90vh" }}>
      <Typography variant="h1" textAlign={"center"} fontWeight={900} marginBottom={1}>
        完成付款
      </Typography>
      {linePayConfirmResponse.message === "success" ? <LinePayPaymentReturnData /> : null}
      <Button variant="contained" color="primary" onClick={handleReturnMeal}>
        返回繼續點餐
      </Button>
    </Column>
  );
};

const LinePayPaymentReturnData = () => {
  const linePayConfirmResponse = useAppSelector(({ payment }) => payment.linePayConfirmResponse);
  const [result, setResult] = useState<LinePayConfirmPayload>();
  useEffect(() => {
    if (linePayConfirmResponse.result.paymentLog.status === "SUCCESS") {
      setResult(linePayConfirmResponse.result);
      console.log(linePayConfirmResponse.result);
    }
  }, [linePayConfirmResponse]);
  if (!result) {
    return (
      <Column>
        <Typography variant="h2" textAlign={"center"}>
          確認付款 資料讀取中...
        </Typography>
      </Column>
    );
  }
  return (
    <>
      <Column marginBottom={5}>
        {result &&
          result.paymentLog.order.orderMeals.map((orderMeal: OrderMeal) => (
            <Column
              key={orderMeal.id}
              bgcolor={"white"}
              p={3}
              borderBottom={`1px solid ${theme.palette.common.black_20}`}
            >
              <Row justifyContent={"flex-start"} gap={2}>
                <Row gap={2}>
                  <img
                    src={orderMeal.meal?.coverUrl as string}
                    alt={orderMeal.mealTitle}
                    style={{
                      maxHeight: "6rem",
                      maxWidth: "6rem",
                      objectFit: "cover"
                    }}
                  />
                  <Column alignItems={"flex-start"} gap={1}>
                    <Typography variant="h3" fontWeight={700}>
                      {orderMeal.mealTitle}
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      ${orderMeal.meal?.price}
                    </Typography>
                  </Column>
                </Row>
                <Column>
                  {JSON.parse(orderMeal?.mealDetails as string).map((mealDetail: MealDetail) => (
                    <Row key={mealDetail.id} gap={2}>
                      <Typography variant="h4" fontWeight={700}>
                        {mealDetail.title}
                      </Typography>
                      <Row>
                        {mealDetail.items.map((item) => (
                          <Typography key={item.id} variant="h4" fontWeight={400}>
                            {item.title}
                          </Typography>
                        ))}
                      </Row>
                    </Row>
                  ))}
                </Column>
                <Typography variant="h4" textAlign={"center"} fontWeight={700} marginLeft={"auto"}>
                  x {orderMeal.amount}
                </Typography>
              </Row>
              <Row justifyContent={"flex-end"} gap={2}>
                <Typography variant="h4" textAlign={"center"} fontWeight={700}>
                  小計
                </Typography>
                <Typography variant="h4" textAlign={"center"} fontWeight={700}>
                  ${orderMeal.price}
                </Typography>
              </Row>
            </Column>
          ))}
      </Column>
      {result && result.result?.packages && (
        <Row justifyContent={"space-between"} marginBottom={2} bgcolor={"white"} p={3}>
          <Row justifyContent={"flex-start"} alignItems={"center"} gap={1}>
            <Typography variant="h3" textAlign={"center"} fontWeight={400} color={"common.black_60"}>
              付款方式
            </Typography>
            <Typography variant="h4" textAlign={"center"} fontWeight={700}>
              {result?.paymentLog.gateway === "LINE_PAY" ? "LINE Pay" : null}
            </Typography>
          </Row>
          <Typography variant="h4" textAlign={"center"} fontWeight={900}>
            ${result.result?.packages.reduce((total, packageItem) => total + packageItem.amount, 0)}
          </Typography>
        </Row>
      )}
    </>
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
