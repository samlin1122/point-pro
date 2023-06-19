import { ChangeEvent, ReactElement, FC, Ref, useState, forwardRef } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  SelectChangeEvent,
  TextField
} from "@mui/material";
import { Row } from "~/components/layout";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { cityList, contactTimeList } from "~/utils/constants";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<any, any>;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
interface ContactFormModalProps {
  open: boolean;
  onClose: () => void;
}

interface InquiryContent {
  [key: string]: boolean;
}

const initialFormState = {
  vendorName: "",
  businessStatus: "",
  contactPerson: "",
  phoneNumber: "",
  city: "",
  contactTime: "",
  inquiryContent: {} as InquiryContent,
  inquiryTime: "",
  requirement: ""
};

const ContactFormModal: FC<ContactFormModalProps> = ({ open, onClose }) => {
  const [formState, setFormState] = useState(initialFormState);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value
    });
  };

  const handleInquiryContentChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      inquiryContent: {
        ...prevState.inquiryContent,
        [name]: checked
      }
    }));
  };

  const handleSubmit = () => {
    // 驗證和提交表單
    console.log(formState);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition} keepMounted>
      <DialogTitle>聯絡資訊</DialogTitle>
      <DialogContent>
        <Row>
          <TextField
            required
            name="vendorName"
            label="商家姓名"
            value={formState.vendorName}
            onChange={handleChange}
            fullWidth
            margin="dense"
            variant="standard"
            sx={{ m: 1, width: "50ch" }}
          />
          <FormControl component="fieldset" sx={{ m: 1, width: "50ch" }} margin="dense">
            <FormLabel component="legend">營業狀態</FormLabel>
            <RadioGroup row name="businessStatus" value={formState.businessStatus} onChange={handleChange}>
              <FormControlLabel value="已開業" control={<Radio />} label="已開業" />
              <FormControlLabel value="籌備中" control={<Radio />} label="籌備中" />
            </RadioGroup>
          </FormControl>
        </Row>
        <Row>
          <TextField
            required
            name="contactPerson"
            label="聯絡人"
            value={formState.contactPerson}
            onChange={handleChange}
            margin="dense"
            variant="standard"
            sx={{ m: 1, width: "50ch" }}
          />
          <TextField
            required
            name="phoneNumber"
            label="連絡電話"
            value={formState.phoneNumber}
            onChange={handleChange}
            margin="dense"
            variant="standard"
            sx={{ m: 1, width: "50ch" }}
          />
        </Row>
        <Row>
          <TextField
            label="所在城市"
            required
            select
            name="city"
            variant="standard"
            value={formState.city}
            onChange={handleChange}
            sx={{ m: 1, width: "50ch" }}
          >
            {cityList.map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="希望聯絡時間"
            required
            select
            name="contactTime"
            variant="standard"
            value={formState.contactTime}
            onChange={handleChange}
            sx={{ m: 1, width: "50ch" }}
          >
            {contactTimeList.map((time) => (
              <MenuItem key={time} value={time}>
                {time}
              </MenuItem>
            ))}
          </TextField>
        </Row>
        <FormControl fullWidth margin="dense" sx={{ m: 1 }}>
          <FormLabel component="legend">詢問內容 (可複選)</FormLabel>
          <FormGroup
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap"
            }}
          >
            {[
              "問題類型",
              "限量優惠方案",
              "LINE 線上點餐系統",
              "QRCode掃碼點餐",
              "餐飲POS系統",
              "連鎖總部系統",
              "手機掃碼點餐APP",
              "外送平台串接",
              "API串接整合服務",
              "Kiosk 點餐機服務",
              "電子印章集點服務",
              "其他（請填寫）"
            ].map((content) => (
              <FormControlLabel
                key={content}
                control={
                  <Checkbox
                    checked={formState.inquiryContent[content] || false}
                    onChange={handleInquiryContentChange}
                    name={content}
                  />
                }
                label={content}
              />
            ))}
          </FormGroup>
        </FormControl>
        <TextField
          name="requirement"
          label="需求說明"
          value={formState.requirement || ""}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} fullWidth variant="contained">
          送出表單
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContactFormModal;
