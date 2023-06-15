// Lib
import { SyntheticEvent } from "react";
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
import { CartItem } from "~/features/orders/type";

type PaymentDrawerProps = {
  open: boolean;
  totalPrice: number;
  item: CartItem[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const PaymentDrawer = (props: PaymentDrawerProps) => {
  const { open, item, totalPrice, setOpen } = props;

  const CashPaymentForm = ({ onSubmit }: { onSubmit: (id: string) => void }) => {
    const handleSubmit = (e: SyntheticEvent) => {
      e.preventDefault();
    };
    return (
      <FormControl onSubmit={handleSubmit} fullWidth>
        <FormControl fullWidth sx={{ marginBottom: "1.5rem" }}>
          <Typography component="label" variant="body1" htmlFor="cash" fontWeight={700} mb={1.5}>
            結帳
          </Typography>
          <Input
            id="cash"
            sx={{ width: "100%", backgroundColor: "common.black_20", padding: "0.75rem 1rem" }}
            placeholder="請輸入現場收取的現金"
          />
        </FormControl>
        <Row justifyContent={"space-between"}>
          <Typography component="h3" variant="body1" fontWeight={700}>
            找錢
          </Typography>
          <Typography component="h3" variant="h6" fontWeight={900}>
            $---
          </Typography>
        </Row>
      </FormControl>
    );
  };

  const handleCompleteOrder = (id: string) => {
    setOpen(false);
  };

  const handleCloseDrawer = () => {
    setOpen(false);
  };

  const paymentBtn = () => [
    {
      label: "結帳",
      onClick: handleCompleteOrder
    }
  ];

  const CreditCardPaymentForm = ({ onSubmit }: { onSubmit: (id: string) => void }) => {
    const handleSubmit = (e: SyntheticEvent) => {
      e.preventDefault();
    };
    return (
      <FormControl fullWidth onSubmit={handleSubmit}>
        <Button variant="contained" color="inherit" sx={{ width: "100%", padding: "0.75rem 1.5rem" }}>
          結帳
        </Button>
      </FormControl>
    );
  };

  const LinePaymentForm = ({ onSubmit }: { onSubmit: (id: string) => void }) => {
    const handleSubmit = (e: SyntheticEvent) => {
      e.preventDefault();
    };
    return (
      <FormControl fullWidth onSubmit={handleSubmit}>
        <Button variant="contained" color="inherit" sx={{ width: "100%", padding: "0.75rem 1.5rem" }}>
          結帳
        </Button>
      </FormControl>
    );
  };

  const paymentFunction = [
    {
      label: "現金結帳",
      icon: <MoneyIcon />,
      content: <CashPaymentForm onSubmit={handleCompleteOrder} />
    },
    {
      label: "信用卡結帳",
      icon: <CreditCardIcon />,
      content: <CreditCardPaymentForm onSubmit={handleCompleteOrder} />
    },
    {
      label: "Line Pay",
      icon: <LinePayIcon width="2.5rem" />,
      content: <LinePaymentForm onSubmit={handleCompleteOrder} />
    }
  ];

  const paymentButton = (
    <Button
      variant="contained"
      color="inherit"
      sx={{
        width: "100%",
        padding: "0.75rem 1.5rem",
        backgroundColor: "common.black_20",
        color: "common.black_40"
      }}
      onClick={() => setOpen(true)}
    >
      結帳
    </Button>
  );

  return (
    <DrawerBase title="結帳" open={open} onClose={handleCloseDrawer} buttonList={paymentBtn()}>
      <Column p={3}>
        <Row justifyContent="space-between">
          <Typography variant="body1" fontWeight={700}>
            類型
          </Typography>
          <Typography variant="h5" fontWeight={900}>
            外帶
          </Typography>
        </Row>
      </Column>
      <Divider />
      <Column p={3}>
        {paymentFunction.map((payment, idx) => (
          <Accordion
            key={payment.label}
            square
            sx={{
              width: "100%",
              boxShadow: 0,
              outline: `1px solid ${theme.palette.common.black_40}`
            }}
          >
            <AccordionSummary
              sx={{
                color: "common.black",
                "&.Mui-expanded": {
                  backgroundColor: theme.palette.common.black,
                  color: "white",
                  fill: "white"
                },
                "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
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
            <AccordionDetails sx={{ padding: "2.25rem 1.5rem" }}>{payment.content}</AccordionDetails>
          </Accordion>
        ))}
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
  );
};

export default PaymentDrawer;
