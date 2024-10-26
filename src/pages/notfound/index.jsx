import { useState, useEffect } from "react";
import { Button, Container, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import notfoundimg from "../../assets/Sorry item not found.png";
import "../payment/success.css";

const NotFoundPage = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            {/* Main Content */}
            <Container id={"content"}>
                <Image
                    src={notfoundimg}
                    fluid={true}
                    id={"paymentSuccessIllustration"}
                    className={"mb-1 mt-5"}
                    style={{ width: 400 }}
                />
                <h4 id={"selamat"}>
                    Oppss! Penerbangan ini telah kehabisan tiket
                </h4>
                <h4>Mari mencari penerbangan yang lain !!!</h4>

                <Button style={{ width: 400 }} onClick={() => navigate("/")}>
                    Cari penerbangan lain
                </Button>
            </Container>
        </>
    );
};

export default NotFoundPage;
