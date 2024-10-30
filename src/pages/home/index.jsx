import { useState, useEffect, useRef } from "react";
import { Button, Card, Row, Col, Container } from "react-bootstrap";
import FormArea from "../../components/FormArea";
import { useNavigate } from "react-router-dom";
import Banner from "../../components/Banner";
import "bootstrap/dist/css/bootstrap.min.css";
import initialSearchImage from "../../assets/Cards/b_search.png";
import clickedSearchImage from "../../assets/Cards/w_search.png";
import PropTypes from "prop-types";
import {
  getFlightByContinent,
  getFlightRecomendation,
} from "../../redux/actions/flight";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment-timezone";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Home = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isFullScreen, setIsFullScreen] = useState(window.innerWidth > 1160);
  const [flightDataUser, setFlightDataUser] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsFullScreen(window.innerWidth > 1160);
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value based on the current window size
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const flightData = localStorage.getItem("flightData");
    if (flightData) {
      const parsedData = JSON.parse(flightData);
      setFlightDataUser(parsedData);
    }
  }, []);

  return (
    <>
      {!isMobile && <Banner />}
      {/* search bar */}

      <FormArea
        isFullScreen={isFullScreen}
        isMobile={isMobile}
        title={
          <>
            Pilih Jadwal Penerbangan spesial di{" "}
            <span style={{ color: "#7126B5" }}>TerbangIn!</span>
          </>
        }
        flightDataUser={flightDataUser}
      />

      <DestinationFavorit isFullScreen={isFullScreen} />
    </>
  );
};

