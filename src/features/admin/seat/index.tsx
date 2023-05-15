import { FC, useState } from "react";
import { TabPanel } from "~/components/tabs";
import { Box, Tab, Tabs } from "@mui/material";

import TableView from "./TableView";
import SeatTabs from "./SeatTabs";
import SeatSearchBar from "./SeatSearchBar";

interface SeatContainerProps {}

export const SeatContainer: FC<SeatContainerProps> = ({}) => {
  const [view, setView] = useState(0);

  return (
    <>
      <SeatTabs view={view} setView={setView} />
      <SeatSearchBar view={view} setView={setView} />
      <TabPanel value={view} index={0}>
        <></>
      </TabPanel>
      <TabPanel value={view} index={1}>
        <></>
      </TabPanel>
      <TabPanel value={view} index={2}>
        <TableView />
      </TabPanel>
    </>
  );
};

export default SeatContainer;
