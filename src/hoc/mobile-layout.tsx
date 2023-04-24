// Libs
import React from 'react'
import { Box } from '@mui/material';
// Components
import { BottomDrawer, Footer, Header } from '../features/customer/index.styles';

interface IMobileLayoutProps {
  children: React.ReactNode
}

const MobileLayout = (props: IMobileLayoutProps) => {
  const { children } = props;

  return (
    <Box sx={{
      width: "100vw",
      maxWidth: "768px",
      minHeight: "100vh",
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <Header />
      {children}
      <Footer />
      <BottomDrawer />
    </Box>
  )
}

export default MobileLayout