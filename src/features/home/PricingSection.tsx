// PricingSection.tsx
import React, { useState } from "react"
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Pagination,
  List,
  ListItem,
  ListItemText,
  Box,
  Container
} from "@mui/material"
import { GlobalStyles, css } from "@mui/system"
import { Row } from "../../components/layout"
import { useDeviceType } from "./slice"
import { AnimatedCard } from "./PricingSection.styles"
import { CallToActionButton, Title } from "./index.styles"

const pricingData = [
  {
    id: 1,
    title: "基本版",
    price: "299/月",
    content: ["單一設備連線", "基本銷售報告", "產品庫存管理", "信用卡/現金支付", "電子收據功能", "電子郵件支援"],
    imgUrl: "/src/assets/images/pricing-plan01.jpg",
    animationClass: ""
  },
  {
    id: 2,
    title: "專業版",
    price: "999/月",
    content: ["多設備連線", "高級銷售報告", "高級庫存管理", "員工管理與時薪追踪", "促銷活動設定", "24/7專業客服支援"],
    imgUrl: "/src/assets/images/pricing-plan02.jpg",
    animationClass: ""
  },
  {
    id: 3,
    title: "企業版",
    price: "聯繫獲取定價",
    content: ["定制功能與整合", "企業報告", "專屬客戶經理", "API整合", "線上與電話客服支援", "量身打造的解決方案"],
    imgUrl: "/src/assets/images/pricing-plan03.jpg",
    animationClass: ""
  }
]

const globalStyles = css`
  .moveLeft {
    animation: moveLeft 500ms forwards;
  }

  .moveRight {
    animation: moveRight 500ms forwards;
  }

  @keyframes moveLeft {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-100%);
    }
  }

  @keyframes moveRight {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`
interface Props
{
  openModal: () => void
}
const PricingSection: React.FC<Props> = ({openModal}) => {
  const [cards, setCards] = useState(pricingData)
  const [currentPage, setCurrentPage] = useState(1)
  const [centerCardIndex, setCenterCardIndex] = useState(1)
  const [animationClass, setAnimationClass] = useState<{ [key: number]: string }>({
    0: "",
    1: "",
    2: ""
  })

  const deviceType = useDeviceType()
  const handleCardClick = (clickedCardIndex: number) => {
    setCards((prevCards) => {
      const newCards = [...prevCards]
      const clickedCard = newCards[clickedCardIndex]
      const centerCard = newCards[centerCardIndex]
      if (clickedCardIndex < centerCardIndex) {
        // Move clicked card to the left of the center card
        newCards.splice(centerCardIndex, 1, clickedCard)
        newCards.splice(clickedCardIndex, 1, centerCard)
        // Remove animation classes from all cards
        newCards.forEach((card) => {
          card.animationClass = ""
        })
        // Set animation class
        setAnimationClass({ [clickedCardIndex]: "moveRight", [centerCardIndex]: "moveLeft" })
      } else if (clickedCardIndex > centerCardIndex) {
        // Move clicked card to the right of the center card
        newCards.splice(clickedCardIndex, 1)
        newCards.splice(centerCardIndex, 0, clickedCard)
        // Remove animation classes from all cards
        newCards.forEach((card) => {
          card.animationClass = ""
        })
        // Set animation class
        setAnimationClass({ [centerCardIndex]: "moveRight", [clickedCardIndex]: "moveLeft" })
      }

      return newCards
    })
    // Reset animation class
    setTimeout(() => {
      setAnimationClass({})
    }, 300)
  }

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value)
  }

  if (deviceType === "tablet") {
    return (
      <Box bgcolor={"white"} py={15}>
        <Container>
        <Row
          sx={{
            alignItems: "flex-start",
            gap: deviceType === "tablet" ? "6.5rem" : "2.5rem",
            marginBottom: deviceType === "tablet" ? "13.125rem" : "2.5rem"
          }}
        >
          <Title
            title="我們的價格方案"
            subtitle="透明且無隱藏費用的定價，讓您放心選擇 PointPro 做為您的餐飲 POS 合作夥伴。"
          />
          <Typography component={"h3"} fontSize={deviceType === "tablet" ? 48 : 32} fontWeight={900}>
            無論您是新創餐廳還是連鎖品牌， PointPro 都能為您提供最適合的解決方案。
          </Typography>
          </Row>
          </Container>
        <Grid container spacing={2}>
          <GlobalStyles styles={globalStyles} />
          {cards.map((card, index) => (
            <Grid item xs={12} md={4} key={`card-${card.id}`}>
              <AnimatedCard
                className={animationClass[index]}
                onClick={() => handleCardClick(index)}
                data-id={card.id}
                index={index}
              >
                <img
                  style={{ height: 262, borderRadius: "2.5rem", objectFit: "cover", width: "100%" }}
                  src={card.imgUrl}
                  title={card.title}
                />
                <Box pt={deviceType === "tablet" ? 5 : 4} px={deviceType === "tablet" ? 4 : 3} pb={deviceType === "tablet" ? 3 : 2} borderRadius={5} bgcolor={"background.paper"}>
                  <Row sx={{ justifyContent: "space-between" }} mb={5}>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 900 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 900 }}>
                      {card.price}
                    </Typography>
                  </Row>
                  <List sx={{marginBottom: "2.5rem"}}>
                    {card.content.map((content, index) => (
                      <ListItem key={`content-${index}`} sx={{ paddingTop: 0 }}>
                        <ListItemText primary={content} />
                      </ListItem>
                    ))}
                  </List>
                  <CallToActionButton content="立即詢問" handleOnClick={() => openModal()} />
                </Box>
              </AnimatedCard>
            </Grid>
          ))}
        </Grid>
        <Typography component={"p"} fontSize={16} fontWeight={600} align={"center"} mt={5} mb={3}>
          立即註冊，開始免費試用， 讓您的餐飲業務達到新的高峰
        </Typography>
      </Box>
    )
  } else {
    return (
      <Box bgcolor={"white"} py={5}>
        <Grid container justifyContent="center">
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {cards[currentPage - 1].title}
                </Typography>
                <Typography>{cards[currentPage - 1].content}</Typography>
              </CardContent>
              <Button variant="contained" color="primary" sx={{ margin: "1rem" }}>
                選擇方案
              </Button>
            </Card>
          </Grid>
        </Grid>
        <Pagination
          count={cards.length}
          page={currentPage}
          onChange={handlePageChange}
          sx={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}
        />
      </Box>
    )
  }
}

export default PricingSection
