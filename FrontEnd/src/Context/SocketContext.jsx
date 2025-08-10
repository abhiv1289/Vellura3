import { createContext, useState, useEffect, useContext } from "react";
import { UseAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const UseSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { auth } = UseAuthContext();

  useEffect(() => {
    if (auth) {
      const socket = io(import.meta.env.VITE_API_URL, {
        query: {
          userId: auth.id,
        },
      });
      setSocket(socket);

      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [auth]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
