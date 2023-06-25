import { FC, useEffect, useState } from "react";
import { IconButton, Typography, styled } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useDeviceType } from "./slice";

interface BackToTopButtonProps {
  position: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

const BackToTopStyleButton = styled(IconButton)`
  && {
    background-color: #020202;
    border-radius: 20px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const BackToTopButton: FC<BackToTopButtonProps> = ({ position }) => {
  const deviceType = useDeviceType();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      setIsVisible(currentScrollPosition > windowHeight * 0.1);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const buttonSize = deviceType === "tablet" ? { width: 120, height: 120 } : { width: 150, height: 48 };

  const buttonScale = isVisible ? 1 : 0;
  const buttonOpacity = isVisible ? 1 : 0;

  return (
    <BackToTopStyleButton
      onClick={handleClick}
      sx={{
        ...buttonSize,
        position: "fixed",
        ...position,
        flexDirection: deviceType === "tablet" ? "column" : "row",
        transform: `scale(${buttonScale})`,
        opacity: buttonOpacity,
        transition: ".3s",
        zIndex: (theme) => theme.zIndex.tooltip
      }}
    >
      <ArrowUpwardIcon fontSize="large" />
      <Typography variant="small">Back to Top</Typography>
    </BackToTopStyleButton>
  );
};

export default BackToTopButton;
