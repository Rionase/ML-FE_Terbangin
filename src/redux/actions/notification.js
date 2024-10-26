import axios from "axios";
import { toast } from "react-toastify";
import { setNotifications, setNotification } from "../reducers/notification";

export const getNotifications = () => async (dispatch, getState) => {
    const { token } = getState().auth;

    let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${import.meta.env.VITE_BACKEND_API}/api/v1/notification`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        const response = await axios.request(config);
        const { data } = response.data;
        dispatch(setNotifications(data));
        return data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
};
export const getNotificationByUserId =
    (userId) => async (dispatch, getState) => {
        const { token } = getState().auth;

        let config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `${
                import.meta.env.VITE_BACKEND_API
            }/api/v1/notification/user/${userId}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            dispatch(setNotifications([]));
            const response = await axios.request(config);
            const { data } = response?.data;
            if (data?.length > 0) {
                dispatch(setNotifications(data));
                return data;
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                dispatch(setNotifications([])); // Set empty array on 404
                return [];
            } else {
                toast.error(
                    error?.response?.data?.message ||
                        "Failed to fetch notifications"
                );
                throw error;
            }
        }
    };

export const readNotification = (id) => async (dispatch, getState) => {
    const { token } = getState().auth;

    let config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `${
            import.meta.env.VITE_BACKEND_API
        }/api/v1/notification/${id}/read`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        const response = await axios.request(config);
        const { data } = response.data;

        dispatch(setNotification(data));
        dispatch(getNotificationByUserId(data.userId));
    } catch (error) {
        toast.error(error.response.data.message);
    }
};
