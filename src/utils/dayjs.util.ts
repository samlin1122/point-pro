import appDayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";
import isYesterday from "dayjs/plugin/isYesterday";
import isToday from "dayjs/plugin/isToday";
import isTomorrow from "dayjs/plugin/isTomorrow";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import "dayjs/locale/zh-tw";

appDayjs.extend(relativeTime);
appDayjs.extend(duration);
appDayjs.extend(utc);
appDayjs.extend(timezone);
appDayjs.extend(localizedFormat);
appDayjs.extend(advancedFormat);
appDayjs.extend(customParseFormat);
appDayjs.extend(isBetween);
appDayjs.extend(isYesterday);
appDayjs.extend(isToday);
appDayjs.extend(isTomorrow);
appDayjs.extend(relativeTime);
appDayjs.locale("zh-tw");

export default appDayjs;

export const dateForm = {
  fullDateWithTime: "YYYY年MM月DD日 HH:mm",
  fullDate: "YYYY年MM月DD日",
  dateWithTime: "MM月DD日 HH:mm",
  dateOnly: "MM月DD日",
  yearOnly: "YYYY年",
  timeOnly: "HH:mm"
};

export const formatFullDateWithTime = (date: any) => {
  return date ? appDayjs(date).format(dateForm.fullDateWithTime) : date;
};
export const formatFullDate = (date: any) => {
  return date ? appDayjs(date).format(dateForm.fullDate) : date;
};
export const formatDateOnly = (date: any) => {
  return date ? appDayjs(date).format(dateForm.dateOnly) : date;
};
export const formatTimeOnly = (date: any) => {
  return date ? appDayjs(date).format(dateForm.timeOnly) : date;
};
