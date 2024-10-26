import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function ProtectedPaymentSuccess({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, token } = useSelector((state) => state.auth);

    const { snapToken, bookingId } = location.state || {};

    useEffect(() => {
        // const query = new URLSearchParams(window.location.search);
        // const snapToken = query.get("snapToken");
        // if (!snapToken) {
        //     navigate("/");
        // }
        if (!token) {
            navigate("/login", { replace: true });
        }
        
        if (!snapToken || !bookingId) {
            navigate("/");
        }
    }, [navigate, snapToken, token, bookingId]);

    return children;
}
