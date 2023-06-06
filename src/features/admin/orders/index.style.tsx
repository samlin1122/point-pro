import { FC, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Typography,
  List,
  ListItem,
  LinearProgress,
  LinearProgressProps,
  Box,
  linearProgressClasses
} from "@mui/material";
import { styled } from "@mui/material/styles";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { useAppDispatch, useAppSelector } from "~/app/hook";
import { Column, Row } from "~/components/layout";
import Switch from "~/components/switch";
import TabsBase, { TabPanel } from "~/components/tabs";

import theme from "~/theme";
import { Order, OrderStatus } from "~/features/orders/type";

const StyledAccordion = styled(Accordion)({
  backgroundColor: "white",
  boxShadow: "0 0 0 0",
  borderRadius: "0 !important"
});

const VerticalDivider = styled("div")(({ theme }) => ({
  height: "32px",
  width: "1px",
  background: theme.palette.common.black_20
}));

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: "0.6875rem",
  borderRadius: "0.5rem",
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.common.black_20
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: "0.5rem"
  }
}));

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <BorderLinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

interface IInnerContentProps {
  tag: string;
  title: string;
  listItems: string[];
}

interface IAccordionProps {
  uid: string;
  title: string;
  timestamp: string;
  innerContent?: IInnerContentProps[];
  orderMeals: Order["orderMeals"];
  status: OrderStatus;
  type: string;
  progress: number;
}

export const OrderAccordions: FC<IAccordionProps> = ({ uid, title, timestamp, orderMeals, status, type, progress }) => {
  const dispatch = useAppDispatch();
  const [expanded, setExpanded] = useState(false);
  const handleExpand = () => {
    setExpanded(!expanded);
  };
  const handleCancelOrder = (id: string) => {
    console.log("cancel order", id);
  };
  return (
    <Box>
      <StyledAccordion expanded={expanded} onChange={handleExpand}>
        <AccordionSummary
          sx={{
            flexDirection: "row-reverse",
            borderBottom: expanded ? `1px solid ${theme.palette.common.black_20}` : null
          }}
          expandIcon={
            expanded ? (
              <Box
                width={40}
                height={40}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative"
                }}
              >
                <RemoveIcon
                  sx={{
                    fontSize: "0.875rem",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                  }}
                />
              </Box>
            ) : (
              <Box
                width={40}
                height={40}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <AddIcon
                  sx={{
                    fontSize: "0.875rem",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                  }}
                />
              </Box>
            )
          }
        >
          <Row
            sx={{
              justifyContent: "space-between",
              padding: "1.5rem",
              gap: "1.5rem",
              width: "100%"
            }}
          >
            <VerticalDivider />
            <Typography sx={{ flex: "0 50%" }}>{uid}xxx-xxx-xxx</Typography>
            <VerticalDivider />
            <Column sx={{ flex: "0 50%", gap: "0.5rem" }}>
              <Typography variant="body1" fontWeight={700}>
                {type === "dine-in" ? "內用" : ""}
              </Typography>
              <Typography variant="h6" fontWeight={900}>
                {title}編號xxx-xxx
              </Typography>
            </Column>
            <VerticalDivider />
            <Typography sx={{ flex: "0 100%" }}>{timestamp}</Typography>
            <VerticalDivider />
            <Box width={"100%"}>
              <LinearProgressWithLabel value={progress} />
            </Box>
          </Row>
        </AccordionSummary>
        <AccordionDetails>
          <List sx={{ marginBottom: "0.75rem" }}>
            {orderMeals.map((orderMeal) => (
              <ListItem key={orderMeal.id} sx={{ borderBottom: `1px solid ${theme.palette.common.black_20}` }}>
                <Row
                  justifyContent={"flex-start"}
                  sx={{ width: "100%", gap: "1.5rem", padding: "0.75rem 0", alignItems: "flex-start" }}
                >
                  <Typography variant="h5" fontWeight={900} sx={{ minWidth: "14.625rem" }}>
                    {orderMeal.categories[0].title}
                  </Typography>
                  <Typography variant="h5" fontWeight={900} sx={{ minWidth: "14.625rem" }}>
                    {orderMeal.title}
                  </Typography>
                  <List sx={{ margin: 0, padding: 0 }}>
                    {orderMeal.specialties.map((specialty) => (
                      <ListItem key={specialty.id} sx={{ margin: 0, padding: 0 }}>
                        {specialty.title}
                      </ListItem>
                    ))}
                  </List>
                  <Switch checked={orderMeal.servedAmount === orderMeal.amount} sx={{ marginLeft: "auto" }} />
                </Row>
              </ListItem>
            ))}
          </List>
          {status === OrderStatus.UNPAID && (
            <Box>
              <Button
                variant="outlined"
                color="inherit"
                sx={{ borderRadius: 0, padding: "0.75rem 1.5rem", minWidth: "20.9375rem" }}
                onClick={() => handleCancelOrder(uid)}
              >
                <Typography variant="body1" fontWeight={700}>
                  取消訂單
                </Typography>
              </Button>
            </Box>
          )}
        </AccordionDetails>
      </StyledAccordion>
    </Box>
  );
};

