// Libs
import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Breadcrumbs,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Dialog,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Link,
  Paper,
  RadioGroup,
  Tab,
  Tabs,
  Typography,
  styled,
  tabsClasses
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";
// Components
import { ButtonBase } from "~/components/buttons";
// Others
import { useAppDispatch, useAppSelector } from "~/app/hook";
import {
  setCurrentCategory,
  openDialog,
  closeDialog,
  openCustomizeDialog,
  closeCustomizeDialog,
  CART,
  ORDER,
  CUSTOMIZED
} from "./slice";
import { MobileDialogLayout } from "~/components/dialog";
import { RadioBase } from "~/components/radio";
import { CheckboxBase } from "~/components/checkbox";

interface IHeaderProps {}
export const Header = (props: IHeaderProps) => {
  return (
    <Box sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
      <Breadcrumbs>
        <Link href="/" underline="hover" color="inherit">
          港都熱炒
        </Link>
        <Typography sx={{ fontWeight: "bold", color: "#020202" }}>我要點餐</Typography>
      </Breadcrumbs>
      <Typography sx={{ fontSize: "2.5rem", fontWeight: "bold", padding: "1rem 0" }}>港都熱炒</Typography>
    </Box>
  );
};

interface ISeatInfoProps {}
export const SeatInfo = (props: ISeatInfoProps) => {
  return (
    <>
      {true && (
        <Box sx={{ padding: "0 0 1rem" }}>
          <Typography sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>內用資訊</Typography>
          <Grid
            container
            sx={{
              padding: "1rem 0",
              borderRadius: "5px",
              bgcolor: "#F2F2F2",
              color: "#919191"
            }}
          >
            <Grid item xs={6} sx={{ padding: "0 1rem" }}>
              <Box sx={{ color: "#919191", fontWeight: "bold" }}>座位</Box>
              <Box sx={{ fontSize: "1.5rem", fontWeight: "bold", color: "#020202" }}>{"A03-1"}</Box>
            </Grid>
            <Grid item xs={6} sx={{ padding: "0 1rem", borderLeft: "1px solid #D1D1D1" }}>
              <Box sx={{ color: "#919191", fontWeight: "bold" }}>入座時間</Box>
              <Box sx={{ fontSize: "1.5rem", fontWeight: "bold", color: "#020202" }}>{"17:30"}</Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};

interface ICategoryNavbarProps {}
export const CategoryNavbar = (props: ICategoryNavbarProps) => {
  const dispatch = useAppDispatch();

  const categories = useAppSelector(({ customerOrder }) => customerOrder.categories);
  const currentCategory = useAppSelector(({ customerOrder }) => customerOrder.currentCategory);

  const onChange = (e: React.SyntheticEvent, newValue: string) => {
    dispatch(setCurrentCategory({ currentCategory: newValue }));
  };

  return (
    <Box>
      <Typography sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>菜單</Typography>
      <Tabs
        value={currentCategory}
        onChange={onChange}
        variant="scrollable"
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            width: "24px",
            "&.Mui-disabled": { opacity: 0.3 }
          },
          "& .MuiTabs-indicator": {
            display: "none"
          },
          marginBottom: "10px"
        }}
      >
        {categories.map(({ id, title }) => (
          <Tab
            key={id}
            value={id}
            label={title}
            sx={{
              bgcolor: "#F2F2F2",
              borderRadius: "5rem",
              margin: ".2rem",
              minHeight: "auto",
              minWidth: "auto",
              "&:focus": {
                outline: "none"
              },
              "&.Mui-selected[aria-selected='true']": {
                color: "#020202",
                bgcolor: "#F7E252"
              }
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

interface IMealsProps {}
export const Meals = (props: IMealsProps) => {
  const dispatch = useAppDispatch();
  const meals = useAppSelector(({ customerOrder }) => customerOrder.meals);
  const currentCategory = useAppSelector(({ customerOrder }) => customerOrder.currentCategory);

  const showMeals = meals.filter(
    (meal) => meal.categories.filter((category) => category.id === currentCategory).length > 0
  );

  const handleSelectedMeal = (currentMealId: string) => () => {
    dispatch(openCustomizeDialog({ currentMealId }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexWrap: "nowrap",
        gap: "10px",
        overflowY: "auto"
      }}
    >
      {showMeals.map((meal) => (
        <Card
          key={meal.id}
          sx={{
            height: "80px",
            flexShrink: "0",
            bgcolor: "#F8F8F8"
          }}
        >
          <CardActionArea
            sx={{
              display: "flex",
              "&:focus": {
                outline: "none"
              }
            }}
            onClick={handleSelectedMeal(meal.id)}
          >
            <CardMedia
              component="img"
              image={meal.coverUrl}
              alt={meal.title}
              sx={{
                height: "100%",
                width: "80px"
              }}
            />
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flexGrow: "1",
                height: "100%"
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <Typography>{meal.title}</Typography>
                <Typography>${meal.price}</Typography>
              </Box>
              <Typography component={"pre"} color="text.secondary" fontSize={"12px"}>
                {meal.description}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
};

const StyledBottomNavigationAction = styled(BottomNavigationAction)(({ theme }) => ({
  borderRadius: "10px",
  minWidth: "auto",
  padding: "0",
  gap: "5px",
  backgroundColor: "#F0F0F0",
  "&:focus": {
    outline: "none"
  },
  "&.Mui-selected": {
    color: "#F0F0F0"
  }
}));

export const Footer = () => {
  const dispatch = useAppDispatch();
  const currentDialog = useAppSelector(({ customerOrder }) => customerOrder.currentDialog);

  const handleFooterAction = (e: React.SyntheticEvent<Element, Event>, newValue: string) => {
    if (newValue) dispatch(openDialog({ currentDialog: newValue }));
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: "1rem",
        left: "50%",
        transform: "translateX(-50%)",
        padding: "5px",
        height: "4.5rem",
        display: "flex",
        width: "220px"
      }}
    >
      <BottomNavigation
        showLabels
        value={currentDialog}
        onChange={handleFooterAction}
        sx={{
          gap: "5px",
          height: "100%",
          width: "100%",
          "& .Mui-selected": {
            bgcolor: "#020202"
          }
        }}
      >
        <StyledBottomNavigationAction label="菜單" value="" icon={<MenuBookIcon sx={{ fontSize: "1rem" }} />} />
        <StyledBottomNavigationAction label="購物車" value={CART} icon={<CartIcon sx={{ fontSize: "1rem" }} />} />
        <StyledBottomNavigationAction label="訂單" value={ORDER} icon={<ReceiptIcon sx={{ fontSize: "1rem" }} />} />
      </BottomNavigation>
    </Paper>
  );
};

interface ICustomizedDialog {}
export const CustomizedDialog = (props: ICustomizedDialog) => {
  const dispatch = useAppDispatch();
  const meals = useAppSelector(({ customerOrder }) => customerOrder.meals);
  const currentDialog = useAppSelector(({ customerOrder }) => customerOrder.currentDialog);
  const currentMealId = useAppSelector(({ customerOrder }) => customerOrder.currentMealId);
  const currentMeal = meals.find((meal) => meal.id === currentMealId);

  const specialtiesValue = useRef<{ [key: string]: number[] }>({});

  const handleClose = () => {
    dispatch(closeCustomizeDialog());
  };

  const handleCustomize = () => {
    dispatch(closeCustomizeDialog());
  };

  const handleAddCart = () => {
    console.log("handleAddCart", specialtiesValue);
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>, value: string) => {
    const fieldName = e.target.name;
    const fieldValue = +value;
    const currentFieldValue = specialtiesValue.current[fieldName] || [];

    specialtiesValue.current = { ...specialtiesValue.current, [fieldName]: [...currentFieldValue, fieldValue] };
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    const fieldName = e.target.name;
    const fieldValue = +e.target.value;
    const currentFieldValue = specialtiesValue.current[fieldName] || [];
    const newFieldValue = checked
      ? [...specialtiesValue.current[fieldName], fieldValue]
      : currentFieldValue.filter((id) => id !== fieldValue);

    specialtiesValue.current[fieldName] = newFieldValue;
  };

  return (
    <MobileDialogLayout
      title={currentMeal?.title}
      isOpen={currentDialog === CUSTOMIZED}
      onCloseDialog={handleClose}
      actionButton={<ButtonBase onClick={handleAddCart}> 加入購物車 </ButtonBase>}
    >
      <Box
        component="form"
        onSubmit={handleCustomize}
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: "5px"
        }}
      >
        <FormControl sx={{ width: "100%" }}>
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              fontWeight: "bold"
            }}
          ></Typography>

          {currentMeal?.specialties.map((specialty) => (
            <Box key={specialty.id}>
              <FormLabel id={specialty.id}>{specialty.title}:</FormLabel>

              {specialty.type === "single" && (
                <RadioGroup
                  row
                  aria-labelledby={specialty.id}
                  id={specialty.id}
                  name={specialty.title}
                  onChange={handleRadioChange}
                >
                  {specialty.items.map((item) => (
                    <FormControlLabel key={item.id} value={item.id} label={item.title} control={<RadioBase />} />
                  ))}
                </RadioGroup>
              )}

              {specialty.type === "multiple" && (
                <FormGroup row aria-labelledby={specialty.id} id={specialty.id}>
                  {specialty.items.map((item) => (
                    <FormControlLabel
                      key={item.id}
                      value={item.id}
                      label={item.title}
                      control={<CheckboxBase onChange={handleCheckboxChange} name={specialty.title} />}
                    />
                  ))}
                </FormGroup>
              )}
            </Box>
          ))}
        </FormControl>
      </Box>
    </MobileDialogLayout>
  );
};

interface ICartProps {}
export const CartDialog = (props: ICartProps) => {
  const dispatch = useAppDispatch();
  const currentDialog = useAppSelector(({ customerOrder }) => customerOrder.currentDialog);
  const cart = useAppSelector(({ customerOrder }) => customerOrder.cart);

  const handleClose = () => {
    dispatch(closeDialog());
  };

  const handleSubmitOrders = () => {
    console.log("handleSubmitOrders");
  };

  return (
    <MobileDialogLayout
      title="購物車"
      isOpen={currentDialog === CART}
      onCloseDialog={handleClose}
      actionButton={<ButtonBase onClick={handleSubmitOrders}>送出訂單</ButtonBase>}
    >
      <Box
        sx={{
          flexGrow: "1",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {cart.length > 0 ? (
          <>
            <Typography variant="h5" sx={{ textAlign: "center", fontWeight: "bold" }}>
              訂購明細
            </Typography>
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flexGrow: "1"
            }}
          >
            <Typography>快去點餐囉！</Typography>
          </Box>
        )}
      </Box>
    </MobileDialogLayout>
  );
};

interface IOrderProps {}
export const OrderDialog = (props: IOrderProps) => {
  const dispatch = useAppDispatch();
  const currentDialog = useAppSelector(({ customerOrder }) => customerOrder.currentDialog);
  const orders = useAppSelector(({ customerOrder }) => customerOrder.orders);

  const handleClose = () => {
    dispatch(closeDialog());
  };

  const handleCheckout = () => {
    console.log("handleCheckout");
  };

  return (
    <MobileDialogLayout
      title="訂單"
      isOpen={currentDialog === ORDER}
      onCloseDialog={handleClose}
      actionButton={<ButtonBase onClick={handleCheckout}>前往結帳</ButtonBase>}
    >
      <Box
        sx={{
          flexGrow: "1",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {orders.length === 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flexGrow: "1"
            }}
          >
            <Typography>沒有訂單記錄</Typography>
          </Box>
        )}
      </Box>
    </MobileDialogLayout>
  );
};
