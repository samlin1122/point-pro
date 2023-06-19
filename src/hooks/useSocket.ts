import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { apiHost } from "~/api/http";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { getOrders } from "~/app/slices/order";
import { resetSocket, setSocket } from "~/app/slices/socket";
import { closeDialog, getMenu } from "~/features/orders/slice";

export enum SocketTopic {
  MENU = "MENU",
  ORDER = "ORDER",
  RESERVATION = "RESERVATION"
}

type useSocketProps = {
  ns: "user" | "admin";
};
export const useSocket = (props: useSocketProps) => {
  const { ns } = props;

  const token = localStorage.getItem("token");

  const dispatch = useAppDispatch();

  const orderStatus = useAppSelector(({ order }) => order.status);

  // Socket Instance
  const { current: socket } = useRef(
    io(`${apiHost}/${ns}`, {
      transports: ["polling", "websocket"],
      autoConnect: false,
      auth: {
        token
      }
    })
  );

  // Connect to server & save sokect instance
  useEffect(() => {
    socket.connect();
    dispatch(setSocket(socket));

    return () => {
      socket.disconnect();
      dispatch(resetSocket());
    };
  }, [token, socket]);

  // CONNECTION listener
  useEffect(() => {
    socket.on("connect", () => {
      console.log(`Connect to server. ${ns} ID: ${socket.id}`);
    });

    socket.on("disconnect", () => {
      console.log("Disconnect from server.");
    });

    socket.io.on("reconnect", (attempt) => {
      console.log(`Reconnect to server. ${attempt} times`);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.io.off("reconnect");
    };
  }, [socket]);

  // MENU listener
  useEffect(() => {
    socket.on(SocketTopic.MENU, (data) => {
      // [TODO]
      const routerIsMenuOrMeal = true;
      if (ns === "user" || (ns === "admin" && routerIsMenuOrMeal)) {
        dispatch(getMenu());
        dispatch(closeDialog());
      }
    });
    return () => {
      socket.off(SocketTopic.MENU);
    };
  }, [socket, ns]);

  // ORDER listener
  useEffect(() => {
    socket.on(SocketTopic.ORDER, (data) => {
      if (ns === "user") {
        dispatch(getOrders({}));
      }

      if (ns === "admin") {
        dispatch(getOrders({ status: orderStatus }));
      }
    });

    return () => {
      socket.off(SocketTopic.ORDER);
    };
  }, [socket, ns, orderStatus]);

  // RESERVATION listener
  useEffect(() => {
    socket.on(SocketTopic.RESERVATION, (data) => {
      console.log(SocketTopic.RESERVATION, data);
    });

    return () => {
      socket.off(SocketTopic.RESERVATION);
    };
  }, [socket]);
};
