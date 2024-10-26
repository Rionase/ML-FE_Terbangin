import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect } from "react";

const ProtectedFilterTicket = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        flightType,
        departure,
        iataCodeDeparture,
        arrival,
        iataCodeArrival,
        departureDate,
        seatType,
        capacity,
    } = location.state || {};

    useEffect(() => {
        if (
            !flightType ||
            !departure ||
            !iataCodeDeparture ||
            !arrival ||
            !iataCodeArrival ||
            !departureDate ||
            !seatType ||
            !capacity
        ) {
            navigate("/", { replace: true });
        }
    }, [
        navigate,
        flightType,
        departure,
        iataCodeDeparture,
        arrival,
        iataCodeArrival,
        departureDate,
        seatType,
        capacity,
    ]);

    return flightType ? children : null;
};

ProtectedFilterTicket.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedFilterTicket;
