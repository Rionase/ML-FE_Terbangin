import Switch from "@mui/material/Switch";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import StartAirportSearchComponent from "../AutoComplete/startAirports";
import EndAirportSearchComponent from "../AutoComplete/endAirports";
import {
    Row,
    Col,
    Button,
    Form,
    Container,
    Modal,
    Image,
} from "react-bootstrap";
import plane from "../../assets/SearchBar/material-symbols_flight-takeoff-sharp.svg";
import swapButton from "../../assets/SearchBar/return.png";
import calendar from "../../assets/SearchBar/calendar.svg";
import seat from "../../assets/SearchBar/class.svg";
import dewasa from "../../assets/Passengers Modal/Dewasa.png";
import anak from "../../assets/Passengers Modal/Anak.png";
import bayi from "../../assets/Passengers Modal/Bayi.png";
import chooseImage from "../../assets/Class Modal/check.png";

import { TextField } from "@mui/material";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import "./form.css";
import RecommendationList from "../RecomendationList";
import dayjs from "dayjs";

const FormArea = ({
    title,
    isFullScreen,
    isMobile,
    onClick,
    flightDataUser,
}) => {
    const navigate = useNavigate();

    const [showInput2, setShowInput2] = useState(false);
    const [smShowCapacity, setSmShowCapacity] = useState(false);
    const [smShowSeatClass, setSmShowSeatClass] = useState(false);
    const [selectedSeatClass, setSelectedSeatClass] = useState(null);
    const [lgShowDeparture, setLgShowDeparture] = useState(false);
    const [lgShowArrival, setLgShowArrival] = useState(false);
    const [seatType, setSeatType] = useState("");
    const [flightType, setFlightType] = useState("One Way");
    const [date1, setDate1] = useState(null);
    const [date2, setDate2] = useState(null);
    const [departure, setDeparture] = useState("");
    const [iataCodeDeparture, setIataCodeDeparture] = useState("");
    const [arrival, setArrival] = useState("");
    const [iataCodeArrival, setIataCodeArrival] = useState("");
    const [capacity, setCapacity] = useState(0);
    const [adult, setAdult] = useState(0);
    const [child, setChild] = useState(0);
    const [baby, setBaby] = useState(0);
    const [switchChecked, setSwitchChecked] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (flightDataUser) {
            setDeparture(flightDataUser.departure);
            setIataCodeDeparture(flightDataUser.iataCodeDeparture);
            setArrival(flightDataUser.arrival);
            setIataCodeArrival(flightDataUser.iataCodeArrival);
            setFlightType(flightDataUser.flightType);
            setDate1(dayjs(flightDataUser.departureDate));
            setDate2(dayjs(flightDataUser.returnDate));
            setSeatType(flightDataUser.seatType);
            setCapacity(flightDataUser.capacity);
            setAdult(flightDataUser.adult);
            setChild(flightDataUser.child);
            setBaby(flightDataUser.baby);

            if (flightDataUser.flightType === "Return") {
                setSwitchChecked(true);
                setShowInput2(true);
            }
        }
    }, [flightDataUser]);

    const handleDateChange1 = (newValue) => {
        setDate1(newValue);
    };

    const handleDateChange2 = (newValue) => {
        setDate2(newValue);
        if (newValue) {
            setFlightType("Return");
        }
    };

    const handleSelectRecommendationStart = (recommendation) => {
        setDeparture(recommendation.city);
        setIataCodeDeparture(recommendation.iataCode);
        setLgShowDeparture(false);
    };

    const handleSelectRecommendationEnd = (recommendation) => {
        setArrival(recommendation.city);
        setIataCodeArrival(recommendation.iataCode);
        setLgShowArrival(false);
    };

    const handleIncrease = (type) => {
        if (type === "ADULT") setAdult(adult + 1);
        if (type === "CHILD") setChild(child + 1);
        if (type === "BABY") setBaby(baby + 1);
    };

    const handleDecrease = (type) => {
        if (type === "ADULT" && adult > 0) setAdult(adult - 1);
        if (type === "CHILD" && child > 0) setChild(child - 1);
        if (type === "BABY" && baby > 0) setBaby(baby - 1);
    };

    const handleSaveCapacity = () => {
        if (adult < 1) {
            toast.error("At least 1 adult is required");
            return;
        }

        setCapacity(adult + child + baby);
        setSmShowCapacity(false);
    };

    const swapAirport = () => {
        const temp = departure;
        setDeparture(arrival);
        setArrival(temp);

        const tempIataCodeDeparture = iataCodeDeparture;
        setIataCodeDeparture(iataCodeArrival);
        setIataCodeArrival(tempIataCodeDeparture);
    };

    const handleReturn = (e) => {
        if (!date1) {
            e.preventDefault();
            toast.error("Please fill the departure date first");
        } else if (!switchChecked) {
            setSwitchChecked(!switchChecked);
            setShowInput2(!showInput2);
            setDate2(null);
        } else {
            setSwitchChecked(!switchChecked);
            setShowInput2(!showInput2);
            setDate2(null);
            setFlightType("One Way");
        }
    };

    const handleClickSeat = (seatClass) => {
        setSelectedSeatClass(seatClass);
    };

    const handleSaveSeat = () => {
        setSeatType(selectedSeatClass);

        setSmShowSeatClass(false);
    };

    const getClassStyle = (buttonId) => {
        return {
            cursor: "pointer",
            backgroundColor:
                selectedSeatClass === buttonId ? "#7126b5" : "initial",
            color: selectedSeatClass === buttonId ? "white" : "initial",
            borderColor: selectedSeatClass === buttonId ? "#7126b5" : "initial",
        };
    };

    const getClassImages = (buttonId) => {
        return selectedSeatClass === buttonId ? chooseImage : "";
    };

    const handleSubmit = (e) => {
        setLoading(true);
        e.preventDefault();
        localStorage.removeItem("flightData");
        const departureDate = date1 ? date1.format("YYYY-MM-DD") : null;
        const returnDate = date2 ? date2.format("YYYY-MM-DD") : null;

        if (!departure) {
            toast.error("Departure is required");
            setLoading(false);
            return;
        }
        if (!arrival) {
            toast.error("Arrival is required");
            setLoading(false);
            return;
        }
        if (!departureDate) {
            toast.error("Departure date is required");
            setLoading(false);
            return;
        }
        if (flightType === "Return" && !returnDate) {
            toast.error("Return date is required");
            setLoading(false);
            return;
        }
        if (!capacity) {
            toast.error("Passanger capacity is required");
            setLoading(false);
            return;
        }
        if (!seatType) {
            toast.error("Seat class is required");
            setLoading(false);
            return;
        }

        // console.log({
        //     flightType,
        //     departure,
        //     iataCodeDeparture,
        //     arrival,
        //     iataCodeArrival,
        //     departureDate,
        //     returnDate,
        //     seatType,
        //     capacity,
        //     adult,
        //     child,
        //     baby,
        // });

        navigate("/find-ticket", {
            state: {
                flightType,
                departure,
                iataCodeDeparture,
                arrival,
                iataCodeArrival,
                departureDate,
                returnDate,
                seatType,
                capacity,
                adult,
                child,
                baby,
            },
        });

        if (onClick) {
            onClick();
        }

        setLoading(false);
    };

    return (
        <Container
            className={isMobile ? "mt-4" : ""}
            style={{ position: "relative" }}
        >
            <Form
                className="d-flex mb-5"
                role="search"
                id="search-submit"
                onSubmit={handleSubmit}
                style={{
                    backgroundColor: "white",
                    margin: isFullScreen ? "0px 120px" : "0px 0px",
                    border: "0px solid #dddddd",
                    borderRadius: "12.5px",
                    boxShadow: " 1px 0 10px 2px rgba(0, 0, 0, 0.1)",
                }}
            >
                {/* header title */}
                <Container>
                    <Row className="p-3 justify-content-md-center">
                        <Col md="auto" className="">
                            <h2 style={{ fontWeight: "700" }}>{title}</h2>
                        </Col>
                    </Row>

                    <Container className="px-3">
                        {/* Flight Destination */}
                        <Row className="mb-4 ">
                            {/* Departure */}
                            <Col md={5} sm={12}>
                                <Row className="d-flex">
                                    <Col
                                        md={{ span: 3, offset: 1 }}
                                        xs={3}
                                        className="d-flex"
                                    >
                                        <Image
                                            src={plane}
                                            style={{ width: 25 }}
                                        />
                                        <span className="ms-1"> From</span>
                                    </Col>
                                    <Col md={7} xs={8} className="">
                                        <TextField
                                            style={{
                                                caretColor: "transparent",
                                            }}
                                            autoComplete="off"
                                            autoCorrect="off"
                                            autoCapitalize="off"
                                            spellCheck="false"
                                            id="standard-basic-departure"
                                            variant="standard"
                                            value={
                                                departure
                                                    ? `${departure} (${iataCodeDeparture})`
                                                    : ""
                                            }
                                            onClick={() =>
                                                setLgShowDeparture(true)
                                            }
                                            placeholder="Search for an airport..."
                                        />
                                        <Modal
                                            centered
                                            show={lgShowDeparture}
                                            onHide={() =>
                                                setLgShowDeparture(false)
                                            }
                                            key={lgShowDeparture}
                                        >
                                            <Modal.Header closeButton>
                                                <Modal.Title>
                                                    Select Departure
                                                </Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <Form id="form-departure">
                                                    <Form.Group
                                                        className="mb-3"
                                                        controlId="exampleForm.ControlInput1"
                                                    >
                                                        <StartAirportSearchComponent
                                                            setStartAirport={
                                                                setDeparture
                                                            }
                                                            setIataCodeDeparture={
                                                                setIataCodeDeparture
                                                            }
                                                            setLgShowDeparture={
                                                                setLgShowDeparture
                                                            }
                                                        />
                                                        <RecommendationList
                                                            onSelect={
                                                                handleSelectRecommendationStart
                                                            }
                                                        />
                                                    </Form.Group>
                                                </Form>
                                            </Modal.Body>
                                        </Modal>
                                    </Col>
                                </Row>
                            </Col>
                            {/* Swap button */}
                            <Col
                                md={2}
                                xs={12}
                                className={
                                    isMobile
                                        ? "my-1 d-flex justify-content-end align-items-center"
                                        : "d-flex justify-content-center"
                                }
                            >
                                <Image
                                    src={swapButton}
                                    onClick={swapAirport}
                                    style={{
                                        cursor: "pointer",
                                        width: "30px",
                                        height: "33px",
                                    }}
                                />
                            </Col>
                            {/* Arrival */}
                            <Col md={5} sm={12}>
                                <Row>
                                    <Col
                                        md={3}
                                        xs={3}
                                        className="d-flex justify-content-md-start"
                                    >
                                        {" "}
                                        <Image
                                            src={plane}
                                            style={{ width: 25 }}
                                        />{" "}
                                        <span className="ms-1">To</span>
                                    </Col>
                                    <Col
                                        md={7}
                                        xs={8}
                                        className="d-flex justify-content-md-start"
                                    >
                                        <TextField
                                            style={{
                                                caretColor: "transparent",
                                            }}
                                            autoComplete="off"
                                            autoCorrect="off"
                                            autoCapitalize="off"
                                            spellCheck="false"
                                            id="standard-basic-arrival"
                                            variant="standard"
                                            value={
                                                arrival
                                                    ? `${arrival} (${iataCodeArrival})`
                                                    : ""
                                            }
                                            onClick={() =>
                                                setLgShowArrival(true)
                                            }
                                            placeholder="Search for an airport..."
                                        />
                                        <Modal
                                            centered
                                            show={lgShowArrival}
                                            onHide={() =>
                                                setLgShowArrival(false)
                                            }
                                            key={lgShowArrival}
                                        >
                                            <Modal.Header closeButton>
                                                <Modal.Title>
                                                    Select Arrival
                                                </Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <Form id="form-arrival">
                                                    <Form.Group
                                                        className="mb-3"
                                                        controlId="exampleForm.ControlInput1"
                                                    >
                                                        <EndAirportSearchComponent
                                                            setEndAirport={
                                                                setArrival
                                                            }
                                                            setIataCodeArrival={
                                                                setIataCodeArrival
                                                            }
                                                            setLgShowArrival={
                                                                setLgShowArrival
                                                            }
                                                        />
                                                        <RecommendationList
                                                            onSelect={
                                                                handleSelectRecommendationEnd
                                                            }
                                                        />
                                                    </Form.Group>
                                                </Form>
                                            </Modal.Body>
                                        </Modal>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        {/* Flight Information */}
                        <Row className="d-flex">
                            {/* Date */}
                            <Col md={5}>
                                <Row className="">
                                    <Col
                                        md={{ span: 3, offset: 1 }}
                                        xs={3}
                                        className="d-flex align-items-center"
                                    >
                                        <Image src={calendar} className="" />{" "}
                                        <span className="ms-1">Date</span>
                                    </Col>
                                    <Col md={4} xs={4} className="">
                                        <p style={{ marginBottom: 0 }}>
                                            Departure
                                        </p>
                                        <LocalizationProvider
                                            dateAdapter={AdapterDayjs}
                                        >
                                            {" "}
                                            <MobileDatePicker
                                                value={date1}
                                                minDate={dayjs()}
                                                onChange={handleDateChange1}
                                                format="DD/MM/YYYY"
                                                slots={{
                                                    textField: (props) => (
                                                        <TextField
                                                            {...props}
                                                            variant="standard"
                                                        />
                                                    ),
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Col>
                                    <Col md={4} xs={4}>
                                        <p style={{ marginBottom: 0 }}>
                                            Return
                                        </p>
                                        <LocalizationProvider
                                            dateAdapter={AdapterDayjs}
                                        >
                                            {" "}
                                            <MobileDatePicker
                                                disabled={!showInput2}
                                                value={date2}
                                                minDate={date1}
                                                format="DD/MM/YYYY"
                                                onChange={handleDateChange2}
                                                slots={{
                                                    textField: (props) => (
                                                        <TextField
                                                            {...props}
                                                            variant="standard"
                                                        />
                                                    ),
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Col>
                                </Row>
                            </Col>
                            <Col
                                md={2}
                                xs={12}
                                className="d-flex justify-content-md-center justify-content-end "
                            >
                                <Switch
                                    checked={switchChecked}
                                    onClick={handleReturn}
                                    color="secondary"
                                    name="switch-return"
                                />
                            </Col>
                            {/* Passanger Data   */}
                            <Col md={5} className={isMobile ? "pt-3" : ""}>
                                <Row>
                                    {/* Icon */}
                                    <Col
                                        md={3}
                                        xs={3}
                                        className="d-flex align-items-center"
                                    >
                                        <Image src={seat} />{" "}
                                        <span className="ms-1">To</span>
                                    </Col>
                                    {/* Passanger Info */}
                                    <Col md={4} xs={4}>
                                        <p style={{ margin: 0 }}>Passangers</p>
                                        <TextField
                                            autoComplete="off"
                                            autoCorrect="off"
                                            autoCapitalize="off"
                                            spellCheck="false"
                                            id="standard-basic-passanger"
                                            variant="standard"
                                            value={
                                                capacity
                                                    ? capacity + " Penumpang"
                                                    : ""
                                            }
                                            placeholder="Passanger"
                                            onClick={() =>
                                                setSmShowCapacity(true)
                                            }
                                            style={{
                                                caretColor: "transparent",
                                                backgroundColor: "white",
                                                color: "black",
                                                borderStyle:
                                                    "none none solid none",
                                                borderColor: "#dddddd",
                                                fontWeight: "bold",
                                                borderRadius: 0,
                                                textAlign: "left",
                                            }}
                                        />

                                        <Modal
                                            id="capacity-modal"
                                            size="sm"
                                            show={smShowCapacity}
                                            onHide={() =>
                                                setSmShowCapacity(false)
                                            }
                                            aria-labelledby="example-modal-sizes-title-sm"
                                            centered
                                        >
                                            <Modal.Header closeButton>
                                                <Modal.Title id="example-modal-sizes-title-sm"></Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body
                                                style={{
                                                    border: "none",
                                                    padding: "0px 15px",
                                                }}
                                            >
                                                {/* Dewasa */}
                                                <Row className="border-bottom my-1">
                                                    <Col
                                                        md={2}
                                                        xs={2}
                                                        style={{ width: 0 }}
                                                        className="pt-1"
                                                    >
                                                        <img
                                                            src={dewasa}
                                                            alt=""
                                                        />
                                                    </Col>
                                                    <Col
                                                        md={4}
                                                        xs={4}
                                                        className="ms-4 align-center-center"
                                                    >
                                                        <h5>Dewasa</h5>
                                                        <p
                                                            style={{
                                                                fontSize:
                                                                    "smaller",
                                                                color: "gray",
                                                            }}
                                                        >
                                                            12 tahun keatas
                                                        </p>
                                                    </Col>
                                                    <Col
                                                        md={6}
                                                        xs={6}
                                                        className="d-flex justify-content-end align-items-center"
                                                    >
                                                        <Button
                                                            variant="outline-danger"
                                                            onClick={() =>
                                                                handleDecrease(
                                                                    "ADULT"
                                                                )
                                                            }
                                                        >
                                                            -
                                                        </Button>
                                                        <span
                                                            style={{
                                                                border: "solid 1px",
                                                                borderRadius:
                                                                    "5px",
                                                                height: "38px",
                                                                width: "35px",
                                                                margin: "0 5px",
                                                            }}
                                                        >
                                                            <h4
                                                                className="d-flex justify-content-center"
                                                                style={{
                                                                    position:
                                                                        "relative",
                                                                    top: "5px",
                                                                }}
                                                            >
                                                                {adult}
                                                            </h4>
                                                        </span>
                                                        <Button
                                                            variant="outline-success"
                                                            onClick={() =>
                                                                handleIncrease(
                                                                    "ADULT"
                                                                )
                                                            }
                                                        >
                                                            +
                                                        </Button>
                                                    </Col>
                                                </Row>
                                                {/* Anak */}
                                                <Row className="border-bottom mt-2">
                                                    <Col
                                                        md={2}
                                                        xs={2}
                                                        style={{ width: 0 }}
                                                        className="pt-1"
                                                    >
                                                        <img
                                                            src={anak}
                                                            alt=""
                                                        />
                                                    </Col>
                                                    <Col
                                                        md={4}
                                                        xs={4}
                                                        className="ms-4"
                                                    >
                                                        <h5>Anak</h5>
                                                        <p
                                                            style={{
                                                                fontSize:
                                                                    "smaller",
                                                                color: "gray",
                                                            }}
                                                        >
                                                            2 - 11 tahun
                                                        </p>
                                                    </Col>
                                                    <Col
                                                        md={6}
                                                        xs={6}
                                                        className="d-flex justify-content-end align-items-center"
                                                    >
                                                        <Button
                                                            variant="outline-danger"
                                                            onClick={() =>
                                                                handleDecrease(
                                                                    "CHILD"
                                                                )
                                                            }
                                                        >
                                                            -
                                                        </Button>
                                                        <span
                                                            style={{
                                                                border: "solid 1px",
                                                                borderRadius:
                                                                    "5px",
                                                                height: "38px",
                                                                width: "35px",
                                                                margin: "0 5px",
                                                            }}
                                                        >
                                                            <h4
                                                                className="d-flex justify-content-center"
                                                                style={{
                                                                    position:
                                                                        "relative",
                                                                    top: "5px",
                                                                }}
                                                            >
                                                                {child}
                                                            </h4>
                                                        </span>
                                                        <Button
                                                            variant="outline-success"
                                                            onClick={() =>
                                                                handleIncrease(
                                                                    "CHILD"
                                                                )
                                                            }
                                                        >
                                                            +
                                                        </Button>
                                                    </Col>
                                                </Row>
                                                {/* Bayi */}
                                                <Row className="border-bottom mt-2">
                                                    <Col
                                                        md={2}
                                                        xs={2}
                                                        style={{ width: 0 }}
                                                        className="pt-1"
                                                    >
                                                        <img
                                                            src={bayi}
                                                            alt=""
                                                        />
                                                    </Col>
                                                    <Col
                                                        md={4}
                                                        xs={4}
                                                        className="ms-4"
                                                    >
                                                        <h5>Bayi</h5>
                                                        <p
                                                            style={{
                                                                fontSize:
                                                                    "smaller",
                                                                color: "gray",
                                                            }}
                                                        >
                                                            Dibawah 2 tahun
                                                        </p>
                                                    </Col>
                                                    <Col
                                                        md={6}
                                                        xs={6}
                                                        className="d-flex justify-content-end align-items-center"
                                                    >
                                                        <Button
                                                            variant="outline-danger"
                                                            onClick={() =>
                                                                handleDecrease(
                                                                    "BABY"
                                                                )
                                                            }
                                                        >
                                                            -
                                                        </Button>
                                                        <span
                                                            style={{
                                                                border: "solid 1px",
                                                                borderRadius:
                                                                    "5px",
                                                                height: "38px",
                                                                width: "35px",
                                                                margin: "0 5px",
                                                            }}
                                                        >
                                                            <h4
                                                                className="d-flex justify-content-center"
                                                                style={{
                                                                    position:
                                                                        "relative",
                                                                    top: "5px",
                                                                }}
                                                            >
                                                                {baby}
                                                            </h4>
                                                        </span>
                                                        <Button
                                                            variant="outline-success"
                                                            onClick={() =>
                                                                handleIncrease(
                                                                    "BABY"
                                                                )
                                                            }
                                                        >
                                                            +
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Modal.Body>
                                            <Modal.Footer
                                                style={{ border: "none" }}
                                            >
                                                <Button
                                                    onClick={handleSaveCapacity}
                                                    className="button-search2"
                                                >
                                                    Simpan
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>
                                    </Col>
                                    {/* Seat Class */}
                                    <Col md={4} xs={4}>
                                        <p style={{ margin: 0 }}>Class</p>
                                        <TextField
                                            autoComplete="off"
                                            autoCorrect="off"
                                            autoCapitalize="off"
                                            spellCheck="false"
                                            id="standard-basic-seat"
                                            variant="standard"
                                            value={
                                                seatType === "Bussines"
                                                    ? "Business"
                                                    : seatType
                                            }
                                            placeholder="Seat Class"
                                            onClick={() =>
                                                setSmShowSeatClass(true)
                                            }
                                            className="me-2"
                                            style={{
                                                caretColor: "transparent",
                                                backgroundColor: "white",
                                                color: "black",
                                                borderStyle:
                                                    "none none solid none",
                                                borderColor: "#dddddd",
                                                fontWeight: "bold",
                                                borderRadius: 0,
                                            }}
                                        />
                                        <Modal
                                            id="seat-modal"
                                            size="sm"
                                            show={smShowSeatClass}
                                            onHide={() =>
                                                setSmShowSeatClass(false)
                                            }
                                            aria-labelledby="example-modal-sizes-title-sm"
                                            centered
                                        >
                                            <Modal.Header closeButton>
                                                <Modal.Title id="example-modal-sizes-title-sm"></Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body
                                                style={{
                                                    border: "none",
                                                    padding: "0px 15px",
                                                }}
                                            >
                                                {/* Economy */}
                                                <Row
                                                    className="border-bottom px-2 py-3 home-seat-class d-flex justify-content-center align-items-center"
                                                    style={getClassStyle(
                                                        "Economy"
                                                    )}
                                                    onClick={() =>
                                                        handleClickSeat(
                                                            "Economy"
                                                        )
                                                    }
                                                >
                                                    <Col
                                                        style={{
                                                            position:
                                                                "relative",
                                                        }}
                                                    >
                                                        <h5>Economy</h5>
                                                    </Col>
                                                    <Col className="d-flex justify-content-end">
                                                        <img
                                                            src={getClassImages(
                                                                "Economy"
                                                            )}
                                                            alt=""
                                                        />
                                                    </Col>
                                                </Row>
                                                {/* Business */}
                                                <Row
                                                    className="border-bottom px-2 py-3 home-seat-class d-flex justify-content-center align-items-center"
                                                    style={getClassStyle(
                                                        "Bussines"
                                                    )}
                                                    onClick={() =>
                                                        handleClickSeat(
                                                            "Bussines"
                                                        )
                                                    }
                                                >
                                                    <Col
                                                        style={{
                                                            position:
                                                                "relative",
                                                        }}
                                                    >
                                                        <h5>Business</h5>
                                                    </Col>
                                                    <Col className="d-flex justify-content-end">
                                                        <img
                                                            src={getClassImages(
                                                                "Bussines"
                                                            )}
                                                            alt=""
                                                        />
                                                    </Col>
                                                </Row>
                                                {/* First Class */}
                                                <Row
                                                    className="border-bottom px-2 py-3 home-seat-class d-flex justify-content-center align-items-center"
                                                    style={getClassStyle(
                                                        "FirstClass"
                                                    )}
                                                    onClick={() =>
                                                        handleClickSeat(
                                                            "FirstClass"
                                                        )
                                                    }
                                                >
                                                    <Col
                                                        style={{
                                                            position:
                                                                "relative",
                                                        }}
                                                    >
                                                        <h5>First Class</h5>
                                                    </Col>
                                                    <Col className="d-flex justify-content-end">
                                                        <img
                                                            src={getClassImages(
                                                                "FirstClass"
                                                            )}
                                                            alt=""
                                                        />
                                                    </Col>
                                                </Row>
                                            </Modal.Body>
                                            <Modal.Footer
                                                style={{ border: "none" }}
                                            >
                                                <Button
                                                    onClick={handleSaveSeat}
                                                    className="button-search2"
                                                >
                                                    Simpan
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                    <Row className="pt-4">
                        {/* button input */}
                        <Button
                            type="submit"
                            id="search"
                            className="button-search"
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Cari Penerbangan"}
                        </Button>
                    </Row>
                </Container>
            </Form>
        </Container>
    );
};

FormArea.propTypes = {
    title: PropTypes.object,
    isFullScreen: PropTypes.bool,
    isMobile: PropTypes.bool,
    onClick: PropTypes.func,
};

export default FormArea;
