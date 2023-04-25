// Libs
import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Tab,
  Tabs,
  Typography,
  tabsClasses
} from "@mui/material"
// Others
import { useAppDispatch, useAppSelector } from "~/app/hook"
import { showBottomDrawer } from "../slice"

interface ISeatInfoProps {}

export const SeatInfo = (props: ISeatInfoProps) => {
  return (
    <Grid
      container
      sx={{
        bgcolor: "#F7E252",
        padding: "10px",
        borderRadius: "5px"
      }}
    >
      <Grid item xs={6}>
        座位 : A03-1
      </Grid>
      <Grid item xs={6}>
        入座時間 : 17:30
      </Grid>
    </Grid>
  )
}

interface IMenuNavbarProps {}

export const MenuNavbar = (props: IMenuNavbarProps) => {
  const navigate = useNavigate()
  const { categoryId = "1" } = useParams()

  const categories = useAppSelector(({ customer }) => customer.categories)

  const onChange = (e: React.SyntheticEvent, newValue: string) => {
    navigate(`/menu/${newValue}`)
  }
  return (
    <Tabs
      value={categoryId}
      onChange={onChange}
      variant="scrollable"
      scrollButtons
      allowScrollButtonsMobile
      sx={{
        [`& .${tabsClasses.scrollButtons}`]: {
          width: "24px",
          "&.Mui-disabled": { opacity: 0.3 }
        },
        marginBottom: "10px"
      }}
    >
      {categories.map(({ id, title }) => (
        <Tab key={id} value={id} label={title} />
      ))}
    </Tabs>
  )
}

interface IMealsProps {}

export const Meals = (props: IMealsProps) => {
  const { categoryId = "1" } = useParams()
  const dispatch = useAppDispatch()
  const meals = useAppSelector(({ customer }) => customer.meals)

  const showMeals = meals.filter((meal) => meal.categories.filter((category) => category.id === categoryId).length > 0)

  const onClickMeal = (currentMealId: string) => () => {
    dispatch(showBottomDrawer({ currentMealId }))
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexWrap: "nowrap",
        gap: "10px",
        height: "calc(100vh - 210px)", //[TODO]
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
          <CardActionArea sx={{ display: "flex" }} onClick={onClickMeal(meal.id)}>
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
  )
}
