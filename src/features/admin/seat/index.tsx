import { FC, useState } from "react";
import { TabPanel } from "~/components/tabs";

import SeatTabs from "./SeatTabs";
import SeatSearchBar from "./SeatSearchBar";
import { TabList, TabTable } from "./tab";
import appDayjs from "~/utils/dayjs.util";
import { DialogType } from "~/components/dialog";

interface SeatContainerProps {}

const SeatContainer: FC<SeatContainerProps> = ({}) => {
  const [view, setView] = useState(0);
  const [date, setDate] = useState<appDayjs.Dayjs>(appDayjs());
  const [search, setSearch] = useState<string>("");

  const handleDateChange = (value: appDayjs.Dayjs | null) => {
    setDate(value ?? appDayjs());
  };
  const handleSearchChange = (value: string) => {
    setSearch(value ?? "");
  };

  return (
    <>
      <SeatTabs view={view} setView={setView} />
      <SeatSearchBar
        view={view}
        date={date}
        handleDateChange={handleDateChange}
        handleSearchChange={handleSearchChange}
      />
      <TabPanel value={view} index={0}>
        <TabTable date={date} />
      </TabPanel>
      <TabPanel value={view} index={1}>
        <TabList date={date} search={search} />
      </TabPanel>
      <DialogType.BookingQRCodeModal />
    </>
  );
};

export default SeatContainer;
