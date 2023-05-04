import { FC } from "react";

import { Button, Stack } from "@mui/material";
import { Base, FieldContainer } from "~/components/layout";

import { RouterProps } from "~/types";

export const MealDetailContainer: FC<RouterProps> = ({ params }) => {
  console.log(params);
  const isCreate = params.meal_id === "create";

  const fieldList = [
    {
      id: "name",
      label: "名稱",
      type: "text"
    },
    {
      id: "image",
      label: "照片",
      type: "file"
    },
    {
      id: "description",
      label: "描述",
      type: "textarea"
    },
    {
      id: "price",
      label: "價格",
      type: "dollar"
    },
    {
      id: "startAt",
      label: "上架時間",
      type: "date"
    },
    {
      id: "hot",
      label: "熱門",
      type: "checkbox"
    },
    {
      id: "customization",
      label: "客製化",
      type: "select",
      list: [{ id: "前菜", label: "serve" }]
    }
  ];

  return (
    <Base>
      <Stack sx={{ flexWrap: "wrap", maxHeight: "inherit" }}>
        {fieldList.map((config) => (
          <FieldContainer width={200} key={`meal-${config.id}`} {...config} />
        ))}
      </Stack>
      <Stack direction="row" justifyContent="end" spacing={4}>
        <Button variant="contained">取消</Button>
        {isCreate ? (
          <>
            <Button variant="contained">新增</Button>
          </>
        ) : (
          <>
            <Button variant="contained">刪除</Button>
            <Button variant="contained">保存</Button>
          </>
        )}
      </Stack>
    </Base>
  );
};

export default MealDetailContainer;