const DestinationFavorit = ({ isFullScreen }) => {
  const dispatch = useDispatch();
  const [activeButton, setActiveButton] = useState(1);
  const [sortContinent, setSortContinent] = useState("Asia");
  const { flights } = useSelector((state) => state.flight);
  const navigate = useNavigate();
  const [loadingImages, setLoadingImages] = useState({});
  const [page, setPage] = useState(0);

  const getButtonStyle = (buttonId) => {
    return {
      backgroundColor: activeButton === buttonId ? "#7126b5" : "#e2d4f0",
      color: activeButton === buttonId ? "white" : "black",
      borderColor: activeButton === buttonId ? "#7126b5" : "#e2d4f0",
    };
  };
  const formatCurrency = (amount) => {
    return amount
      .toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
      .replace("Rp", "");
  };
  const getSourceImages = (buttonId) => {
    return activeButton === buttonId ? clickedSearchImage : initialSearchImage;
  };

  const handleClick = (buttonId, value) => {
    setActiveButton(buttonId);
    setSortContinent(value);
    // setLoadingImages({});
  };

  const getDatePlus30Days = () => {
    const today = new Date();
    const resultDate = new Date(today);
    resultDate.setDate(today.getDate() + 3);
    return resultDate.toISOString().split("T")[0]; // Format YYYY-MM-DD
  };

  const navigateToFindTicket = (flight) => {
    navigate("/find-ticket", {
      state: {
        flightType: "One Way", // Assuming one-way flight type
        departure: flight.StartAirport.city,
        iataCodeDeparture: flight.StartAirport.iataCode,
        arrival: flight.EndAirport.city,
        iataCodeArrival: flight.EndAirport.iataCode,
        departureDate: moment
          .tz(flight.departureAt, flight.StartAirport.timezone)
          .format("YYYY-MM-DD"), // Format as needed
        returnDate: null,
        seatType: "Economy",
        capacity: 1,
        adult: 1,
        child: 0,
        baby: 0,
      },
    });
  };

  const handleImageLoad = (id) => {
    setLoadingImages((prevState) => ({ ...prevState, [id]: true }));
  };

  const handlePreviousClick = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNextClick = () => {
    if (flights.length == 8) {
      setPage(page + 1);
    }
  };

  // useEffect(() => {
  //     if (sortContinent !== null) {
  //         const datePlus30Days = getDatePlus30Days();
  //         // console.log(
  //         //     "Dispatching getFlightByContinent with date:",
  //         //     datePlus30Days,
  //         //     "and continent:",
  //         //     sortContinent
  //         // );
  //         dispatch(getFlightByContinent(datePlus30Days, sortContinent)).catch(
  //             (error) => {
  //                 console.error("Error fetching flights:", error);
  //             }
  //         );
  //     }
  // }, [dispatch, sortContinent]);

  useEffect(() => {
    dispatch(getFlightRecomendation(page)).catch((error) => {
      console.error("Error fetching flights:", error);
    });
  }, [page]);

  return (
    <Container>
      <Row
        className="my-3"
        style={{ margin: isFullScreen ? "0px 120px" : "0px 0px" }}
      >
        <h4> Rekomendasi Penerbangan</h4>
      </Row>
      <Row style={{ margin: isFullScreen ? "0px 120px" : "0px 0px" }}>
        {flights.map((flight) => (
          <Col key={flight.id} md={3} sm={6} xs={6} className="mb-3">
            <Card
              onClick={() => navigateToFindTicket(flight)}
              style={{
                cursor: "pointer",
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {!loadingImages[flight.id] && (
                <Skeleton height={200} style={{ width: "100%" }} />
              )}
              <Card.Img
                key={flight.id}
                src={`/Foto Airport/${flight.EndAirport.picture}`}
                alt="End Airport"
                // loading="lazy"
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  display: loadingImages[flight.id] ? "block" : "none",
                  backgroundColor: "#f0f0f0",
                }}
                onLoad={() => handleImageLoad(flight.id)}
              />
              <Card.Body style={{ flex: "1 1 auto" }}>
                <TextWithTooltip
                  text={`${flight.StartAirport.city} → ${flight.EndAirport.city}`}
                />
                <TextWithTooltip
                  text={flight.Airline.name}
                  style={{
                    color: "#7126b5",
                    fontWeight: "900",
                  }}
                />
                <p style={{ margin: 0 }}>
                  {moment
                    .tz(flight.departureAt, flight.StartAirport.timezone)
                    .format("DD MMMM yyyy")}
                </p>
                <p>
                  Mulai dari
                  <span
                    style={{
                      color: "red",
                      margin: 0,
                      fontWeight: 700,
                    }}
                  >
                    {formatCurrency(flight.priceEconomy)}
                  </span>
                </p>
              </Card.Body>
            </Card>
          </Col>
        ))}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            marginTop: "20px",
            marginBottom: "50px",
          }}
        >
          <button
            disabled={page === 0}
            onClick={handlePreviousClick}
            style={{
              backgroundColor: page === 0 ? "#D3D3D3" : "#6A0DAD",
              color: page === 0 ? "#A9A9A9" : "#FFF",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: page === 0 ? "not-allowed" : "pointer",
              transition: "background-color 0.3s",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Previous
          </button>
          <button
            disabled={flights.length < 8}
            onClick={handleNextClick}
            style={{
              backgroundColor: flights.length < 8 ? "#D3D3D3" : "#6A0DAD",
              color: flights.length < 8 ? "#A9A9A9" : "#FFF",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: flights.length < 8 ? "not-allowed" : "pointer",
              transition: "background-color 0.3s",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Next
          </button>
        </div>
      </Row>
    </Container>
  );
};

const TextWithTooltip = ({ text }) => {
  const textRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const isTextOverflowing = (element) => {
    return element.offsetWidth < element.scrollWidth;
  };

  useEffect(() => {
    if (textRef.current) {
      setIsOverflowing(isTextOverflowing(textRef.current));
    }
  }, [text]);

  return (
    <Tippy content={text} disabled={!isOverflowing}>
      <p
        ref={textRef}
        style={{
          margin: 0,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {text}
      </p>
    </Tippy>
  );
};

DestinationFavorit.propTypes = {
  isFullScreen: PropTypes.bool.isRequired,
};

export default Home;
