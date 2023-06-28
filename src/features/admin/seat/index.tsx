import { FC, useState } from "react";
import { TabPanel } from "~/components/tabs";

import SeatTabs from "./SeatTabs";
import SeatSearchBar from "./SeatSearchBar";
import { TabList, TabTable } from "./tab";
import appDayjs from "~/utils/dayjs.util";

interface SeatContainerProps {}

const SeatContainer: FC<SeatContainerProps> = ({}) => {
  const [view, setView] = useState(0);
  const [date, setDate] = useState<appDayjs.Dayjs>(appDayjs());

  const handleDateChange = (value: appDayjs.Dayjs | null) => {
    setDate(value ?? appDayjs());
  };

  return (
    <>
      <SeatTabs view={view} setView={setView} />
      <SeatSearchBar view={view} setView={setView} date={date} handleDateChange={handleDateChange} />
      <TabPanel value={view} index={0}>
        <TabTable date={date} />
      </TabPanel>
      <TabPanel value={view} index={1}>
        <TabList date={date} />
      </TabPanel>
    </>
  );
};

export default SeatContainer;