const STATUS = [
  { value: OrderStatus.UNPAID, title: "未付款", id: OrderStatus.UNPAID },
  { value: OrderStatus.SUCCESS, title: "已付款", id: OrderStatus.SUCCESS },
  { value: OrderStatus.CANCEL, title: "已取消", id: OrderStatus.CANCEL },
  { value: OrderStatus.PENDING, title: "準備中", id: OrderStatus.PENDING }
];

interface IOrderProps {
  orderStatus: OrderStatus;
  setOrderStatus: (status: OrderStatus) => void;
}

export const OrderTabs: FC<IOrderProps> = ({ orderStatus, setOrderStatus }) => {
  const handleSelected = (orderStatus: OrderStatus) => {
    setOrderStatus(orderStatus);
  };

  return (
    <TabsBase
      sx={{ position: "sticky", top: "0", zIndex: "10", backgroundColor: theme.palette.background.paper }}
      tabs={STATUS}
      onChange={(_, value) => handleSelected(value as OrderStatus)}
      value={orderStatus}
    />
  );
};

export const OrderList: FC<IOrderProps> = ({ orderStatus, setOrderStatus }) => {
  const orders = useAppSelector(({ customerOrder }) => customerOrder.orders);

  const showOrders = orders.filter(({ paymentLogs }) => paymentLogs[0].status === orderStatus);

  console.log("orderStatus", orderStatus);
  console.log("showOrders", showOrders);

  const calculateServedPercentage = (order: Order) => {
    const totalMeals = order.orderMeals.length;
    const servedMeals = order.orderMeals.filter((meal) => meal.amount === meal.servedAmount).length;

    return (servedMeals / totalMeals) * 100;
  };

  return (
    <>
      {showOrders.length === 0 ? (
        <Column justifyContent={"center"} bgcolor={"background.paper"} height={"calc(92ch - 88px)"}>
          <Typography component={"h2"} variant="h1" textAlign={"center"}>
            無此分類訂單
          </Typography>
        </Column>
      ) : (
        STATUS.map(({ id }, idx) => (
          <Box key={id} bgcolor={"background.paper"}>
            <TabPanel value={idx} index={idx}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: "0.75rem", height: "100ch" }}>
                {showOrders.map((order, idx) => (
                  <OrderAccordions
                    key={`${order.id}-${idx}`}
                    uid={order.id}
                    title={order.id}
                    orderMeals={order.orderMeals}
                    timestamp={new Date(order.updatedAt).toLocaleString()}
                    status={order.status}
                    type={order.type}
                    progress={calculateServedPercentage(order)}
                  />
                ))}
              </Box>
            </TabPanel>
          </Box>
        ))
      )}
    </>
  );
};
