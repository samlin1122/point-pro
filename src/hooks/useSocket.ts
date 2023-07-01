import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import { apiHost } from "~/api/http";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { getOrders } from "~/app/slices/order";
import { SocketTopic, addNotification, resetSocket, setSocket } from "~/app/slices/socket";
import { closeDialog, getMenu } from "~/features/orders/slice";
import { getToken } from "~/utils/token.utils";

export enum NameSpace {
  main = "/",
  user = "/user",
  admin = "/admin"
}

type useSocketProps = {
  ns: NameSpace;
};
export const useSocket = (props: useSocketProps) => {
  const { ns } = props;

  const { pathname } = useLocation();

  const dispatch = useAppDispatch();

  const orderStatus = useAppSelector(({ order }) => order.status);

  // Socket Instance
  const { current: socket } = useRef(
    io(`${apiHost}${ns}`, {
      transports: ["polling", "websocket"],
      autoConnect: false,
      auth: {
        token: getToken()
      }
    })
  );

  // Connect to server & save socket instance
  useEffect(() => {
    socket.connect();
    dispatch(setSocket(socket));

    return () => {
      socket.disconnect();
      dispatch(resetSocket());
    };
  }, [socket]);

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
  }, [socket, ns]);

  // MENU listener
  useEffect(() => {
    socket.on(SocketTopic.MENU, (data) => {
      if (ns === NameSpace.user) {
        dispatch(getMenu());
        dispatch(closeDialog());
      }

      if (ns === NameSpace.admin) {
        dispatch(addNotification({ ...data, notiType: SocketTopic.MENU }));
        if (pathname.includes("/admin/menu")) {
          dispatch(getMenu());
          dispatch(closeDialog());
        }
        if (pathname.includes("/admin/meal")) {
          dispatch(getMenu());
        }
      }
    });

    return () => {
      socket.off(SocketTopic.MENU);
    };
  }, [socket, ns, pathname]);

  // ORDER listener
  useEffect(() => {
    socket.on(SocketTopic.ORDER, (data) => {
      if (ns === NameSpace.user) {
        dispatch(getOrders({}));
      }

      if (ns === NameSpace.admin) {
        dispatch(addNotification({ ...data, notiType: SocketTopic.ORDER }));

        if (pathname.includes("/admin/orders")) {
          dispatch(getOrders({ status: orderStatus }));
        }
      }
    });

    return () => {
      socket.off(SocketTopic.ORDER);
    };
  }, [socket, ns, orderStatus, pathname]);

  // RESERVATION listener
  useEffect(() => {
    socket.on(SocketTopic.RESERVATION, (data) => {
      if (ns === NameSpace.admin) {
        dispatch(addNotification({ ...data, notiType: SocketTopic.RESERVATION }));
      }
    });

    return () => {
      socket.off(SocketTopic.RESERVATION);
    };
  }, [socket, ns, pathname]);
};
