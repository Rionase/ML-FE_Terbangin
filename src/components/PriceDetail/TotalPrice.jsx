import { useEffect } from "react";
import { Row, Col } from "react-bootstrap";

const TotalPrice = ({
    departureTotalPrice,
    returnTotalPrice,
    setTotalPrice,
}) => {
    const totalPrice = departureTotalPrice + returnTotalPrice;

    const formattedPrice = (price) => {
        return price.toLocaleString("id-ID");
    };

    useEffect(() => {
        setTotalPrice(totalPrice);
    }, [totalPrice, setTotalPrice]);

    return (
        <>
            <br />
            <hr />
            <Row style={{ borderBottom: "2px solid black" }}>
                <Col>
                    <b style={{ fontSize: "1.2rem" }}>Total Harga</b>
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
                    IDR {formattedPrice(totalPrice)}
                </Col>
            </Row>
        </>
    );
};

export default TotalPrice;
