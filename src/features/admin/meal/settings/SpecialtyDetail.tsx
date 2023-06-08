import { useEffect, useState, useReducer } from "react";

import { FilterOptionsState, IconButton, InputAdornment, Stack, TextField } from "@mui/material";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { FieldContainer } from "~/components/layout";
import { DrawerBase } from "~/components/drawer";
import { InputText } from "~/components/input";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";

import { useAppDispatch } from "~/app/hook";
import {
  getSpecialtyById,
  getSpecialtyItems,
  postSpecialty,
  putSpecialtyById,
  deleteSpecialty
} from "~/app/slices/specialty";
import { SpecialtyTypeList } from "~/utils/constants";
import mainReducer, {
  initialState,
  defaultSetting,
  editField,
  addItem,
  deleteItem,
  editItem,
  convertToPayload
} from "./reducers";
import { ISpecialtyItem } from "~/types";

interface filterOptionType extends ISpecialtyItem {
  inputValue?: string;
}
const filter = createFilterOptions<filterOptionType>();
interface SpecialtyDetailProps {
  specialtyId: string | undefined;
  open: boolean;
  onClose: (update?: boolean) => void;
}
const SpecialtyDetail = ({ specialtyId, open, onClose }: SpecialtyDetailProps) => {
  const isCreate = !Boolean(specialtyId);

  const [specialtyItemOptions, setSpecialtyItemOptions] = useState<ISpecialtyItem[]>([]);

  const [state, reducerDispatch] = useReducer(mainReducer, initialState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (open) {
      dispatchGetSpecialtyItems();
      if (isCreate) {
        reducerDispatch(defaultSetting(null));
      } else {
        dispatchGetSpecialtyById();
      }
    } else {
      reducerDispatch(defaultSetting(null));
    }
  }, [open]);

  const dispatchGetSpecialtyItems = async () => {
    const { result } = await dispatch(getSpecialtyItems()).unwrap();
    setSpecialtyItemOptions(result);
  };
  const dispatchGetSpecialtyById = async () => {
    try {
      const { result } = await dispatch(getSpecialtyById(specialtyId as string)).unwrap();
      reducerDispatch(defaultSetting(result));
    } catch (error) {
      console.log("dispatchGetSpecialtyById failed");
    }
  };

  const fieldList = [
    {
      id: "title",
      label: "名稱",
      type: "text"
    },
    {
      id: "type",
      label: "類型",
      type: "select",
      list: SpecialtyTypeList
    },
    {
      id: "items",
      label: "選項",
      type: "button",
      text: "新增選項",
      startIcon: <AddIcon />,
      onClick: () => reducerDispatch(addItem())
    }
  ];

  const handleFieldChange = (props: { id: string; value: any }) => {
    reducerDispatch(editField(props));
  };

  const handleSpecialtyItemChange = (props: { index: number; key: string; value: any }) => {
    reducerDispatch(editItem(props));
  };

  const filterOptions = (options: ISpecialtyItem[], params: FilterOptionsState<filterOptionType>) => {
    const filtered = filter(options, params);

    const { inputValue } = params;
    // Suggest the creation of a new value
    const isExisting = options.some((option) => inputValue === option.title);
    if (inputValue !== "" && !isExisting) {
      filtered.push({
        id: "",
        title: `新增 "${inputValue}"`,
        inputValue
      });
    }
    return filtered;
  };

  const getOptionLabel = (option: string | filterOptionType) => {
    // Value selected with enter, right from the input
    if (typeof option === "string") {
      return option;
    }
    // Add "xxx" option created dynamically
    if (option.inputValue) {
      return option.inputValue;
    }
    // Regular option
    return option.title;
  };

  const handleButtonClick = async (key: string) => {
    switch (key) {
      case "cancel":
        onClose();
        break;
      case "create":
        try {
          let payload = convertToPayload(state);
          console.log({ payload });
          await dispatch(postSpecialty(payload));
          onClose(true);
        } catch (error) {
          console.log("create specialty failed");
        }
        break;
      case "save":
        try {
          let payload = convertToPayload(state);
          console.log({ payload });
          await dispatch(putSpecialtyById({ specialtyId: specialtyId as string, payload }));
          onClose(true);
        } catch (error) {
          console.log("update specialty failed");
        }
        break;
      case "delete":
        try {
          await dispatch(deleteSpecialty(specialtyId as string));
          onClose(true);
        } catch (error) {
          console.log("delete specialty failed", { error });
        }
        break;
    }
  };

  const getButtonList = () => {
    return isCreate
      ? [{ label: "新增", onClick: () => handleButtonClick("create") }]
      : [
          { label: "刪除", onClick: () => handleButtonClick("delete") },
          { label: "保存", onClick: () => handleButtonClick("save") }
        ];
  };
  return (
    <DrawerBase
      title={isCreate ? "新增客製化選項" : "編輯客製化選項"}
      open={open}
      onClose={onClose}
      buttonList={getButtonList()}
    >
      <Stack sx={{ p: 3 }} gap={3}>
        {fieldList.map((field) => (
          <FieldContainer
            width={200}
            key={`specialty-input-${field.id}`}
            value={state[field.id].value}
            onChange={handleFieldChange}
            {...field}
          />
        ))}
        {state.items.value.map((item: ISpecialtyItem, index: number) => (
          <Stack
            key={`items-${item.id ? item.id : `new-${index}`}`}
            direction="row"
            gap={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Autocomplete
              value={item.title}
              onChange={(event, value) => handleSpecialtyItemChange({ index, key: "title", value })}
              filterOptions={filterOptions}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              options={specialtyItemOptions}
              getOptionLabel={getOptionLabel}
              renderOption={(props, option) => <li {...props}>{typeof option === "string" ? option : option.title}</li>}
              sx={{ width: "60%" }}
              freeSolo
              renderInput={(params) => <TextField placeholder="請輸入客製化選項" {...params} />}
            />
            <InputText
              type="number"
              value={item.price}
              onChange={(event) => handleSpecialtyItemChange({ index, key: "price", value: event.target.value })}
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
            />
            <IconButton sx={{ width: "10%" }} onClick={() => reducerDispatch(deleteItem(index))}>
              <CancelIcon />
            </IconButton>
          </Stack>
        ))}
      </Stack>
    </DrawerBase>
  );
};

export default SpecialtyDetail;
