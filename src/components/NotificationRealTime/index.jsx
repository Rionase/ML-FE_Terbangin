import { useEffect } from "react";
import { toast } from "react-toastify";
import CustomToastMessage from "../ToastMessage";
import { useSocket } from "../SocketContext";
import { useSelector } from "react-redux";

const NotificationHandler = () => {
    const socket = useSocket();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!user || !socket.current) {
            return;
        }

        socket.current.on("bookingNotification", (data) => {
            if (data.userId === user.id) {
                // console.log("Received booking notification:", data);
                toast.info(
                    <CustomToastMessage
                        message={
                            data?.message || "Received booking notification"
                        }
                        highlight={data?.highlight}
                    />,
                    {
                        containerId: "navbarToast",
                        closeOnClick: true,
                    }
                );
            }
        });

        socket.current.on("paymentSuccess", (data) => {
            if (data.userId === user.id) {
                // console.log("Received payment success notification:", data);
                toast.success(
                    <CustomToastMessage
                        message={
                            data?.message || "Received payment notification"
                        }
                        highlight={data?.highlight || "Order ID"}
                    />,
                    {
                        containerId: "navbarToast",
                        autoClose: 5000,
                        closeOnClick: true,
                    }
                );
            }
        });

        socket.current.on("paymentFailed", (data) => {
            if (data.userId === user.id) {
                // console.log("Received payment failed notification:", data);
                toast.error(
                    <CustomToastMessage
                        message={
                            data?.message || "Received payment notification"
                        }
                        highlight={data?.highlight || "Order ID"}
                    />,
                    {
                        containerId: "navbarToast",
                        autoClose: 5000,
                        closeOnClick: true,
                    }
                );
            }
        });

        return () => {
            if (socket.current) {
                socket.current.off("bookingNotification");
                socket.current.off("paymentSuccess");
                socket.current.off("paymentFailed");
            }
        };
    }, [socket.current, user]);

    return null;
};

export default NotificationHandler;
