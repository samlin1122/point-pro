import { ChangeEvent, FC, useState } from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useDeviceType } from "./slice";
import {
  SubscribeSectionInputContainer,
  SubscribeSectionInputBase,
  SubscribeSectionStyledCard,
  SubscribeSectionIconButton
} from "./SubscribedSection.style";

const SubscribedSection: FC = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [email, setEmail] = useState("");
  const [errorMessages, setErrorMessages] = useState("");
  const [checked, setChecked] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const deviceType = useDeviceType();

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (email.length === 0) setIsFocused(false);
  };
  const handleButtonClick = () => {
    console.log("Button clicked");
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    setEmail(e.target.value);
    if (e.target.value.length > 0) {
      setIsFocused(true);
      if (emailRegex.test(email)) {
        setButtonDisabled(false);
        setErrorMessages("");
      } else {
        setErrorMessages("請輸入有效的電子郵件地址");
      }
    }
    if (e.target.value.length === 0) {
      setIsFocused(false);
      setButtonDisabled(true);
      setErrorMessages("");
    }
  };

  return (
    <Box bgcolor={"background.paper"} py={deviceType === "tablet" ? "5rem" : "2.5rem"}>
      <Container>
        <SubscribeSectionStyledCard>
          <Box py={deviceType === "tablet" ? "7.5rem" : "2rem"} px={deviceType === "tablet" ? "5rem" : "1.5rem"}>
            <Grid container spacing={2} alignItems={"center"} justifyContent={"space-between"}>
              <Grid item xs={12} md={6}>
                <Typography variant={"h1"} component={"h2"} fontWeight={"900"} mb={3}>
                  {"掌握第一手促銷"}
                </Typography>
                <Typography component={"p"}>
                  {"訂閱我們的電子報,了解最新餐飲趨勢和專家建議,還可獲得專屬優惠和折扣"}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ width: "100%", position: "relative" }}>
                  <SubscribeSectionInputContainer
                    sx={{
                      outlineWidth: "2px",
                      outlineStyle: "solid",
                      outlineColor: isFocused ? (theme) => theme.palette.primary.main : "transparent"
                    }}
                  >
                    <Box>
                      <SubscribeSectionInputBase
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        value={email}
                        onChange={handleInputChange}
                        placeholder="請輸入您的 E-mail"
                      />
                      {
                        <Typography
                          variant={"small"}
                          component={"p"}
                          fontWeight={"400"}
                          hidden={!errorMessages}
                          color={"error"}
                        >
                          {errorMessages}
                        </Typography>
                      }
                    </Box>
                    <SubscribeSectionIconButton
                      disabled={buttonDisabled}
                      disableRipple={true}
                      disableFocusRipple={true}
                      onClick={handleButtonClick}
                    >
                      <ArrowForwardIcon />
                    </SubscribeSectionIconButton>
                  </SubscribeSectionInputContainer>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </SubscribeSectionStyledCard>
      </Container>
    </Box>
  );
};

export default SubscribedSection;
