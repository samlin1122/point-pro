import { ReactElement, FC, Ref, forwardRef, useState, SyntheticEvent } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField
} from "@mui/material";
import { Row } from "~/components/layout";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { cityList, contactTimeList } from "~/utils/constants";
import axios from "axios";

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
  [key: string]: boolean | { [key: string]: boolean } | string[];
}

const ContactFormModal: FC<ContactFormModalProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState<InquiryContent>({
    quest: []
  });

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    // 驗證和提交表單
    const corsUrl = "https://cors-proxy.fringe.zone/";
    const googleUrl =
      "https://docs.google.com/forms/u/0/d/e/1FAIpQLSeS2HdhAsUft11Yee4OF5LCWutl2MDY7ilUSHWuEqWsfeTPDQ/formResponse";

    const data = new FormData();
    data.set("entry.1962534612", JSON.stringify(formData.vendorName)); // 商家名稱
    data.set("entry.1920691995_sentinel", JSON.stringify(formData.businessStatus));
    data.set("entry.1802353228", JSON.stringify(formData.contactPerson));
    data.set("entry.122567838", JSON.stringify(formData.phoneNumber));
    data.set("entry.87711208", JSON.stringify(formData.city));
    data.set("entry.1701296742", JSON.stringify(formData.contactTime));
    data.set("entry.1937030945", JSON.stringify(formData.requirement));
    data.set("entry.1711160904_sentinel", JSON.stringify(formData.quest));
    axios
      .post(`${corsUrl + googleUrl}`, data)
      .then((res) => {
        // onClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // get Data
  const getData = (key: string) => {
    return formData.hasOwnProperty(key) ? formData[key] : "";
  };

  // Set data
  const setData = (key: string, value: any) => {
    return setFormData({ ...formData, [key]: value });
  };

  const handleCheckBoxChange = (event: SyntheticEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      setData("quest", [...(formData.quest as string[]), target.name]);
    } else {
      setData(
        "quest",
        (formData.quest as string[]).filter((item) => item !== target.name)
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition} keepMounted>
      <DialogTitle>聯絡資訊</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Row>
            <TextField
              required
              // name="entry.1962534612"
              name="vendorName"
              label="商家姓名"
              fullWidth
              margin="dense"
              variant="standard"
              sx={{ m: 1, width: "50ch" }}
              value={getData("vendorName")}
              onChange={(e) => setData("vendorName", e.target.value)}
            />
            <FormControl component="fieldset" sx={{ m: 1, width: "50ch" }} margin="dense">
              <FormLabel component="legend">營業狀態</FormLabel>
              <RadioGroup
                row
                // name="entry.1920691995_sentinel"
                name="businessStatus"
                value={getData("businessStatus")}
                onChange={(e) => setData("businessStatus", e.target.value)}
              >
                <FormControlLabel value="已開業" control={<Radio />} label="已開業" />
                <FormControlLabel value="籌備中" control={<Radio />} label="籌備中" />
              </RadioGroup>
            </FormControl>
          </Row>
          <Row>
            <TextField
              required
              // name="entry.1802353228"
              name="contactPerson"
              label="聯絡人"
              margin="dense"
              variant="standard"
              sx={{ m: 1, width: "50ch" }}
              value={getData("contactPerson")}
              onChange={(e) => setData("contactPerson", e.target.value)}
            />
            <TextField
              required
              // name="entry.122567838"
              name="phoneNumber"
              label="連絡電話"
              margin="dense"
              variant="standard"
              inputProps={{ inputMode: "numeric", pattern: "^[0-9]{10}$" }}
              sx={{ m: 1, width: "50ch" }}
              value={getData("phoneNumber")}
              onChange={(e) => setData("phoneNumber", e.target.value)}
            />
          </Row>
          <Row>
            <TextField
              label="所在城市"
              required
              select
              // name="entry.87711208"
              name="city"
              variant="standard"
              sx={{ m: 1, width: "50ch" }}
              value={getData("city")}
              onChange={(e) => setData("city", e.target.value)}
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
              // name="entry.1701296742"
              name="contactTime"
              variant="standard"
              sx={{ m: 1, width: "50ch" }}
              value={getData("contactTime")}
              onChange={(e) => setData("contactTime", e.target.value)}
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
                  label={content}
                  control={
                    <Checkbox
                      checked={(formData.quest as string[]).includes(content)}
                      onChange={handleCheckBoxChange}
                      name={content}
                    />
                  }
                />
              ))}
            </FormGroup>
          </FormControl>
          <TextField
            label="需求說明"
            // name="entry.1937030945"
            name="requirement"
            fullWidth
            multiline
            rows={4}
            margin="dense"
            value={getData("requirement")}
            onChange={(e) => setData("requirement", e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained">
            送出表單
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactFormModal;
