import { FC, RefObject, SyntheticEvent, useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  Input,
  List,
  ListItem,
  ListItemText,
  Typography,
  styled
} from "@mui/material";

import TabsBase, { TabPanel } from "~/components/tabs";
import { Column, Row } from "~/components/layout";
import GridBase, { GridItemBase } from "~/components/grid";
import { ButtonBase, ButtonIcon, CloseButton } from "~/components/buttons";
import { useAppDispatch, useAppSelector } from "~/app/hook";

import {
  clearCart,
  closeCustomizeDialog,
  createCartItem,
  decreaseCartItemAmount,
  decreaseMealAmount,
  deleteCartItem,
  increaseCartItemAmount,
  increaseMealAmount,
  openCustomizeDialog,
  setCurrentCategory,
  updateCartItem,
  updateSpecialty
} from "~/features/orders/slice";

import { ReactComponent as LinePayIcon } from "~/assets/line-pay-solid.svg";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MoneyIcon from "@mui/icons-material/Money";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { InputNumber } from "~/features/orders/index.styles";
import theme from "~/theme";
import { DrawerBase } from "~/components/drawer";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ModalBase } from "~/components/modals";
import { Meal, Specialty, SpecialtyItem } from "~/features/orders/type";

export const MenuTabs: FC = () => {
  const dispatch = useAppDispatch();

  const categories = useAppSelector(({ customerOrder }) => customerOrder.categories);
  const currentCategory = useAppSelector(({ customerOrder }) => customerOrder.currentCategory);

  const handleClickCategory = (categoryId: string) => {
    dispatch(setCurrentCategory(categoryId));
    dispatch(closeCustomizeDialog());
  };

  return (
    <TabsBase
      sx={{ position: "sticky", top: "0", zIndex: "10", backgroundColor: theme.palette.background.paper }}
      tabs={categories}
      value={currentCategory}
      onChange={(_, value) => handleClickCategory(value)}
    />
  );
};

interface IMealCardProps extends Meal {
  currentMealId: string;
}

const MealCard: FC<IMealCardProps> = ({ id, title, price, coverUrl, currentMealId }) => (
  <Column
    key={id}
    py="0.5rem"
    sx={{
      gap: "0.75rem",
      backgroundColor: id === currentMealId ? "primary.main" : "transparent",
      padding: "0.3rem"
    }}
  >
    <Box component="img" src={coverUrl} height="7rem" width="7rem" alt={title} sx={{ objectFit: "cover" }} />
    <Row justifyContent="space-between" alignItems="center">
      <Typography fontWeight={900}>{title}</Typography>
      <Typography>{price}</Typography>
    </Row>
  </Column>
);

interface IMealsProps {}

export const MealList: FC<IMealsProps> = () => {
  const dispatch = useAppDispatch();

  const menu = useAppSelector(({ customerOrder }) => customerOrder.menu);
  const currentCategory = useAppSelector(({ customerOrder }) => customerOrder.currentCategory);
  const currentMealId = useAppSelector(({ customerOrder }) => customerOrder.currentMealId);

  const contentRef = useRef<HTMLDivElement>(null);

  const handleSelectedMeal = (currentMealId: string) => () => {
    dispatch(openCustomizeDialog(currentMealId));
  };

  return (
    <>
      <Box ref={contentRef} sx={{ p: 3, overflowY: "scroll", height: "calc(100vh - 88px - 55px)" }}>
        {menu.map(
          (category, idx) =>
            category.id === currentCategory && (
              <TabPanel key={category.id} value={category.position} index={category.position}>
                <GridBase columns="5" gap="1rem">
                  {category.meals.length > 0 &&
                    category.meals.map((meal) => (
                      <GridItemBase
                        sx={{
                          zIndex: 0,
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: theme.palette.common.black_20
                          }
                        }}
                        key={meal.id}
                        onClick={handleSelectedMeal(meal.id)}
                      >
                        <MealCard {...meal} currentMealId={currentMealId} />
                      </GridItemBase>
                    ))}
                </GridBase>
              </TabPanel>
            )
        )}
      </Box>
      <MealDrawer contentRef={contentRef} />
    </>
  );
};

const CartTitle = styled(Row)`
  padding: 1.5rem 1.5rem 0.75rem 1.5rem;
`;

