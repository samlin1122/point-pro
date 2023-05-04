import { useState, FC, ChangeEvent } from "react";

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
import { Base } from "~/components/layout";

import AddIcon from "@mui/icons-material/Add";
import SwitchBase from "~/components/switch";
import { RouterProps } from "~/types";

export const MealListContainer: FC<RouterProps> = ({ navigate }) => {
  const [category, setCategory] = useState("");
  const [categoryList, setCategoryList] = useState([1, 2, 3, 4, 5]);
  const [mealList, setMealList] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

  const handleChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };

  const handleSwitchChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.checked);
  };

  const handleMealClick = (meal_id: Number) => {
    console.log({ meal_id });
    navigate({ pathname: `/admin/meal/list/${meal_id}` });
  };

  const handleMealCreate = () => {
    navigate({ pathname: `/admin/meal/list/create` });
  };

  return (
    <>
      <Base>
        <Stack direction="row" justifyContent="space-between">
          <FormControl sx={{ width: "150px" }}>
            <InputLabel id="category-select-label">分類</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={category}
              label="Age"
              onChange={handleChange}
            >
              {categoryList.map((cate) => (
                <MenuItem key={`category-${cate}`} value={cate}>
                  {cate}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button onClick={handleMealCreate} variant="contained" startIcon={<AddIcon />}>
            新增菜單
          </Button>
        </Stack>
      </Base>
      <Divider flexItem />
      <List sx={{ mx: 3, p: 0 }}>
        {mealList.map((item) => (
          <ListItemButton
            key={`meal-${item}`}
            sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
            onClick={() => handleMealClick(item)}
          >
            <ListItem>
              <ListItemText primary={"青椒炒肉絲"} />
              <FormControlLabel
                onClick={(eve) => eve.stopPropagation()}
                control={<SwitchBase sx={{ mx: 1 }} onChange={handleSwitchChange} />}
                label="上架中"
              />
            </ListItem>
          </ListItemButton>
        ))}
      </List>
    </>
  );
};

export default MealListContainer;
