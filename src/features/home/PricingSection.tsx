// PricingSection.tsx
import React, { useEffect, useRef, useState } from "react"
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Pagination,
  useMediaQuery,
  useTheme,
  styled,
} from "@mui/material"
import { keyframes, GlobalStyles, css } from "@mui/system"

import { AnimatedCard } from "./pricingSection.styles"

const cardData = [
  {
    id: 1,
    title: "基本版",
    price: "1490/月",
    content: ["單一設備連線", "基本銷售報告", "產品庫存管理", "信用卡/現金支付", "電子收據功能", "電子郵件支援"],
    animationClass: ""
  },
  {
    id: 2,
    title: "專業版",
    price: "2970/月",
    content: ["多設備連線", "高級銷售報告", "高級庫存管理", "員工管理與時薪追踪", "促銷活動設定", "24/7專業客服支援"],
    animationClass: ""
  },
  {
    id: 3,
    title: "企業版",
    price: "聯繫獲取定價",
    content: ["定制功能與整合", "企業報告", "專屬客戶經理", "API整合", "線上與電話客服支援", "量身打造的解決方案"],
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




const PricingSection = () => {
  const [cards, setCards] = useState(cardData)
  const [currentPage, setCurrentPage] = useState(1)
  const [ centerCardIndex, setCenterCardIndex ] = useState(1)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [animationClass, setAnimationClass] = useState<{ [key: number]: string }>({
    0: "",
    1: "",
    2: ""
  })


  const theme = useTheme()
  const isTablet = useMediaQuery(theme.breakpoints.up("sm"))


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
      const distance = centerCardIndex - clickedCardIndex
      setAnimationClass({ [centerCardIndex]: "moveLeft", [clickedCardIndex]: "moveRight" })
    } else if (clickedCardIndex > centerCardIndex) {
      // Move clicked card to the right of the center card
      newCards.splice(clickedCardIndex, 1)
      newCards.splice(centerCardIndex, 0, clickedCard)

      // Remove animation classes from all cards
      newCards.forEach((card) => {
        card.animationClass = ""
      })

      // Set animation class
      const distance = clickedCardIndex - centerCardIndex
      setAnimationClass({ [centerCardIndex]: "moveRight", [clickedCardIndex]: "moveLeft" })
    }

    return newCards
  })
  // Reset animation class
  setTimeout(() => {
    setAnimationClass({})
  }, 500)
}


  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value)
  }

  if (isTablet) {
    return (
      <Grid container justifyContent="center" spacing={1}>
        <GlobalStyles styles={globalStyles} />
        {cards.map((card, index) => (
          <Grid item key={`card-${card.id}`} xs={12} sm={4}>
            <AnimatedCard
              className={animationClass[index]}
              onClick={() => handleCardClick(index)}
              data-id={card.id}
              index={index}
              sx={{
                filter: `blur(${index === 1 ? 0 : 1.5}px)})`
              }}
            >
              <CardContent>
                <Typography variant="h5" component="h2">
                  {card.title}
                </Typography>
                <Typography>{card.content}</Typography>
              </CardContent>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  margin: "1rem",
                  pointerEvents: index === 1 ? "auto" : "none"
                }}
              >
                選擇方案
              </Button>
            </AnimatedCard>
          </Grid>
        ))}
      </Grid>
    )
  } else {
    return (
      <>
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
      </>
    )
  }
}

export default PricingSection


