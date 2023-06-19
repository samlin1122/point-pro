// Libs
import React from "react";
import {
  Box,
  Button,
  ButtonBase,
  DialogActions,
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  MobileStepper,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
  TextFieldProps,
  Typography
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AccessibilityIcon from "@mui/icons-material/Accessibility";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import EmailIcon from "@mui/icons-material/Email";
import QrCodeIcon from "@mui/icons-material/QrCode";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import ClearIcon from "@mui/icons-material/Clear";
import DirectionsIcon from "@mui/icons-material/Directions";
import InfoIcon from "@mui/icons-material/Info";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PickersActionBarProps } from "@mui/x-date-pickers";
// Components
import { CustomerBookingDialog } from "~/types/common";
import { MobileButton, MobileDialogLayout } from "~/components/dialog";
import { CheckboxBase } from "~/components/checkbox";
// Others
import appDayjs, { formatTimeOnly, formatDateOnly } from "~/utils/dayjs.util";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import {
  setStep,
  setAdultsAmount,
  setDate,
  setReservedAt,
  setPhone,
  getBookingRecord,
  setQueryString,
  setDialog,
  setName,
  setEmail,
  setRemark,
  setGender,
  setAgreedPolicy,
  postBookingRecord,
  resetUserInfo
} from "./slice";

const genderObj = {
  0: "先生",
  1: "小姐",
  2: ""
};

export const PeopleAndTime = () => {
  const dispatch = useAppDispatch();

  const availableBookings = useAppSelector(({ customerBooking }) => customerBooking.availableBookings);
  const availablePeriod = useAppSelector(({ customerBooking }) => customerBooking.availablePeriod);
  const choosedDate = useAppSelector(({ customerBooking }) => customerBooking.choosedDate);
  const reservedAt = useAppSelector(({ customerBooking }) => customerBooking.bookingParams.reservedAt);
  const adults = useAppSelector(({ customerBooking }) => customerBooking.bookingParams.user.adults);

  const availableDate = availableBookings.map((availableBooking) => availableBooking.date);
  const choosedPeriodInfo = availablePeriod.find((availablePeriod) => availablePeriod.startedAt === reservedAt);
  const adultOptionList =
    choosedPeriodInfo?.peopleAmount && choosedPeriodInfo?.peopleAmount > 10
      ? [1, 2, 3, 4, 7, 8, 9, 10]
      : Array.from({ length: choosedPeriodInfo?.peopleAmount ?? 1 }, (_, i) => i + 1);

  // [TODO]: add or remove children amount
  // const children = useAppSelector(({ customerBooking }) => customerBooking.bookingParams.user.children);
  // const childrenOptionList = useMemo(
  //   () => Array.from({ length: children }, (_, i) => ({ value: i, label: `${i} 位小孩` })),
  //   [children]
  // );
  // const handleChangeChildrenAmount = (e: SelectChangeEvent<`${number}`>) => {
  //   dispatch(setChildrenAmount(+e.target.value));
  // };

  const handleOpenBookingSearch = () => {
    dispatch(setDialog(CustomerBookingDialog.RECORD_QUERY));
  };

  const handleChangeAdultsAmount = (e: SelectChangeEvent<`${number}`>) => {
    dispatch(setAdultsAmount(+e.target.value));
  };

  const handleChangeBookingDate = (value: appDayjs.Dayjs | null) => {
    dispatch(setDate(value?.startOf("day").valueOf() ?? appDayjs().startOf("day").valueOf()));
  };

  const handleChangeReservedPeriod = (e: SelectChangeEvent<`${number}`>) => {
    dispatch(setReservedAt(+e.target.value));
  };

  return (
    <>
      <Box sx={{ marginBottom: "1.5rem" }}>
        <Typography fontWeight={700} sx={{ marginBottom: ".5rem" }}>
          用餐日期
        </Typography>
        <Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={appDayjs(choosedDate)}
              sx={{ width: "95%" }}
              format="MM月DD日 (星期dd)"
              onChange={handleChangeBookingDate}
              views={["day"]}
              disablePast
              maxDate={appDayjs().add(30, "day")}
              shouldDisableDate={(day) => !availableDate.includes(appDayjs(day).valueOf())}
              slots={{
                actionBar: (props: PickersActionBarProps) => (
                  <DialogActions className={props.className} sx={{ padding: ".5rem" }}>
                    <ButtonBase
                      onClick={props.onAccept}
                      sx={{
                        fontSize: "body1.fontSize",
                        bgcolor: "primary.main",
                        padding: ".5rem",
                        borderRadius: ".5rem",
                        width: "100%"
                      }}
                    >
                      確定
                    </ButtonBase>
                  </DialogActions>
                )
              }}
              slotProps={{
                toolbar: {
                  hidden: true
                },
                actionBar: {
                  actions: ["accept"]
                }
              }}
            />
          </LocalizationProvider>
        </Box>
      </Box>
      <Box sx={{ marginBottom: "1.5rem" }}>
        <Typography fontWeight={700} sx={{ marginBottom: ".5rem" }}>
          用餐時段
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItem: "center", gap: "1rem" }}>
          <Box sx={{ flexGrow: 1 }}>
            <Select onChange={handleChangeReservedPeriod} value={`${reservedAt}`} sx={{ width: "95%" }}>
              {!reservedAt && <MenuItem value="0"></MenuItem>}
              {availablePeriod.map((option) => (
                <MenuItem value={`${option.startedAt}`} key={option.startedAt}>
                  {formatTimeOnly(option.startedAt)}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
      </Box>
      <Box sx={{ marginBottom: "1.5rem" }}>
        <Typography fontWeight={700} sx={{ marginBottom: ".5rem" }}>
          用餐人數
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItem: "center", gap: "1rem" }}>
          <Box sx={{ flexGrow: 1 }}>
            <Select onChange={handleChangeAdultsAmount} value={`${adults}`} sx={{ width: "95%" }}>
              {adultOptionList.map((value) => (
                <MenuItem value={`${value}`} key={value}>
                  {`${value} 位`}
                </MenuItem>
              ))}
            </Select>
          </Box>
          {/* [TODO] */}
          {/* <Box sx={{ flexGrow: 1 }}>
            <Select onChange={handleChangeChildrenAmount} value={`${children}`} sx={{ width: "95%" }}>
              {childrenOptionList.map((option) => (
                <MenuItem value={`${option.value}`} key={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </Box> */}
        </Box>
      </Box>
      <ButtonBase
        onClick={handleOpenBookingSearch}
        sx={{ textDecoration: "underline", fontWeight: 700, fontSize: "body1.fontSize" }}
      >
        我已經有預約了，查詢預訂資訊
      </ButtonBase>
    </>
  );
};

