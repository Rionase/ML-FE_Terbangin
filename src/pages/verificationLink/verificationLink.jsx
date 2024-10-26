import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyLink } from "../../redux/actions/verify";
import Swal from "sweetalert2";

const VerificationLink = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setShowModal(true);
    }, []);

    useEffect(() => {
        const handleConfirmation = async () => {
            setShowModal(false);
            const searchParams = new URLSearchParams(location.search);
            const token = searchParams.get("token");

            try {
                dispatch(verifyLink(navigate, token));
                Swal.fire({
                    title: "Link Terverifikasi",
                    text: "Link berhasil diverifikasi, silahkan reset password anda",
                    icon: "success",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "OK",
                    showCancelButton: false,
                    showConfirmButton: true,
                });
            } catch (error) {
                console.error("Error:", error);
            }
        };

        if (showModal) {
            handleConfirmation();
        }
    }, [showModal, dispatch, location, navigate]);

    return <div>VerificationLink</div>;
};

export default VerificationLink;
