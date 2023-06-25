import { FC, useEffect, useRef, useState } from "react";
import { Container, Box, Typography, useMediaQuery, useTheme } from "@mui/material";

import { CallToActionButton } from "./index.styles";
import { useGetImageUrl } from "~/hooks/useGetImageUrl";

const rootStyle = {
  position: "relative",
  height: "100%",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "0 0 50% 50% / 80% 80% 20% 20%"
} as const;
const videoStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "1080px",
  objectFit: "cover",
  objectPosition: "50% 50%",
  zIndex: 0
} as const;
const curveContainerStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  textShadow: "0px 0px 5px rgba(0,0,0,0.3)"
} as const;

const getCurvePath = (width: number, height: number, borderRadius: number): string => {
  const startX = 0;
  const startY = height - borderRadius;
  const endX = width;
  const endY = startY;
  const controlX = width / 2;
  const controlY = startY + borderRadius; // 調整控制點的 Y 值

  return `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
};

interface Props {
  openModal: () => void;
}

const HeroSection: FC<Props> = ({ openModal }) => {
  const heroSectionRef = useRef<HTMLDivElement | null>(null);
  const [curvePath, setCurvePath] = useState("");
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.up("sm"));

  useEffect(() => {
    const handleSetCurvePath = () => {
      if (isTablet && heroSectionRef.current) {
        const { clientWidth, clientHeight } = heroSectionRef.current;
        const borderRadius = clientHeight / 2;
        setCurvePath(getCurvePath(clientWidth, clientHeight, borderRadius));
      }
    };
    window.addEventListener("resize", handleSetCurvePath);
    return () => {
      window.removeEventListener("resize", handleSetCurvePath);
    };
  }, [isTablet]);

  return (
    <Box bgcolor={"background.paper"}>
      <Box ref={heroSectionRef} sx={{ ...rootStyle, minHeight: isTablet ? "67.5rem" : "50.75rem" }}>
        <video
          style={videoStyle}
          src={useGetImageUrl("pexels-kampus-production-hero-section.mp4", null)}
          autoPlay={true}
          muted={true}
          loop={true}
        />
        <Container
          sx={{ zIndex: 10, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "start" }}
        >
          <Typography variant={isTablet ? "display2" : "h1"} lineHeight={1.2} color="white" component="h1" mb={5}>
            客製化服務， <br />
            提供獨特的餐飲體驗
            <Typography
              variant={isTablet ? "h1" : "h5"}
              sx={{ display: "block" }}
              component="span"
              mt={isTablet ? 3 : 5}
            >
              特別的餐飲體驗, 來自於我們與您的專屬互動
            </Typography>
          </Typography>
          <CallToActionButton content="立即詢問" handleOnClick={() => openModal()} />
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
                width: "100%",
                zIndex: -1,
                transform: "translateY(10%)"
              }}
            >
              <path id="curve" d={curvePath} fill="none" />
              <text width="100ch" fill="white" dy="8rem" fontSize="1.25rem">
                <textPath href="#curve" textAnchor="middle" startOffset="50%">
                  立即開啟PointPro餐飲POS系統,掌握每一次點餐,提升顧客滿意度
                </textPath>
              </text>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default HeroSection;