export const BookerInfo = () => {
  const dispatch = useAppDispatch();

  const { name, gender, phone, email, remark } = useAppSelector(
    ({ customerBooking }) => customerBooking.bookingParams.user
  );
  const isAgreedPrivacyPolicy = useAppSelector(({ customerBooking }) => customerBooking.isAgreedPrivacyPolicy);

  const handleEnterName = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setName(e.target.value));
  };

  const handleChooseGender = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    dispatch(setGender(+value));
  };

  const handleEnterPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPhone(e.target.value));
  };

  const handleEnterEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setEmail(e.target.value));
  };

  const handleEnterRemark = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setRemark(e.target.value));
  };

  const handleAgreedPolicy = () => {
    dispatch(setAgreedPolicy(!isAgreedPrivacyPolicy));
  };

  const handleOpenPrivayPolicyDialog = () => {
    dispatch(setDialog(CustomerBookingDialog.PRIVACY_POLICY));
  };

  return (
    <Box sx={{ paddingBottom: "10rem" }}>
      <Box sx={{ marginBottom: "1rem" }}>
        <Typography fontWeight={700} sx={{ marginBottom: "1rem" }}>
          姓名*
        </Typography>
        <TextField
          placeholder="如何稱呼您"
          variant="outlined"
          sx={{ width: "100%" }}
          value={name}
          onChange={handleEnterName}
        />
        <RadioGroup row value={gender} onChange={handleChooseGender}>
          <FormControlLabel value={0} control={<Radio />} label="先生" />
          <FormControlLabel value={1} control={<Radio />} label="小姐" />
          <FormControlLabel value={2} control={<Radio />} label="其他" />
        </RadioGroup>
      </Box>
      <Box sx={{ marginBottom: "1rem" }}>
        <Typography fontWeight={700} sx={{ marginBottom: "1rem" }}>
          手機號碼*
        </Typography>
        <TextField
          placeholder="0912345678"
          variant="outlined"
          sx={{ width: "100%" }}
          value={phone}
          onChange={handleEnterPhone}
        />
      </Box>
      <Box sx={{ marginBottom: "1rem" }}>
        <Typography fontWeight={700} sx={{ marginBottom: "1rem" }}>
          電子信箱*
        </Typography>
        <TextField
          placeholder="example@email.com"
          variant="outlined"
          sx={{ width: "100%" }}
          value={email}
          onChange={handleEnterEmail}
        />
      </Box>
      <Box sx={{ marginBottom: "1rem" }}>
        <Typography fontWeight={700} sx={{ marginBottom: "1rem" }}>
          備註
        </Typography>
        <TextField
          placeholder="有任何特殊需求嗎？可以先寫在這裡喔（例如：行動不便、過敏...等）。"
          multiline
          rows={4}
          sx={{ width: "100%" }}
          value={remark}
          onChange={handleEnterRemark}
        />
      </Box>
      <Box sx={{ padding: "0 .1rem" }}>
        <FormControlLabel
          control={<CheckboxBase checked={isAgreedPrivacyPolicy} onChange={handleAgreedPolicy} />}
          label="確認我已閱讀並同意"
          sx={{ margin: "0" }}
        />
        <ButtonBase
          sx={{ textDecoration: "underline", fontWeight: 700, fontSize: "body1.fontSize" }}
          onClick={handleOpenPrivayPolicyDialog}
        >
          PointPro 隱私權政策
        </ButtonBase>
      </Box>
    </Box>
  );
};

