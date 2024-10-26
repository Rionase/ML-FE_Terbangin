import { Button, Form, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { updateForgetPasswordUser } from "../../redux/actions/verify";

function Forget() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordKonfirmasi, setNewPasswordKonfirmasi] = useState("");
  const [loading, setLoading] = useState(false);
  const { id, token } = location.state || {};

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== newPasswordKonfirmasi) {
      toast.error("Password tidak sama");
      return;
    }

    dispatch(
      updateForgetPasswordUser(navigate, token, newPassword, id, setLoading)
    );
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Masukkan Password Baru</Form.Label>
        <InputGroup>
          <Form.Control
            type={showPassword ? "text" : "password"}
            placeholder="***"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
          />
          <InputGroup.Text
            onClick={togglePasswordVisibility}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </InputGroup.Text>
        </InputGroup>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Ulangi Password Baru</Form.Label>
        <InputGroup>
          <Form.Control
            type={showConfirmPassword ? "text" : "password"}
            placeholder="***"
            value={newPasswordKonfirmasi}
            onChange={(e) => {
              setNewPasswordKonfirmasi(e.target.value);
            }}
          />
          <InputGroup.Text
            onClick={toggleConfirmPasswordVisibility}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
          </InputGroup.Text>
        </InputGroup>
      </Form.Group>

      <Button
        variant="primary"
        type="submit"
        className="w-100 mb-3"
        style={{ borderRadius: "12px", backgroundColor: "#7126B5" }}
        disabled={loading}
      >
        {loading ? "Loading..." : "Simpan"}
      </Button>
    </Form>
  );
}

export default Forget;
