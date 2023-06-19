// Libs
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Typography } from "@mui/material";
// Components

// Others
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { confirmLinePay } from "~/app/slices/payment";
import { Column, Row } from "~/components/layout";
import { LinePayConfirmPayload } from "~/types/api";

export const LinePayPaymentReturn = () => {
  const [searchParams] = useSearchParams();
  console.log(searchParams.get("transactionId"));
  console.log(searchParams.get("orderId"));
  const dispatch = useAppDispatch();
  const linePayConfirmResponse = useAppSelector(({ payment }) => payment.linePayConfirmResponse);
  const navigate = useNavigate();
  const transactionId = searchParams.get("transactionId");
  const orderId = searchParams.get("orderId");

  const [result, setResult] = useState<LinePayConfirmPayload>();

  useEffect(() => {
    const handleConfirmLinePay = async () => {
      if (transactionId && orderId) {
        const response = await dispatch(confirmLinePay({ transactionId, orderId }));
        console.log(response);
      }
    };
    handleConfirmLinePay();
  }, []);

  useEffect(() => {
    console.log(linePayConfirmResponse);
    if (linePayConfirmResponse) {
      setResult(linePayConfirmResponse.result);
    }
  }, [linePayConfirmResponse]);

  const handleReturnMeal = () => {
    navigate("/admin/orders");
  };

  return (
    <Column justifyContent={"space-between"} p={3} sx={{ height: "100%", minHeight: "90vh" }}>
      <Typography variant="h1" textAlign={"center"}>
        完成付款
      </Typography>
      {result && (
        <Column>
          {result.result?.packages?.map((packageItem) => (
            <Column key={packageItem.id}>
              {packageItem.products.map((product) => (
                <Row key={product.name}>
                  <img src={product.imageUrl} alt={product.name} />
                  <Column>
                    <Typography variant="h3" textAlign={"center"}>
                      {product.name}
                    </Typography>
                  </Column>
                  <Row justifyContent={"space-between"}>
                    <Column>
                      <Typography variant="h3" textAlign={"center"}>
                        {product.price}
                      </Typography>
                    </Column>
                    <Column>
                      <Typography variant="h3" textAlign={"center"}>
                        x {product.quantity}
                      </Typography>
                    </Column>
                  </Row>
                </Row>
              ))}
            </Column>
          ))}
          {result.result?.packages && (
            <Row justifyContent={"space-between"}>
              <Typography variant="h3" textAlign={"center"}>
                總金額
              </Typography>
              <Typography variant="h3" textAlign={"center"}>
                {result.result?.packages?.reduce((total, packageItem) => total + packageItem.amount, 0)}
              </Typography>
            </Row>
          )}
          <Row justifyContent={"space-between"}>
            <Typography variant="h3" textAlign={"center"}>
              付款方式
            </Typography>
            <Typography variant="h3" textAlign={"center"}>
              {result.paymentLog?.gateway === "LinePay" ? "LINE Pay" : null}
            </Typography>
          </Row>
        </Column>
      )}
      <Button variant="contained" color="primary" onClick={handleReturnMeal}>
        返回繼續點餐
      </Button>
    </Column>
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
