import { Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { generateLink } from "../../redux/actions/verify";

function EmailForgeted() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRequestLink = (e) => {
        e.preventDefault();

        dispatch(generateLink(email, setLoading));
    };

    return (
        <Form onSubmit={handleRequestLink}>
            <Form.Group className="mb-5" controlId="formBasicEmail">
                <Form.Label>Masukkan Email</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Contoh: john@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Form.Group>

            <Button
                variant="primary"
                type="submit"
                className="w-100 mb-3"
                style={{ borderRadius: "12px", backgroundColor: "#7126B5" }}
                disabled={loading}
            >
                {loading ? "Loading..." : "Kirim Email"}
            </Button>
        </Form>
    );
}

export default EmailForgeted;
