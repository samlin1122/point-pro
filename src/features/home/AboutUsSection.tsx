import { Box, Container, Typography, Grid } from '@mui/material'
import { Column } from '~/components/layout';
import { Title } from './index.styles';
import AboutUsAvatarCard from './AboutUsSection.style';
import { useDeviceType } from './slice';

const aboutUsData = [
  {
    name: "Alan",
    title: "CEO",
    imgUrl: "src/assets/images/us-01.png",
  },
  {
    name: "Sam",
    title: "CO-FOUNDER",
    imgUrl: "src/assets/images/us-02.png",
  },
  {
    name: "Emily",
    title: "DEVELOPER",
    imgUrl: "src/assets/images/us-03.png",
  },
  {
    name: "LinYee",
    title: "DEVELOPER",
    imgUrl: "src/assets/images/us-04.png",
  },
  {
    name: "ShihHuan",
    title: "DEVELOPER",
    imgUrl: "src/assets/images/us-05.png",
  },
  {
    name: "Cooper",
    title: "DESIGNER",
    imgUrl: "src/assets/images/us-06.png",
  },
]

const AboutUsSection = () =>
{
  const deviceType = useDeviceType();

  return (
    <Box bgcolor={"background.paper"} pt={deviceType === "tablet" ? "5rem" : "2.5rem"} pb={deviceType === "tablet" ? "10rem" : "5rem"}>
      <Container>
        <Column>
          <Box position={"relative"} flex={"auto"}>
            <img src="/src/assets/images/about-us.jpg" style={{
              width: "100%",
              borderRadius: deviceType === "tablet" ? "2.5rem" : "0",
            }}  alt="" />
            <Typography variant={deviceType === "tablet" ? "display1": "h1"} lineHeight={1.2} component={"h2"} color="primary.main" fontWeight={900} textTransform={"uppercase"} position={"absolute"} top={'100%'} right={0} sx={{
              transform: deviceType === "tablet" ? "translateY(calc(-100% + 5rem))" : "translateY(calc(-100% + 2rem))",
            }}>
              About Us.</Typography>
          </Box>
          <Title title={"我們傳奇的團隊"} subtitle={"我們是一群充滿熱情的專家，使用最新技術和工具為餐飲行業提供全方位的解決方案"} sx={{ marginTop: deviceType === "tablet" ? "7.5rem" : "4rem" }} />
          <Grid container spacing={deviceType === "tablet" ? 3 : 1} mt={5}>
            {aboutUsData.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <AboutUsAvatarCard name={item.name} title={item.title} imgUrl={item.imgUrl} />
              </Grid>
            ))}
          </Grid>
        </Column>
      </Container>
    </Box>
  )
}

export default AboutUsSection