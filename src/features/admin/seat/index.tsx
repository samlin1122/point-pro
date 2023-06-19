import { FC, useState } from "react";
import { TabPanel } from "~/components/tabs";

import SeatTabs from "./SeatTabs";
import SeatSearchBar from "./SeatSearchBar";
import { TabList, TabTable } from "./tab";

interface SeatContainerProps {}

const SeatContainer: FC<SeatContainerProps> = ({}) => {
  const [view, setView] = useState(0);

  return (
    <>
      <SeatTabs view={view} setView={setView} />
      <SeatSearchBar view={view} setView={setView} />
      <TabPanel value={view} index={0}>
        <TabTable />
      </TabPanel>
      <TabPanel value={view} index={1}>
        <TabList />
      </TabPanel>
    </>
  );
};

export default SeatContainer;
