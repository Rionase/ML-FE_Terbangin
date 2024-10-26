import { Container, Row, Col, Card, Nav } from "react-bootstrap";
import { FaUserEdit, FaCog, FaSignOutAlt, FaArrowLeft } from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import profilePicture from "../../assets/undraw_male_avatar_g98d.svg";
import { logout } from "../../redux/actions/auth";

import ProfileForm from "../../components/Profile/ProfileForm";
import AccountSettingsForm from "../../components/Profile/AccountSettingsForm";
import BackButton from "../../components/BackButton";
import HeaderShadow from "../../components/HeaderShadow";
import "./profile.css";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentForm, setCurrentForm] = useState("profile");

  const handleUbahProfil = () => {
    setCurrentForm("profile");
  };

  const handlePengaturanAkun = () => {
    setCurrentForm("accountSettings");
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      <HeaderShadow>
        <h4 className="pt-4" style={{ fontWeight: 700 }}>
          Akun
        </h4>
        <div className="d-flex justify-content-between align-items-center mt-4">
          <BackButton ButtonText={"Beranda"} />
        </div>
      </HeaderShadow>

      <Container>
        <Row
          className="mt-1 mx-auto"
          style={{ maxWidth: "800px", paddingTop: "25px" }}
        >
          <Col md={4} className="mb-3">
            <Card
              style={{
                boxShadow: "1px 0 5px 2px rgba(0, 0, 0, 0.1)",
                borderRadius: "0.50rem",
                padding: "25px",
              }}
            >
              <img
                src={user?.picture ? user?.picture : profilePicture}
                alt="profile"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              />
            </Card>
            <Card
              style={{
                boxShadow: "1px 0 5px 2px rgba(0, 0, 0, 0.1)",
                borderRadius: "0.50rem",

                marginTop: "20px",
              }}
            >
              <Nav className="flex-column justify-content-end">
                <Nav.Link
                  className={`menu-profile d-flex align-items-center ${
                    currentForm === "profile" ? "active" : ""
                  }`}
                  onClick={handleUbahProfil}
                  style={{
                    borderBottomLeftRadius: "0px",
                    borderBottomRightRadius: "0px",
                  }}
                >
                  <FaUserEdit className="me-2 FaUserEdit" /> Ubah Profil
                </Nav.Link>
                <Nav.Link
                  className={`menu-profile d-flex align-items-center ${
                    currentForm === "accountSettings" ? "active" : ""
                  }`}
                  onClick={handlePengaturanAkun}
                  style={{ borderRadius: "0px" }}
                >
                  <FaCog className="me-2 FaCog" /> Pengaturan Akun
                </Nav.Link>
                <Nav.Link
                  onClick={handleLogout}
                  className="menu-profile-logout d-flex align-items-center"
                  style={{
                    borderTopLeftRadius: "0px",
                    borderTopRightRadius: "0px",
                  }}
                >
                  <FaSignOutAlt className="menu-profile-logout-icon me-2" />{" "}
                  Keluar
                </Nav.Link>
              </Nav>
            </Card>
          </Col>
          <Col md={8} className="mb-5">
            {currentForm === "profile" ? (
              <ProfileForm />
            ) : (
              <AccountSettingsForm />
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