const StyledCartItem = styled(Column)(({ theme }) => ({
  flex: 1,
  justifyContent: "space-between",
  padding: "0.75rem 1.5rem",
  gap: "0.75rem",
  borderBottom: `1px solid ${theme.palette.common.black_20}`
}));

const SpecialtiesCartList = styled(List)(({ theme }) => ({
  padding: 0,
  margin: 0
}));

const SpecialtiesCartItem = styled(ListItem)(({ theme }) => ({
  padding: 0,
  margin: 0
}));

interface ICartItemProps {
  idx: number;
  title: string;
  amount: number;
  price: number;
  coverUrl: string;
  specialties: Specialty[];
  handleAdd: (idx: number) => void;
  handleMinus: (idx: number) => void;
}

const CartItem: FC<ICartItemProps> = ({ idx, title, amount, price, coverUrl, specialties, handleAdd, handleMinus }) => {
  const dispatch = useAppDispatch();
  const handleDeleteCartItem = (idx: number) => (e: SyntheticEvent<Element, Event>) => {
    e.stopPropagation();
    dispatch(deleteCartItem(idx));
  };

  return (
    <>
      <StyledCartItem>
        <Row justifyContent={"flex-start"} align={"flex-start"} sx={{ gap: "0.75rem" }}>
          <Box component="img" height={64} width={64} src={coverUrl} alt={title} sx={{ objectFit: "cover" }} />
          <Column justifyContent={"flex-start"} alignItems={"flex-start"}>
            <Typography component="h3" variant="body1" fontWeight={700} mb={0.5}>
              {title}
            </Typography>
            <SpecialtiesCartList dense={true}>
              {specialties.map((specialty) => (
                <SpecialtiesCartItem key={specialty.id}>
                  <ListItemText
                    secondary={specialty.items.map((item) => (
                      <Typography
                        component="span"
                        variant="body1"
                        key={item.id}
                        lineHeight={1.2}
                        sx={{ marginRight: "0.5rem" }}
                      >
                        {item.title}
                      </Typography>
                    ))}
                  />
                </SpecialtiesCartItem>
              ))}
            </SpecialtiesCartList>
          </Column>
          <ButtonIcon sx={{ marginLeft: "auto" }} size="large" color="inherit" onClick={handleDeleteCartItem(idx)}>
            <DeleteIcon sx={{ height: "100%" }} />
          </ButtonIcon>
        </Row>
        <Row
          justifyContent={"space-between"}
          alignItems={"center"}
          sx={{
            width: "100%"
          }}
        >
          <InputNumber value={amount} onAdd={() => handleAdd(idx)} onMinus={() => handleMinus(idx)} />
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {price}
          </Typography>
        </Row>
      </StyledCartItem>
    </>
  );
};

const SelectTab = styled(Button)(({ theme }) => ({
  borderRadius: "1rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1.5rem",
  padding: "0.5rem 1rem",
  minWidth: "9rem",
  outline: `1px solid ${theme.palette.common.black_20}`,
  backgroundColor: theme.palette.common.white,
  fontWeight: 700,
  color: theme.palette.common.black,
  "&:hover": {
    backgroundColor: "transparent",
    outline: `1px solid ${theme.palette.common.black}`
  },
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    outline: `1px solid ${theme.palette.common.black}`
  },

  "&.disabled": {
    backgroundColor: theme.palette.common.black_20,
    outline: `1px solid ${theme.palette.common.black_20}`,
    color: theme.palette.common.black_40
  }
}));

interface IMealDrawer {
  contentRef: RefObject<HTMLDivElement>;
}

