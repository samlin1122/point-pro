import { useState, FC, ChangeEvent, useEffect, Fragment } from "react";

import {
  List,
  ListItem,
  FormControl,
  InputLabel,
  MenuItem,
  Stack,
  Button,
  Divider,
  ListItemText,
  ListItemButton,
  FormControlLabel
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import SwitchBase from "~/components/switch";
import AddIcon from "@mui/icons-material/Add";

import { RouterProps, IMeal, ICategory } from "~/types";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { getMeals, putMealById } from "~/app/slices/meal";
import { Categories } from "~/app/selector";
import appDayjs, { formatFullDate } from "~/utils/dayjs.util";

export const MealListContainer: FC<RouterProps> = ({ navigate }) => {
  const dispatch = useAppDispatch();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const categories: ICategory[] = useAppSelector(Categories);
  const [mealList, setMealList] = useState<IMeal[]>();

  useEffect(() => {
    dispatchGetMeals();
  }, []);

  const dispatchGetMeals = async () => {
    const { result } = await dispatch(getMeals()).unwrap();
    setMealList(result);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value as string);
  };

  const handleSwitchChange = async (mealId: string, checked: boolean) => {
    // console.log(event.target.checked);
    let payload: { publishedAt: string | null } = { publishedAt: appDayjs().toISOString() };
    if (checked) {
      payload.publishedAt = appDayjs().toISOString();
    } else {
      payload.publishedAt = null;
    }
    console.log({ mealId, payload });

    try {
      await dispatch(putMealById({ mealId, payload }));
      await dispatchGetMeals();
    } catch (error) {
      console.log("publishedAt failed");
    }
  };

  const handleMealClick = (mealId: string) => {
    console.log({ mealId });
    navigate({ pathname: `/admin/meal/list/${mealId}` });
  };

  const handleMealCreate = () => {
    navigate({ pathname: `/admin/meal/list/create` });
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between" p={3}>
        <FormControl sx={{ width: "150px" }}>
          <InputLabel id="category-select-label">分類</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={selectedCategory}
            label="category"
            onChange={handleChange}
          >
            <MenuItem value="all">全部</MenuItem>
            {categories.map((cate) => (
              <MenuItem key={`cate-${cate.title}`} value={cate.id}>
                {cate.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button onClick={handleMealCreate} variant="contained" startIcon={<AddIcon />}>
          新增菜單
        </Button>
      </Stack>
      <Divider flexItem />
      <List sx={{ mx: 0, p: 0 }}>
        {mealList?.map((meal) => (
          <Fragment key={`meal-${meal.id}`}>
            {selectedCategory === "all" || meal.categories?.some((categoryId) => categoryId === selectedCategory) ? (
              <ListItemButton
                sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
                onClick={() => handleMealClick(meal.id)}
              >
                <ListItem>
                  <ListItemText sx={{ width: "40%" }} primary={meal.title} />
                  {appDayjs().isBefore(appDayjs(meal.publishedAt)) ? (
                    <ListItemText primary={formatFullDate(meal.publishedAt)} />
                  ) : null}
                  <FormControlLabel
                    onClick={(eve) => eve.stopPropagation()}
                    control={
                      <SwitchBase
                        sx={{ mx: 2 }}
                        onChange={(event) => handleSwitchChange(meal.id, event.target.checked)}
                        checked={appDayjs().isAfter(appDayjs(meal.publishedAt))}
                      />
                    }
                    label={appDayjs().isAfter(appDayjs(meal.publishedAt)) ? "上架中" : "未上架"}
                  />
                </ListItem>
              </ListItemButton>
            ) : null}
          </Fragment>
        ))}
      </List>
    </>
  );
};

export default MealListContainer;
