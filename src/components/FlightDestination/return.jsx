import { Row, Col, Image } from "react-bootstrap";
import PropTypes from "prop-types";
import Arrow from "../../assets/airline-left.png";

const FlightDestinationReturn = ({
    departureTime,
    departureDate,
    departureCity,
    flightDuration,
    arrivalTime,
    arrivalDate,
    arrivalCity,
    additionals,
}) => {
    return (
        <Row className="d-flex justify-content-center">
            <Col
                md={3}
                xs={3}
                className="d-flex flex-column align-items-center justify-content-center"
            >
                <p style={{ fontWeight: "bold", marginBottom: 0 }}>
                    {arrivalTime}
                </p>
                <p style={{ marginBottom: 0 }}>{arrivalDate}</p>
                <p style={{ marginBottom: 0 }}>{arrivalCity}</p>
            </Col>
            <Col
                md={6}
                xs={4}
                className="d-flex flex-column justify-content-center"
                style={{ textAlign: "center" }}
            >
                <p className="my-0" style={{ marginBottom: 0 }}>
                    {Math.floor(flightDuration % 60) == 0
                        ? `${flightDuration / 60} Jam`
                        : flightDuration < 60
                        ? `${flightDuration % 60} Menit`
                        : `${Math.floor(flightDuration / 60)} Jam ${
                              flightDuration % 60
                          } Menit`}
                </p>
                <Image
                    src={Arrow}
                    className="img-fluid"
                    style={{ marginBottom: 0 }}
                />
                <p className="my-0">{additionals}</p>
            </Col>
            <Col
                md={3}
                xs={3}
                className="d-flex flex-column align-items-center justify-content-center"
            >
                <p style={{ fontWeight: "bold", marginBottom: 0 }}>
                    {departureTime}
                </p>
                <p style={{ marginBottom: 0 }}>{departureDate}</p>
                <p style={{ marginBottom: 0 }}>{departureCity}</p>
            </Col>
        </Row>
    );
};

FlightDestinationReturn.propTypes = {
    text: PropTypes.string,
};

export default FlightDestinationReturn;
