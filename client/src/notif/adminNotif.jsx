import { useEffect, useState, useRef } from "react";
import socketIOClient from "socket.io-client";

const NEW_EVENT = "newUserNotif";
const SOCKET_SERVER_URL = "http://localhost:5000";

const AdminNotif = (roomId) => {
  const [notif, setNotif] = useState(null);
  const socketRef = useRef();

  useEffect(() => {
    // create web socket connection
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { roomId },
    });

    // listen for incoming notifications
    socketRef.current.on("newNotif", (newNotif) => {
      setNotif(newNotif);
    });

    // destroy the socket connection
    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  // send new notif
  const sendNotif = (newNotif) => {
    socketRef.current.emit(NEW_EVENT, {
      body: newNotif,
    });
  };

  return { notif, sendNotif };
};

export default AdminNotif;
