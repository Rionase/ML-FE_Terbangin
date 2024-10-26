import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { generateOTP } from "../../redux/actions/verify";
import { toast } from "react-toastify";
import logo2 from "../../assets/Vector.png";
import GoogleLoginComponent from "../GoogleLogin/GoogleLogin";
import {
    getUserByEmail,
    getUserByPhoneNumber,
} from "../../redux/actions/profile";

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [photo, setPhoto] = useState();
    const [loading, setLoading] = useState(false);

    const [showEmailLogo, setShowEmailLogo] = useState(false);
    const [showPhoneLogo, setShowPhoneLogo] = useState(false);
    const [showPasswordLogo, setShowPasswordLogo] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name) {
            toast.error("Nama tidak boleh kosong");
            return;
        }
        if (!email) {
            toast.error("Email tidak boleh kosong");
            return;
        }
        if (!phone) {
            toast.error("Nomor telepon tidak boleh kosong");
            return;
        }
        if (!password) {
            toast.error("Password tidak boleh kosong");
            return;
        }

        try {
            const [emailData, phoneData] = await Promise.all([
                dispatch(getUserByEmail(email)),
                dispatch(getUserByPhoneNumber(phone)),
            ]);

            let isEmailAvailable = true;
            let isPhoneAvailable = true;

            if (emailData) {
                isEmailAvailable = false;
                toast.error("Email sudah terdaftar");
            }

            if (phoneData) {
                isPhoneAvailable = false;
                toast.error("Nomor telepon sudah terdaftar");
            }

            if (!isEmailAvailable || !isPhoneAvailable) {
                return;
            }

            dispatch(
                generateOTP(
                    navigate,
                    name,
                    email,
                    phone,
                    password,
                    photo,
                    setLoading
                )
            );
        } catch (error) {
            toast.error("Terjadi kesalahan: " + error.message);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicNama">
                <Form.Label>Fullname</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Nama Lengkap"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <div style={{ position: "relative" }}>
                    <Form.Control
                        type="email"
                        placeholder="Contoh: john@gmail.com"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (e.target.value) setShowEmailLogo(true);
                            else setShowEmailLogo(false);
                        }}
                    />
                    {showEmailLogo && (
                        <img
                            src={logo2}
                            alt="logo"
                            style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                width: "20px",
                                height: "20px",
                            }}
                        />
                    )}
                </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicTelepon">
                <Form.Label>Nomor Telepon</Form.Label>
                <div style={{ position: "relative" }}>
                    <Form.Control
                        type="tel"
                        placeholder="+62"
                        value={phone}
                        onChange={(e) => {
                            setPhone(e.target.value);
                            if (e.target.value) setShowPhoneLogo(true);
                            else setShowPhoneLogo(false);
                        }}
                    />
                    {showPhoneLogo && (
                        <img
                            src={logo2}
                            alt="logo"
                            style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                width: "20px",
                                height: "20px",
                            }}
                        />
                    )}
                </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Buat Password</Form.Label>
                <div style={{ position: "relative" }}>
                    <Form.Control
                        type="password"
                        placeholder="Buat Password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (e.target.value) setShowPasswordLogo(true);
                            else setShowPasswordLogo(false);
                        }}
                    />
                    {showPasswordLogo && (
                        <img
                            src={logo2}
                            alt="logo"
                            style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                width: "20px",
                                height: "20px",
                            }}
                        />
                    )}
                </div>
            </Form.Group>

            <Form.Group controlId="picture" className="mb-3">
                <Form.Label>Picture</Form.Label>
                <Form.Control
                    type="file"
                    onChange={(e) => setPhoto(e.target.files[0])}
                />
            </Form.Group>

            <Button
                variant="primary"
                type="submit"
                className="w-100 mb-3"
                style={{ borderRadius: "12px", backgroundColor: "#7126B5" }}
                disabled={loading}
            >
                {loading ? "Loading..." : "Daftar"}
            </Button>
            <p className="text-center text-black">Or</p>
            <GoogleLoginComponent text={"Register with google"} />

            <div className="text-center mb-3 mt-2">
                Sudah punya akun?{" "}
                <Link to="/login" style={{ color: "#7126B5" }}>
                    Masuk disini
                </Link>
            </div>
        </Form>
    );
}

export default Register;
