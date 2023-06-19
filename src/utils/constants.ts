import { OrderStatus, SpecialtyType, OrderStatusTitle } from "~/types/common";

// 專門放固定參數
export const genderList = [
  { id: "male", name: "男生" },
  { id: "female", name: "女生" }
];

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
