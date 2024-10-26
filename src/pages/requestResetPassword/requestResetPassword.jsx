import EmailForgeted from "../../components/EmailForgetPassword/EmailForgetPassword";
import image from "../../assets/travel.svg";
import logo from "../../assets/logo-white.png";
import logo2 from "../../assets/logo-no-background.png";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const RequestResetPassword = () => {
    const navigate = useNavigate();

    return (
        <Container fluid className="vh-100">
            <Row className="h-100">
                <Col
                    md={6}
                    className="d-none d-md-block p-0 position-relative"
                    style={{ backgroundColor: "#DEC9FF", position: "relative" }}
                >
                    <img
                        src={image}
                        alt="Login"
                        className="position-absolute start-50 translate-middle-x"
                        style={{
                            maxWidth: "80%",
                            maxHeight: "100%",
                            transform: "translateX(-50%)",
                            marginTop: "220px",
                        }}
                    />
                    <img
                        src={logo}
                        alt="Logo"
                        className="position-absolute"
                        style={{
                            maxWidth: "300px",
                            left: "5px",
                            zIndex: "1",
                        }}
                    />
                </Col>
                <Col
                    md={6}
                    className="d-flex align-items-center justify-content-center position-relative"
                    style={{ paddingTop: "50px" }}
                >
                    <img
                        src={logo2}
                        alt="Logo2"
                        className="d-block d-md-none position-absolute"
                        style={{
                            maxWidth: "170px",
                            top: "70px",
                            right: "30px",
                            zIndex: "1",
                        }}
                    />
                    <div className="w-75">
                        <div className="d-flex align-items-center">
                            <Button
                                variant="light"
                                className="text-decoration-none border-0 me-3 p-2 mb-4"
                                onClick={() => navigate(-1)}
                            >
                                <FaArrowLeft style={{ color: "black" }} />
                            </Button>
                            <h2 className="mb-4">Verification Email</h2>
                        </div>
                        <EmailForgeted />
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default RequestResetPassword;
