import React, { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Dropdown,
    ListGroup,
    Modal,
} from "react-bootstrap";
import { FaCircle, FaArrowLeft, FaFilter } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import notifLogo from "../../assets/bell.png";
import {
    getNotificationByUserId,
    readNotification,
} from "../../redux/actions/notification";
import BackButton from "../../components/BackButton";
import HeaderShadow from "../../components/HeaderShadow";

const NotificationPage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const notifications = useSelector(
        (state) => state.notification.notifications
    );

    const [filterStatus, setFilterStatus] = useState("all");
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (user) {
            dispatch(getNotificationByUserId(user.id));
        }
    }, [dispatch, user]);

    const handleFilterChange = (status) => {
        setFilterStatus(status);
    };

    const handleNotificationClick = (notif) => {
        setSelectedNotification(notif);
        setModalVisible(true);
        dispatch(readNotification(notif.id));
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedNotification(null);
    };

    const renderMessage = (message) => {
        const parts = message.split(/(UNPAID|\b[A-Z0-9]{9}\b)/g);

        return parts.map((part, index) => {
            if (part === "UNPAID") {
                return (
                    <span
                        key={index}
                        style={{ color: "gray", fontWeight: "bold" }}
                    >
                        {part}
                    </span>
                );
            } else if (/^[A-Z0-9]{9}$/.test(part)) {
                return (
                    <span
                        key={index}
                        style={{ color: "purple", fontWeight: "bold" }}
                    >
                        {part}
                    </span>
                );
            } else {
                return <span key={index}>{part}</span>;
            }
        });
    };

    const filteredNotifications = notifications
        .filter((notif) => {
            if (filterStatus === "false") {
                return !notif.statusRead;
            } else if (filterStatus === "true") {
                return notif.statusRead;
            }
            return true;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <>
            <HeaderShadow>
                <h4 className="pt-4" style={{ fontWeight: 700 }}>
                    Notifikasi
                </h4>
                <Row className="mt-4">
                    <Col xs={12} md={10} className="d-flex mt-1">
                        <BackButton ButtonText={"Beranda"} />
                    </Col>
                    <Col xs={12} md={2} className="d-flex mt-1">
                        <Dropdown className="flex-fill d-flex">
                            <Dropdown.Toggle
                                variant="outline-secondary"
                                className="px-4 "
                                style={{
                                    borderRadius: "40px",
                                    width: "100%",
                                }}
                            >
                                <FaFilter className="me-2" />
                                Filter
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item
                                    onClick={() => handleFilterChange("all")}
                                >
                                    Semua
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => handleFilterChange("false")}
                                >
                                    Belum Dibaca
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => handleFilterChange("true")}
                                >
                                    Sudah Dibaca
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
            </HeaderShadow>

            <Container className="mt-4">
                <Row>
                    <Col>
                        {notifications.length === 0 && (
                            <div className="text-center mt-5 ">
                                <img
                                    src="/Notify-amico.svg"
                                    alt="No notifications available"
                                    loading="lazy"
                                    width="300"
                                    height="300"
                                    style={{ maxWidth: "100%", height: "auto" }}
                                />
                            </div>
                        )}
                        <ListGroup style={{ cursor: "pointer" }}>
                            {filteredNotifications?.map((notif, index) => (
                                <ListGroup.Item
                                    key={index}
                                    className="d-flex flex-column flex-md-row justify-content-between align-items-start p-3"
                                    style={{
                                        backgroundColor:
                                            hoveredIndex === index
                                                ? "#f0f0f0"
                                                : "transparent",
                                        transition:
                                            "background-color 0.3s ease",
                                    }}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    onClick={() =>
                                        handleNotificationClick(notif)
                                    }
                                >
                                    <div className="me-md-2 pe-4 mb-2 mb-md-0 d-flex align-items-center">
                                        <img
                                            src={notifLogo}
                                            alt="Notification Bell"
                                            style={{
                                                width: "24px",
                                                height: "24px",
                                                marginRight: "20px",
                                            }}
                                        />
                                        <div>
                                            <div className="fw-bold">
                                                {notif.title}
                                            </div>
                                            <div className="fw-regular">
                                                {renderMessage(notif.message)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div className="text-md-end me-2">
                                            {new Date(
                                                notif.createdAt
                                            ).toLocaleString()}
                                        </div>
                                        {!notif.statusRead && (
                                            <FaCircle size={10} color="green" />
                                        )}
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>
                </Row>
                {selectedNotification && (
                    <Modal
                        show={modalVisible}
                        onHide={handleCloseModal}
                        centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>
                                {selectedNotification.title}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {renderMessage(selectedNotification.message)}
                        </Modal.Body>
                    </Modal>
                )}
            </Container>
        </>
    );
};

export default NotificationPage;
