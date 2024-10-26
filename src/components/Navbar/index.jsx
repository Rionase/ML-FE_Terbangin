import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Image, Container, Navbar } from "react-bootstrap";
import logo from "../../assets/Logo/svg/logo-no-background.svg";
import AccountCircle from "@mui/icons-material/AccountCircle";
import login from "../../assets/fi_log-in.png";
import { useEffect, useState } from "react";
import { getProfile, logout } from "../../redux/actions/auth";
import { Menu, MenuItem, IconButton, Avatar, Badge } from "@mui/material";
import { styled } from "@mui/material/styles";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import "./navbar.css";
import { getNotificationByUserId } from "../../redux/actions/notification";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSocket } from "../SocketContext";

const StyledMenuItemLogout = styled(MenuItem)(({ theme }) => ({
    "&:hover": {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.error.contrastText,
    },
    "&:active": {
        backgroundColor: theme.palette.error.dark,
        color: theme.palette.error.contrastText,
    },
}));

function NavScrollExample() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, token } = useSelector((state) => state.auth);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationCount, setNotificationCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const socket = useSocket();
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
        handleClose();
    };

    const fetchNotifications = async () => {
        if (!user) {
            return;
        }
        const data = await dispatch(getNotificationByUserId(user?.id));
        setNotifications(data);

        let count = 0;
        data?.forEach((notification) => {
            if (!notification.statusRead) {
                count++;
            }
        });
        setNotificationCount(count);
    };

    useEffect(() => {
        dispatch(getProfile());
    }, [dispatch, token]);

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user]);

    useEffect(() => {
        if (!user || !socket.current) {
            return;
        }

        socket.current.on("notificationUpdate", (message) => {
            fetchNotifications();
        });

        return () => {
            if (socket.current) {
                socket.current.off("notificationUpdate");
            }
        };
    }, [socket.current]);

    return (
        <>
            <Navbar
                sticky="top"
                expand="lg"
                className="bg-body-tertiary border-bottom"
                style={{
                    boxShadow: "1px 0 10px 2px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <Image src={logo} height={35} alt="Logo" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        {/* <Form className="d-flex mt-2">
                        <Form.Control
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                            style={{ borderRadius: "10px 0px 0px 10px" }}
                        />
                        <button
                            style={{
                                border: "1px solid #DEE2E6",
                                borderRadius: "0px 10px 10px 0px",
                            }}
                        >
                            <SearchIcon />
                        </button>
                    </Form> */}
                        {!user && (
                            <Button
                                className="d-flex ms-auto mt-2"
                                style={{
                                    backgroundColor: "#7126b5",
                                    borderColor: "#7126b5",
                                }}
                                as={Link}
                                to="/login"
                            >
                                <span
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <img
                                        src={login}
                                        className="me-2"
                                        alt="Login Icon"
                                    />
                                    Masuk
                                </span>
                            </Button>
                        )}
                        {user && (
                            <>
                                <div className="d-flex ms-auto">
                                    <IconButton
                                        color="inherit"
                                        onClick={() => {
                                            navigate("/order-history");
                                            handleClose();
                                        }}
                                    >
                                        <FormatListBulletedIcon />
                                    </IconButton>
                                    <IconButton
                                        color="inherit"
                                        onClick={() => {
                                            navigate("/notification");
                                            handleClose();
                                        }}
                                    >
                                        <Badge
                                            badgeContent={notificationCount}
                                            color="error"
                                        >
                                            <NotificationsNoneIcon />
                                        </Badge>
                                    </IconButton>
                                    <IconButton
                                        color="inherit"
                                        onClick={handleMenu}
                                    >
                                        {user.picture ? (
                                            <Avatar
                                                src={user.picture}
                                                alt="User Profile"
                                                sx={{
                                                    width: 30,
                                                    height: 30,
                                                }}
                                            />
                                        ) : (
                                            <AccountCircle />
                                        )}
                                    </IconButton>
                                </div>

                                <Menu
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        "aria-labelledby": "basic-button",
                                    }}
                                >
                                    <MenuItem
                                        onClick={() => {
                                            navigate("/profile");
                                            handleClose();
                                        }}
                                    >
                                        Profil
                                    </MenuItem>
                                    <StyledMenuItemLogout
                                        onClick={handleLogout}
                                    >
                                        Keluar
                                    </StyledMenuItemLogout>
                                </Menu>
                            </>
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <ToastContainer
                enableMultiContainer
                containerId={"navbarToast"}
                position="top-right"
                autoClose={5000}
                transition={Zoom}
                className="custom-toast-container"
            />
        </>
    );
}

export default NavScrollExample;
