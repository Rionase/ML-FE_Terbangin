import axios from "axios";
import { toast } from "react-toastify";

export const updateSeat = (data, id) => async () => {
    let config = {
        method: "put",
        url: `${import.meta.env.VITE_BACKEND_API}/api/v1/seat/${id}`,
        headers: {
            "Content-Type": "application/json",
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

export const getSeatById = (id) => async () => {
    let config = {
        method: "get",
        url: `${import.meta.env.VITE_BACKEND_API}/api/v1/seat/id/${id}`,
        headers: {
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await axios.request(config);
        const { data } = response.data;
        return data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
};

export const getSeatByFlightId = (flightId) => async () => {
    let config = {
        method: "get",
        url: `${
            import.meta.env.VITE_BACKEND_API
        }/api/v1/seat/seat-with-flight-id/${flightId}`,
        headers: {
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await axios.request(config);
        const { data } = response.data;
        return data;
    } catch (error) {
        console.log(error?.response?.data?.message);
    }
};