interface IConfirmBookingTextFieldProps extends Omit<TextFieldProps, "label" | "value" | "InputProps" | "variant"> {
  label: string;
  value: string;
  icon: React.ReactNode;
}
export const ConfirmBookingTextField = (props: IConfirmBookingTextFieldProps) => {
  const { label, value, icon, ...rest } = props;

  return (
    <TextField
      label={
        <Box sx={{ display: "flex", alignContent: "center", fontSize: "h5.fontSize" }}>
          {icon}
          <Box sx={{ marginLeft: ".5rem", color: "common.black" }}>{label}</Box>
        </Box>
      }
      variant="standard"
      value={value}
      InputProps={{
        startAdornment: <InputAdornment position="start" sx={{ width: "1rem" }} />
      }}
      sx={{ width: "100%", marginBottom: "2rem", pointerEvents: "none", padding: "1rem 1rem 0" }}
      {...rest}
    />
  );
};

interface IConfirmBookingInfoProps {
  isReminder?: boolean;
}
export const ConfirmBookingInfo = (props: IConfirmBookingInfoProps) => {
  const { isReminder = false } = props;
  const reservedAt = useAppSelector(({ customerBooking }) => customerBooking.bookingParams.reservedAt);
  const { name, gender, phone, email, remark, adults } = useAppSelector(
    ({ customerBooking }) => customerBooking.bookingParams.user
  );

  return (
    <Box sx={{ paddingBottom: isReminder ? "" : "10rem" }}>
      <Grid
        container
        sx={{
          padding: "1rem 0",
          borderRadius: "5px",
          bgcolor: "common.black_20",
          color: "common.black_60",
          marginBottom: "1rem"
        }}
      >
        <Grid item xs={6} sx={{ padding: "0 1rem" }}>
          <Box sx={{ color: "common.black_60", fontWeight: 500 }}>用餐人數</Box>
          <Box sx={{ fontSize: "h5.fontSize", fontWeight: 900, color: "common.black" }}>{adults} 位</Box>
        </Grid>
        <Grid item xs={6} sx={{ padding: "0 1rem", borderLeft: ".1rem solid", borderColor: "common.black_40" }}>
          <Box sx={{ color: "common.black_60", fontWeight: 500 }}>入座時間</Box>
          <Box sx={{ fontSize: "h6.fontSize", fontWeight: 900, color: "common.black" }}>
            <Box>{formatDateOnly(reservedAt)}</Box>
            <Box>{formatTimeOnly(reservedAt)}</Box>
          </Box>
        </Grid>
      </Grid>
      <ConfirmBookingTextField label="姓名" value={`${name} ${genderObj[gender]}`} icon={<AccessibilityIcon />} />
      <ConfirmBookingTextField label="手機號碼" value={phone} icon={<PhoneIphoneIcon />} />
      <ConfirmBookingTextField label="電子信箱" value={email} icon={<EmailIcon />} />
      <ConfirmBookingTextField label="備註" value={remark || "無"} icon={<StickyNote2Icon />} multiline maxRows={4} />
    </Box>
  );
};

