import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect } from "react";

const ProtectedVerificationProfile = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const { email, phoneNumber } = location.state || {};

    useEffect(() => {
        if (!email && !phoneNumber) {
            navigate("/", { replace: true });
        }
    }, [email, navigate, phoneNumber]);

    return email || phoneNumber ? children : null;
};

ProtectedVerificationProfile.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedVerificationProfile;
