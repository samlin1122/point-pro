// Libs
import React, { useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { BottomNavigation, BottomNavigationAction, Box, Breadcrumbs, Drawer, FormControl, FormControlLabel, FormGroup, FormLabel, Link, RadioGroup, Typography } from '@mui/material'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ReceiptIcon from '@mui/icons-material/Receipt'
// Components
import { ButtonBase } from '~/components/buttons'
import { CheckboxBase } from '~/components/checkbox'
import { RadioBase } from '~/components/radio'
// Others
import logoIcon from '~/assets/logo.svg'
import { useAppDispatch, useAppSelector } from '~/app/hook'
import { closeBottomDrawer } from './slice'

export const Header = () => {

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '.5rem',
      padding: '.5rem',
      fontWeight: 'bold',
      fontSize: '1.5rem',
    }}>
      <Breadcrumbs>
        <Link href="/" underline="hover" color="inherit">港都熱炒</Link>
        <Typography sx={{ fontWeight: 'bold', color: '#000' }}>我要點餐</Typography>
      </Breadcrumbs>
      <Typography sx={{ fontSize: '40px', fontWeight: 'bold' }}>港都熱炒</Typography>
      {/* <img src={logoIcon} alt='logo' width='32px' /> Point Pro */}
    </Box >
  )
}

export const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const onNavigate = (e: React.SyntheticEvent<Element, Event>, newValue: string) => {
    navigate(`/${newValue}`);
  }

  return (
    <BottomNavigation
      showLabels
      value={location?.pathname.split('/')[1]}
      onChange={onNavigate}
      sx={{
        display: 'fixed',
        border: '1px solid red'
      }}
    >
      <BottomNavigationAction
        label="菜單"
        value='menu'
        icon={<MenuBookIcon />}
      />
      <BottomNavigationAction
        label="購物車"
        value='cart'
        icon={<ShoppingCartIcon />}
      />
      <BottomNavigationAction
        label="訂單"
        value='orders'
        icon={<ReceiptIcon />}
      />
    </BottomNavigation>
  )
}

interface ISpecialitiesValue {

}

export const BottomDrawer = () => {
  const dispatch = useAppDispatch();
  const meals = useAppSelector(({ customer }) => customer.meals);
  const isShowBottomDrawer = useAppSelector(({ customer }) => customer.isShowBottomDrawer);
  const currentMealId = useAppSelector(({ customer }) => customer.currentMealId);
  const currentMeal = meals.find(meal => meal.id === currentMealId);

  const specialitiesValue: any = useRef({}).current;

  const onClose = () => {
    dispatch(closeBottomDrawer());
  };

  const onCustomize = () => {
    dispatch(closeBottomDrawer());
  }

  const onAddCart = () => {
    console.log('onAddCart', specialitiesValue);
  }

  const onRadioChange = (e: React.ChangeEvent<HTMLInputElement>, value: string) => {
    console.log('[onRadioChange]', e.target.name, value);
    const fieldName = e.target.name;
    const fieldValue = +value;
    specialitiesValue[fieldName] = fieldValue;
  }

  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    console.log('[onCheckboxChange]', e.target.name, e.target.value, checked);
    const fieldName = e.target.name;
    const fieldValue = +e.target.value;
    // [TODO]
    // let currerntSpecialitiesValue = specialitiesValue[fieldName];
    if (Array.isArray(specialitiesValue[fieldName])) {
      if (checked) {
        specialitiesValue[fieldName].push(fieldValue);
      } else {
        specialitiesValue[fieldName] = specialitiesValue[fieldName].filter((id: any) => id !== fieldValue);
      }
    } else {
      specialitiesValue[fieldName] = [fieldValue];
    }
  }


  return (
    <Drawer
      open={isShowBottomDrawer}
      onClose={onClose}
      anchor='bottom'
    >
      <Box
        component='form'
        onSubmit={onCustomize}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          padding: '5px'
        }}
      >
        <FormControl sx={{ width: '100%' }}>
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold'
            }}
          >
            {currentMeal?.title}
          </Typography>

          {currentMeal?.specialities.map(speciality => (
            <Box key={speciality.id}>
              <FormLabel id={speciality.id}>
                {speciality.title}:
              </FormLabel>

              {speciality.type === 'single' && (
                <RadioGroup
                  row
                  aria-labelledby={speciality.id}
                  id={speciality.id}
                  name={speciality.title}
                  onChange={onRadioChange}
                >
                  {speciality.items.map(item => (
                    <FormControlLabel
                      key={item.id}
                      value={item.id}
                      label={item.title}
                      control={<RadioBase />}
                    />
                  ))}
                </RadioGroup>
              )}

              {speciality.type === 'multiple' && (
                <FormGroup
                  row
                  aria-labelledby={speciality.id}
                  id={speciality.id}
                >
                  {speciality.items.map(item => (
                    <FormControlLabel
                      key={item.id}
                      value={item.id}
                      label={item.title}
                      control={<CheckboxBase onChange={onCheckboxChange} name={speciality.title} />}
                    />
                  ))}
                </FormGroup>
              )}
            </Box>
          ))}

          <ButtonBase
            sx={{
              borderRadius: '10px',
              margin: '5px',
              bgcolor: '#F7E252',
            }}
            onClick={onAddCart}
          >
            加入購物車
          </ButtonBase>
        </FormControl>
      </Box>
    </Drawer>
  )
}