import axios from "axios";
import { toast } from "react-toastify";

export const createBooking = (data) => async (dispatch, getState) => {
    const { user, token } = getState().auth;

    let config = {
        method: "post",
        url: `${import.meta.env.VITE_BACKEND_API}/api/v1/booking`,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify(data),
    };

    try {
        const response = await axios.request(config);
        const { data } = response.data;
        return data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
};

export const getBookingById = (bookingId) => async (_, getState) => {
    if (!bookingId) {
        return;
    }
    const authToken = getState().auth.token;

    try {
        const response = await axios.get(
            `${
                import.meta.env.VITE_BACKEND_API
            }/api/v1/booking/id/${bookingId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        const { data } = response.data;
        return data;
    } catch (e) {
        toast.error(e?.response?.data?.message);
    }
};

export const printTicket = (bookingId) => async (dispatch, getState) => {
    const { user, token } = getState().auth;

    let data = {
        email: user?.email,
        bookingId: bookingId,
    };

    let config = {
        method: "post",
        url: `${import.meta.env.VITE_BACKEND_API}/api/v1/booking/send-ticket`,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify(data),
    };

    try {
        const response = await axios.request(config);
        const { data } = response.data;
        return data;
    } catch (e) {
        toast.error(e?.response?.data?.message);
    }
};
