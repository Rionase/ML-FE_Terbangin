import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const socket = useRef(null);

    useEffect(() => {
        socket.current = io(import.meta.env.VITE_SOCKET_URL, {
            reconnectionAttempts: Infinity,
            reconnectionDelay: 2000,
            secure: true,
        });

        socket.current.on("connect", () => {
            console.log("Connected to server");
        });

        socket.current.on("disconnect", () => {
            console.log("Disconnected from server");
        });

        socket.current.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
        });

        return () => {
            if (socket.current) {
                socket.current.disconnect();
                socket.current = null;
            }
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
