// Libs
import { FC } from "react";
// Components
import SeatContainer from "~/features/admin/seat";
import withMainLayout from "~/hoc/create-main-layout";

import { Seat, RouterProps } from "~/types";
import { SeatStatus } from "~/types/common";

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

const SeatPage: FC<RouterProps> = (props) => {
  return <SeatContainer seats={seats} {...props} />;
};

export default withMainLayout(SeatPage);