interface IBookingStepProps {
  stepLength: number;
}
export const BookingStep = (props: IBookingStepProps) => {
  const { stepLength } = props;

  const dispatch = useAppDispatch();

  const step = useAppSelector(({ customerBooking }) => customerBooking.step);
  const reservedAt = useAppSelector(({ customerBooking }) => customerBooking.bookingParams.reservedAt);
  const { name, phone, email, adults } = useAppSelector(({ customerBooking }) => customerBooking.bookingParams.user);
  const isAgreedPrivacyPolicy = useAppSelector(({ customerBooking }) => customerBooking.isAgreedPrivacyPolicy);

  const isNotFirstStep = step !== 0;
  const isNotLastStep = step !== stepLength - 1;

  const isBookingNextStepBtnDisabled = () => {
    switch (step) {
      case 0:
        return !(reservedAt && adults);
      case 1:
        return !(name && phone && email && isAgreedPrivacyPolicy);
      case 2:
        return false;
      default:
        return true;
    }
  };

  const handleGoBack = () => {
    dispatch(setStep(step - 1));
  };

  const handleGoNext = () => {
    dispatch(setStep(step + 1));
  };

  const handleConfirm = async () => {
    await dispatch(postBookingRecord());
    dispatch(setDialog(CustomerBookingDialog.REMINDER));
  };

  return (
    <MobileStepper
      variant="progress"
      steps={stepLength}
      activeStep={step}
      backButton={
        <>
          {isNotFirstStep && (
            <MobileButton
              onClick={handleGoBack}
              sx={{
                bgcolor: "common.white",
                border: ".5px solid",
                "&:hover": { backgroundColor: "common.white" }
              }}
            >
              回上一步
            </MobileButton>
          )}
          {!isNotLastStep && <MobileButton onClick={handleConfirm}>確認預定</MobileButton>}
        </>
      }
      nextButton={
        isNotLastStep && (
          <MobileButton onClick={handleGoNext} disabled={isBookingNextStepBtnDisabled()}>
            下一步
          </MobileButton>
        )
      }
      sx={{
        display: "flex",
        // flexDirection: "column-reverse", // [TODO]: remove?
        gap: "1rem",
        width: "100vw",
        maxWidth: "768px",
        margin: "0 auto",
        paddingBottom: "1.5rem",
        ".MuiLinearProgress-root": { display: "none" }
      }}
    />
  );
};

