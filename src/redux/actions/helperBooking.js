import axios from "axios";
import { toast } from "react-toastify";

export const createHelperBooking =
    (dataArray) => async (dispatch, getState) => {
        const { user, token } = getState().auth;

        let config = {
            method: "post",
            url: `${import.meta.env.VITE_BACKEND_API}/api/v1/helper-booking`,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const createdHelperBookings = [];

            for (const helperBooking of dataArray) {
                const response = await axios.request({
                    ...config,
                    data: JSON.stringify(helperBooking),
                });
                const { data } = response.data;
                createdHelperBookings.push(data);
            }

            return createdHelperBookings;
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    };
