import React, { useState, useEffect } from "react";
import {
    Row,
    Col,
    Button,
    Container,
    Modal,
    Dropdown,
    Card,
} from "react-bootstrap";
import "./order.css";
import Swal from "sweetalert2";
import { FaFilter } from "react-icons/fa";
import HeaderShadow from "../../components/HeaderShadow";
import BackButton from "../../components/BackButton";
import DetailFlight from "../../components/FlightDetail";
import FlightDestination from "../../components/FlightDestination";
import Price from "../../components/PriceDetail/Price";

import {
    getHistoryCardDetails,
    getHistoryCards,
} from "../../redux/actions/history";
import { resetHistoryState } from "../../redux/reducers/history";
import { useDispatch, useSelector } from "react-redux";
import TotalPrice from "../../components/PriceDetail/TotalPrice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getFlightById } from "../../redux/actions/flight";
import FlightDestinationReturn from "../../components/FlightDestination/return";
import moment from "moment-timezone";
import { printTicket } from "../../redux/actions/booking";
import { useSocket } from "../../components/SocketContext";

const OrderHistory = () => {
    const [showModal, setShowModal] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [filterStatus, setFilterStatus] = useState("");
    const socket = useSocket();

    const dispatch = useDispatch();
    const { historycards, historycard } = useSelector((state) => state.history);

    const { user, token } = useSelector((state) => state.auth);

    const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
    };

    const groupByMonth = (data) => {
        return data.reduce((acc, item) => {
            const month = moment(item.Seat?.Flight?.departureAt).format(
                "MMMM YYYY"
            );
            if (!acc[month]) {
                acc[month] = [];
            }
            acc[month].push(item);
            return acc;
        }, {});
    };

    const handleFilterChange = (status) => {
        setFilterStatus(status);
    };

    const groupedHistorycards = groupByMonth(historycards);
    // this function is for toggle active status history list, for purple border purpose
    const handleDetailClick = async (booking) => {
        await dispatch(getHistoryCardDetails(booking));
        if (historycard[0]?.bookingId === booking) {
            // console.log("masuk a");
            setShowDetail(!showDetail);
        } else {
            setSelectedBooking(booking);
            setShowDetail(true);
            // console.log("masuk b");
            await dispatch(getHistoryCardDetails(booking));
        }

        // Scroll to the top of the page
        window.scrollTo({
            top: 0,
            behavior: "smooth", // This makes the scroll smooth
        });
        if (isMobile) {
            setShowModal(true);
        }
    };

    useEffect(() => {
        return () => {
            // Dispatch action to reset history state
            dispatch(resetHistoryState());
        };
    }, [dispatch]);

    useEffect(() => {
        if (!user) return;
        if (filterStatus == "") {
            dispatch(getHistoryCards());
        } else {
            dispatch(getHistoryCards(filterStatus));
            setShowDetail(false);
        }
    }, [dispatch, filterStatus, user]);

    useEffect(() => {
        if (!user || !socket.current) {
            return;
        }

        socket.current.on("paymentUpdate", (message) => {
            // console.log("Payment status updated");
            if (filterStatus == "") {
                dispatch(getHistoryCards());
                setShowDetail(false);
            } else {
                dispatch(getHistoryCards(filterStatus));
                setShowDetail(false);
            }
        });

        return () => {
            if (socket.current) {
                socket.current.off("paymentUpdate");
            }
        };
    }, [socket.current]);

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <>
            {/* Header */}
            <HeaderShadow>
                <h4 className="pt-4" style={{ fontWeight: 700 }}>
                    Riwayat Pemesanan
                </h4>
                <Row className="mt-4">
                    <Col xs={12} md={10} className="d-flex mt-1 ">
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
                                    onClick={() => handleFilterChange("")}
                                >
                                    Semua
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => handleFilterChange("ISSUED")}
                                >
                                    ISSUED
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => handleFilterChange("UNPAID")}
                                >
                                    UNPAID
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() =>
                                        handleFilterChange("CANCELLED")
                                    }
                                >
                                    CANCELLED
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
            </HeaderShadow>
            {/* Month for make section history per-month */}

            {/* Main Content */}
            {/* <Container>
            <Row className="mx-sm-4">
              <Col md={7}>
                <HistoryDestination
                  onDetailClick={handleDetailClick}
                  isActive={isActive}
                  setIsActive={setIsActive}
                  selectedBooking={selectedBooking}
                  historycards={historycards}
                />
              </Col> */}
            {/* If mobile breakpoint is false, the detail history will show on right side page */}
            {/* {showDetail && !isMobile && selectedBooking && (
                <Col md={5} className="px-4">
                  <HistoryDetail booking={historycard} />
                </Col>
              )}
            </Row>
          </Container> */}

            <Container>
                <Row>
                    {historycards.length === 0 && (
                        <div className="text-center mt-5 ">
                            <img
                                src="/Search-rafiki.svg"
                                alt="history not available"
                                loading="lazy"
                                width="300"
                                height="300"
                                style={{
                                    maxWidth: "100%",
                                    height: "auto",
                                }}
                            />
                        </div>
                    )}
                    <Col md={7}>
                        {Object.keys(groupedHistorycards).length === 0 && (
                            <Container className="my-3"></Container>
                        )}
                        {Object.keys(groupedHistorycards).map((month) => (
                            <React.Fragment key={month}>
                                <Container className="my-3">
                                    <Row>
                                        <h5>{month}</h5>
                                    </Row>
                                </Container>
                                <Col>
                                    <HistoryDestination
                                        onDetailClick={handleDetailClick}
                                        isActive={isActive}
                                        setIsActive={setIsActive}
                                        selectedBooking={selectedBooking}
                                        historycards={
                                            groupedHistorycards[month]
                                        } // Kirim data yang dikelompokkan berdasarkan bulan
                                    />
                                </Col>
                            </React.Fragment>
                        ))}
                    </Col>
                    {showDetail && !isMobile && selectedBooking && (
                        <Col md={5} className=" mt-5">
                            <HistoryDetail booking={historycard} />
                        </Col>
                    )}
                </Row>
            </Container>

            {/* If mobile breakpoint is true, the detail history will show by modal */}
            {isMobile && selectedBooking && (
                <HistoryDetailMobile
                    setShowModal={setShowModal}
                    showModal={showModal}
                    booking={historycard}
                />
            )}
        </>
    );
};

