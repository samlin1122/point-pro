import appDayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";

appDayjs.extend(relativeTime);
appDayjs.extend(duration);

export default appDayjs;
