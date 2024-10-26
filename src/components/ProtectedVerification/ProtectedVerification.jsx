import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect } from "react";

const ProtectedVerification = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const { name, email, password, phoneNumber } = location.state || {};

    useEffect(() => {
        if (!email || !name || !password || !phoneNumber) {
            navigate("/register", { replace: true });
        }
    }, [email, navigate, name, password, phoneNumber]);

    return email ? children : null;
};

ProtectedVerification.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedVerification;
