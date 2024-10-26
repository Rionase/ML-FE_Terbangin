import { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { Button as ButtonMUI } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../../redux/actions/profile";
import { toast } from "react-toastify";

const ProfileForm = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [picture, setPicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName ?? "");
    }
  }, [user, isEditing]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fullName) {
      toast.error("Name is required");
      return;
    }

    if (user?.fullName === fullName && !picture) {
      toast.error("Name is the same as before");
      return;
    }

    dispatch(
      updateProfile(navigate, fullName, picture, setLoading, setIsEditing)
    );
  };

  return (
    <Card
      id="profile-form"
      className="profile-form"
      style={{
        padding: "25px",
        boxShadow: "1px 0 5px 2px rgba(0, 0, 0, 0.1)",
        borderRadius: "0.50rem",
      }}
    >
      <Form onSubmit={handleSubmit}>
        <h4 className="mb-0 text-center">Profil</h4>
        <div className="d-flex justify-content-end mb-3">
          <ButtonMUI
            variant="link"
            onClick={() => setIsEditing(!isEditing)}
            style={{ color: "#7126B5" }}
          >
            {isEditing ? "Batal" : "Ubah"}
          </ButtonMUI>
        </div>

        <Form.Group controlId="formNamaLengkap" className="mb-3">
          <Form.Label>Nama Lengkap</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nama Lengkap"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={!isEditing}
          />
        </Form.Group>
        <Form.Group controlId="picture" className="mb-3">
          <Form.Label>Foto Profil</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setPicture(e.target.files[0])}
            disabled={!isEditing}
          />
        </Form.Group>
        <Button
          className="profile-button-simpan mt-3 w-100"
          variant="primary"
          type="submit"
          disabled={!isEditing || loading}
        >
          {loading ? "Loading..." : "Simpan"}
        </Button>
      </Form>
    </Card>
  );
};

export default ProfileForm;
