import { OrderStatus, SpecialtyType, OrderStatusTitle } from "~/types/common";

// 專門放固定參數
export const genderList = [
  { id: 0, title: "先生" },
  { id: 1, title: "小姐" },
  { id: 2, title: "其他" }
];
export const genderListStringArray = ["先生", "小姐", ""];

export const SpecialtyTypeList = [
  { id: SpecialtyType.SINGLE, title: "單選" },
  { id: SpecialtyType.MULTIPLE, title: "多選" }
];

export const ORDER_STATUS = [
  {
    id: OrderStatus.PENDING,
    value: OrderStatus.PENDING,
    title: OrderStatusTitle.PENDING
  },

  {
    id: OrderStatus.UNPAID,
    value: OrderStatus.UNPAID,
    title: OrderStatusTitle.UNPAID
  },

  {
    id: OrderStatus.SUCCESS,
    value: OrderStatus.SUCCESS,
    title: OrderStatusTitle.SUCCESS
  },

  {
    id: OrderStatus.CANCEL,
    value: OrderStatus.CANCEL,
    title: OrderStatusTitle.CANCEL
  }
];

export const MOBILE_ORDER_STATUS_TAB = [
  {
    type: [OrderStatus.PENDING, OrderStatus.UNPAID],
    title: OrderStatusTitle.UNPAID
  },
  {
    type: [OrderStatus.SUCCESS],
    title: OrderStatusTitle.SUCCESS
  },
  {
    type: [OrderStatus.CANCEL],
    title: OrderStatusTitle.CANCEL
  }
];

// route
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";

export type SideBarItemType = {
  id: string;
  name: string;
  src?: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
  path?: string;
  list?: SideBarItemType[];
};

export const sideBarItemList: SideBarItemType[] = [
  {
    id: "orders",
    name: "訂單系統",
    src: RestaurantMenuIcon,
    path: "/admin/orders"
  },
  {
    id: "menu",
    name: "點餐系統",
    src: StickyNote2Icon,
    path: "/admin/menu"
  },
  {
    id: "seat",
    name: "座位系統",
    src: EventSeatIcon,
    path: "/admin/seat"
  },
  {
    id: "meal",
    name: "菜單系統",
    src: MenuBookIcon,
    list: [
      {
        id: "list",
        name: "菜單列表",
        path: "/admin/meal/list"
      },
      {
        id: "settings",
        name: "菜單設置",
        path: "/admin/meal/settings"
      }
    ]
  }
];

export const flatSideBarItemList = sideBarItemList.flatMap((item) => {
  return item.list ? item.list : item;
});

export const cityList = [
  "臺北市",
  "新北市",
  "桃園市",
  "新竹市",
  "臺中市",
  "臺南市",
  "高雄市",
  "基隆市",
  "新竹縣",
  "苗栗縣",
  "彰化縣",
  "南投縣",
  "雲林縣",
  "嘉義縣",
  "嘉義市",
  "屏東縣",
  "宜蘭縣",
  "花蓮縣",
  "臺東縣",
  "金門縣",
  "澎湖縣",
  "連江縣"
];

export const contactTimeList = ["9:00~11:30", "13:00~18:00", "18:00之後"];

export const seatStatusList = [
  { id: "AVAILABLE", title: "未使用", color: "#F2F2F2" },
  { id: "RESERVED", title: "已預訂", color: "#CFF561" },
  { id: "OCCUPIED", title: "使用中", color: "#FEE391" }
];

export const seatStatusListObj = seatStatusList.reduce(
  (obj: { [key: string]: any }, currnt) => ({ ...obj, [currnt.id]: currnt }),
  {}
);

export const reservationStatusList = [
  { id: "NOT_ATTENDED", title: "未入席" },
  { id: "IN_USE", title: "使用中" },
  { id: "COMPLETED", title: "已完成" }
];

export const reservationStatusListObj = reservationStatusList.reduce(
  (obj: { [key: string]: any }, currnt) => ({ ...obj, [currnt.id]: currnt }),
  {}
);
