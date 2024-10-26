import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getProfile } from "../../redux/actions/auth";
import Player from "react-lottie-player";
import loadingAnimation from "../../assets/LottieFiles/Animation-airplaneloading.json";
import TopLoadingBar from "react-top-loading-bar";

const NonProtected = ({ children }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const loadingBarRef = useRef(null);

    useEffect(() => {
        dispatch(getProfile(navigate, "/", null));
    }, [dispatch, navigate]);

    useEffect(() => {
        const handleBeforeUnload = () => {
            localStorage.removeItem("hasLoaded");
            localStorage.removeItem("flightData");
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("unload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("unload", handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        const hasLoaded = localStorage.getItem("hasLoaded");
        if (!hasLoaded) {
            loadingBarRef.current.continuousStart();

            const timeout1 = setTimeout(() => {
                loadingBarRef.current.continuousStart();
            }, 1000);

            const timeout2 = setTimeout(() => {
                loadingBarRef.current.continuousStart();
            }, 2000);

            const timeout3 = setTimeout(() => {
                loadingBarRef.current.complete();
                setIsLoading(false);
                localStorage.setItem("hasLoaded", "true");
            }, 3000);

            return () => {
                clearTimeout(timeout1);
                clearTimeout(timeout2);
                clearTimeout(timeout3);
            };
        } else {
            setIsLoading(false);
        }
    }, []);

    const waveText = (text) => {
        return text.split("").map((char, index) => (
            <span key={index} style={{ animationDelay: `${index * 0.08}s` }}>
                {char} &nbsp;
            </span>
        ));
    };

    return (
        <>
            <TopLoadingBar color="#7126B5" ref={loadingBarRef} />
            {isLoading ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "80vh",
                    }}
                >
                    <Player
                        play
                        loop
                        animationData={loadingAnimation}
                        style={{
                            height: "40vh",
                            width: "80vw",
                            marginBottom: "1rem",
                        }}
                    />
                    <h1
                        style={{
                            color: "#7126B5",
                            display: "inline-block",
                            fontSize: "2rem",
                        }}
                    >
                        {waveText("T e r b a n g i n . . .")}
                    </h1>
                </div>
            ) : (
                children
            )}
            <style>
                {`
                     @keyframes wave {
                        0%, 100% {
                            transform: translateY(0);
                        }
                        50% {
                            transform: translateY(-8px);
                        }
                    }
                    h1 span {
                        display: inline-block;
                        animation: wave 1s infinite;
                    }
                `}
            </style>
        </>
    );
};

export default NonProtected;