export const BookingRecordQueryModal = () => {
  const dispatch = useAppDispatch();

  const queryString = useAppSelector(({ customerBooking }) => customerBooking.queryString);
  const dialog = useAppSelector(({ customerBooking }) => customerBooking.dialog);

  const handleClose = () => {
    dispatch(setDialog(""));
  };

  const handleQuery = async () => {
    if (!queryString) return;
    await dispatch(getBookingRecord());
    dispatch(setDialog(CustomerBookingDialog.REMINDER));
  };

  const handleQueryString = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setQueryString(e.target.value));
  };

  return (
    <MobileDialogLayout
      title="預訂查詢"
      titleSize="h2"
      isOpen={dialog === CustomerBookingDialog.RECORD_QUERY}
      onCloseDialog={handleClose}
      actionButton={
        <Button onClick={handleQuery} disabled={!queryString}>
          查詢
        </Button>
      }
    >
      <Typography fontWeight={700} sx={{ marginBottom: "1rem" }}>
        姓名與手機號碼
      </Typography>
      <TextField
        placeholder="請輸入預訂時留下的姓名或手機號碼"
        variant="outlined"
        sx={{ width: "100%" }}
        value={queryString}
        onChange={handleQueryString}
      />
    </MobileDialogLayout>
  );
};

export const PrivacyPolicyModal = () => {
  const dispatch = useAppDispatch();

  const dialog = useAppSelector(({ customerBooking }) => customerBooking.dialog);

  const handleClose = () => {
    dispatch(setDialog(""));
  };

  const handleConfirm = () => {
    dispatch(setAgreedPolicy(true));
    dispatch(setDialog(""));
  };

  return (
    <MobileDialogLayout
      title={
        <>
          <Box>PointPro</Box>
          <Box>隱私權政策</Box>
        </>
      }
      titleSize="h1"
      isOpen={dialog === CustomerBookingDialog.PRIVACY_POLICY}
      onCloseDialog={handleClose}
      actionButton={<Button onClick={handleConfirm}>確認同意</Button>}
    >
      <Typography variant="h6" color="text.disabled">
        最後更新日期：2023年3月12日
      </Typography>
      <br />
      <Typography fontWeight={700}>
        請注意，以下為一篇純屬虛構的網站隱私權政策，因為我快被Miro的loading搞瘋，所以請你們這邊自行替換。
      </Typography>
      <br />
      <Typography>我們非常尊重您的隱私，因此我們採用各種措施來保護您的個人資料。</Typography>
      <br />
      <Typography>您使用本網站即表示您同意本隱私權政策的條款。如果您不同意本政策，請停止使用本網站。</Typography>
      <br />
      <ul>
        <li>
          我們收集的信息：我們可能會收集您的姓名、地址、電子郵件地址和其他識別信息，以及您在本網站上的瀏覽和交易歷史記錄。
        </li>
        <li>
          信息的使用：我們可能會使用您的信息來改進我們的產品和服務，以及向您提供個性化的廣告和促銷信息。此外，我們可能會將您的信息分享給我們的合作夥伴，以便他們向您提供相關的產品和服務。
        </li>
        <li>
          信息的保護：我們會採用各種技術和措施來保護您的信息，以防止未經授權的訪問、使用或泄露。但是，由於互聯網的本質，我們無法保證信息的絕對安全。
        </li>
        <li>
          Cookie和其他技術：我們可能會使用Cookie和其他類似技術來收集關於您的信息。這些技術可以幫助我們了解您的喜好和興趣，以便為您提供更好的產品和服務。您可以隨時通過瀏覽器設置拒絕Cookie，但這可能會影響您使用本網站的某些功能。
        </li>
        <li>
          兒童隱私：我們不會故意收集未滿13歲的兒童的個人信息。如果我們發現自己收集了未滿13歲的兒童的個人信息，我們將立即刪除這些信息。
        </li>
      </ul>
      <br />
      <Typography>如果您對本政策有任何疑問或關注，請聯繫我們的客戶服務部門。</Typography>
    </MobileDialogLayout>
  );
};

interface IAtionIconProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}
export const ActionIcon = (props: IAtionIconProps) => {
  const { icon, title, onClick } = props;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <ButtonBase
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
          borderRadius: "50%",
          bgcolor: "common.white",
          marginBottom: ".5rem"
        }}
        onClick={() => onClick()}
      >
        {icon}
      </ButtonBase>
      <Typography fontWeight={700}>{title}</Typography>
    </Box>
  );
};

