import { useEffect } from "react";
import { Row, Col } from "react-bootstrap";

const Price = ({ adult, child, baby, flightPrice, setTotalPrice }) => {
    const totalPrice = flightPrice * adult + flightPrice * child;
    const tax = totalPrice * 0.01;
    const formattedPrice = (price) => {
        return price.toLocaleString("id-ID");
    };

    useEffect(() => {
        setTotalPrice(totalPrice + tax * (adult + child));
    }, [totalPrice]);

    return (
        <>
            <hr />
            <p style={{ marginBottom: 0, fontWeight: "bold" }}>Rincian Harga</p>
            <Row>
                <Col xs={6} md={6}>
                    {adult} {adult > 1 ? "Adults" : "Adult"}
                </Col>
                <Col xs={6} md={6} className="d-flex justify-content-end">
                    IDR {formattedPrice(flightPrice * adult)}
                </Col>
            </Row>
            {child > 0 && (
                <Row>
                    <Col xs={6} md={6}>
                        {child} {child > 1 ? "Children" : "Child"}
                    </Col>
                    <Col xs={6} md={6} className="d-flex justify-content-end">
                        IDR {formattedPrice(flightPrice * child)}
                    </Col>
                </Row>
            )}
            {baby > 0 && (
                <Row>
                    <Col xs={6} md={6}>
                        {baby} {baby > 1 ? "Babies" : "Baby"}
                    </Col>
                    <Col xs={6} md={6} className="d-flex justify-content-end">
                        IDR 0
                    </Col>
                </Row>
            )}
            <Row className="mb-3">
                <Col xs={6} md={6}>
                    Tax
                </Col>
                <Col xs={6} md={6} className="d-flex justify-content-end">
                    IDR {formattedPrice(tax)}
                </Col>
            </Row>

            <hr />
            <Row>
                <Col>
                    <strong style={{ fontSize: "1.2rem" }}>Total</strong>
                </Col>
                <Col
                    className="d-flex justify-content-end"
                    xs={6}
                    md={8}
                    style={{
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        color: "#7126b5",
                    }}
                >
                    IDR {formattedPrice(totalPrice + tax * (adult + child))}
                </Col>
            </Row>
        </>
    );
};

export default Price;
