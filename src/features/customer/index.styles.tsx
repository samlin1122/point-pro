// Libs
import React, { useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Breadcrumbs,
  Drawer,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Link,
  RadioGroup,
  Typography
} from "@mui/material"
import MenuBookIcon from "@mui/icons-material/MenuBook"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import ReceiptIcon from "@mui/icons-material/Receipt"
// Components
import { ButtonBase } from "~/components/buttons"
import { CheckboxBase } from "~/components/checkbox"
import { RadioBase } from "~/components/radio"
// Others
import logoIcon from "~/assets/logo.svg"
import { useAppDispatch, useAppSelector } from "~/app/hook"
import { closeBottomDrawer } from "./slice"

export const Header = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: ".5rem",
        padding: ".5rem",
        fontWeight: "bold",
        fontSize: "1.5rem"
      }}
    >
      <Breadcrumbs>
        <Link href="/" underline="hover" color="inherit">
          港都熱炒
        </Link>
        <Typography sx={{ fontWeight: "bold", color: "#000" }}>我要點餐</Typography>
      </Breadcrumbs>
      <Typography sx={{ fontSize: "40px", fontWeight: "bold" }}>港都熱炒</Typography>
      {/* <img src={logoIcon} alt='logo' width='32px' /> Point Pro */}
    </Box>
  )
}

export const Footer = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavigate = (e: React.SyntheticEvent<Element, Event>, newValue: string) => {
    navigate(`/${newValue}`)
  }

  return (
    <BottomNavigation
      showLabels
      value={location?.pathname.split("/")[1]}
      onChange={handleNavigate}
      sx={{
        display: "fixed",
        border: "1px solid red"
      }}
    >
      <BottomNavigationAction label="菜單" value="menu" icon={<MenuBookIcon />} />
      <BottomNavigationAction label="購物車" value="cart" icon={<ShoppingCartIcon />} />
      <BottomNavigationAction label="訂單" value="orders" icon={<ReceiptIcon />} />
    </BottomNavigation>
  )
}

interface ISpecialtiesValue {}

export const BottomDrawer = () => {
  const dispatch = useAppDispatch()
  const meals = useAppSelector(({ customer }) => customer.meals)
  const isShowBottomDrawer = useAppSelector(({ customer }) => customer.isShowBottomDrawer)
  const currentMealId = useAppSelector(({ customer }) => customer.currentMealId)
  const currentMeal = meals.find((meal) => meal.id === currentMealId)

  const specialtiesValue = useRef<{ [key: string]: number[] }>({})

  const handleClose = () => {
    dispatch(closeBottomDrawer())
  }

  const handleCustomize = () => {
    dispatch(closeBottomDrawer())
  }

  const handleAddCart = () => {
    console.log("onAddCart", specialtiesValue)
  }

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>, value: string) => {
    console.log("[onRadioChange]", e.target.name, value)
    const fieldName = e.target.name
    const fieldValue = +value
    const currentFieldValue = specialtiesValue.current[fieldName] || []
    specialtiesValue.current = { ...specialtiesValue.current, [fieldName]: [...currentFieldValue, fieldValue] }
  }

  const handleChangeCheckbox = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    console.log("[onCheckboxChange]", e.target.name, e.target.value, checked)
    const fieldName = e.target.name
    const fieldValue = +e.target.value
    const currentFieldValue = specialtiesValue.current[fieldName] || []
    const newFieldValue = checked
      ? [...specialtiesValue.current[fieldName], fieldValue]
      : currentFieldValue.filter((id) => id !== fieldValue)
    // [TODO]
    // let currentSpecialtiesValue = specialtiesValue[fieldName];
    specialtiesValue.current[fieldName] = newFieldValue
    // if (Array.isArray(specialtiesValue[fieldName])) {
    //   if (checked) {
    //     specialtiesValue[fieldName].push(fieldValue)
    //   } else {
    //     specialtiesValue[fieldName] = specialtiesValue[fieldName].filter((id: any) => id !== fieldValue)
    //   }
    // } else {
    //   specialtiesValue[fieldName] = [fieldValue]
    // }
  }

  return (
    <Drawer open={isShowBottomDrawer} onClose={handleClose} anchor="bottom">
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
          >
            {currentMeal?.title}
          </Typography>

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
                      control={<CheckboxBase onChange={handleChangeCheckbox} name={specialty.title} />}
                    />
                  ))}
                </FormGroup>
              )}
            </Box>
          ))}

          <ButtonBase
            sx={{
              borderRadius: "10px",
              margin: "5px",
              bgcolor: "#F7E252"
            }}
            onClick={handleAddCart}
          >
            加入購物車
          </ButtonBase>
        </FormControl>
      </Box>
    </Drawer>
  )
}
