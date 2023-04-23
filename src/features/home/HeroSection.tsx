import { Container, Box, Typography, useMediaQuery, useTheme } from "@mui/material"
import { useEffect, useRef, useState } from "react"

const rootStyle = {
  position: "relative",
  height: "80vh",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "0 0 50% 50% / 0 0 8rem 8rem",
  backgroundColor: "rgba(0, 0, 0, 0.2)"
} as const
const videoStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
} as const
const curveContainerStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  textShadow: "0px 0px 5px rgba(0,0,0,0.3)",
} as const

const getCurvePath = (width: number, height: number, borderRadius: number): string => {
  const startX = 0
  const startY = height - borderRadius
  const endX = width
  const endY = startY
  const controlX = width / 2
  const controlY = startY + borderRadius // 調整控制點的 Y 值

  return `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`
}

const HeroSection = () =>
{
  const heroSectionRef = useRef<HTMLDivElement | null>(null)
  const [ curvePath, setCurvePath ] = useState("")
  const theme = useTheme()
  const isTablet = useMediaQuery(theme.breakpoints.up("sm"))

  useEffect(() => {
    if (isTablet && heroSectionRef.current) {
      const { clientWidth, clientHeight } = heroSectionRef.current
      const borderRadius = clientHeight / 2
      setCurvePath(getCurvePath(clientWidth, clientHeight, borderRadius))
    }
  }, [isTablet])

  return (
    <Box ref={heroSectionRef} sx={rootStyle}>
      <video
        style={videoStyle}
        width="auto"
        height="100%"
        src="src/assets/pexels-kampus-production-hero-section.mp4"
        autoPlay={true}
        muted={true}
        loop={true}
      />
      <Container sx={curveContainerStyle}>
        <Typography variant="h1" sx={{ color: "white" }} component="h1">
          客製化服務， 提供獨特的餐飲體驗
          <Typography variant="h2" sx={{ display: "block" }} component="span">
            特別的餐飲體驗, 來自於我們與您的專屬互動
          </Typography>
        </Typography>
        {isTablet && (
          <Box
            component="svg"
            viewBox={`0 0 ${heroSectionRef.current?.clientWidth || 0} ${heroSectionRef.current?.clientHeight || 0}`} // 修改 viewBox 的值
            sx={{
              position: "absolute",
              bottom: 0, // 將 bottom 改為正值
              left: 0,
              right: 0,
              marginLeft: "auto",
              marginRight: "auto",
              width: "100%"
            }}
          >
            <path id="curve" d={curvePath} fill="none" />
            <text width="1000" fill="white" dy="8rem">
              <textPath href="#curve" startOffset="30%">
                立即開啟PointPro餐飲POS系統,掌握每一次點餐,提升顧客滿意度
              </textPath>
            </text>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default HeroSection