const MealDrawer: FC<IMealDrawer> = ({ contentRef }) => {
  const dispatch = useAppDispatch();

  const meals = useAppSelector(({ customerOrder }) => customerOrder.meals);
  const currentMealId = useAppSelector(({ customerOrder }) => customerOrder.currentMealId);
  const currentMealAmount = useAppSelector(({ customerOrder }) => customerOrder.currentMealAmount);
  const currentSpecialty = useAppSelector(({ customerOrder }) => customerOrder.currentSpecialty);

  const currentMeal = meals.find((meal) => meal.id === currentMealId);
  const specialtyItems = currentSpecialty.reduce((acc, cur) => acc.concat(cur.items), [] as SpecialtyItem[]);

  const handleClickItem = (selectedSpecialty: Specialty, selectedItem: SpecialtyItem) => () => {
    dispatch(updateSpecialty({ selectedSpecialty, selectedItem }));
  };

  const handleAdd = () => {
    dispatch(increaseMealAmount());
  };

  const handleMinus = () => {
    dispatch(decreaseMealAmount());
  };

  const handleAddToCart = () => {
    dispatch(createCartItem());
  };

  const handleClose = () => {
    dispatch(closeCustomizeDialog());
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        width: `${contentRef.current?.clientWidth}px`,
        transition: "transform 0.3s",
        transform: currentMeal ? "translateY(0)" : "translateY(100%)"
      }}
    >
      <Box
        bgcolor={"white"}
        sx={{
          borderTop: `1px solid ${theme.palette.common.black_40}`,
          position: "relative",
          padding: "2rem 1.5rem"
        }}
      >
        <CloseButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 1
          }}
        />
        <Column sx={{ gap: "2rem" }}>
          {currentMeal?.specialties?.length
            ? currentMeal.specialties.map((specialty) => (
                <Column key={specialty.id} sx={{ gap: "1.5rem" }}>
                  <Typography variant="h6" key={specialty.id} sx={{ fontWeight: 900 }}>
                    {specialty.title}
                  </Typography>
                  <Row component={"ul"} sx={{ gap: "1.5rem", padding: 0, margin: 0 }}>
                    {specialty.items.map((item, idx) => (
                      <ListItem key={item.id}>
                        <SelectTab
                          onClick={handleClickItem(specialty, item)}
                          className={specialtyItems.find(({ id }) => id === item.id) ? "Mui-selected" : ""}
                        >
                          <Typography variant="body1" fontWeight={700}>
                            {item.title}
                          </Typography>
                        </SelectTab>
                      </ListItem>
                    ))}
                  </Row>
                </Column>
              ))
            : null}
        </Column>
        <Row sx={{ marginTop: "2.5rem" }} alignItems={"center"}>
          <InputNumber value={currentMealAmount} onAdd={() => handleAdd()} onMinus={() => handleMinus()} />
          <ButtonBase
            sx={{
              backgroundColor: theme.palette.common.black,
              color: "white",
              padding: "1rem 1.5rem",
              marginLeft: "1.5rem",
              "&:hover": {
                backgroundColor: theme.palette.common.black_80,
                color: theme.palette.common.black_20
              }
            }}
            onClick={handleAddToCart}
          >
            <ShoppingCartIcon />
            <Typography variant="h6" fontWeight={700} ml={"0.8125rem"}>
              加入購物車
            </Typography>
          </ButtonBase>
        </Row>
      </Box>
    </Box>
  );
};

