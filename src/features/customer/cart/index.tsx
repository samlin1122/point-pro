// Libs
import React from 'react'
import { Box, Typography } from '@mui/material'
// Components
import { ButtonBase } from '~/components/buttons'
import MobileLayout from '~/hoc/mobile-layout'
// Others
import { useAppSelector } from '~/app/hook'

interface ICartProps {

}

const Cart = (props: ICartProps) => {
  const cart = useAppSelector(({ customer }) => customer.cart);
  return (
    <MobileLayout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          flexGrow: '1',
        }}
      >
        <Box sx={{
          flexGrow: '1',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {cart.length > 0
            ? <>
              <Typography variant='h5' sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                訂購明細
              </Typography>
            </>
            : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexGrow: '1',
                }}
              >
                <Typography>快去點餐囉！</Typography>
              </Box>
            )
          }
        </Box>
        {cart.length > 0 && (
          <ButtonBase
            sx={{
              borderRadius: '10px',
              margin: '5px',
              bgcolor: '#F7E252'
            }}
          >
            送出訂單
          </ButtonBase>
        )}
      </Box>
    </MobileLayout >
  )
}

export default Cart