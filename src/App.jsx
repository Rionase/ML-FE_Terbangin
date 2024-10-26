import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";
import store from "./redux/store";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import Navbar from "./components/Navbar";
import Home from "./pages/home";
import LoginPage from "./pages/login/login";
import RegisterPage from "./pages/register/register";
import ForgetPassword from "./pages/forgetPassword/forgetPassword";
import Profile from "./pages/profile/profile";
import OtpVerification from "./pages/otp/otpVerification";
import OtpVerificationProfile from "./pages/otp/otpUpdateProfile";
import RequestResetPassword from "./pages/requestResetPassword/requestResetPassword";
import VerificationLink from "./pages/verificationLink/verificationLink";
import FindTicket from "./pages/findTicket";
import OrderHistoryPages from "./pages/orderHistory";
import BookingForm from "./pages/checkout/index";
import Payment from "./pages/payment";
import NotificationPage from "./pages/notification";
import PaymentSuccess from "./pages/payment/success";
import NotFoundPage from "./pages/notfound";

import ProtectedVerification from "./components/ProtectedVerification/ProtectedVerification";
import ProtectedVerificationProfile from "./components/ProtectedVerification/ProtectedVerificationProfile";
import ProtectedForgetPassword from "./components/ProtectedForgetPassword/ProtectedForgetPassword";
import ProtectedFilterTicket from "./components/ProtectedFilterTicket/ProtectedVerification";
import ProtectedBooking from "./components/ProtectedBooking";
import Protected from "./components/Protected";
import NonProtected from "./components/NonProtected";
import ProtectedPayment from "./components/ProtectedPayment";
import ProtectedPaymentSuccess from "./components/ProtectedPaymentSuccess";
import NotificationHandler from "./components/NotificationRealTime";
import { SocketProvider } from "./components/SocketContext";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <NonProtected>
                <Navbar />
                <Home />
            </NonProtected>
        ),
    },
    {
        path: "/login",
        element: (
            <NonProtected>
                <LoginPage />
            </NonProtected>
        ),
    },
    {
        path: "/register",
        element: (
            <NonProtected>
                <RegisterPage />
            </NonProtected>
        ),
    },

    {
        path: "/profile",
        element: (
            <Protected>
                <Navbar />
                <Profile />
            </Protected>
        ),
    },
    {
        path: "/verification",
        element: (
            <ProtectedVerification>
                <OtpVerification />
            </ProtectedVerification>
        ),
    },
    {
        path: "/verification-profile",
        element: (
            <ProtectedVerificationProfile>
                <OtpVerificationProfile />
            </ProtectedVerificationProfile>
        ),
    },
    {
        path: "/request-reset-password",
        element: (
            <NonProtected>
                <RequestResetPassword />,
            </NonProtected>
        ),
    },
    {
        path: "/verify-link",
        element: (
            <NonProtected>
                <VerificationLink />,
            </NonProtected>
        ),
    },
    {
        path: "/forget-password",
        element: (
            <ProtectedForgetPassword>
                <ForgetPassword />
            </ProtectedForgetPassword>
        ),
    },
    {
        path: "/find-ticket",
        element: (
            <ProtectedFilterTicket>
                <Navbar />
                <FindTicket />
            </ProtectedFilterTicket>
        ),
    },
    {
        path: "/order-history",
        element: (
            <>
                <Protected>
                    <Navbar />
                    <OrderHistoryPages />
                </Protected>
            </>
        ),
    },
    {
        path: "/booking",
        element: (
            <ProtectedBooking>
                <Navbar />
                <BookingForm />
            </ProtectedBooking>
        ),
    },
    {
        path: "/payment",
        element: (
            <>
                <ProtectedPayment>
                    <Navbar />
                    <Payment />
                </ProtectedPayment>
            </>
        ),
    },
    {
        path: "/notification",
        element: (
            <>
                <Protected>
                    <Navbar />
                    <NotificationPage />
                </Protected>
            </>
        ),
    },
    {
        path: "/payment-success",
        element: (
            <>
                <ProtectedPaymentSuccess>
                    <Navbar />
                    <PaymentSuccess />
                </ProtectedPaymentSuccess>
            </>
        ),
    },
    {
        path: "/not-found",
        element: (
            <>
                <Navbar />
                <NotFoundPage />
            </>
        ),
    },
]);

function App() {
    return (
        <Provider store={store}>
            <SocketProvider>
                <GoogleOAuthProvider
                    clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                >
                    <RouterProvider router={router} />
                    <NotificationHandler />
                    <ToastContainer theme="colored" />
                </GoogleOAuthProvider>
            </SocketProvider>
        </Provider>
    );
}

export default App;
