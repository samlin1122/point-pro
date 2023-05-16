import { FC, useState } from "react";
import { TabPanel } from "~/components/tabs";

import SeatTabs from "./SeatTabs";
import SeatSearchBar from "./SeatSearchBar";
import { TabList, TabTable } from "./tab";

import { Seat } from "~/types";
import { SeatStatus } from "~/types/common";

interface SeatContainerProps {}

const seats: Seat[] = [
  {
    seatNo: "A1",
    currentStatus: SeatStatus.AVAILABLE,
    reservations: [
      {
        reservationTime: new Date("2023-05-16 12:00"),
        id: "1",
        seats: ["A1", "A2", "A3"],
        options: {
          name: "葉小姐",
          adult: 4,
          child: 2,
          phoneNumber: "0912345678",
          email: "test@email.com"
        }
      },
      {
        reservationTime: new Date("2023-05-16 16:00"),
        id: "2",
        seats: ["A1", "A2", "A3"],
        options: {
          name: "曹小姐",
          adult: 3,
          child: 2,
          phoneNumber: "0912345678",
          email: "test@email.com"
        }
      },
      {
        reservationTime: new Date("2023-05-16 18:00"),
        id: "3",
        seats: ["A1", "A2", "A3"],
        options: {
          name: "宋小姐",
          adult: 4,
          child: 2,
          phoneNumber: "0912345678",
          email: "test@email.com"
        }
      },
      {
        reservationTime: new Date("2023-05-16 20:00"),
        id: "4",
        seats: ["A1", "A2", "A3"],
        options: {
          name: "田小姐",
          adult: 4,
          child: 2,
          phoneNumber: "0912345678",
          email: "test@email.com"
        }
      }
    ]
  }
];

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
