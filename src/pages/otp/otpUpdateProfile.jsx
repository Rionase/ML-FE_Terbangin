import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
    generateOTPProfile,
    verifyOTPProfile,
} from "../../redux/actions/verify";
import { toast } from "react-toastify";

const OtpVerificationProfile = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { email, phoneNumber } = location.state || {};
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(60);

    const handleChange = (element, index) => {
        if (isNaN(parseInt(element.value))) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleResendOtp = () => {
        if (countdown === 0) {
            dispatch(
                generateOTPProfile(navigate, email, phoneNumber, setLoading)
            );

            toast.success("OTP resent successfully");
            setCountdown(60);
        }
    };

    const handleKeyDown = (element, index) => {
        if (element.key === "Backspace") {
            setOtp([...otp.map((d, idx) => (idx === index ? "" : d))]);
            if (element.target.previousSibling) {
                element.target.previousSibling.focus();
            }
        } else if (element.key === "ArrowLeft") {
            if (element.target.previousSibling) {
                element.target.previousSibling.focus();
            }
        } else if (element.key === "ArrowRight") {
            if (element.target.nextSibling) {
                element.target.nextSibling.focus();
            }
        }
    };

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData("text");
        if (paste.length === 6) {
            setOtp(paste.split(""));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const otpString = otp.join("");
        dispatch(
            verifyOTPProfile(
                navigate,
                email,
                phoneNumber,
                otpString,
                setLoading
            )
        );
    };

    useEffect(() => {
        if (countdown > 0) {
            const timer = setInterval(() => {
                setCountdown(countdown - 1);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [countdown]);

    return (
        <Container
            className="d-flex flex-column align-items-center justify-content-center"
            style={{ minHeight: "100vh" }}
        >
            <Row>
                <Col>
                    <div className="d-flex align-items-center pb-5">
                        <Button
                            variant="link"
                            className="text-decoration-none"
                            onClick={() => navigate(-1)}
                        >
                            <FaArrowLeft style={{ color: "black" }} />
                        </Button>
                        <h2 className="text-start mb-0 ms-2">Masukkan OTP</h2>
                    </div>
                    <p className="pb-3 text-center">
                        Ketik 6 digit kode yang dikirimkan ke{" "}
                        <strong>{email ? email : phoneNumber}</strong>
                    </p>
                    <div
                        className="d-flex justify-content-center mb-3"
                        onPaste={handlePaste}
                    >
                        {otp.map((data, index) => {
                            return (
                                <input
                                    className="otp-field"
                                    type="text"
                                    name="otp"
                                    maxLength="1"
                                    key={index}
                                    value={data}
                                    onChange={(e) =>
                                        handleChange(e.target, index)
                                    }
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onFocus={(e) => e.target.select()}
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        margin: "0 5px",
                                        textAlign: "center",
                                        fontSize: "20px",
                                        borderRadius: "16px",
                                        border: "1px solid #ccc",
                                        backgroundColor: "white",
                                        boxShadow: "0 0 0 1px #ccc inset",
                                        color: "black",
                                    }}
                                />
                            );
                        })}
                    </div>
                    <p className="pb-3 text-center">
                        {countdown > 0 ? (
                            `Kirim OTP dalam ${countdown} detik`
                        ) : (
                            <a
                                style={{ cursor: "pointer", color: "#7126B5" }}
                                className="otp-resend"
                                onClick={handleResendOtp}
                            >
                                Kirim Ulang
                            </a>
                        )}
                    </p>
                    <Button
                        variant="primary"
                        className="w-100"
                        style={{
                            backgroundColor: "#7126B5",
                            borderColor: "#7126B5",
                            borderRadius: "16px",
                        }}
                        onClick={handleSubmit}
                    >
                        {loading ? "Loading..." : "Verifikasi OTP"}
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default OtpVerificationProfile;
