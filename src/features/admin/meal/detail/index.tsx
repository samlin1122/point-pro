import { FC } from "react";
import { RouterProps } from "~/types";

export const MealDetailContainer: FC<RouterProps> = ({ params }) => {
  console.log(params);
  const isCreate = params.meal_id === "create";

  return <div>菜單{isCreate ? "新增" : "編輯"}頁</div>;
};

export default MealDetailContainer;
