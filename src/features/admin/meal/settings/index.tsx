import { FC, useState } from "react";

import { Button, IconButton, Stack, Typography } from "@mui/material";
import { Base, FieldContainer } from "~/components/layout";
import { InputText } from "~/components/input";
import { DrawerBase } from "~/components/drawer";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";

import { RouterProps } from "~/types";

interface categoryType {
  id: number | undefined;
  name: string;
}
interface customType {
  id: number | undefined;
  name: string;
  type: string;
  list: string[];
}

const categoeyList_data = [
  { id: 1, name: "冷盤" },
  { id: 2, name: "燒烤" },
  { id: 3, name: "熱炒" },
  { id: 4, name: "飲料" }
];
const init = { category: { id: undefined, name: "" }, custom: { id: undefined, name: "", type: "", list: [] } };
const customizationList_data = [
  { id: 1, name: "辣度", type: "單選", list: ["小辣", "中辣"] },
  { id: 2, name: "飯麵", type: "單選", list: ["飯", "麵"] },
  { id: 3, name: "特別調整", type: "多選", list: ["少油", "少鹽"] }
];

export const MealSettingsContainer: FC<RouterProps> = ({ navigate }) => {
  const [categoeyList, setCategoryList] = useState<categoryType[]>(categoeyList_data);
  const [customList, setCustomList] = useState<customType[]>(customizationList_data);
  const [open, setOpen] = useState(false);
  const [isCreate, setIsCreate] = useState(false);

  const handleAddCategory = () => {
    setCategoryList((val) => [...val, init.category]);
  };
  const handleEditCategory = (id: number | undefined) => {
    if (id) {
      // delete
      console.log("delete category : ", id);
    } else {
      // create
      console.log("create category : ", id);
    }
  };
  const handleCreateCustom = () => {
    setOpen(true);
    setIsCreate(true);
  };

  const handleEditCustom = (data: customType) => {
    console.log("handleEditCustom :", data);

    setOpen(true);
    setIsCreate(false);
  };

  const handleButtonClick = (type: string, data: string) => {
    console.log("handleEditFinish : ", type, data);
    handleCloseDrawer();
  };

  const handleCloseDrawer = () => {
    setIsCreate(false);
    setOpen(false);
  };

  const getButtonList = () => {
    return isCreate
      ? [{ label: "新增", onClick: (data: string) => handleButtonClick("create", data) }]
      : [
          { label: "刪除", onClick: (data: string) => handleButtonClick("delete", data) },
          { label: "保存", onClick: (data: string) => handleButtonClick("save", data) }
        ];
  };

  return (
    <Base display="flex" justifyContent="space-between">
      <Stack width="50%" p={3}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          分類
        </Typography>
        {categoeyList.map((categoey) => (
          <InputText
            key={`categoey-${categoey.id ? categoey.id : "new"}`}
            value={categoey.name}
            placeholder="請輸入新增分類項目"
            disabled={Boolean(categoey.id)}
            sx={{
              my: 2,
              "& .Mui-disabled": {
                color: (theme) => theme.palette.primary.contrastText,
                WebkitTextFillColor: "unset !important"
              }
            }}
            endAdornment={
              <IconButton onClick={() => handleEditCategory(categoey.id)}>
                {categoey.id ? <CloseIcon /> : <AddIcon />}
              </IconButton>
            }
          />
        ))}
        <Button variant="contained" sx={{ my: 2 }} onClick={handleAddCategory} startIcon={<AddIcon />}>
          新增
        </Button>
      </Stack>
      <Stack width="50%" p={3}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          客製化
        </Typography>
        {customList.map((custom) => (
          <InputText
            key={`custom-${custom.id}`}
            value={custom.name}
            disabled
            sx={{
              my: 2,
              "& .Mui-disabled": {
                color: (theme) => theme.palette.primary.contrastText,
                WebkitTextFillColor: "unset !important"
              }
            }}
            endAdornment={
              <IconButton onClick={() => handleEditCustom(custom)}>
                <FormatAlignJustifyIcon />
              </IconButton>
            }
          />
        ))}
        <Button variant="contained" sx={{ my: 2 }} onClick={handleCreateCustom} startIcon={<AddIcon />}>
          新增
        </Button>
      </Stack>
      <DrawerBase
        title={isCreate ? "新增客製化選項" : "編輯客製化選項"}
        open={open}
        onClose={handleCloseDrawer}
        buttonList={getButtonList()}
      >
        <CustomOptionDetail />
      </DrawerBase>
    </Base>
  );
};

export default MealSettingsContainer;

const CustomOptionDetail = () => {
  const [list, setList] = useState<string[]>([]);
  const fieldList = [
    {
      id: "name",
      label: "名稱",
      type: "text"
    },
    {
      id: "type",
      label: "類型",
      type: "select",
      list: [
        { id: "single", label: "單選" },
        { id: "multiple", label: "多選" }
      ]
    },
    {
      id: "select",
      label: "選項",
      type: "button",
      text: "新增選項",
      startIcon: <AddIcon />,
      onClick: () => setList([...list, "name"])
    }
  ];
  return (
    <Stack sx={{ p: 3 }}>
      {fieldList.map((config) => (
        <FieldContainer width={200} key={`custom-input-${config.id}`} {...config} />
      ))}
      <Stack gap={3} direction="row" alignItems={"center"} flexWrap="wrap">
        {list.map((e, key) => (
          <InputText
            key={`selecttion-${key}`}
            sx={{ width: 200, p: 0 }}
            placeholder="請輸入客製化選項"
            endAdornment={
              <IconButton>
                <CloseIcon />
              </IconButton>
            }
          />
        ))}
      </Stack>
    </Stack>
  );
};
