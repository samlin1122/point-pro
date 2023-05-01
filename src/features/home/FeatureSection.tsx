import { Box, Container, Grid, Typography } from "@mui/material"
import { Column, Row } from "../../components/layout"
import { Title } from "./index.styles"
import { useDeviceType } from "./slice"
import FeatureCard from "./FeatureSection.style"
import { Assignment, MoreTime, ChromeReaderMode, MenuBook } from "@mui/icons-material"

interface FeatureData {
  title: string
  content: {
    imgUrl?: string
    icon?: JSX.Element
    title: string
    description: string
  }[]
}

const featureData: FeatureData[]  = [
  {
    title: "個性化、貼心、無微不至的餐飲服務",
    content: [
      {
        imgUrl: "/src/assets/images/feature01.jpg",
        title: "客製化菜單",
        description: "提供客人個性化的餐飲選擇，讓他們品嚐到獨特的體驗"
      },
      {
        imgUrl: "/src/assets/images/feature02.jpg",
        title: "溫馨提醒",
        description: "智能POS助顧客餐點補充，感受關懷與新鮮度。"
      },
      {
        imgUrl: "/src/assets/images/feature03.jpg",
        title: "科技提升體驗",
        description: "智能點餐、雲端支付,顧客享受便利與舒適。"
      },
      {
        imgUrl: "/src/assets/images/feature04.jpg",
        title: "客人回饋",
        description: "定期收集意見,解決問題，顧客感受尊重。"
      }
    ]
  },
  {
    title: "智能化經營,靈活管理,實現更大收益",
    content: [
      {
        icon: <Assignment sx={{ fontSize: 40 }} />,
        title: "訂單管理",
        description: "簡便且高效的訂單管理系統，<br />幫助餐廳營運更流暢"
      },
      {
        icon: <MoreTime sx={{ fontSize: 40 }} />,
        title: "預訂管理",
        description: "直觀的預訂管理系統，<br />使餐廳更優化預訂管理"
      },
      {
        icon: <ChromeReaderMode sx={{ fontSize: 40 }} />,
        title: "菜單管理",
        description: "簡單的菜單編輯工具，<br />讓餐廳可以輕鬆管理和編輯"
      },
      {
        icon: <MenuBook sx={{ fontSize: 40 }} />,
        title: "庫存管理",
        description: "庫存管理工具，讓餐廳可以<br />更好地管理庫存，減少浪費"
      }
    ]
  }
]

const FeatureSection = () =>
{
  const deviceType = useDeviceType()
  return (
    <Box pt={20} bgcolor={"background.paper"}>
      <Container>
        <Column sx={{ gap: deviceType === "tablet" ? "5rem" : "2.5rem" }}>
          <Box display={"flex"} flexDirection={deviceType === "tablet" ? "row" : "column"} gap={deviceType === "tablet" ? "6rem" : "2.5rem" }>
            <Title
              title="產品功能特色"
              subtitle="為您的餐廳帶來卓越的管理體驗，PointPro POS 系統專為提升營運效率而設計"
            />
            <Typography component={"h3"} fontSize={deviceType === "tablet" ? 48 : 32} fontWeight={900}>
              {featureData[0].title}
            </Typography>
          </Box>
          <Grid container spacing={deviceType === "tablet" ? 3 : 2}>
            {featureData[0].content.map((feature, index) => {
              return (
                <Grid item xs={12} md={3} key={feature.title}>
                  <img
                    src={feature.imgUrl}
                    alt=""
                    style={{
                      borderRadius: "2.5rem",
                      width: "100%",
                      maxHeight: deviceType === "tablet" ? "17.625rem" : "21.9375rem",
                      aspectRatio: deviceType === "tablet" ? "51/47" : "1/1",
                      objectFit: "cover"
                    }}
                  />
                  <Box
                    flex={"column"}
                    px={deviceType === "tablet" ? 3 : 2}
                    pt={deviceType === "tablet" ? 4 : 3}
                    pb={3}
                    textAlign={"center"}
                  >
                    <Typography component={"h3"} fontSize={24} fontWeight={900}>
                      {feature.title}
                    </Typography>
                    <Typography component={"p"} fontSize={deviceType === "tablet" ? 24 : 16}>
                      {feature.description}
                    </Typography>
                  </Box>
                </Grid>
              )
            })}
          </Grid>
          <Grid container spacing={deviceType === "tablet" ? 3 : 5} justifyContent={"space-between"} alignItems={"stretch"}>
            <Grid item xs={12} md={6} display={"flex"} flexDirection={"column"} justifyContent={"space-between"}>
              <Typography component={"h3"} variant={deviceType === "tablet" ? "h1" : "h3"} fontWeight={900} sx={{maxWidth: "32rem"}}>
                {featureData[ 1 ].title}
              </Typography>
              {
                deviceType === "tablet" && <Box mt={'auto'} ml={'auto'}>
                  <img src="/src/assets/featureIllustration.svg" alt="" />
                </Box>
              }
            </Grid>
            <Grid item xs={12} md={5} display={"flex"} flexDirection={"column"} gap={deviceType === "tablet" ? "1rem" : "0.5rem"}>
              {
                featureData[ 1 ].content.map((feature, index) =>
                {
                  return (
                    <FeatureCard
                    key={feature.title}
                    description={feature.description}
                    title={feature.title}>
                      {feature.icon}
                    </FeatureCard>
                  )
                }
                )}
            </Grid>
          </Grid>
        </Column>
      </Container>
    </Box>
  )
}

export default FeatureSection
