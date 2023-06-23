// Lib
import { ChangeEvent, useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  FormControl,
  Input,
  Typography
} from "@mui/material";
import MoneyIcon from "@mui/icons-material/Money";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// Components
import { Column, Row } from "~/components/layout";
import { DrawerBase } from "~/components/drawer";
// Others
import { ReactComponent as LinePayIcon } from "~/assets/line-pay-solid.svg";
import theme from "~/theme";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { requestLinePay, requestEcPay, requestCashPayment, closePaymentDrawer } from "~/app/slices/payment";
import { OrderType } from "~/types/common";
import { getOrders } from "~/app/slices/order";
import { calculateParentOrderPrice } from "~/utils/price.utils";
import { CashPaymentDialog } from "./index.style";

const { host } = location;

const PaymentDrawer = () => {
  const dispatch = useAppDispatch();

  const status = useAppSelector(({ order }) => order.status);
  const linePayResponse = useAppSelector(({ payment }) => payment.linePayResponse);
  const paymentItem = useAppSelector(({ payment }) => payment.paymentItem);
  const { id, type, status: orderStatus } = paymentItem ?? {};
  const isOpenPaymentDrawer = useAppSelector(({ payment }) => payment.isOpenPaymentDrawer);
  const cashPaymentResponse = useAppSelector(({ payment }) => payment.cashPaymentResponse);

  const [canPay, setCanPay] = useState<boolean>(false);

  const [selectPayment, setSelectPayment] = useState<string>("");
  const [cash, setCash] = useState(0);

  const totalPrice = paymentItem ? calculateParentOrderPrice(paymentItem) : 0;

  const handleCompleteOrder = async () => {
    if (orderStatus === "UNPAID") {
      await handlePaymentRequest();
    }
    dispatch(getOrders({ status }));
    dispatch(closePaymentDrawer());
  };

  const handleCloseDrawer = () => {
    dispatch(closePaymentDrawer());
  };

  const handleRestPayment = () => {
    setSelectPayment("");
    setCash(0);
    setCanPay(false);
  };

  const paymentBtn = () => [
    {
      label: "結帳",
      onClick: () => handleCompleteOrder(),
      isEnabled: selectPayment === "line-pay" || selectPayment === "ec-pay" || canPay
    }
  ];

  useEffect(() => {
    if (linePayResponse) {
      if (linePayResponse?.result.returnCode === "0000") {
        console.log(linePayResponse.result.info);
        window.location.href = linePayResponse.result.info.paymentUrl.web;
      }
    }
  }, [linePayResponse]);

  const handlePaymentRequest = async () => {
    if (!paymentItem) return;
    const id = paymentItem.orders.map((order) => order.id);
    if (selectPayment === "line-pay") {
      await dispatch(
        requestLinePay({
          orderId: id,
          confirmUrl: import.meta.env.DEV ? `http://${host}/payment/confirm` : `https://${host}/payment/confirm`,
          cancelUrl: import.meta.env.DEV ? `http://${host}/payment/cancel` : `https://${host}/payment/cancel`
        })
      );
    }
    if (selectPayment === "ec-pay") {
      await dispatch(
        requestEcPay({
          orderId: id,
          confirmUrl: import.meta.env.DEV ? `http://${host}/payment/confirm` : `https://${host}/payment/confirm`
        })
      );
    }
    if (selectPayment === "cash") {
      if (cash >= totalPrice) {
        await dispatch(requestCashPayment(id));
        handleRestPayment();
      }
    }
  };

  const EcPayForm = () => {
    const ecPayResponse = useAppSelector(({ payment }) => payment.ecPayResponse);

    useEffect(() => {
      if (ecPayResponse && ecPayResponse.result) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(ecPayResponse.result, "text/html");
        const form = doc.querySelector("form");
        if (form) {
          document.body.appendChild(form);
          form.submit();
        }
      }
    }, [ecPayResponse]);

    if (!ecPayResponse || !ecPayResponse.result) {
      return null;
    }

    return null;
  };

  const CashPaymentForm = () => {
    const handleCountCash = (e: ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value.replace(/^0+(?!$)/, ""));
      setCash(value);
      if (Number(value) >= totalPrice) {
        setCanPay(true);
      } else {
        setCanPay(false);
      }
    };
    return (
      <FormControl fullWidth>
        <FormControl fullWidth sx={{ marginBottom: "1.5rem" }}>
          <Typography component="label" variant="body1" htmlFor="cash" fontWeight={700} mb={1.5}>
            結帳
          </Typography>
          <Input
            id="cash"
            sx={{ width: "100%", backgroundColor: "common.black_20", padding: "0.75rem 1rem" }}
            placeholder="請輸入現場收取的現金"
            type="number"
            value={cash}
            onChange={handleCountCash}
          />
        </FormControl>
        <Row justifyContent={"space-between"}>
          <Typography component="h3" variant="body1" fontWeight={700}>
            找錢
          </Typography>
          <Typography component="h3" variant="h6" fontWeight={900}>
            ${cash - totalPrice > 0 ? cash - totalPrice : 0}
          </Typography>
        </Row>
      </FormControl>
    );
  };

  const paymentFunction = [
    {
      label: "現金結帳",
      icon: <MoneyIcon />,
      content: CashPaymentForm,
      target: "cash"
    },
    {
      label: "信用卡結帳",
      type: "button",
      icon: <CreditCardIcon />,
      target: "ec-pay"
    },
    {
      label: "Line Pay",
      type: "button",
      icon: <LinePayIcon width="2.5rem" />,
      target: "line-pay"
    }
  ];

  return (
    <>
      <DrawerBase title="結帳" open={isOpenPaymentDrawer} onClose={handleCloseDrawer} buttonList={paymentBtn()}>
        <Column p={3}>
          <Row justifyContent="space-between">
            <Typography variant="body1" fontWeight={700}>
              類型
            </Typography>
            <Typography variant="h5" fontWeight={900}>
              {type === OrderType.DineIn ? "內用" : "外帶"}
            </Typography>
          </Row>
        </Column>
        <Divider />
        <Column p={3}>
          {paymentFunction.map((payment, idx) =>
            payment.type === "button" ? (
              <Button
                key={payment.label}
                variant="contained"
                fullWidth
                sx={{
                  outline: `1px solid ${theme.palette.common.black_40}`,
                  backgroundColor: selectPayment === payment.target ? "common.black" : "transparent",
                  color: selectPayment === payment.target ? "white" : "common.black",
                  fill: selectPayment === payment.target ? "white" : "common.black",
                  borderRadius: 0,
                  boxShadow: 0,
                  "&:hover": {
                    backgroundColor: "common.black_60",
                    color: "white",
                    fill: "white",
                    boxShadow: 0
                  }
                }}
                onClick={() => setSelectPayment(payment.target)}
              >
                <Row justifyContent={"flex-start"} gap={3} width={"100%"} p={1}>
                  {payment.icon}
                  <Typography component="h3" variant="h6" fontWeight={900}>
                    {payment.label}
                  </Typography>
                </Row>
              </Button>
            ) : (
              payment.type !== "button" && (
                <Accordion
                  key={payment.label}
                  square
                  onClick={() => setSelectPayment(payment.target)}
                  expanded={selectPayment === payment.target}
                  sx={{
                    width: "100%",
                    boxShadow: 0,
                    outline: `1px solid ${theme.palette.common.black_40}`
                  }}
                >
                  <AccordionSummary
                    sx={{
                      color: selectPayment === payment.target ? "white" : "common.black",
                      fill: selectPayment === payment.target ? "white" : "common.black",
                      backgroundColor: selectPayment === payment.target ? "common.black" : "transparent",
                      "&.Mui-expanded": {
                        backgroundColor: selectPayment === payment.target ? "common.black" : "transparent",
                        color: selectPayment === payment.target ? "white" : "common.black",
                        fill: selectPayment === payment.target ? "white" : "common.black"
                      },
                      "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                        color: "white"
                      },
                      "&:hover": {
                        backgroundColor: "common.black_60",
                        color: "white"
                      }
                    }}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Row justifyContent={"flex-start"} gap={3} width={"100%"}>
                      <Box>{payment.icon}</Box>
                      <Typography component="h3" variant="h6" fontWeight={900}>
                        {payment.label}
                      </Typography>
                    </Row>
                  </AccordionSummary>
                  {payment.content ? (
                    <AccordionDetails sx={{ padding: "2.25rem 1.5rem" }}>{payment.content()}</AccordionDetails>
                  ) : null}
                </Accordion>
              )
            )
          )}
        </Column>
        <Row
          mt={"auto"}
          justifyContent={"space-between"}
          p={3}
          sx={{ borderTop: `1px dashed ${theme.palette.common.black_40}` }}
        >
          <Typography component="h4" variant="body1" fontWeight={700}>
            總金額
          </Typography>
          <Typography component="h4" variant="h6" fontWeight={900}>
            {totalPrice}
          </Typography>
        </Row>
      </DrawerBase>
      <EcPayForm />
      {cashPaymentResponse && cashPaymentResponse.result.paymentLogs && (
        <CashPaymentDialog result={cashPaymentResponse.result} />
      )}
    </>
  );
};

export default PaymentDrawer;
