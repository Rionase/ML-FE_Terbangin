import React, { useState, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";

import airplane1 from "../../assets/Image.png";

const Booking = () => {
  const [status, setStatus] = useState("return");
  const [flagIdDeparture, setFlagIdDeparture] = useState(
    "f7bd7a46-246a-4dc0-a2e1-3889d7ad9b16"
  );
  const [flagIdReturn, setFlagIdReturn] = useState(null);

  return (
    <Container>
      <Row
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          position: "absolute",
          top: "248px",
          left: "826px",
          borderRadius: "8px",
          width: "450px",
          alignItems: "flex-start",
          padding: "36px",
          boxSizing: "border-box",
          fontSize: "var(--body-14-medium-size)",
          color: "var(--neutral-05)",
        }}
      >
        <section
          style={{
            border: "solid 0.5px #DCDCDC",
            borderRadius: "10px",
            boxShadow: " 1px 0 10px 2px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Col>
            <Col className="my-2">
              <b>Detail Penerbangan</b>
            </Col>
            {/* Untuk Return  (43-45)*/}
            {flagIdReturn !== null && (
              <Col className="my-2">
                <b>Pergi</b>
              </Col>
            )}
            {/* Bagian 1 (Keberangkatan) */}
            <Col
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div className="md-2">
                <b>07:00</b>
                <p>3 Maret 2023</p>
              </div>
              <div className="md-2">
                <b style={{ color: "#a06ece" }}>Keberangkatan</b>
              </div>
            </Col>
            <p style={{ fontWeight: "500" }}>
              Soekarno Hatta - Terminal 1A Domestik
            </p>
          </Col>
          {/* Bagian 2 (Maskapai) */}
          <Col className="mt-1">
            <Col
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <span className="p-2">
                <img src={airplane1} alt="airplane1" />
              </span>
              <Col>
                <div>
                  <b>Jet Air - Economy</b>
                </div>
                <div>
                  <b>JT - 203</b>
                </div>
                <br />
                <div>
                  <b>Informasi:</b>
                </div>
                <div>Baggage 20 kg</div>
                <div>Cabin baggage 7 kg</div>
                <p>In Flight Entertainment</p>
              </Col>
            </Col>
          </Col>
          {/* Bagian 3 (Kedatangan) */}
          <Col
            className="mt-1"
            style={{
              borderBottomStyle: "ridge",
              borderWidth: "2px",
            }}
          >
            <Col
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div className="md-2">
                <b>11:00</b>
                <p>3 Maret 2023</p>
              </div>
              <div className="md-2">
                <b style={{ color: "#a06ece" }}>Kedatangan</b>
              </div>
            </Col>
            <p style={{ fontWeight: "500" }}>Melbourne International Airport</p>
          </Col>
          {/* Untuk return (114-189) */}
          {flagIdReturn !== null && (
            <Container>
              <Col>
                <Col className="my-2">
                  <b>Pulang</b>
                </Col>
                <Col
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div className="md-2">
                    <b>07:00</b>
                    <p>5 Maret 2023</p>
                  </div>
                  <div className="md-2">
                    <b style={{ color: "#a06ece" }}>Keberangkatan</b>
                  </div>
                </Col>
                <p style={{ fontWeight: "500" }}>
                  Melbourne International Airport
                </p>
              </Col>
              <Col className="mt-1">
                <Col
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <span className="p-2">
                    <img src={airplane1} alt="airplane1" />
                  </span>
                  <Col>
                    <div>
                      <b>Jet Air - Economy</b>
                    </div>
                    <div>
                      <b>JT - 203</b>
                    </div>
                    <br />
                    <div>
                      <b>Informasi:</b>
                    </div>
                    <div>Baggage 20 kg</div>
                    <div>Cabin baggage 7 kg</div>
                    <p>In Flight Entertainment</p>
                  </Col>
                </Col>
              </Col>
              <Col
                className="mt-1"
                style={{
                  borderBottomStyle: "ridge",
                  borderWidth: "2px",
                }}
              >
                <Col
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div className="md-2">
                    <b>11:00</b>
                    <p>5 Maret 2023</p>
                  </div>
                  <div className="md-2">
                    <b style={{ color: "#a06ece" }}>Kedatangan</b>
                  </div>
                </Col>
                <p style={{ fontWeight: "500" }}>
                  Soekarno Hatta - Terminal 1A Domestik
                </p>
              </Col>
            </Container>
          )}
          {/* Bagian 4 (Harga) */}
          <Col
            className="mt-1"
            style={{
              borderBottomStyle: "ridge",
              borderWidth: "2px",
            }}
          >
            <div className="listItem5">
              <div className="text">
                <div className="label46">
                  <b className="rincianBayar">Rincian Harga</b>
                </div>
              </div>
            </div>
            <Row
              className="my-1"
              style={{
                display: "flex",
                flexDirection: "Row",
              }}
            >
              <Col>
                <div>2 Adults</div>
              </Col>
              <Col style={{ display: "flex", flexDirection: "row-reverse" }}>
                <div>IDR 9.550.000</div>
              </Col>
            </Row>
            <Row
              className="my-1"
              style={{
                display: "flex",
                flexDirection: "Row",
              }}
            >
              <Col>
                <div>1 Baby</div>
              </Col>
              <Col style={{ display: "flex", flexDirection: "row-reverse" }}>
                <div>IDR 0</div>
              </Col>
            </Row>
            <Row
              className="my-1"
              style={{
                display: "flex",
                flexDirection: "Row",
              }}
            >
              <Col>
                <div>Tax</div>
              </Col>
              <Col style={{ display: "flex", flexDirection: "row-reverse" }}>
                <div>IDR 300.000</div>
              </Col>
            </Row>
          </Col>
          {/* Total */}
          <Row
            className="my-1"
            style={{
              display: "flex",
              flexDirection: "Row",
            }}
          >
            <Col>
              <b>Total</b>
            </Col>
            <Col style={{ display: "flex", flexDirection: "row-reverse" }}>
              <b style={{ color: "#7126b5" }}>IDR 9.850.000</b>
            </Col>
          </Row>
        </section>
      </Row>
    </Container>
  );
};

export default Booking;
