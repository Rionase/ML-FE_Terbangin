import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Row, Col, Container, Card, Button } from "react-bootstrap";
import { Breadcrumbs, Link } from "@mui/material";
import { toast } from "react-toastify";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useLocation, useNavigate } from "react-router-dom";
import { getFlightById } from "../../redux/actions/flight";
import { getSeatByFlightId, getSeatById } from "../../redux/actions/seat";
import moment from "moment-timezone";
import { useSocket } from "../../components/SocketContext";

import DetailFlight from "../../components/FlightDetail";
import HeaderShadow from "../../components/HeaderShadow";
import PassangerForm from "../../components/Passanger/PassangerForm";
import TotalPrice from "../../components/PriceDetail/TotalPrice";
import Price from "../../components/PriceDetail/Price";
import SeatSelectionComponent from "../../components/Passanger/Seat";

import { createPassanger } from "../../redux/actions/passanger";
import { generateSnapPayment } from "../../redux/actions/payment";
import { createBooking } from "../../redux/actions/booking";
import { createHelperBooking } from "../../redux/actions/helperBooking";
import Swal from "sweetalert2";

const BookingForm = () => {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        flightIdDeparture,
        flightIdReturn,
        capacity,
        adult,
        child,
        baby,
        seatType,
    } = location.state || {};
    const [capacityUser, setCapacityUser] = useState(0);
    const [userFullName, setUserFullName] = useState("");
    const [userPhoneNumber, setUserPhoneNumber] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [showFlightDetails, setShowFlightDetails] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [seatsConfirmed, setSeatsConfirmed] = useState(false);

    const [flightDeparture, setFlightDeparture] = useState({});
    const [flightReturn, setFlightReturn] = useState({});
    const [seatDeparture, setSeatDeparture] = useState([]);
    const [seatDepartureAvailable, setSeatDepartureAvailable] = useState([]);
    const [seatSelectedDeparture, setSeatSelectedDeparture] = useState([]);
    const [seatReturn, setSeatReturn] = useState([]);
    const [seatReturnAvailable, setSeatReturnAvailable] = useState([]);
    const [seatSelectedReturn, setSeatSelectedReturn] = useState([]);
    const [airlineClass, setAirlineClass] = useState("");
    const [saveDisabled, setSaveDisabled] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [departureTotalPrice, setDepartureTotalPrice] = useState(0);
    const [returnTotalPrice, setReturnTotalPrice] = useState(0);
    const [bookingIdResult, setBookingIdResult] = useState("");
    const [isBookingSuccess, setIsBookingSuccess] = useState(false);
    const socket = useSocket();

    const initialPassangerState = {
        title: "",
        fullName: "",
        familyName: "",
        dateOfBirth: "",
        nationality: "",
        idNumber: "",
        issuingCountry: "",
        expiryDate: "",
        showFamilyDataPassanger: false,
    };
    const [passangerData, setPassangerData] = useState({
        adult: Array.from({ length: adult }, () => ({
            ...initialPassangerState,
        })),
        child: Array.from({ length: child }, () => ({
            ...initialPassangerState,
        })),
        baby: Array.from({ length: baby }, () => ({
            ...initialPassangerState,
        })),
    });
    const [errors, setErrors] = useState({});
    const [errorStatus, setErrorStatus] = useState(false);

    const validateForm = () => {
        let formErrors = {};
        const combinedPassangers = [
            ...passangerData.adult.map((passanger, index) => ({
                ...passanger,
                type: "adult",
                index,
            })),
            ...passangerData.child.map((passanger, index) => ({
                ...passanger,
                type: "child",
                index,
            })),
        ];

        combinedPassangers.forEach((passanger) => {
            if (!passanger.title)
                formErrors[`${passanger.type}-${passanger.index}-title`] =
                    "Title is required";
            if (!passanger.fullName)
                formErrors[`${passanger.type}-${passanger.index}-fullName`] =
                    "Full name is required";
            if (passanger.showFamilyDataPassanger && !passanger.familyName)
                formErrors[`${passanger.type}-${passanger.index}-familyName`] =
                    "Family name is required";
            if (!passanger.dateOfBirth)
                formErrors[`${passanger.type}-${passanger.index}-dateOfBirth`] =
                    "Date of birth is required";
            if (!passanger.nationality)
                formErrors[`${passanger.type}-${passanger.index}-nationality`] =
                    "Nationality is required";
            if (!passanger.idNumber)
                formErrors[`${passanger.type}-${passanger.index}-idNumber`] =
                    "ID number is required";
            if (!passanger.issuingCountry)
                formErrors[
                    `${passanger.type}-${passanger.index}-issuingCountry`
                ] = "Issuing country is required";
        });
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleInputChange = (type, index, field, value) => {
        const updatedPassangers = passangerData[type].map((passanger, i) =>
            i === index ? { ...passanger, [field]: value } : passanger
        );
        setPassangerData({ ...passangerData, [type]: updatedPassangers });
    };

    const handleSwitchChanges = (type, index) => {
        setPassangerData((prevData) => ({
            ...prevData,
            [type]: prevData[type].map((passanger, idx) =>
                idx === index
                    ? {
                          ...passanger,
                          showFamilyDataPassanger:
                              !passanger.showFamilyDataPassanger,
                      }
                    : passanger
            ),
        }));
    };

    useEffect(() => {
        if (user) {
            setUserFullName(user?.fullName || "");
            setUserPhoneNumber(user?.phoneNumber || "");
            setUserEmail(user?.email || "");
        }
    }, [user]);

    useEffect(() => {
        if (errorStatus) {
            validateForm();
        }
    }, [passangerData]);

    useEffect(() => {
        dispatch(getFlightById(flightIdDeparture)).then((data) => {
            setFlightDeparture(data[0]);
        });
        if (flightIdReturn) {
            dispatch(getFlightById(flightIdReturn)).then((data) => {
                setFlightReturn(data[0]);
            });
        }
        setCapacityUser(capacity - baby);
    }, [dispatch, flightIdDeparture]);

    const fetchData = async () => {
        if (flightDeparture?.id || flightReturn?.id) {
            let selectedAirlineClass = "";

            if (seatType === "Economy") {
                selectedAirlineClass = "ECONOMY";
            } else if (seatType === "Bussines") {
                selectedAirlineClass = "BUSINESS";
            } else if (seatType === "FirstClass") {
                selectedAirlineClass = "FIRST_CLASS";
            }

            setAirlineClass(selectedAirlineClass);

            try {
                // console.log(
                //     "Data Penerbangan Berangkat: ",
                //     flightDeparture
                // );
                const dataDeparture = await dispatch(
                    getSeatByFlightId(flightDeparture?.id)
                );
                const filteredDataDeparture = dataDeparture?.filter(
                    (seat) => seat.airlineClass === selectedAirlineClass
                );
                const availableSeatsDeparture = filteredDataDeparture?.filter(
                    (seat) => seat.isAvailable === true
                );
                setSeatDeparture(filteredDataDeparture);
                setSeatDepartureAvailable(availableSeatsDeparture);

                // console.log("Data Kursi Berangkat: ", filteredDataDeparture);
                // console.log(
                //     "Data Kursi Tersedia Berangkat: ",
                //     availableSeatsDeparture
                // );

                if (flightIdReturn && flightReturn?.id) {
                    // console.log(flightIdReturn);
                    // console.log("Data Penerbangan Pulang: ", flightReturn);
                    const dataReturn = await dispatch(
                        getSeatByFlightId(flightReturn?.id)
                    );
                    const filteredDataReturn = dataReturn?.filter(
                        (seat) => seat.airlineClass === selectedAirlineClass
                    );
                    const availableSeatsReturn = filteredDataReturn?.filter(
                        (seat) => seat.isAvailable === true
                    );
                    setSeatReturn(filteredDataReturn);
                    setSeatReturnAvailable(availableSeatsReturn);

                    // console.log("Data Kursi Pulang: ", filteredDataReturn);
                    // console.log(
                    //     "Data Kursi Tersedia Pulang: ",
                    //     availableSeatsReturn
                    // );
                }
            } catch (error) {
                console.error("Error fetching seat data:", error);
            }
        }
    };

    useEffect(() => {
        fetchData();
        setIsBookingSuccess(false);
    }, [
        dispatch,
        flightDeparture,
        flightReturn,
        seatType,
        isBookingSuccess,
        airlineClass,
    ]);

    useEffect(() => {
        if (!user || !socket.current) {
            return;
        }

        socket.current.on("seatsUpdate", (data) => {
            if (
                (data.flightId === flightIdDeparture ||
                    data.flightId === flightIdReturn) &&
                data.airlineClass === airlineClass
            ) {
                setIsBookingSuccess(true);
            }
        });

        return () => {
            if (socket.current) {
                socket.current.off("seatsUpdate");
            }
        };
    }, [socket.current, airlineClass]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setErrorStatus(true);
            document.querySelector("#data-penumpang").scrollIntoView(true, {
                behavior: "smooth",
            });
            toast.error("Silahkan lengkapi data penumpang.");
            return;
        } else if (
            seatSelectedDeparture.length < capacityUser
            // seatSelectedReturn.length < capacityUser
        ) {
            toast.error("Silahkan pilih kursi terlebih dahulu.");
            return;
        } else {
            setErrorStatus(false);
            // console.log("Data yang disimpan: ", passangerData);
            // console.log("Kursi yang dipesan: ", seatSelectedDeparture);
            // console.log(
            //     "Total Harga: ",
            //     totalPrice ? totalPrice : departureTotalPrice
            // );

            try {
                setSaveDisabled(true);

                const passangerResult = await dispatch(
                    createPassanger(passangerData)
                );
                // console.log("Data Penumpang: ", passangerResult);
                const price = totalPrice ? totalPrice : departureTotalPrice;

                const paymentResult = await dispatch(
                    generateSnapPayment({ totalPrice: price })
                );
                // console.log("Data Pembayaran: ", paymentResult);

                // Check seat availability for departure and return seats
                const isSeatAvailableDeparture = await Promise.all(
                    seatSelectedDeparture.map(async (seat) => {
                        const seatDeparture = await dispatch(
                            getSeatById(seat.seatId)
                        );
                        return seatDeparture[0].isAvailable;
                    })
                );

                const isSeatAvailableReturn = await Promise.all(
                    seatSelectedReturn.map(async (seat) => {
                        const seatReturn = await dispatch(
                            getSeatById(seat.seatId)
                        );
                        return seatReturn[0].isAvailable;
                    })
                );

                // Check if any seat is not available
                if (
                    isSeatAvailableDeparture.includes(false) ||
                    (flightIdReturn && isSeatAvailableReturn.includes(false))
                ) {
                    Swal.fire({
                        icon: "error",
                        title: "Kursi sudah dipesan",
                        text: "Kursi yang Anda pilih sudah dipesan oleh pengguna lain. Silahkan pilih kursi lain.",
                        confirmButtonColor: "#7126B5",
                    });
                    setSaveDisabled(false);
                    onSeatsSelected([]);
                    return;
                }

                let bookingData = {
                    userId: user?.id,
                    paymentId: paymentResult?.id,
                    status: flightIdReturn ? "Return" : "One Way",
                    roundtripFlightId: flightIdReturn ? flightIdReturn : null,
                };
                const bookingResult = await dispatch(
                    createBooking(bookingData)
                );
                // console.log("Data Booking: ", bookingResult);

                setBookingIdResult(bookingResult?.id);

                const helperBookingData = [];

                seatSelectedDeparture?.forEach((seat, key) => {
                    helperBookingData.push({
                        bookingId: bookingResult?.id,
                        seatId: seat.seatId,
                        passangerId: passangerResult[key]?.id,
                    });
                });
                seatSelectedReturn?.forEach((seat, key) => {
                    helperBookingData.push({
                        bookingId: bookingResult?.id,
                        seatId: seat.seatId,
                        passangerId: passangerResult[key]?.id,
                    });
                });
                // console.log(helperBookingData);

                const helperBookingResult = await dispatch(
                    createHelperBooking(helperBookingData)
                );
                // console.log("Data Helper Booking: ", helperBookingResult);

                if (
                    passangerResult &&
                    paymentResult &&
                    bookingResult &&
                    helperBookingResult
                ) {
                    setShowFlightDetails(true);
                    setIsSaved(true);
                    setSeatsConfirmed(true);
                    window.scrollTo(0, 0);

                    Swal.fire({
                        icon: "success",
                        title: "Booking Berhasil",
                        text: "Silahkan lanjutkan ke pembayaran.",
                        confirmButtonColor: "#7126B5",
                    });
                }
            } catch (error) {
                toast.error("Gagal membuat data booking.");
            }
        }
    };

    const handleSubmitPayment = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate("/payment", {
                state: {
                    seatSelectedDeparture,
                    seatSelectedReturn,
                    bookingIdResult,
                    adultCount: adult,
                    childCount: child,
                    babyCount: baby,
                },
            });
            // console.log("To Payment Page: ", {
            //     seatSelectedDeparture,
            //     seatSelectedReturn,
            //     bookingIdResult,
            //     adultCount: adult,
            //     childCount: child,
            //     babyCount: baby,
            // });
            toast.info("Silahkan Bayar.");
        }, 1000);
    };

    return (
        <>
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
                    <Link underline="hover" key="1" color="inherit">
                        Isi Data Diri
                    </Link>
                    ,
                    <Link
                        underline="hover"
                        key="2"
                        color="inherit"
                        style={{ fontWeight: 300 }}
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
            </HeaderShadow>
            <Container>
                <Row>
                    <Col md={7}>
                        <Card
                            className="mb-4 mt-3"
                            style={{
                                boxShadow: "1px 0 5px 2px rgba(0, 0, 0, 0.1)",
                                borderRadius: "0.50rem",
                            }}
                        >
                            <h4
                                className="mb-0"
                                style={{
                                    marginLeft: "18px",
                                    marginTop: "15px",
                                }}
                            >
                                Isi Data Pemesan
                            </h4>
                            <Card.Body>
                                <Form>
                                    <div
                                        style={{
                                            backgroundColor: "#343a40",
                                            padding: "10px",
                                            color: "white",
                                            borderTopLeftRadius: "10px",
                                            borderTopRightRadius: "10px",
                                        }}
                                    >
                                        <h6
                                            className="mb-0"
                                            style={{ marginLeft: "4px" }}
                                        >
                                            Data Diri Pemesan
                                        </h6>
                                    </div>
                                    <div style={{ padding: "10px" }}>
                                        <Form.Group
                                            controlId="formFullName"
                                            className="mt-3"
                                        >
                                            <Form.Label
                                                style={{
                                                    color: "#7126B5",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Nama Lengkap
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={userFullName}
                                                readOnly={isSaved}
                                                disabled={true}
                                            />
                                        </Form.Group>

                                        <Form.Group
                                            controlId="formPhone"
                                            className="mt-3"
                                        >
                                            <Form.Label
                                                style={{
                                                    color: "#7126B5",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Nomor Telepon
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={userPhoneNumber}
                                                readOnly={isSaved}
                                                disabled={true}
                                            />
                                        </Form.Group>

                                        <Form.Group
                                            controlId="formEmail"
                                            className="mt-3"
                                        >
                                            <Form.Label
                                                style={{
                                                    color: "#7126B5",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Email
                                            </Form.Label>
                                            <Form.Control
                                                type="email"
                                                value={userEmail}
                                                readOnly={isSaved}
                                                disabled={true}
                                            />
                                        </Form.Group>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                        <Card
                            className="mb-3"
                            id="data-penumpang"
                            style={{
                                boxShadow: "1px 0 5px 2px rgba(0, 0, 0, 0.1)",
                                borderRadius: "0.50rem",
                            }}
                        >
                            <h4
                                className="mb-0"
                                style={{
                                    marginLeft: "18px",
                                    marginTop: "15px",
                                }}
                            >
                                Isi Data Penumpang
                            </h4>
                            <Card.Body>
                                {passangerData.adult.map((passanger, index) => (
                                    <PassangerForm
                                        key={`adult-${index}`}
                                        isSaved={isSaved}
                                        handleSwitchChanges={
                                            handleSwitchChanges
                                        }
                                        handleInputChange={handleInputChange}
                                        passanger={{
                                            ...passanger,
                                            type: "adult",
                                            index,
                                            order: index + 1,
                                        }}
                                        errors={errors}
                                    />
                                ))}
                                {passangerData.child.map((passanger, index) => (
                                    <PassangerForm
                                        key={`child-${index}`}
                                        isSaved={isSaved}
                                        handleSwitchChanges={
                                            handleSwitchChanges
                                        }
                                        handleInputChange={handleInputChange}
                                        passanger={{
                                            ...passanger,
                                            type: "child",
                                            index,
                                            order: adult + index + 1,
                                        }}
                                        errors={errors}
                                    />
                                ))}
                                {/* {passangerData.baby.map((passanger, index) => (
                                    <PassangerForm
                                        key={`baby-${index}`}
                                        isSaved={isSaved}
                                        handleSwitchChanges={
                                            handleSwitchChanges
                                        }
                                        handleInputChange={handleInputChange}
                                        passanger={{
                                            ...passanger,
                                            type: "baby",
                                            index,
                                            order: adult + child + index + 1,
                                        }}
                                        errors={errors}
                                    />
                                ))} */}
                            </Card.Body>
                        </Card>
                        <SeatSelectionComponent
                            title={"Pilih Kursi Penerbangan Berangkat"}
                            seatType={seatType}
                            seatsConfirmed={seatsConfirmed}
                            seatArrayAll={seatDeparture}
                            seatAvailable={seatDepartureAvailable}
                            onSeatsSelected={setSeatSelectedDeparture}
                            adult={adult}
                            child={child}
                            // baby={baby}
                            capacity={capacityUser}
                            isBookingSuccess={isBookingSuccess}
                        />
                        {flightIdReturn && (
                            <SeatSelectionComponent
                                title={"Pilih Kursi Penerbangan Pulang"}
                                seatType={seatType}
                                seatsConfirmed={seatsConfirmed}
                                seatArrayAll={seatReturn}
                                seatAvailable={seatReturnAvailable}
                                onSeatsSelected={setSeatSelectedReturn}
                                adult={adult}
                                child={child}
                                // baby={baby}
                                capacity={capacityUser}
                                isBookingSuccess={isBookingSuccess}
                            />
                        )}

                        <div style={{ paddingBottom: "40px" }}>
                            <Button
                                type="submit"
                                className="btn-primary"
                                disabled={saveDisabled || seatsConfirmed}
                                onClick={handleSubmit}
                                style={{
                                    width: "100%",
                                    paddingTop: "20px",
                                    paddingBottom: "20px",
                                    borderRadius: "17px",
                                    backgroundColor: "#7126B5",
                                }}
                            >
                                {seatsConfirmed
                                    ? "Booking berhasil dibuat"
                                    : "Simpan"}
                            </Button>
                        </div>
                    </Col>

                    <Col md={5}>
                        <Card
                            className="mb-3 mt-3"
                            style={{
                                boxShadow: "1px 0 5px 2px rgba(0, 0, 0, 0.1)",
                                borderRadius: "0.50rem",
                            }}
                        >
                            <h4
                                className="mb-0"
                                style={{
                                    marginLeft: "18px",
                                    marginTop: "15px",
                                }}
                            >
                                Detail Penerbangan
                            </h4>
                            <Card.Body>
                                <DetailFlight
                                    TitleDetail={"Jadwal Berangkat"}
                                    // BookingCode
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
                                        .format("DD MMMM YYYY")}
                                    departureAirport={
                                        flightDeparture?.StartAirport?.name
                                    }
                                    departureTerminal={
                                        flightDeparture?.StartAirport?.terminal
                                    }
                                    arrivalTime={moment
                                        .tz(
                                            flightDeparture?.arrivalAt,
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
                                        .format("DD MMMM YYYY")}
                                    arrivalAirport={
                                        flightDeparture?.EndAirport?.name
                                    }
                                    arrivalTerminal={
                                        flightDeparture?.EndAirport?.terminal
                                    }
                                    airlineName={flightDeparture?.Airline?.name}
                                    airlineLogo={
                                        flightDeparture?.Airline?.picture
                                    }
                                    flightCode={flightDeparture?.flightCode}
                                    seatClass={seatType}
                                    baggage={flightDeparture?.Airline?.baggage}
                                    cabinBaggage={
                                        flightDeparture?.Airline?.cabinBaggage
                                    }
                                    additionals={
                                        flightDeparture?.Airline?.additionals
                                    }
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
                                {flightIdReturn && (
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
                                            // BookingCode
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
                                                .format("DD MMMM YYYY")}
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
                                                .format("HH:mm")}
                                            arrivalDate={moment
                                                .tz(
                                                    flightReturn?.arrivalAt,
                                                    flightReturn?.EndAirport
                                                        ?.timezone
                                                )
                                                .format("DD MMMM YYYY")}
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
                                            flightCode={
                                                flightReturn?.flightCode
                                            }
                                            seatClass={seatType}
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
                            </Card.Body>
                        </Card>
                        {showFlightDetails && (
                            <div>
                                <Button
                                    onClick={handleSubmitPayment}
                                    variant="danger"
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        width: "100%",
                                        paddingTop: "20px",
                                        paddingBottom: "20px",
                                        borderRadius: "17px",
                                    }}
                                >
                                    {loading ? "Loading..." : "Lanjut Bayar"}
                                </Button>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default BookingForm;
