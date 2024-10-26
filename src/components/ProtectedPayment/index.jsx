import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function ProtectedPayment({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingIdResult } = location.state || {};

    useEffect(() => {
        if (!bookingIdResult) {
            navigate("/");
        }
    }, [bookingIdResult, navigate]);

    return children;
}
