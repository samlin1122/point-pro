// Libs
import { useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import MoneyIcon from "@mui/icons-material/Money";
import CreditCardIcon from "@mui/icons-material/CreditCard";
// Components
import ModalBase from "./modal-base";
// Others
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { closeModal, deleteCartItem, openModal } from "~/features/orders/slice";
import linePay from "~/assets/images/line-pay.png";
import { MobileModal } from "~/types/common";
import { requestEcPay, requestLinePay } from "~/app/slices/payment";

interface IMobileModalLayout {
  children: React.ReactNode;
  open: boolean;
}

const { host } = location;

const MobileModalLayout = (props: IMobileModalLayout) => {
  const { children, open } = props;

  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(closeModal());
  };

  return (
    <ModalBase open={open} onClose={handleClose}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          width: "80%",
          bgcolor: "common.white",
          textAlign: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "1rem"
        }}
      >
        {children}
      </Box>
    </ModalBase>
  );
};

const ConfirmRemoveCartItem = () => {
  const dispatch = useAppDispatch();

  const currentModal = useAppSelector(({ takeOrder }) => takeOrder.currentModal);
  const data = useAppSelector(({ takeOrder }) => takeOrder.modalData);

  const handleConfirm = () => {
    dispatch(deleteCartItem(data.idx));
    dispatch(closeModal());
  };

  return (
    <MobileModalLayout open={currentModal === MobileModal.REMOVE_CART_CONFIRM}>
      <>
        <Typography variant="h6" fontWeight={900}>
          從購物車中移除？
        </Typography>
        <Button
          onClick={handleConfirm}
          sx={{
            color: "common.black",
            bgcolor: "primary.main",
            width: "100%"
          }}
        >
          確定
        </Button>
      </>
    </MobileModalLayout>
  );
};

const Payment = () => {
  const dispatch = useAppDispatch();

  const currentModal = useAppSelector(({ takeOrder }) => takeOrder.currentModal);
  const orders = useAppSelector(({ order }) => order.orders);
  const linePayResponse = useAppSelector(({ payment }) => payment.linePayResponse);

  const handlePaymentByCash = () => {
    dispatch(
      openModal({
        type: MobileModal.COUNTER_REMINDER
      })
    );
  };

  const handlePaymentByCard = async () => {
    // [TODO]: jump to NewebPay
    const orderIds = orders.filter((order) => order.status === "UNPAID").map((order) => order.id);
    await dispatch(
      requestEcPay({
        orderId: orderIds,
        confirmUrl: import.meta.env.DEV
          ? `http://${host}/payment/confirm?from=ecPay&`
          : `https://${host}/payment/confirm?from=ecPay&`
      })
    );
  };

  const handlePaymentByLinePay = async () => {
    // [TODO]: jump to LINEPay
    const orderIds = orders.filter((order) => order.status === "UNPAID").map((order) => order.id);
    await dispatch(
      requestLinePay({
        orderId: orderIds,
        confirmUrl: import.meta.env.DEV
          ? `http://${host}/payment/confirm?from=linePay&`
          : `https://${host}/payment/confirm?from=linePay&`,
        cancelUrl: import.meta.env.DEV ? `http://${host}/payment/cancel` : `https://${host}/payment/cancel`
      })
    );
  };

  useEffect(() => {
    if (linePayResponse && linePayResponse.result.body && linePayResponse.result.body.returnCode === "0000") {
      window.location.href = linePayResponse.result.body.info.paymentUrl.web;
    }
  }, [linePayResponse]);

  return (
    <MobileModalLayout open={currentModal === MobileModal.PAYMENT}>
      <>
        <Typography variant="h6" fontWeight={900}>
          請選擇付款方式
        </Typography>
        <Button
          onClick={handlePaymentByCash}
          startIcon={<MoneyIcon />}
          sx={{
            color: "common.black",
            bgcolor: "primary.main",
            width: "100%"
          }}
        >
          現金付款
        </Button>
        <Button
          onClick={handlePaymentByCard}
          startIcon={<CreditCardIcon />}
          sx={{
            color: "common.black",
            bgcolor: "primary.main",
            width: "100%"
          }}
        >
          信用卡
        </Button>
        <Button
          onClick={handlePaymentByLinePay}
          sx={{
            color: "common.black",
            bgcolor: "primary.main",
            width: "100%"
          }}
        >
          <img src={linePay} alt="LINE Pay" style={{ height: "1.8rem" }} />
        </Button>
      </>
    </MobileModalLayout>
  );
};

const CounterReminder = () => {
  const currentModal = useAppSelector(({ takeOrder }) => takeOrder.currentModal);

  return (
    <MobileModalLayout open={currentModal === MobileModal.COUNTER_REMINDER}>
      <Typography variant="h6" fontWeight={700}>
        請至臨櫃結帳
      </Typography>
    </MobileModalLayout>
  );
};

const CartItemIsOffReminder = () => {
  const currentModal = useAppSelector(({ takeOrder }) => takeOrder.currentModal);
  const data = useAppSelector(({ takeOrder }) => takeOrder.modalData);

  return (
    <MobileModalLayout open={currentModal === MobileModal.CART_ITEM_IS_OFF}>
      <Typography variant="h6" fontWeight={700}>
        「{data.title}」已被下架
      </Typography>
    </MobileModalLayout>
  );
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

export default {
  ConfirmRemoveCartItem,
  Payment,
  CounterReminder,
  CartItemIsOffReminder,
  EcPayForm
};
