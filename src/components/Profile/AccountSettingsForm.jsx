import React, { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { Button as ButtonMUI } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { generateOTPProfile } from "../../redux/actions/verify";
import { updatePassword } from "../../redux/actions/profile";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AccountSettingsForm = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhoneNumber, setIsEditingPhoneNumber] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email ?? "");
      setPhoneNumber(user.phoneNumber ?? "");
    }
  }, [user, isEditingEmail, isEditingPhoneNumber]);

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Password and Confirm Password are required");
      return;
    }
    if (password.length < 1) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Password not match with Confirm Password");
      return;
    }

    dispatch(updatePassword(navigate, password, setLoading));

    setPassword("");
    setConfirmPassword("");
  };

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email is required");
      return;
    }
    if (email === user?.email) {
      toast.error("Email is the same as before");
      return;
    }
    dispatch(generateOTPProfile(navigate, email, null, setLoading));
  };

  const handleChangePhoneNumber = async (e) => {
    e.preventDefault();
    if (!phoneNumber) {
      toast.error("Phone number is required");
      return;
    }
    if (phoneNumber === user?.phoneNumber) {
      toast.error("Phone number is the same as before");
      return;
    }

    dispatch(generateOTPProfile(navigate, null, phoneNumber, setLoading));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Password and Confirm Password are required");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password must match");
      return;
    }
    dispatch(
      updatePassword(
        navigate,
        email,
        phoneNumber,
        password,
        confirmPassword,
        setLoading
      )
    );
  };

  return (
    <Card
      id="account-settings-form"
      className="account-settings-form"
      style={{
        padding: "25px",
        boxShadow: "1px 0 5px 2px rgba(0, 0, 0, 0.1)",
        borderRadius: "0.50rem",
      }}
    >
      <h4 className="mb-4 text-center">Pengaturan Akun</h4>
      <Form onSubmit={handleSubmitPassword} className="mb-3">
        <h5 className="text-center">Ganti Password</h5>
        <Form.Group controlId="formPassword" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formConfirmPassword" className="mb-3">
          <Form.Label>Konfirmasi Password</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <Button
          className="profile-button-simpan mt-2 w-100"
          variant="primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Loading..." : "Ganti Password"}
        </Button>
      </Form>
      <hr />
      <Form onSubmit={handleSubmit}>
        <h5 className="text-center">Ganti Email</h5>
        <Form.Group controlId="formEmail" className="mb-3">
          <div className="d-flex justify-content-between mb-3">
            <Form.Label>Email</Form.Label>
            <ButtonMUI
              variant="link"
              onClick={() => setIsEditingEmail(!isEditingEmail)}
              style={{ color: "#7126B5" }}
            >
              {isEditingEmail ? "Batal" : "Ubah"}
            </ButtonMUI>
          </div>

          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!isEditingEmail}
          />
        </Form.Group>
        <Button
          onClick={handleChangeEmail}
          className="mt-2 w-100"
          disabled={loading || !isEditingEmail}
        >
          {loading ? "Loading..." : "Verifikasi Email"}
        </Button>
      </Form>
      <hr />
      <Form>
        <Form.Group controlId="formPhoneNumber" className="mb-3">
          <h5 className="text-center">Ganti Nomor Telepon</h5>
          <div className="d-flex justify-content-between mb-3">
            <Form.Label>Nomor Telepon</Form.Label>
            {/* <ButtonMUI
              variant="link"
              onClick={() => setIsEditingPhoneNumber(!isEditingPhoneNumber)}
              disabled
              style={{ color: "#7126B5" }}
            >
              {isEditingPhoneNumber ? "Batal" : "Ubah"}
            </ButtonMUI> */}
          </div>
          <Form.Control
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled
          />
        </Form.Group>
        <Button
          onClick={handleChangePhoneNumber}
          className="mt-2 w-100"
          disabled
        >
          {loading ? "Loading..." : "Verifikasi Nomor Telepon"}
        </Button>
      </Form>
    </Card>
  );
};

export default AccountSettingsForm;