const HistoryDestination = ({
    onDetailClick,
    isActive,
    setIsActive,
    historycards,
}) => {
    const dispatch = useDispatch();
    const [returnFlights, setReturnFlights] = useState({});

    const formattedPrice = (price) => {
        return Number(price).toLocaleString("id-ID");
    };

    useEffect(() => {
        const loadReturnFlights = async () => {
            const flights = {};
            for (const booking of historycards) {
                if (booking?.Booking?.roundtripFlightId) {
                    const dataFlightReturn = await dispatch(
                        getFlightById(booking?.Booking?.roundtripFlightId)
                    );
                    flights[booking?.bookingId] = dataFlightReturn[0];
                }
            }
            setReturnFlights(flights);
        };

        loadReturnFlights();
    }, [dispatch, historycards]);

    return (
        <>
            {historycards.map((booking) => {
                const hasRoundtrip =
                    booking?.Booking?.roundtripFlightId !== null;

                return (
                    <Card
                        key={booking?.bookingId}
                        className="mb-3"
                        variant="custom"
                        onMouseDown={() =>
                            setIsActive((active) =>
                                active === booking?.bookingId
                                    ? null
                                    : booking?.bookingId
                            )
                        }
                        onClick={() => onDetailClick(booking?.bookingId)}
                        style={{
                            border:
                                isActive === booking?.bookingId
                                    ? "2px solid purple"
                                    : "",
                            boxShadow: "1px 0 5px 2px rgba(0, 0, 0, 0.1)",
                            borderRadius: "0.50rem",
                        }}
                    >
                        <Card.Body>
                            <Row>
                                {/* Section for render booking status */}
                                <Col
                                    md={12}
                                    className="d-flex justify-content-start"
                                >
                                    <StatusPayment
                                        bookingStatus={
                                            booking?.Booking?.Payment?.status
                                        }
                                    />
                                </Col>
                                <Col md={12}>
                                    {/* Section for render history destination or history list */}
                                    {booking && (
                                        <FlightDestination
                                            departureTime={moment
                                                .tz(
                                                    booking?.Seat?.Flight
                                                        ?.departureAt,
                                                    booking?.Seat?.Flight
                                                        ?.StartAirport?.timezone
                                                )
                                                .format("HH:mm")}
                                            departureDate={moment
                                                .tz(
                                                    booking?.Seat?.Flight
                                                        ?.departureAt,
                                                    booking?.Seat?.Flight
                                                        ?.StartAirport?.timezone
                                                )
                                                .format("DD MMMM yyyy")}
                                            departureCity={
                                                booking?.Seat?.Flight
                                                    ?.StartAirport?.city
                                            }
                                            flightDuration={
                                                booking?.Seat?.Flight?.duration
                                            }
                                            arrivalCity={
                                                booking?.Seat?.Flight
                                                    ?.EndAirport?.city
                                            }
                                            arrivalTime={moment
                                                .tz(
                                                    booking?.Seat?.Flight
                                                        ?.arrivalAt,
                                                    booking?.Seat?.Flight
                                                        ?.StartAirport?.timezone
                                                )
                                                .clone()
                                                .tz(
                                                    booking?.Seat?.Flight
                                                        ?.EndAirport?.timezone
                                                )
                                                .format("HH:mm")}
                                            arrivalDate={moment
                                                .tz(
                                                    booking?.Seat?.Flight
                                                        ?.arrivalAt,
                                                    booking?.Seat?.Flight
                                                        ?.StartAirport?.timezone
                                                )
                                                .clone()
                                                .tz(
                                                    booking?.Seat?.Flight
                                                        ?.EndAirport?.timezone
                                                )
                                                .format("DD MMMM yyyy")}
                                            additionals={
                                                booking?.Seat?.Flight?.Airline
                                                    ?.additionals
                                            }
                                        />
                                    )}
                                    {hasRoundtrip &&
                                        returnFlights[booking.bookingId] && (
                                            <>
                                                <hr className="solid" />
                                                <FlightDestinationReturn
                                                    departureTime={moment
                                                        .tz(
                                                            returnFlights[
                                                                booking
                                                                    .bookingId
                                                            ]?.departureAt,
                                                            returnFlights[
                                                                booking
                                                                    .bookingId
                                                            ]?.StartAirport
                                                                ?.timezone
                                                        )
                                                        .format("HH:mm")}
                                                    departureDate={moment
                                                        .tz(
                                                            returnFlights[
                                                                booking
                                                                    .bookingId
                                                            ]?.departureAt,
                                                            returnFlights[
                                                                booking
                                                                    .bookingId
                                                            ]?.StartAirport
                                                                ?.timezone
                                                        )
                                                        .format("DD MMMM yyyy")}
                                                    departureCity={
                                                        returnFlights[
                                                            booking.bookingId
                                                        ]?.StartAirport?.city
                                                    }
                                                    flightDuration={
                                                        returnFlights[
                                                            booking.bookingId
                                                        ]?.duration
                                                    }
                                                    arrivalCity={
                                                        returnFlights[
                                                            booking.bookingId
                                                        ]?.EndAirport?.city
                                                    }
                                                    arrivalTime={moment
                                                        .tz(
                                                            returnFlights[
                                                                booking
                                                                    .bookingId
                                                            ]?.arrivalAt,
                                                            returnFlights[
                                                                booking
                                                                    .bookingId
                                                            ]?.StartAirport
                                                                ?.timezone
                                                        )
                                                        .clone()
                                                        .tz(
                                                            returnFlights[
                                                                booking
                                                                    .bookingId
                                                            ]?.EndAirport
                                                                ?.timezone
                                                        )
                                                        .format("HH:mm")}
                                                    arrivalDate={moment
                                                        .tz(
                                                            returnFlights[
                                                                booking
                                                                    .bookingId
                                                            ]?.arrivalAt,
                                                            returnFlights[
                                                                booking
                                                                    .bookingId
                                                            ]?.StartAirport
                                                                ?.timezone
                                                        )
                                                        .clone()
                                                        .tz(
                                                            returnFlights[
                                                                booking
                                                                    .bookingId
                                                            ]?.EndAirport
                                                                ?.timezone
                                                        )
                                                        .format("DD MMMM yyyy")}
                                                    additionals={
                                                        returnFlights[
                                                            booking.bookingId
                                                        ]?.Airline?.additionals
                                                    }
                                                />
                                            </>
                                        )}
                                    <hr className="solid" />
                                </Col>
                                <Row style={{ textAlign: "left" }}>
                                    <Col md={4}>
                                        <p
                                            style={{
                                                margin: 0,
                                                fontWeight: "700",
                                            }}
                                        >
                                            Booking Code:
                                        </p>
                                        <p
                                            style={{
                                                color: "#7126b5",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {booking?.Booking?.bookingCode}
                                        </p>
                                    </Col>
                                    <Col md={4}>
                                        <p
                                            style={{
                                                margin: 0,
                                                fontWeight: "700",
                                            }}
                                        >
                                            Class:
                                        </p>
                                        {booking?.Seat?.airlineClass ===
                                        "FIRST_CLASS" ? (
                                            <p>FirstClass</p>
                                        ) : (
                                            booking?.Seat?.airlineClass
                                        )}
                                    </Col>
                                    <Col md={4} className="">
                                        <p
                                            style={{
                                                margin: 0,
                                                fontWeight: "700",
                                            }}
                                        >
                                            Total Payment:
                                        </p>
                                        <p>
                                            Rp{" "}
                                            {formattedPrice(
                                                booking?.Booking?.Payment
                                                    ?.totalPrice
                                            )}
                                        </p>
                                    </Col>
                                </Row>
                            </Row>
                        </Card.Body>
                    </Card>
                );
            })}
        </>
    );
};

const StatusPayment = ({ bookingStatus }) => {
    // Color block for payment status
    // green for payment confirmed
    // red for canceled
    // grey for unpaid / waiting payment
    return (
        <p
            style={{
                backgroundColor: (() => {
                    switch (bookingStatus) {
                        case "ISSUED":
                            return "green";
                        case "CANCELLED":
                            return "grey";
                        default:
                            return "red";
                    }
                })(),
                color: "white",
                borderRadius: 10,
                margin: 0,
                padding: "0.375rem 0.75rem",
                lineHeight: 1.5,
                textAlign: "center",
            }}
        >
            {bookingStatus}
        </p>
    );
};

// average fetching data here
const HistoryDetail = ({ booking }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [departureTotalPrice, setDepartureTotalPrice] = useState(0);
    const [returnTotalPrice, setReturnTotalPrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [adult, setAdult] = useState(0);
    const [child, setChild] = useState(0);
    const [baby, setBaby] = useState(0);
    const [seatType, setSeatType] = useState("");
    const [seatSelectedDeparture, setSeatSelectedDeparture] = useState([]);
    const [seatSelectedReturn, setSeatSelectedReturn] = useState([]);
    const [bookingIdResult, setBookingIdResult] = useState("");
    const [flightReturn, setFlightReturn] = useState(null);
    const [flightDeparture, setFlightDeparture] = useState(null);
    const [loading, setloading] = useState(false);

    const handleLanjutBayar = (e) => {
        e.preventDefault();

        navigate("/payment", {
            state: {
                seatSelectedDeparture: seatSelectedDeparture,
                seatSelectedReturn: seatSelectedReturn,
                bookingIdResult: bookingIdResult,
                adultCount: adult,
                childCount: child,
                babyCount: baby,
            },
        });
        // console.log("To Payment Page: ", {
        //     seatSelectedDeparture: seatSelectedDeparture,
        //     seatSelectedReturn: seatSelectedReturn,
        //     bookingIdResult: bookingIdResult,
        //     adultCount: adult,
        //     childCount: child,
        //     babyCount: baby,
        // });
        toast.info("Silahkan Bayar.");
    };
    useEffect(() => {
        setBookingIdResult(booking[0]?.Booking?.id);
        const seatMap = {};

        booking.forEach((item) => {
            const flightId = item.Seat?.flightId;
            if (!seatMap[flightId]) {
                seatMap[flightId] = [];
            }

            seatMap[flightId].push({
                seatId: item.Seat?.id,
            });
        });
        console.log("Seat Map: ", seatMap);

        if (!booking[0]?.Booking?.roundtripFlightId) {
            setSeatSelectedDeparture(seatMap[booking[0]?.Seat?.Flight?.id]);
            // console.log(
            //     "Seat Map Departure: ",
            //     seatMap[booking[0]?.Seat?.Flight?.id]
            // );
        } else {
            let departure;
            booking.forEach((item) => {
                if (item.Booking?.roundtripFlightId !== item.Seat?.flightId) {
                    departure = item.Seat?.flightId;
                }
            });
            setSeatSelectedDeparture(seatMap[departure]);
            // console.log(
            //     "Seat Map Departure: ",
            //     seatMap[booking[1]?.Seat?.Flight?.id]
            // );

            setSeatSelectedReturn(
                seatMap[booking[0].Booking?.roundtripFlightId]
            );
            // console.log(
            //     "Seat Map Return: ",
            //     seatMap[booking[0].Booking?.roundtripFlightId]
            // );
        }
    }, [booking]);

    useEffect(() => {
        if (booking[0]?.Seat?.airlineClass === "ECONOMY") {
            setSeatType("Economy");
        } else if (booking[0]?.Seat?.airlineClass === "BUSINESS") {
            setSeatType("Bussines");
        } else if (booking[0]?.Seat?.airlineClass === "FIRST_CLASS") {
            setSeatType("FirstClass");
        }

        const uniqueBookings = [];
        const passangersId = new Set();

        booking.forEach((item) => {
            if (!passangersId.has(item.Passanger?.id)) {
                passangersId.add(item.Passanger?.id);
                uniqueBookings.push(item);
            }
        });

        const adults = uniqueBookings.filter(
            (item) => item.Passanger?.type === "ADULT"
        ).length;
        setAdult(adults);

        const childs = uniqueBookings.filter(
            (item) => item.Passanger?.type === "CHILD"
        ).length;
        setChild(childs);

        const babies = uniqueBookings.filter(
            (item) => item.Passanger?.type === "BABY"
        ).length;
        setBaby(babies);

        const fetchFlight = async () => {
            if (booking[0]?.Booking?.roundtripFlightId) {
                const flightDepartureData = await dispatch(
                    getFlightById(booking[0]?.Seat?.flightId)
                );
                setFlightDeparture(flightDepartureData[0]);

                const flightReturnData = await dispatch(
                    getFlightById(booking[0]?.Booking?.roundtripFlightId)
                );
                setFlightReturn(flightReturnData[0]);
            } else if (booking[0]?.Seat?.flightId) {
                const flightDepartureData = await dispatch(
                    getFlightById(booking[0]?.Seat?.flightId)
                );
                setFlightDeparture(flightDepartureData[0]);
            }
        };

        fetchFlight();
    }, [booking, dispatch]);

    const handlePrintTicket = async () => {
        try {
            setloading(true);
            await dispatch(printTicket(booking[0]?.Booking?.id));
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

    return (
        <Card
            style={{
                boxShadow: "1px 0 5px 2px rgba(0, 0, 0, 0.1)",
                borderRadius: "0.50rem",
            }}
        >
            <Card.Body>
                {flightDeparture && (
                    <>
                        <DetailFlight
                            TitleDetail={"Jadwal Berangkat"}
                            BookingCode={`${booking[0]?.Booking?.bookingCode}`}
                            BookingStatus={
                                <StatusPayment
                                    bookingStatus={
                                        booking[0]?.Booking?.Payment?.status
                                    }
                                />
                            }
                            departureTime={moment
                                .tz(
                                    flightDeparture?.departureAt,
                                    flightDeparture?.StartAirport?.timezone
                                )
                                .format("HH:mm")}
                            departureDate={moment
                                .tz(
                                    flightDeparture?.departureAt,
                                    flightDeparture?.StartAirport?.timezone
                                )
                                .format("DD MMMM yyyy")}
                            departureAirport={
                                flightDeparture?.StartAirport?.name
                            }
                            departureTerminal={
                                flightDeparture?.StartAirport?.terminal
                            }
                            arrivalTime={moment
                                .tz(
                                    flightDeparture?.arrivalAt,
                                    flightDeparture?.EndAirport?.timezone
                                )
                                .clone()
                                .tz(flightDeparture?.EndAirport?.timezone)
                                .format("HH:mm")}
                            arrivalDate={moment
                                .tz(
                                    flightDeparture?.arrivalAt,
                                    flightDeparture?.EndAirport?.timezone
                                )
                                .clone()
                                .tz(flightDeparture?.EndAirport?.timezone)
                                .format("DD MMMM yyyy")}
                            arrivalAirport={flightDeparture?.EndAirport?.name}
                            arrivalTerminal={
                                flightDeparture?.EndAirport?.terminal
                            }
                            airlineName={flightDeparture?.Airline?.name}
                            airlineLogo={flightDeparture?.Airline?.picture}
                            seatClass={seatType}
                            flightCode={flightDeparture?.flightCode}
                            baggage={flightDeparture?.Airline?.baggage}
                            cabinBaggage={
                                flightDeparture?.Airline?.cabinBaggage
                            }
                            additionals={flightDeparture?.Airline?.additionals}
                            booking={booking}
                        />
                        <Price
                            adult={adult}
                            child={child}
                            baby={baby}
                            flightPrice={flightDeparture[`price${seatType}`]}
                            setTotalPrice={setDepartureTotalPrice}
                        />
                    </>
                )}
                {flightReturn && booking[0]?.Booking?.roundtripFlightId && (
                    <>
                        <br />
                        <hr
                            style={{
                                color: "black",
                                borderWidth: "5px",
                                borderStyle: "dashed",
                            }}
                        />
                        <DetailFlight
                            TitleDetail={"Jadwal Pulang"}
                            BookingCode={`${booking[0]?.Booking?.bookingCode}`}
                            BookingStatus={
                                <StatusPayment
                                    bookingStatus={
                                        booking[0]?.Booking?.Payment?.status
                                    }
                                />
                            }
                            departureTime={moment
                                .tz(
                                    flightReturn?.departureAt,
                                    flightReturn?.StartAirport?.timezone
                                )
                                .format("HH:mm")}
                            departureDate={moment
                                .tz(
                                    flightReturn?.departureAt,
                                    flightReturn?.StartAirport?.timezone
                                )
                                .format("DD MMMM yyyy")}
                            departureAirport={flightReturn?.StartAirport?.name}
                            departureTerminal={
                                flightReturn?.StartAirport?.terminal
                            }
                            arrivalTime={moment
                                .tz(
                                    flightReturn?.arrivalAt,
                                    flightReturn?.StartAirport?.timezone
                                )
                                .clone()
                                .tz(flightReturn?.EndAirport?.timezone)
                                .format("HH:mm")}
                            arrivalDate={moment
                                .tz(
                                    flightReturn?.arrivalAt,
                                    flightReturn?.StartAirport?.timezone
                                )
                                .clone()
                                .tz(flightReturn?.EndAirport?.timezone)
                                .format("DD MMMM yyyy")}
                            arrivalAirport={flightReturn?.EndAirport?.name}
                            arrivalTerminal={flightReturn?.EndAirport?.terminal}
                            airlineName={flightReturn?.Airline?.name}
                            airlineLogo={flightReturn?.Airline?.picture}
                            seatClass={seatType}
                            flightCode={flightReturn?.flightCode}
                            baggage={flightReturn?.Airline?.baggage}
                            cabinBaggage={flightReturn?.Airline?.cabinBaggage}
                            additionals={flightReturn?.Airline?.additionals}
                            booking={booking}
                        />
                        <Price
                            adult={adult}
                            child={child}
                            baby={baby}
                            flightPrice={flightReturn[`price${seatType}`]}
                            setTotalPrice={setReturnTotalPrice}
                        />

                        <TotalPrice
                            departureTotalPrice={departureTotalPrice}
                            returnTotalPrice={returnTotalPrice}
                            setTotalPrice={setTotalPrice}
                        />
                    </>
                )}

                {(booking[0]?.Booking?.Payment?.status === "UNPAID" && (
                    <Row className="pt-3 d-flex justify-content-between">
                        <Col xs={12} className="d-flex">
                            <Button
                                onClick={handleLanjutBayar}
                                className="flex-fill"
                                type="button"
                                variant="danger"
                                style={{
                                    borderRadius: 14,
                                    fontWeight: 700,
                                    height: 50,
                                }}
                            >
                                Lanjut Bayar
                            </Button>
                        </Col>
                    </Row>
                )) ||
                    (booking[0]?.Booking?.Payment?.status === "ISSUED" && (
                        <Row className="pt-3 d-flex justify-content-between">
                            <Col xs={12} className="d-flex">
                                <Button
                                    onClick={handlePrintTicket}
                                    className="flex-fill"
                                    type="button"
                                    variant="primary"
                                    style={{
                                        borderRadius: 14,
                                        fontWeight: 700,
                                        height: 50,
                                    }}
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Jadwal Penerbangan Sedang Dikirim.."
                                        : "Kirim Jadwal Penerbangan"}
                                </Button>
                            </Col>
                        </Row>
                    ))}
                {/* Refund Feature */}
                {/* )) ||
                (booking[0]?.Booking?.Payment?.status === "CANCELED" && (
                    <Row className="pt-3 d-flex justify-content-between">
                        <Col xs={12} className="d-flex">
                            <Button
                                className="flex-fill"
                                type="button"
                                variant="primary"
                            >
                                Refund
                            </Button>
                        </Col>
                    </Row>
                ))} */}
            </Card.Body>
        </Card>
    );
};

const HistoryDetailMobile = ({ showModal, setShowModal, booking }) => {
    return (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton className="my-1"></Modal.Header>

            <HistoryDetail booking={booking} />

            {/* <Container>
                <Row className="pb-3 d-flex justify-content-between">
                    <Col xs={6} className="d-flex">
                        <Button className="flex-fill" variant="primary">
                            Cetak Tiket
                        </Button>
                    </Col>
                    <Col xs={12} className="d-flex">
                        <Button
                            className="flex-fill"
                            variant="secondary"
                            onClick={() => setShowModal(false)}
                        >
                            Close
                        </Button>
                    </Col>
                </Row>
            </Container> */}
        </Modal>
    );
};

export default OrderHistory;
