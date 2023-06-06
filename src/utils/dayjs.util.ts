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
