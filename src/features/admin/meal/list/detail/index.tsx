import { FC, useEffect, useReducer } from "react";

import { Button, Stack } from "@mui/material";
import { Base, FieldContainer } from "~/components/layout";

import { RouterProps } from "~/types";

import mainReducer, { initialState, defaultSetting, editField, convertToPayload } from "./reducers";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { getMealById, postMeal, patchMealById, deleteMeal } from "~/app/slices/meal";
import { Categories } from "~/app/selector";
import { Specialties } from "~/app/selector";

export const MealListDetailContainer: FC<RouterProps> = ({ params, navigate }) => {
  const isCreate = params.meal_id === "create";
  const dispatch = useAppDispatch();
  const categories = useAppSelector(Categories);
  const specialties = useAppSelector(Specialties);
  const [state, reducerDispatch] = useReducer(mainReducer, initialState);

  useEffect(() => {
    if (isCreate) {
      reducerDispatch(defaultSetting(null));
    } else {
      dispatchGetMealById();
    }
  }, []);

  const dispatchGetMealById = async () => {
    try {
      const { result } = await dispatch(getMealById(params.meal_id as string)).unwrap();
      reducerDispatch(defaultSetting(result));
    } catch (error) {
      navigate({ pathname: "/admin/meal/list" });
    }
  };

  const fieldList = [
    {
      id: "title",
      label: "名稱",
      type: "text"
    },
    {
      id: "coverUrl",
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
      id: "publishedAt",
      label: "上架時間",
      type: "date"
    },
    {
      id: "isPopular",
      label: "熱門",
      type: "checkbox"
    },
    {
      id: "categories",
      label: "分類",
      type: "select",
      multiple: true,
      list: categories
    },
    {
      id: "specialties",
      label: "客製化",
      type: "select",
      multiple: true,
      list: specialties
    }
  ];

  const handleButtonClick = async (key: string) => {
    switch (key) {
      case "cancel":
        navigate(-1);
        break;
      case "create":
        try {
          let payload = convertToPayload(state);
          console.log({ payload });
          await dispatch(postMeal(payload));
        } catch (error) {
          console.log("create meal failed");
        }
        break;
      case "save":
        try {
          let payload = convertToPayload(state);
          console.log({ payload });
          await dispatch(patchMealById({ mealId: params.meal_id as string, payload }));
        } catch (error) {
          console.log("update meal failed");
        }
        break;
      case "delete":
        try {
          await dispatch(deleteMeal(params.meal_id as string));
          navigate({ pathname: "/admin/meal/list" });
        } catch (error) {
          console.log("delete meal failed", { error });
        }
        break;
    }
  };

  const handleFieldChange = (props: { id: string; value: any }) => {
    reducerDispatch(editField(props));
  };
  // console.log(state);

  return (
    <Base>
      <Stack sx={{ flexWrap: "wrap", maxHeight: "calc(100vh - 88px - 47px)", gap: 5 }}>
        {fieldList.map((config) => (
          <FieldContainer
            key={`meal-${config.id}`}
            width={200}
            value={state[config.id].value}
            onChange={handleFieldChange}
            {...config}
          />
        ))}
      </Stack>
      {/* button */}
      <Stack direction="row" justifyContent="end" spacing={4}>
        <Button variant="contained" onClick={() => handleButtonClick("cancel")}>
          取消
        </Button>
        {isCreate ? (
          <>
            <Button variant="contained" onClick={() => handleButtonClick("create")}>
              新增
            </Button>
          </>
        ) : (
          <>
            <Button variant="contained" onClick={() => handleButtonClick("delete")}>
              刪除
            </Button>
            <Button variant="contained" onClick={() => handleButtonClick("save")}>
              保存
            </Button>
          </>
        )}
      </Stack>
    </Base>
  );
};

export default MealListDetailContainer;
