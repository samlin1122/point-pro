// Libs
import React from 'react'
import { Box, Typography } from '@mui/material'
// Components
import MobileLayout from '~/hoc/mobile-layout'
import { ButtonBase } from '~/components/buttons'
// Others
import { useAppSelector } from '~/app/hook'

interface IOrderProps {

}

const Order = (props: IOrderProps) => {
  const orders = useAppSelector(({ customer }) => customer.orders);

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
          {orders.length > 0
            ? <></>
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
                <Typography>沒有訂單記錄</Typography>
              </Box>
            )
          }
        </Box>
        {orders.length > 0 && (
          <ButtonBase
            sx={{
              borderRadius: '10px',
              margin: '5px',
              bgcolor: '#F7E252'
            }}
          >
            前往結帳
          </ButtonBase>
        )}
      </Box>
    </MobileLayout>
  )
}

export default Order