// 專門放固定參數
export const genderList = [
  { id: "male", name: "男生" },
  { id: "female", name: "女生" }
];

// route
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import MenuBookIcon from "@mui/icons-material/MenuBook";

export const sideBarItemList = [
  {
    id: "orders",
    name: "點餐系統",
    src: RestaurantMenuIcon,
    path: "orders"
  },
  {
    id: "menu",
    name: "訂單系統",
    src: StickyNote2Icon,
    path: "menu"
  },
  {
    id: "meal",
    name: "菜單系統",
    src: MenuBookIcon,
    list: [
      {
        id: "list",
        name: "菜單列表",
        src: "frame-204",
        path: "meal/list"
      },
      {
        id: "settings",
        name: "菜單設置",
        src: "frame-204",
        path: "meal/settings"
      }
    ]
  }
];
