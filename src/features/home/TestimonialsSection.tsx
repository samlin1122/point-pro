import { Box, Container, Typography, Rating } from "@mui/material"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Column, Row } from "../../components/layout"
import { Title } from "./index.styles"
import { useDeviceType } from "./slice"

import "swiper/css"

const testimonialsData = [
  {
    name: "林怡君",
    rate: 5,
    imgUrl: "src/assets/images/testimonials-1.jpg",
    content: "我們的餐廳使用了PointPro，非常滿意！系統操作簡單易懂，訂單處理更加快速，客戶滿意度也大幅提升了。"
  },
  {
    name: "李大偉",
    rate: 4.5,
    imgUrl: "src/assets/images/testimonials-2.jpg",
    content:
      "在PointPro的支援下，我們店裡的客戶服務更加高效率。系統可以追蹤訂單，幫助我們掌握客人喜好，並且快速處理退款等問題。"
  },
  {
    name: "張家豪",
    rate: 5,
    imgUrl: "src/assets/images/testimonials-3.jpg",
    content:
      "我在使用PointPro的餐廳點餐時，感到非常方便和快速。系統操作簡單易懂，訂單也能快速處理，餐點的味道也非常美味。"
  },
  {
    name: "黃雅婷",
    rate: 5,
    imgUrl: "src/assets/images/testimonials-4.jpg",
    content: "我們店裡使用了PointPro的內用點餐系統，大大減輕了我們員工的工作量，客人點餐更加方便快速。"
  },
  {
    name: "許志偉",
    rate: 4.5,
    imgUrl: "src/assets/images/testimonials-5.jpg",
    content: "PointPro的外帶點餐系統非常好用，能夠快速處理訂單，大大提高了效率，也省去了客人等待的時間。"
  },
  {
    name: "郭承恩",
    rate: 5,
    imgUrl: "src/assets/images/testimonials-6.jpg",
    content: "我們公司導入了PointPro，整合了POS系統、訂單管理等多個功能，讓我們的營運管理更加順暢。"
  }
]

const TestimonialsSection = () => {
  const deviceType = useDeviceType()
  return (
    <Box pt={20} bgcolor={"background.paper"} sx={{ userSelect: "none"}}>
      <Container>
        <Column sx={{ gap: deviceType === "tablet" ? "5rem" : "2.5rem", marginBottom: deviceType === "tablet" ? "5rem" : "2.5rem"  }}>
          <Row sx={{ gap: deviceType === "tablet" ? "6.5rem" : "2.5rem" }}>
            <Title title="客戶分享" subtitle="他們的成功故事" />
          </Row>
          </Column>
      <Swiper
          spaceBetween={deviceType === "tablet" ? 30 : 16}
          slidesPerView={deviceType === "tablet" ? 3 : 1}
          centeredSlides={true}
          grabCursor={true}
          loop={true}
          >
          {testimonialsData.map((feature, index) => {
            return (
              <SwiperSlide key={feature.name}>
                <img
                  src={feature.imgUrl}
                  alt=""
                  style={{
                    borderRadius: "2.5rem",
                    width: "100%",
                    height: "100%",
                    maxHeight: "19.5rem",
                    aspectRatio: "4/3",
                    objectFit: "cover",
                    objectPosition: "50% 50%"
                  }}
                />
                <Box bgcolor={"white"} borderRadius={"2.5rem"} flex={"column"} px={deviceType === "tablet" ? 3 : 2} pt={deviceType === "tablet" ? 4 : 3} pb={3}>
                  <Rating value={feature.rate} precision={0.5} size="small" readOnly />
                  <Typography component={"h3"} fontSize={24} fontWeight={900}>
                    {feature.name}
                  </Typography>
                  <Typography component={"p"} fontSize={16}>
                    {feature.content}
                  </Typography>
                </Box>
              </SwiperSlide>
            )
          })}
        </Swiper>
        </Container>
      </Box>
  )
}

export default TestimonialsSection
