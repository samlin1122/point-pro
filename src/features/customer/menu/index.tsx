// Libs
import { useEffect } from 'react'
import { Box } from '@mui/material'
// Components
import MobileLayout from '~/hoc/mobile-layout'
import { SeatInfo, MenuNavbar, Meals } from './index.styles'
// Others
import { useAppDispatch } from '~/app/hook'
import { fetchMenu } from '../slice'

interface IMenuProps {
}

const Menu = (props: IMenuProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchMenu());
  }, [])


  return (
    <MobileLayout>
      <Box
        sx={{
          flexGrow: '1',
          padding: "0 10px",
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <SeatInfo />
        <MenuNavbar />
        <Meals />
      </Box>
    </MobileLayout>
  )
}

export default Menu