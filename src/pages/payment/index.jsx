import { Breadcrumbs, Link } from "@mui/material";
import { Row, Col, Button, Container, Modal, Card } from "react-bootstrap";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import moment from "moment-timezone";

// hard data
import HeaderShadow from "../../components/HeaderShadow";
import DetailFlight from "../../components/FlightDetail";
import Price from "../../components/PriceDetail/Price";
import TotalPrice from "../../components/PriceDetail/TotalPrice";

import { useState, useEffect } from "react";
import "./index.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getBookingById } from "../../redux/actions/booking";
import { getSeatById } from "../../redux/actions/seat";
import { getFlightById } from "../../redux/actions/flight";

const Payment = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
                    <Link underline="hover" key="1" color="inherit" href="#">
                        Isi Data Diri
                    </Link>
                    ,
                    <Link
                        underline="hover"
                        key="2"
                        color="inherit"
                        href="/payment"
                    >
                        Bayar
                    </Link>
                    ,
                    <Link
                        underline="hover"
                        key="3"
                        color="inherit"
                        style={{ fontWeight: 300 }}
                    >
                        Selesai
                    </Link>
                    ,
                </Breadcrumbs>

                {/* Midtrans or Internal timer */}
                {/* <Row className="my-4 g-2">
                    <Col md={12} className="d-flex">
                        <Button
                            variant="danger"
                            className="flex-fill"
                            size="lg"
                        >
                            Selesaikan Pembayaran sampai 10 Maret 2023 12:00
                        </Button>
                    </Col>
                </Row> */}
            </HeaderShadow>

            {/* Main Content */}
            <Container className="mt-3 mb-5">
                <Row>
                    {/* Detail Booking */}

                    <Col
                        md={5}
                        xs={12}
                        // its just for aesthetically purpose
                        className={isMobile ? "pb-3 d-flex" : "order-1"}
                    >
                        {/* If mobile breakout is true, booking detail can be show by click the button, else show on the right side page */}
                        {isMobile ? <DetailBookingMobile /> : <BookingDetail />}
                    </Col>
                    <Col md={7} xs={12}>
                        <PaymentEmbedMidtrans />
                    </Col>
                    {/* Embed for Midtrans */}
                </Row>
            </Container>
        </>
    );
};