export const BookingReminderModal = () => {
  const dispatch = useAppDispatch();

  const dialog = useAppSelector(({ customerBooking }) => customerBooking.dialog);
  const { name, gender, phone, email, remark, adults } = useAppSelector(
    ({ customerBooking }) => customerBooking.bookingParams.user
  );

  const handleClose = () => {
    dispatch(setStep(0));
    dispatch(resetUserInfo());
    dispatch(setDialog(""));
  };

  const handleQRCode = () => {
    dispatch(setDialog(CustomerBookingDialog.QRCODE));
  };

  const handlePhoneCall = () => {
    // [TODO]: make a phone call
  };

  const handleCancel = () => {
    // [TODO]: make a phone call or cancel online
  };

  return (
    <MobileDialogLayout
      title={
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <EventIcon sx={{ width: "1rem", height: "1rem" }} />
          <Box sx={{ marginLeft: ".5rem", fontSize: "body1.fontSize" }}>已為您安排訂位</Box>
        </Box>
      }
      titleSize="h6"
      isShowCloseIcon={false}
      isOpen={dialog === CustomerBookingDialog.REMINDER}
      onCloseDialog={handleClose}
      actionButton={<Button onClick={handleClose}>關閉</Button>}
      dialogTitleProps={{
        sx: { ".MuiTypography-h6": { textAlign: "center" }, bgcolor: "primary.main" }
      }}
    >
      <Box sx={{ paddingBottom: "5rem" }}>
        <br />
        <Typography variant="h3" fontWeight={900}>
          港都熱炒
        </Typography>
        <br />
        <Typography>
          親愛的 {name} {genderObj[gender]}
        </Typography>
        <br />
        <Typography>您的訂位已經成功囉, 感謝您選擇港都熱炒！</Typography>
        <br />
        <Typography>
          我們會竭誠為您提供美味佳餚和貼心的服務。請留意並保存以下資訊，並準時到達。 如需更改或取消，提前聯繫我們。
        </Typography>
        <br />
        <ConfirmBookingInfo isReminder />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "2rem",
            marginBottom: "2rem"
          }}
        >
          <ActionIcon icon={<QrCodeIcon />} title="QR Code" onClick={handleQRCode} />
          <ActionIcon icon={<LocalPhoneIcon />} title="撥打電話" onClick={handlePhoneCall} />
          <ActionIcon icon={<ClearIcon />} title="修改/取消" onClick={handleCancel} />
        </Box>
        <ConfirmBookingTextField label="位置" value="台北市中山區民生東路一段52號" icon={<DirectionsIcon />} />
        <ConfirmBookingTextField
          label="溫馨提醒"
          value="請您準時到達,如有遲到情況,請提前告知,以免影響您的用餐體驗。如遇特殊天氣或交通狀況,請提前安排出行,確保您能夠準時抵達餐廳。如果有特殊飲食需求或過敏情況,請在抵達餐廳時告知我們的服務人員。再次感謝您選擇港都熱炒,期待您的光臨!"
          icon={<InfoIcon />}
          multiline
          rows={7}
        />
        <Typography color="text.disabled" sx={{ padding: "3rem", textAlign: "center", bgcolor: "common.black_20" }}>
          Copyright © 2023 PointPro.
          <br />
          All Rights Reserved
        </Typography>
      </Box>
    </MobileDialogLayout>
  );
};

export const BookingQRCodeModal = () => {
  const dispatch = useAppDispatch();

  const dialog = useAppSelector(({ customerBooking }) => customerBooking.dialog);

  const handleClose = () => {
    dispatch(setDialog(CustomerBookingDialog.REMINDER));
  };

  return (
    <MobileDialogLayout
      title={
        <>
          <Box>請出示此畫面</Box>
          <Box>以便店員為您帶位</Box>
        </>
      }
      titleSize="h5"
      isOpen={dialog === CustomerBookingDialog.QRCODE}
      onCloseDialog={handleClose}
      actionButton={<Button onClick={handleClose}>關閉</Button>}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <QrCodeIcon sx={{ fontSize: "20rem" }} />
      </Box>
      <ConfirmBookingTextField label="訂位編號" value={"5f02-4e28-eo29"} icon={<QrCodeIcon />} />
    </MobileDialogLayout>
  );
};