export const CartList: FC = () => {
  const dispatch = useAppDispatch();

  const cart = useAppSelector(({ customerOrder }) => customerOrder.cart);

  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);

  const [openPayment, setOpenPayment] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (headerRef.current && footerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
      setFooterHeight(footerRef.current.offsetHeight);
    }
  }, []);

  const handleAdd = (idx: number) => {
    dispatch(increaseCartItemAmount(idx));
  };

  const handleMinus = (idx: number) => {
    dispatch(decreaseCartItemAmount(idx));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    setOpenDialog(false);
  };

  const handleCloseDrawer = () => {
    setOpenPayment(false);
  };

  const handleCreatePayment = () => {
    console.log("handleCreatePayment");
    setOpenPayment(false);
  };

  const handleUpdateCartItem = () => {
    dispatch(updateCartItem());
  };

  const handleSubmitOrders = () => {
    console.log("handleSubmitOrders");
    console.log(cart);
    setOpenPayment(true);
  };

  const handleCompleteOrder = (id: string) => {
    console.log("handleCompleteOrder" + id);
    console.log(cart);
    setOpenPayment(false);
  };

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
      onClick={() => setOpenPayment(true)}
    >
      結帳
    </Button>
  );

  const paymentBtn = () => [
    {
      label: "結帳",
      onClick: handleCompleteOrder
    }
  ];

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
      icon: <LinePayIcon width={"2.5rem"} />,
      content: <LinePaymentForm onSubmit={handleCompleteOrder} />
    }
  ];

  return (
    <>
      <Column bgcolor={"background.paper"} height={"100%"}>
        <CartTitle justifyContent={"space-between"} alignItems={"flex-end"} ref={headerRef}>
          <Typography component="h2" variant="h3" fontWeight={900}>
            已點項目
          </Typography>
          <Box>
            {cart.length > 0 && (
              <ButtonBase size={"small"} color="inherit" disableRipple onClick={() => setOpenDialog(true)}>
                <Typography
                  component="span"
                  variant="body1"
                  color="common.black"
                  sx={{ textDecorationLine: "underline", textUnderlineOffset: "0.25rem" }}
                >
                  清空訂單
                </Typography>
              </ButtonBase>
            )}
          </Box>
        </CartTitle>
        <ModalBase open={openDialog} onClose={() => setOpenDialog(false)}>
          <Box display="grid" sx={{ placeContent: "center" }} height={"100%"}>
            <Card>
              <CardHeader
                title="清空訂單"
                sx={{ backgroundColor: theme.palette.common.black, color: "white", textAlign: "center" }}
              />
              <CardContent sx={{ padding: "1.5rem 1.25rem", minWidth: "50cqw" }}>
                <Typography component="p" variant="body1" fontWeight={700} textAlign={"center"}>
                  確定要刪除此項目嗎？
                </Typography>
              </CardContent>
              <CardActions sx={{ gap: "1.5rem", justifyContent: "center", alignItems: "center", padding: "1.5rem" }}>
                <Button variant="outlined" color="inherit" fullWidth onClick={handleClearCart}>
                  確定
                </Button>
                <Button variant="contained" color="secondary" fullWidth onClick={() => setOpenDialog(false)}>
                  取消
                </Button>
              </CardActions>
            </Card>
          </Box>
        </ModalBase>
        {cart.length > 0 ? (
          <>
            <List sx={{ padding: 0, overflowY: "scroll", height: `calc(100vh - ${headerHeight + footerHeight}px)` }}>
              {cart.map((cartItem, idx) => (
                <ListItem key={`${cartItem.title}-${idx}`} sx={{ padding: 0 }}>
                  <CartItem
                    idx={idx}
                    title={cartItem.title}
                    price={cartItem.price}
                    coverUrl={cartItem.coverUrl}
                    specialties={cartItem.specialties}
                    amount={cartItem.amount}
                    handleAdd={handleAdd}
                    handleMinus={handleMinus}
                  />
                </ListItem>
              ))}
            </List>
            <Box
              ref={footerRef}
              sx={{ position: "sticky", bottom: 0, borderTop: `1px dashed ${theme.palette.common.black_40}` }}
              bgcolor={"background.paper"}
            >
              <Column sx={{ padding: "0.75rem 1.5rem", gap: "0.75rem" }}>
                <Row justifyContent={"space-between"} alignItems={"flex-end"}>
                  <Typography component="h3" variant="body1" fontWeight={700}>
                    數量
                  </Typography>
                  <Typography component="h3" variant="h6" fontWeight={900}>
                    {cart.length}
                  </Typography>
                </Row>
                <Row justifyContent={"space-between"} alignItems={"flex-end"}>
                  <Typography component="h3" variant="body1" fontWeight={700}>
                    小記
                  </Typography>
                  <Typography component="h3" variant="h6" fontWeight={900}>
                    {cart.reduce((acc, cur) => (acc += cur.amount * cur.price), 0)}
                  </Typography>
                </Row>
              </Column>
              <ButtonBase
                sx={{ width: "100%", padding: "1.5rem 2rem", borderRadius: 0, boxShadow: "none" }}
                variant="contained"
                onClick={handleSubmitOrders}
                color="primary"
              >
                <Typography component="h3" variant="h6" fontWeight={900} textAlign={"center"}>
                  結帳
                </Typography>
              </ButtonBase>
            </Box>
          </>
        ) : (
          <Typography component="h3" variant="h5" fontWeight={900} align="center" p={3}>
            無訂單
          </Typography>
        )}
      </Column>
      <DrawerBase title="結帳" open={openPayment} onClose={handleCloseDrawer} buttonList={paymentBtn()}>
        <Column p={3}>
          <Row justifyContent={"space-between"}>
            <Typography component="h3" variant="body1" fontWeight={700}>
              類型
            </Typography>
            <Typography component="h3" variant="h5" fontWeight={900}>
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
            {cart.reduce((acc, cur) => (acc += cur.amount * cur.price), 0)}
          </Typography>
        </Row>
      </DrawerBase>
    </>
  );
};
