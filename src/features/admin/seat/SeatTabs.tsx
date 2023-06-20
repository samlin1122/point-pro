import React, { useState } from "react";
import { Tab, Tabs } from "@mui/material";

interface ISeatViewProps {
  view: number;
  setView: React.Dispatch<React.SetStateAction<number>>;
}

const SEAT_VIEW = "SEAT_VIEW";
const GANTT_VIEW = "GANTT_VIEW";
const TABLE_VIEW = "TABLE_VIEW";

const tabs = [
  { value: SEAT_VIEW, title: "座位表", id: SEAT_VIEW },
  // { value: GANTT_VIEW, title: "甘特圖", id: GANTT_VIEW },
  { value: TABLE_VIEW, title: "列表", id: TABLE_VIEW }
];

const SeatTabs = (props: ISeatViewProps) => {
  const { view, setView } = props;

  return (
    <Tabs
      sx={{ position: "sticky", top: "0", zIndex: "10", backgroundColor: "background.paper", height: "50px" }}
      onChange={(_, value) => setView(value)}
      value={view}
    >
      {tabs.map((tab) => (
        <Tab label={tab.title} id={tab.id} key={`${tab.id}-${tab.title}`} />
      ))}
    </Tabs>
  );
};

export default SeatTabs;
