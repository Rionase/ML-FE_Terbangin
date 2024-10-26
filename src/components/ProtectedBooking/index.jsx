import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedBooking = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const { user, token } = useSelector((state) => state.auth);

    const {
        flightIdDeparture,
        flightIdReturn,
        capacity,
        adult,
        child,
        baby,
        seatType,
    } = location.state || {};

    useEffect(() => {
        if (!token) {
            localStorage.setItem(
                "bookingData",
                JSON.stringify({
                    flightIdDeparture,
                    flightIdReturn,
                    capacity,
                    adult,
                    child,
                    baby,
                    seatType,
                })
            );
            navigate("/login", { replace: true });
        }
        if (!flightIdDeparture) {
            navigate("/", { replace: true });
        }
    }, [token, navigate, flightIdDeparture]);

    return flightIdDeparture ? children : null;
};

export default ProtectedBooking;
