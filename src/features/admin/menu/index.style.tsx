// Lib
import { FC, SyntheticEvent, useEffect, useRef, useState } from "react";
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
  Chip,
  Divider,
  Drawer,
  FormControl,
  Input,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  Typography,
  styled,
  tabsClasses
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MoneyIcon from "@mui/icons-material/Money";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// Components
import { TabPanel } from "~/components/tabs";
import { Column, Row } from "~/components/layout";
import GridBase, { GridItemBase } from "~/components/grid";
import { ButtonBase, ButtonIcon, CloseButton } from "~/components/buttons";
import { DrawerBase } from "~/components/drawer";
import { ModalBase } from "~/components/modals";
// Others
import { useAppDispatch, useAppSelector } from "~/app/hook";
import {
  clearCart,
  closeCustomizeDialog,
  createCartItem,
  // decreaseCartItemAmount,
  decreaseMealAmount,
  deleteCartItem,
  // increaseCartItemAmount,
  increaseMealAmount,
  openCustomizeDialog,
  resetSpecialty,
  setCurrentCategory,
  updateCartItem,
  updateSpecialty,
  viewCartItemCustomized
} from "~/features/orders/slice";
import { ReactComponent as LinePayIcon } from "~/assets/line-pay-solid.svg";
import { InputNumber } from "~/features/orders/index.styles";
import theme from "~/theme";
import { CartItem, Meal, Specialty, SpecialtyItem } from "~/features/orders/type";

export const MenuTabs = () => {
  const dispatch = useAppDispatch();

  const categories = useAppSelector(({ customerOrder }) => customerOrder.categories);
  const currentCategory = useAppSelector(({ customerOrder }) => customerOrder.currentCategory);

  const handleClickCategory = (categoryId: string) => {
    dispatch(setCurrentCategory(categoryId));
    dispatch(closeCustomizeDialog());
  };

  return (
    <Tabs
      variant="scrollable"
      value={currentCategory}
      onChange={(_, value) => handleClickCategory(value)}
      sx={{
        position: "sticky",
        top: "0",
        zIndex: "2",
        backgroundColor: theme.palette.background.paper,
        [`& .${tabsClasses.scrollButtons}.Mui-disabled`]: {
          opacity: 0.2
        }
      }}
    >
      {categories.map(({ id, title }) => (
        <Tab key={id} value={id} label={title} sx={{ fontSize: theme.typography.body1.fontSize }} />
      ))}
    </Tabs>
  );
};