// average fetching data here
const BookingDetail = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const [snapToken, setSnapToken] = useState("");
    const [showPayment, setShowPayment] = useState(false);
    const [flightDeparture, setFlightDeparture] = useState(null);
    const [flightReturn, setFlightReturn] = useState(null);
    const [booking, setBooking] = useState(null);
    const [seatType, setSeatType] = useState("");
    const [departureTotalPrice, setDepartureTotalPrice] = useState(0);
    const [returnTotalPrice, setReturnTotalPrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [adult, setAdult] = useState(0);
    const [child, setChild] = useState(0);
    const [baby, setBaby] = useState(0);
    const [snapLoaded, setSnapLoaded] = useState(false);

    const {
        seatSelectedDeparture,
        seatSelectedReturn,
        bookingIdResult,
        adultCount,
        childCount,
        babyCount,
    } = location.state || {};

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (bookingIdResult) {
                    const bookingData = await dispatch(
                        getBookingById(bookingIdResult)
                    );
                    // console.log("Booking:", bookingData);
                    setBooking(bookingData[0]);
                    setSnapToken(bookingData[0]?.Payment?.snapToken);

                    setAdult(adultCount);
                    setChild(childCount);
                    setBaby(babyCount);

                    if (
                        seatSelectedDeparture &&
                        seatSelectedDeparture[0]?.seatId
                    ) {
                        const seatDeparture = await dispatch(
                            getSeatById(seatSelectedDeparture[0].seatId)
                        );
                        // console.log("Seat Departure:", seatDeparture);
                        if (seatDeparture.length > 0) {
                            const flightDepartureData = await dispatch(
                                getFlightById(seatDeparture[0].flightId)
                            );
                            // console.log(
                            //     "Flight Departure:",
                            //     flightDepartureData
                            // );

                            if (seatDeparture[0]?.airlineClass === "ECONOMY") {
                                setSeatType("Economy");
                            } else if (
                                seatDeparture[0]?.airlineClass === "BUSINESS"
                            ) {
                                setSeatType("Bussines");
                            } else if (
                                seatDeparture[0]?.airlineClass === "FIRST_CLASS"
                            ) {
                                setSeatType("FirstClass");
                            }

                            setFlightDeparture(flightDepartureData[0]);
                        } else {
                            console.error("Seat Departure data is empty");
                        }
                    }

                    if (seatSelectedReturn && seatSelectedReturn[0]?.seatId) {
                        const seatReturn = await dispatch(
                            getSeatById(seatSelectedReturn[0].seatId)
                        );
                        // console.log("Seat Return:", seatReturn);
                        if (seatReturn.length > 0) {
                            const flightReturnData = await dispatch(
                                getFlightById(seatReturn[0].flightId)
                            );
                            // console.log("Flight Return:", flightReturnData);

                            if (
                                flightReturnData[0]?.airlineClass === "ECONOMY"
                            ) {
                                setSeatType("Economy");
                            } else if (
                                flightReturnData[0]?.airlineClass === "BUSINESS"
                            ) {
                                setSeatType("Bussines");
                            } else if (
                                flightReturnData[0]?.airlineClass ===
                                "FIRST_CLASS"
                            ) {
                                setSeatType("FirstClass");
                            }

                            setFlightReturn(flightReturnData[0]);
                        } else {
                            console.error("Seat Return data is empty");
                        }
                    }
                } else {
                    console.error("bookingIdResult is undefined");
                }
            } catch (error) {
                console.error("Error in fetchData:", error);
            }
        };

        fetchData();
    }, [dispatch, bookingIdResult, seatSelectedDeparture, seatSelectedReturn]);

    // integration with midtrans snap
    useEffect(() => {
        const midtransScriptUrl = import.meta.env
            .VITE_MIDTRANS_SANDBOX_SNAP_URL;
        const scriptTag = document.createElement("script");
        scriptTag.src = midtransScriptUrl;

        const myMidtransClientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
        scriptTag.setAttribute("data-client-key", myMidtransClientKey);

        scriptTag.onload = () => setSnapLoaded(true);
        document.body.appendChild(scriptTag);

        return () => {
            document.body.removeChild(scriptTag);
        };
    }, []);

    useEffect(() => {
        if (!snapLoaded || !snapToken) return;

        try {
            window.snap.embed(snapToken, {
                embedId: "snapContainer",
                onSuccess: (result) => {
                    console.log("success");
                    console.log(result);
                    navigate("/payment-success", {
                        state: {
                            snapToken,
                            bookingId: bookingIdResult,
                        },
                    });
                },
                onPending: (result) => {
                    console.log("pending");
                    console.log(result);
                },
                onError: (result) => {
                    console.log("error");
                    console.log(result);
                },
                onClose: () => {
                    console.log("closed");
                },
            });
        } catch (error) {
            console.error("Error during snap embed:", error);
        }
    }, [snapLoaded, snapToken, navigate]);

    return (
        <>
            {/* Flight Information */}
            <Card
                style={{
                    boxShadow: "1px 0 5px 2px rgba(0, 0, 0, 0.1)",
                    borderRadius: "0.50rem",
                }}
            >
                <Card.Body>
                    <Row className="d-flex justify-content-between">
                        <Col>
                            <h4>Detail Penerbangan</h4>
                            {flightDeparture && seatSelectedDeparture && (
                                <>
                                    <DetailFlight
                                        TitleDetail={"Jadwal Berangkat"}
                                        BookingCode={`${booking?.bookingCode}`}
                                        // BookingStatus
                                        departureTime={moment
                                            .tz(
                                                flightDeparture?.departureAt,
                                                flightDeparture?.StartAirport
                                                    ?.timezone
                                            )
                                            .format("HH:mm")}
                                        departureDate={moment
                                            .tz(
                                                flightDeparture?.departureAt,
                                                flightDeparture?.StartAirport
                                                    ?.timezone
                                            )
                                            .format("DD MMMM yyyy")}
                                        departureAirport={
                                            flightDeparture?.StartAirport?.name
                                        }
                                        departureTerminal={
                                            flightDeparture?.StartAirport
                                                ?.terminal
                                        }
                                        arrivalTime={moment
                                            .tz(
                                                flightDeparture?.arrivalAt,
                                                flightDeparture?.EndAirport
                                                    ?.timezone
                                            )
                                            .clone()
                                            .tz(
                                                flightDeparture?.EndAirport
                                                    ?.timezone
                                            )
                                            .format("HH:mm")}
                                        arrivalDate={moment
                                            .tz(
                                                flightDeparture?.arrivalAt,
                                                flightDeparture?.EndAirport
                                                    ?.timezone
                                            )
                                            .clone()
                                            .tz(
                                                flightDeparture?.EndAirport
                                                    ?.timezone
                                            )
                                            .format("DD MMMM yyyy")}
                                        arrivalAirport={
                                            flightDeparture?.EndAirport?.name
                                        }
                                        arrivalTerminal={
                                            flightDeparture?.EndAirport
                                                ?.terminal
                                        }
                                        airlineName={
                                            flightDeparture?.Airline?.name
                                        }
                                        airlineLogo={
                                            flightDeparture?.Airline?.picture
                                        }
                                        seatClass={seatType}
                                        flightCode={flightDeparture?.flightCode}
                                        baggage={
                                            flightDeparture?.Airline?.baggage
                                        }
                                        cabinBaggage={
                                            flightDeparture?.Airline
                                                ?.cabinBaggage
                                        }
                                        additionals={
                                            flightDeparture?.Airline
                                                ?.additionals
                                        }
                                        // booking
                                    />
                                    <Price
                                        adult={adult}
                                        child={child}
                                        baby={baby}
                                        flightPrice={
                                            flightDeparture[`price${seatType}`]
                                        }
                                        setTotalPrice={setDepartureTotalPrice}
                                    />
                                </>
                            )}

                            {flightReturn &&
                                booking.roundtripFlightId &&
                                seatSelectedReturn && (
                                    <>
                                        <hr />
                                        <DetailFlight
                                            TitleDetail={"Jadwal Pulang"}
                                            BookingCode={`${booking?.bookingCode}`}
                                            // BookingStatus
                                            departureTime={moment
                                                .tz(
                                                    flightReturn?.departureAt,
                                                    flightReturn?.StartAirport
                                                        ?.timezone
                                                )
                                                .format("HH:mm")}
                                            departureDate={moment
                                                .tz(
                                                    flightReturn?.departureAt,
                                                    flightReturn?.StartAirport
                                                        ?.timezone
                                                )
                                                .format("DD MMMM yyyy")}
                                            departureAirport={
                                                flightReturn?.StartAirport?.name
                                            }
                                            departureTerminal={
                                                flightReturn?.StartAirport
                                                    ?.terminal
                                            }
                                            arrivalTime={moment
                                                .tz(
                                                    flightReturn?.arrivalAt,
                                                    flightReturn?.EndAirport
                                                        ?.timezone
                                                )
                                                .clone()
                                                .tz(
                                                    flightReturn?.EndAirport
                                                        ?.timezone
                                                )
                                                .format("HH:mm")}
                                            arrivalDate={moment
                                                .tz(
                                                    flightReturn?.arrivalAt,
                                                    flightReturn?.EndAirport
                                                        ?.timezone
                                                )
                                                .clone()
                                                .tz(
                                                    flightReturn?.EndAirport
                                                        ?.timezone
                                                )
                                                .format("DD MMMM yyyy")}
                                            arrivalAirport={
                                                flightReturn?.EndAirport?.name
                                            }
                                            arrivalTerminal={
                                                flightReturn?.EndAirport
                                                    ?.terminal
                                            }
                                            airlineName={
                                                flightReturn?.Airline?.name
                                            }
                                            airlineLogo={
                                                flightReturn?.Airline?.picture
                                            }
                                            seatClass={seatType}
                                            flightCode={
                                                flightReturn?.flightCode
                                            }
                                            baggage={
                                                flightReturn?.Airline?.baggage
                                            }
                                            cabinBaggage={
                                                flightReturn?.Airline
                                                    ?.cabinBaggage
                                            }
                                            additionals={
                                                flightReturn?.Airline
                                                    ?.additionals
                                            }
                                            // booking
                                        />
                                        <Price
                                            adult={adult}
                                            child={child}
                                            baby={baby}
                                            flightPrice={
                                                flightReturn[`price${seatType}`]
                                            }
                                            setTotalPrice={setReturnTotalPrice}
                                        />
                                        <TotalPrice
                                            departureTotalPrice={
                                                departureTotalPrice
                                            }
                                            returnTotalPrice={returnTotalPrice}
                                            setTotalPrice={setTotalPrice}
                                        />
                                    </>
                                )}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </>
    );
};

const DetailBookingMobile = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button
                className="flex-fill"
                variant="primary"
                onClick={handleShow}
            >
                Detail Flight
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton className="mb-1"></Modal.Header>
                <BookingDetail />

                <Modal.Footer className="mt-1">
                    <Button
                        className="flex-fill"
                        variant="secondary"
                        onClick={() => handleClose(false)}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

const PaymentEmbedMidtrans = () => {
    return (
        <>
            <div id={"snapContainer"} className={""}></div>
        </>
    );
};

export default Payment;
