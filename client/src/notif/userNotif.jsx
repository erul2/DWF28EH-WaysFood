import { useEffect, useState, useRef } from "react";
import socketIOClient from "socket.io-client";

const NEW_EVENT = "newNotif";
const SOCKET_SERVER_URL = "http://localhost:5000";

const UserNotif = (roomId) => {
  const [notif, setNotif] = useState("");
  const socketRef = useRef();

  useEffect(() => {
    // create web socket connection
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      auth: { token: localStorage.getItem("token") },
      query: { roomId },
    });

    // listen for incoming notifications
    socketRef.current.on(NEW_EVENT, (notif) => {
      setNotif(notif);
    });

    // destroy the socket connection
    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  // send new notif
  const sendNotif = (notif) => {
    socketRef.current.emit(NEW_EVENT, {
      body: notif,
    });
  };

  return { notif, sendNotif };
};

export default UserNotif;
