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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// Components
import { Column, Row } from "~/components/layout";
import { DrawerBase } from "~/components/drawer";
// Others
import { ReactComponent as LinePayIcon } from "~/assets/line-pay-solid.svg";
import theme from "~/theme";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { requestLinePay, requestCashPayment, closePaymentDrawer } from "~/app/slices/payment";
import { OrderType } from "~/types/common";
import { getOrders } from "~/app/slices/order";
import { calculateGatherOrderPrice } from "~/utils/price.utils";
import { CashPaymentDialog } from "./index.style";
import { NotificationsOrderMessage, SocketTopic } from "~/app/slices/socket";

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
  const socket = useAppSelector(({ socket }) => socket.socket);

  const [selectPayment, setSelectPayment] = useState<string>("");
  const [cash, setCash] = useState("");

  const totalPrice = paymentItem ? calculateGatherOrderPrice(paymentItem) : 0;

  const handleCompleteOrder = async () => {
    if (orderStatus === "UNPAID") {
      await handlePaymentRequest();
    }
    socket &&
      socket.emit(SocketTopic.ORDER, {
        notiType: SocketTopic.ORDER,
        message: NotificationsOrderMessage.PAY_ORDER,
        result: paymentItem?.orders[0]
      });
    dispatch(getOrders({ status }));
    dispatch(closePaymentDrawer());
  };

  const handleCloseDrawer = () => {
    dispatch(closePaymentDrawer());
  };

  const handleRestPayment = () => {
    setSelectPayment("");
    setCash("");
    setCanPay(false);
  };

  const paymentBtn = () => [
    {
      label: "結帳",
      onClick: () => handleCompleteOrder(),
      disabled: !(selectPayment === "line-pay" || selectPayment === "ec-pay" || canPay)
    }
  ];

  useEffect(() => {
    if (linePayResponse) {
      if (linePayResponse.result.body && linePayResponse.result.body.returnCode === "0000") {
        window.location.href = linePayResponse.result.body.info.paymentUrl.web;
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
          confirmUrl: import.meta.env.DEV
            ? `http://${host}/payment/confirm?from=linePay&`
            : `https://${host}/payment/confirm?from=linePay&`,
          cancelUrl: import.meta.env.DEV ? `http://${host}/payment/cancel` : `https://${host}/payment/cancel`
        })
      );
    }
    if (selectPayment === "cash") {
      if (+cash >= totalPrice) {
        await dispatch(requestCashPayment(id));
        handleRestPayment();
      }
    }
  };

  const handleClickPaymentWay = (paymentTarget: string) => {
    setSelectPayment(selectPayment === paymentTarget ? "" : paymentTarget);
  };

  const CashPaymentForm = () => {
    const handleCountCash = (e: ChangeEvent<HTMLInputElement>) => {
      setCash(e.target.value);
      if (Number(e.target.value) >= totalPrice) {
        setCanPay(true);
      } else {
        setCanPay(false);
      }
    };
    return (
      <>
        <FormControl fullWidth sx={{ marginBottom: "1rem", userSelect: "none" }}>
          <Typography component="label" variant="body1" htmlFor="cash" fontWeight={700}>
            現場收取金額
          </Typography>
          <Input
            id="cash"
            sx={{ width: "100%", backgroundColor: "common.black_20", padding: "0.75rem 1rem" }}
            type="number"
            value={cash}
            onChange={handleCountCash}
          />
        </FormControl>
        <Row justifyContent={"space-between"}>
          <Typography variant="body1" fontWeight={700}>
            {+cash - totalPrice >= 0 ? "找錢" : "不足"}
          </Typography>
          <Typography variant="h6" fontWeight={900}>
            {Math.abs(+cash - totalPrice)}元
          </Typography>
        </Row>
      </>
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
      label: "Line Pay",
      type: "button",
      icon: <LinePayIcon width="2.5rem" />,
      target: "line-pay"
    }
  ];

  return (
    <>
      <DrawerBase
        title={type === OrderType.DineIn ? "內用結帳" : "外帶結帳"}
        open={isOpenPaymentDrawer}
        onClose={handleCloseDrawer}
        buttonList={paymentBtn()}
        sx={{ userSelect: "none" }}
        width="400px"
      >
        <Column p={2}>
          <Row>
            {type === OrderType.DineIn ? (
              <>
                <Typography variant="h6">桌號：</Typography>
                <Typography variant="h6">{paymentItem?.seats.join(", ")}</Typography>
              </>
            ) : (
              <>
                <Typography variant="h6">訂單編號：</Typography>
                <Typography variant="h6">{paymentItem?.id.slice(-5)}</Typography>
              </>
            )}
          </Row>
        </Column>
        <Divider />
        <Column p={3}>
          {paymentFunction.map((payment) =>
            payment.type === "button" ? (
              <Row key={payment.label}>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: selectPayment === payment.target ? "common.black" : "common.black_60",
                    color: "white",
                    fill: "white",
                    borderRadius: 0,
                    boxShadow: 0,
                    width: "100%",
                    "&:hover": {
                      bgcolor: selectPayment === payment.target ? "common.black" : "common.black_60",
                      color: "white",
                      fill: "white"
                    }
                  }}
                  onClick={() => handleClickPaymentWay(payment.target)}
                >
                  <Row justifyContent={"flex-start"} gap={3} width={"100%"} p={1}>
                    {payment.icon}
                    <Typography component="h3" variant="h6" fontWeight={900}>
                      {payment.label}
                    </Typography>
                  </Row>
                </Button>
              </Row>
            ) : (
              payment.type !== "button" && (
                <Row key={payment.label}>
                  <Accordion
                    square
                    expanded={selectPayment === payment.target}
                    sx={{
                      width: "100%",
                      boxShadow: 0
                    }}
                  >
                    <AccordionSummary
                      sx={{
                        bgcolor: selectPayment === payment.target ? "common.black" : "common.black_60",
                        color: "white",
                        fill: "white",
                        borderBottom: "1px solid",
                        "& .MuiAccordionSummary-expandIconWrapper": {
                          color: "white"
                        },
                        "&:hover": {
                          bgcolor: selectPayment === payment.target ? "common.black" : "common.black_60"
                        }
                      }}
                      onClick={() => handleClickPaymentWay(payment.target)}
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
                      <AccordionDetails sx={{ padding: "1rem" }}>{payment.content()}</AccordionDetails>
                    ) : null}
                  </Accordion>
                </Row>
              )
            )
          )}
        </Column>
        <Row
          mt={"auto"}
          justifyContent={"space-between"}
          px={3}
          py={2}
          sx={{ borderTop: `1px dashed ${theme.palette.common.black_40}` }}
        >
          <Typography variant="h6" fontWeight={700}>
            總金額
          </Typography>
          <Typography variant="h6" fontWeight={900}>
            {totalPrice}
          </Typography>
        </Row>
      </DrawerBase>
      <CashPaymentDialog {...cashPaymentResponse} />
    </>
  );
};

export default PaymentDrawer;
