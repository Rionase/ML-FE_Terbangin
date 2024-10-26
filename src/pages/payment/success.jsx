import { Breadcrumbs, Link } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useDispatch } from "react-redux";
import HeaderShadow from "../../components/HeaderShadow";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button, Container, Image } from "react-bootstrap";
import "./success.css";
import { printTicket } from "../../redux/actions/booking";
import Swal from "sweetalert2";

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const { snapToken, bookingId } = location.state || {};
    const [loading, setloading] = useState(false);

    const handlePrintTicket = async () => {
        try {
            setloading(true);
            await dispatch(printTicket(bookingId));
            Swal.fire({
                icon: "success",
                title: "Tiket berhasil dikirim ke email Anda",
            });
            setloading(false);
        } catch (error) {
            console.error("Failed to print ticket:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Gagal mengirim tiket. Silakan coba lagi!",
            });
        }
    };

    const findOther = () => {
        navigate("/");
    };

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
            {/* Header */}
            <HeaderShadow>
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    className="pt-4"
                    aria-label="breadcrumb"
                    style={{
                        fontWeight: "700",
                        fontSize: "23px",
                        color: "black",
                    }}
                >
                    <Link underline="none" key="1" color="inherit">
                        Isi Data Diri
                    </Link>
                    <Link underline="none" key="2" color="inherit">
                        Bayar
                    </Link>
                    <Link
                        underline="none"
                        key="3"
                        color="inherit"
                        style={{
                            fontWeight: "700",
                            fontSize: "23px",
                            color: "black",
                        }}
                    >
                        Selesai
                    </Link>
                </Breadcrumbs>
            </HeaderShadow>

            {/* Main Content */}
            <Container id={"content"}>
                <Image
                    src={"/payment-success-illustration.svg"}
                    fluid={true}
                    id={"paymentSuccessIllustration"}
                    className={"mb-1 mt-5"}
                    style={{ width: 200 }}
                />
                <h4 id={"selamat"}>Selamat!</h4>
                <h4>Transaksi pembayaran tiket sukses!</h4>
                <Button
                    className={"paymentSuccessBtn mt-1"}
                    onClick={handlePrintTicket}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Kirim Jadwal Penerbangan"}
                </Button>

                <Button
                    className={"paymentSuccessBtn mt-3"}
                    onClick={() => findOther}
                >
                    Cari penerbangan lain
                </Button>
            </Container>
        </>
    );
};

export default PaymentSuccess;
