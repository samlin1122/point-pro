import { ChangeEvent, FC, useEffect, useState } from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useDeviceType } from "./slice";
import {
  SubscribeSectionInputContainer,
  SubscribeSectionInputBase,
  SubscribeSectionStyledCard,
  SubscribeSectionIconButton
} from "./SubscribedSection.style";
import { ModalBase } from "~/components/modals";
import { ButtonBase } from "~/components/buttons";
import { useAppDispatch } from "~/app/hook";
import { sendMail } from "~/app/slices/mailer";

interface SubscribeSectionDialogProps {
  open: boolean;
  handleClose: (val: boolean) => void;
  email: string;
  children: React.ReactNode;
}

const SubscribeSectionDialog = (props: SubscribeSectionDialogProps) => {
  const { open, handleClose, children, email } = props;
  const dispatch = useAppDispatch();

  const handleCloseModal = async (val: boolean) => {
    const html = `
    <h1>親愛的客戶，您好</h1>
    <p>感謝您訂閱「PointPro」的電子報！我們非常高興能夠與您建立聯繫並分享最新的產品和行業資訊。在這封信中，我們想向您介紹一些我們的服務以及您可以期待的好處。</p>
    <p>
「PointPro」是一個專為餐飲業打造的先進POS系統，我們致力於幫助餐廳提升營運效率，提供更優質的客戶體驗。以下是一些您可以期待的「PointPro」的優點：</p>

    <ol>
    <li>簡單易用的操作界面：我們設計了直觀且使用者友好的界面，使您能夠輕鬆管理訂單、庫存、員工和報表等。</li>
    <li>客製化功能：「PointPro」提供了豐富的功能和模組，讓您能夠根據您的餐廳需求自訂設定，包括餐桌管理、菜單設計、促銷活動等。</li>
    <li>即時數據和報表：我們的系統能夠提供即時的銷售數據和報表，讓您能夠快速了解餐廳的營運狀況，做出明智的決策。</li>
    <li>客戶支援和培訓：我們擁有一支專業的客戶支援團隊，隨時為您提供協助和解答問題。此外，我們還提供全面的培訓資源，以確保您和您的團隊能夠充分發揮「PointPro」系統的潛力。</li>
    </ol>
    <p>我們期待能夠與您共同合作，幫助您的餐廳取得更大的成功。如果您有任何問題或需要進一步的資訊，請隨時聯繫我們的客戶支援團隊。再次感謝您的訂閱，我們期待在未來的電子報中與您分享更多有價值的內容。</p>
    <p>祝您一切順利！</p>
    <p>最誠摯的問候，順頌時祺</p>
    <h2>「PointPro」團隊敬上</h2>
    `;
    const request = {
      to: email,
      subject: "歡迎訂閱「PointPro」電子報！",
      html
    };
    console.log(request);
    await dispatch(sendMail(request));
    handleClose(val);
  };

  return (
    <ModalBase open={open} onClose={() => handleCloseModal(true)}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          width: "80%",
          bgcolor: "common.white",
          textAlign: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "1.5rem"
        }}
      >
        {children}
        <ButtonBase variant={"contained"} color={"primary"} fullWidth onClick={() => handleCloseModal(true)}>
          確認
        </ButtonBase>
      </Box>
    </ModalBase>
  );
};

const SubscribedSection: FC = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [email, setEmail] = useState("");
  const [errorMessages, setErrorMessages] = useState("");
  const [open, setOpen] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const deviceType = useDeviceType();

  const handleEmailAddressLocalStore = (val: string) => {
    let emails = JSON.parse(localStorage.getItem("emails") || "[]");
    if (!emails.includes(val)) {
      emails.push(val);
      localStorage.setItem("emails", JSON.stringify(emails));
      setEmail(val);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (email.length === 0) setIsFocused(false);
  };
  const handleButtonClick = () => {
    handleEmailAddressLocalStore(email);
    setOpen(true);
  };

  const handleCloseModal = (val: boolean) => {
    val && setOpen(false);
    val && setEmail("");
    val && setErrorMessages("");
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (e.target.value.length > 0) {
      setIsFocused(true);
      setEmail(e.target.value);
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
        <SubscribeSectionDialog open={open} handleClose={handleCloseModal} email={email}>
          <Box p={3}>
            <Typography variant={"h4"} component={"h2"} fontWeight={"900"} mb={3}>
              感謝您的訂閱
            </Typography>
            <Typography variant={"h6"} component={"p"}>
              我們將會寄送最新優惠及最新餐飲趨勢給您的電子郵件。
            </Typography>
          </Box>
        </SubscribeSectionDialog>
      </Container>
    </Box>
  );
};

export default SubscribedSection;
