import { useEffect, useReducer, useState } from "react";

import { Stack } from "@mui/material";
import { FieldContainer } from "~/components/layout";
import { DrawerBase } from "~/components/drawer";

import { useAppDispatch } from "~/app/hook";
import { getPeriodByDate } from "~/app/slices/period";
import { patchReservationById, postReservation } from "~/app/slices/reservation";
import { PeriodInfo } from "~/types";
import { PatchReservation } from "~/types/api";
import { genderList } from "~/utils/constants";
import mainReducer, {
  initialState,
  defaultSetting,
  editField,
  validator,
  validateCheck,
  convertToCreatePayload,
  convertToPatchPayload
} from "./reducers/reservation-detail";
import appDayjs, { formatTimeOnly } from "~/utils/dayjs.util";

interface ReservationDetail {
  open: boolean;
  onClose: (refresh?: boolean) => void;
  isCreate: boolean;
  date: appDayjs.Dayjs;
  info?: any;
}

const ReservationDetail = ({ open, onClose, isCreate, date, info }: ReservationDetail) => {
  const dispatch = useAppDispatch();
  const [periods, setPeriods] = useState<PeriodInfo[]>([]);
  const [state, reducerDispatch] = useReducer(mainReducer, initialState);

  useEffect(() => {
    if (open) {
      dispatchGetPeriodByDate();
      if (isCreate) {
        reducerDispatch(defaultSetting(info?.id));
      } else {
        reducerDispatch(defaultSetting(info));
      }
    }
  }, [open]);

  const dispatchGetPeriodByDate = async () => {
    let payload = {
      date: appDayjs(date).isToday() ? date?.toDate() ?? appDayjs().toDate() : appDayjs(date).startOf("day"),
      excludeTime: false,
      isOnlineBooking: false
    };
    let { result } = await dispatch(getPeriodByDate(payload)).unwrap();
    setPeriods(result?.[0]?.periods ?? []);
  };

  const amountList = () => {
    let available = periods.find((e) => e.id === state.period?.value)?.available || 0;
    return available > 10
      ? [
          { id: 1, title: 1 },
          { id: 2, title: 2 },
          { id: 3, title: 3 },
          { id: 4, title: 4 },
          { id: 7, title: 7 },
          { id: 8, title: 8 },
          { id: 9, title: 9 },
          { id: 10, title: 10 }
        ]
      : Array.from({ length: periods.find((e) => e.id === state.period?.value)?.available ?? 0 }, (_, i) => ({
          id: i + 1,
          title: i + 1
        }));
  };

  const fieldList = [
    {
      id: "period",
      label: "時段",
      type: "select",
      list: periods.map((e: PeriodInfo) => ({ id: e.id, title: formatTimeOnly(e.periodStartedAt) })),
      disabled: !!info?.id
    },
    {
      id: "amount",
      label: "人數",
      type: "select",
      list: amountList(),
      disabled: !state.period?.value || !!info?.reservation?.id
    },
    {
      id: "name",
      label: "姓名",
      type: "text"
    },
    {
      id: "gender",
      label: "稱謂",
      type: "select",
      list: genderList
    },
    {
      id: "phone",
      label: "電話",
      type: "text"
    },
    {
      id: "email",
      label: "信箱",
      type: "text"
    }
  ];

  const handleFieldChange = (props: { id: string; value: any }) => {
    reducerDispatch(editField(props));
  };

  const handleButtonClick = async (key: string) => {
    try {
      switch (key) {
        case "create":
          if (validateCheck(state)) {
            let payload = convertToCreatePayload(
              state,
              periods.find((e) => e.id === state.period.value)?.periodStartedAt as Date
            );
            console.log({ payload });
            await dispatch(postReservation(payload));
            onClose(true);
          } else {
            reducerDispatch(validator());
          }
          break;
        case "save":
          if (validateCheck(state)) {
            let payload: PatchReservation = convertToPatchPayload(state);
            console.log({ payload });
            await dispatch(patchReservationById({ reservationId: info.reservation.id, payload }));
            onClose(true);
          } else {
            reducerDispatch(validator());
          }
          break;
        case "cancel":
          onClose();
          break;
      }
    } catch (error) {
      console.log(`${key} specialty failed`);
    }
  };
  const getButtonList = () => {
    return isCreate
      ? [
          { label: "取消", onClick: () => handleButtonClick("cancel") },
          { label: "新增", onClick: () => handleButtonClick("create") }
        ]
      : [
          { label: "取消", onClick: () => handleButtonClick("cancel") },
          { label: "保存", onClick: () => handleButtonClick("save") }
        ];
  };

  return (
    <DrawerBase
      title={isCreate ? "新增預約使用" : "編輯預約使用"}
      open={open}
      onClose={onClose}
      buttonList={getButtonList()}
    >
      <Stack sx={{ p: 3 }} gap={3}>
        <FieldContainer type="date" label="日期" width={200} value={date} disabled={true} />
        {fieldList.map((field) => (
          <FieldContainer
            width={200}
            key={`edit-seat-detail-input-${field.id}`}
            value={state[field.id].value}
            onChange={handleFieldChange}
            error={state[field.id].invalid}
            {...field}
          />
        ))}
      </Stack>
    </DrawerBase>
  );
};
export default ReservationDetail;