interface IMealCardProps extends Meal {
  currentMealId: string;
}
const MealCard = (props: IMealCardProps) => {
  const dispatch = useAppDispatch();

  const { id, title, price, coverUrl, currentMealId } = props;

  const isModifiedCartItem = useAppSelector(({ customerOrder }) => customerOrder.isModifiedCartItem);
  const isSelected = id === currentMealId && !isModifiedCartItem;

  const handleSelectedMeal = (currentMealId: string) => () => {
    dispatch(resetSpecialty());
    dispatch(openCustomizeDialog(currentMealId));
  };
  return (
    <Box
      key={id}
      sx={{
        backgroundColor: isSelected ? "primary.main" : "transparent",
        boxShadow: "rgba(0, 0, 0, 0.5) 0px 1px 4px"
      }}
      onClick={handleSelectedMeal(id)}
    >
      <Typography
        fontWeight={600}
        textAlign="center"
        sx={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", padding: ".3rem" }}
      >
        {title}
      </Typography>
      <Box height="6rem" sx={{ bgcolor: theme.palette.common.black, textAlign: "center" }}>
        <Box component="img" src={coverUrl} alt={title} sx={{ objectFit: "fill", height: "100%", maxWidth: "100%" }} />
      </Box>
      <Typography textAlign="center">{price}元</Typography>
      <Row justifyContent="space-between" alignItems="center"></Row>
    </Box>
  );
};

export const MealDrawer = () => {
  const dispatch = useAppDispatch();

  const meals = useAppSelector(({ customerOrder }) => customerOrder.meals);
  const currentMealId = useAppSelector(({ customerOrder }) => customerOrder.currentMealId);
  const currentMealAmount = useAppSelector(({ customerOrder }) => customerOrder.currentMealAmount);
  const currentSpecialty = useAppSelector(({ customerOrder }) => customerOrder.currentSpecialty);
  const isModifiedCartItem = useAppSelector(({ customerOrder }) => customerOrder.isModifiedCartItem);

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

  const handleUpdateCartItem = () => {
    dispatch(updateCartItem());
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
        transition: "transform 0.3s",
        transform: currentMeal ? "translateY(0)" : "translateY(100%)",
        width: "66.6vw"
      }}
    >
      <Box
        bgcolor="white"
        sx={{
          borderTop: `1px solid ${theme.palette.common.black_40}`,
          position: "relative",
          padding: ".5rem"
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 900, color: theme.palette.common.black }}>
          {currentMeal?.title}
        </Typography>
        <CloseButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            padding: ".5rem",
            minWidth: 0
          }}
        />
        <Box>
          {currentMeal?.specialties?.length
            ? currentMeal.specialties.map((specialty) => (
                <Box key={specialty.id}>
                  <Typography
                    variant="h6"
                    key={specialty.id}
                    sx={{ fontWeight: 900, padding: "1rem 0 1rem", color: theme.palette.common.black_80 }}
                  >
                    {specialty.title}
                  </Typography>
                  <Box
                    sx={{
                      padding: 0,
                      margin: 0,
                      width: "100%",
                      display: "grid",
                      gridTemplateColumns: "repeat(6, 1fr)",
                      gap: ".5rem"
                    }}
                  >
                    {specialty.items.map((item) => (
                      <Chip
                        key={item.id}
                        label={item.title}
                        color="primary"
                        variant={specialtyItems.find(({ id }) => id === item.id) ? "filled" : "outlined"}
                        icon={
                          <DoneIcon
                            sx={{
                              display: specialtyItems.find(({ id }) => id === item.id) ? "block" : "none",
                              fontSize: theme.typography.body1.fontSize
                            }}
                          />
                        }
                        onClick={handleClickItem(specialty, item)}
                        sx={{
                          color: theme.palette.common.black,
                          fontSize: theme.typography.body1.fontSize,
                          "&:hover": {
                            bgcolor: theme.palette.primary.main
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              ))
            : null}
        </Box>
        <Box sx={{ marginTop: "1rem", display: "flex", justifyContent: "end" }}>
          <InputNumber value={currentMealAmount} onAdd={handleAdd} onMinus={handleMinus} />
          <ButtonBase
            sx={{
              backgroundColor: theme.palette.common.black,
              color: "white",
              padding: ".5rem 1rem",
              marginLeft: "1.5rem",
              "&:hover": {
                backgroundColor: theme.palette.common.black_80,
                color: theme.palette.common.black_20
              }
            }}
            onClick={isModifiedCartItem ? handleUpdateCartItem : handleAddToCart}
            startIcon={isModifiedCartItem ? <DoneIcon /> : <ShoppingCartIcon />}
          >
            <Typography variant="body1" fontWeight={700}>
              {isModifiedCartItem ? "確認修改" : "加入購物車"}
            </Typography>
          </ButtonBase>
        </Box>
      </Box>
    </Box>
  );
};

export const MealList = () => {
  const menu = useAppSelector(({ customerOrder }) => customerOrder.menu);
  const currentCategory = useAppSelector(({ customerOrder }) => customerOrder.currentCategory);
  const currentMealId = useAppSelector(({ customerOrder }) => customerOrder.currentMealId);

  return (
    <>
      <Box
        sx={{
          p: 2,
          overflowY: "scroll",
          height: "calc(100vh - 88px - 4rem)"
        }}
      >
        {menu.map(
          (category) =>
            category.id === currentCategory && (
              <TabPanel
                key={category.id}
                value={category.position}
                index={category.position}
                sx={{ paddingBottom: "26rem" }}
              >
                <GridBase columns="5" gap="1rem">
                  {category.meals.length > 0 &&
                    category.meals.map((meal) => (
                      <GridItemBase
                        sx={{
                          cursor: "pointer"
                        }}
                        key={meal.id}
                      >
                        <MealCard {...meal} currentMealId={currentMealId} />
                      </GridItemBase>
                    ))}
                </GridBase>
              </TabPanel>
            )
        )}
      </Box>
    </>
  );
};

const SpecialtiesCartList = styled(List)(({ theme }) => ({
  padding: 0,
  margin: 0
}));

const SpecialtiesCartItem = styled(ListItem)(({ theme }) => ({
  padding: 0,
  margin: 0
}));

interface ICartMealProps {
  idx: number;
  cartItem: CartItem;
}

const CartMeal = ({ idx, cartItem }: ICartMealProps) => {
  const dispatch = useAppDispatch();

  const { title, amount, specialties, price } = cartItem;

  const specialtiesPrice = specialties.reduce(
    (acc, specialty) => (acc += specialty.items.reduce((acc, specialtyItem) => (acc += specialtyItem.price), 0)),
    0
  );
  const totalPrice = (price + specialtiesPrice) * amount;

  const handleEditCartItem = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    dispatch(viewCartItemCustomized({ cartItem, idx }));
  };

  const handleDeleteCartItem = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    dispatch(deleteCartItem(idx));
  };

  // [TODO] remove?
  // const handleAdd = (idx: number) => {
  //   dispatch(increaseCartItemAmount(idx));
  // };
  // const handleMinus = (idx: number) => {
  //   dispatch(decreaseCartItemAmount(idx));
  // };

  return (
    <Column
      sx={{
        flex: 1,
        padding: ".2rem .5rem",
        gap: ".2rem",
        borderBottom: `1px solid ${theme.palette.common.black_20}`,
        boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
        cursor: "pointer"
      }}
      onClick={handleEditCartItem}
    >
      <Row>
        <Typography variant="h6" fontWeight={700} mb={0.5}>
          {title} x {amount}
        </Typography>
        <ButtonIcon sx={{ marginLeft: "auto" }} size="large" color="inherit" onClick={handleDeleteCartItem}>
          <DeleteIcon />
        </ButtonIcon>
      </Row>
      <Row sx={{ gap: "0.5rem" }} alignItems="flex-start">
        {/* [TODO] remove? */}
        {/* <Box component="img" height={64} width={64} src={coverUrl} alt={title} sx={{ objectFit: "cover" }} /> */}
        <Column>
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
      </Row>
      <Box
        sx={{
          width: "100%",
          textAlign: "right"
        }}
      >
        {/* [TODO] remove? */}
        {/* <InputNumber value={amount} onAdd={() => handleAdd(idx)} onMinus={() => handleMinus(idx)} /> */}
        <Typography variant="body1" sx={{ fontWeight: 900 }}>
          {`${price}${specialtiesPrice ? `(+${specialtiesPrice})` : ""} x ${amount} = ${totalPrice}元`}
        </Typography>
      </Box>
    </Column>
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
      icon: <LinePayIcon width="2.5rem" />,
      content: <LinePaymentForm onSubmit={handleCompleteOrder} />
    }
  ];

  const totalPrice = cart.reduce((acc, cartItem) => {
    const speicaltiesPrice = cartItem.specialties.reduce(
      (acc, specialty) => (acc += specialty.items.reduce((acc, specialtyItem) => (acc += specialtyItem.price), 0)),
      0
    );
    return (acc += cartItem.amount * (cartItem.price + speicaltiesPrice));
  }, 0);

  return (
    <>
      <Column bgcolor="background.paper" height="100%">
        {cart.length > 0 && (
          <Row justifyContent="space-between" ref={headerRef} sx={{ padding: "0.5rem" }}>
            <Typography variant="h5" fontWeight={900}>
              已點項目
            </Typography>
            <Box>
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
            </Box>
          </Row>
        )}
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
            <List
              sx={{
                overflowY: "scroll",
                flexGrow: 1,
                height: `calc(100vh - 88px - 16rem)`,
                padding: ".5rem"
              }}
            >
              {cart.map((cartItem, idx) => (
                <ListItem key={`${cartItem.title}-${idx}`} sx={{ padding: 0, margin: ".5rem 0" }}>
                  <CartMeal idx={idx} cartItem={cartItem} />
                </ListItem>
              ))}
            </List>
            <Box
              ref={footerRef}
              sx={{ borderTop: `1px dashed ${theme.palette.common.black_40}` }}
              bgcolor={"background.paper"}
            >
              <Column sx={{ padding: "0.75rem 1.5rem", gap: "0.75rem" }}>
                <Row justifyContent={"space-between"} alignItems={"flex-end"}>
                  <Typography variant="body1" fontWeight={700}>
                    數量
                  </Typography>
                  <Typography variant="h6" fontWeight={900}>
                    {cart.reduce((acc, cur) => (acc += cur.amount), 0)}
                  </Typography>
                </Row>
                <Row justifyContent="space-between" alignItems="flex-end">
                  <Typography variant="body1" fontWeight={700}>
                    小計
                  </Typography>
                  <Typography variant="h6" fontWeight={900}>
                    {totalPrice}元
                  </Typography>
                </Row>
              </Column>
              <ButtonBase
                sx={{ width: "100%", padding: "1rem", borderRadius: 0, boxShadow: "none" }}
                variant="contained"
                onClick={handleSubmitOrders}
                color="primary"
              >
                <Typography variant="h6" fontWeight={900} textAlign="center">
                  結帳
                </Typography>
              </ButtonBase>
            </Box>
          </>
        ) : (
          <Typography
            variant="h5"
            fontWeight={900}
            align="center"
            p={3}
            sx={{ margin: "auto" }}
            color={theme.palette.common.black_40}
          >
            無項目
          </Typography>
        )}
      </Column>
      <DrawerBase title="結帳" open={openPayment} onClose={handleCloseDrawer} buttonList={paymentBtn()}>
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
    </>
  );
};
