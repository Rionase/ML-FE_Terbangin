import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const { id } = location.state || {};

    useEffect(() => {
        if (!id) {
            navigate("/login", { replace: true });
        }
    }, [id, navigate]);

    // Return children if id exists
    return id ? children : null;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
