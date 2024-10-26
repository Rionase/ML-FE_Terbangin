import axios from "axios";
import { toast } from "react-toastify";
import { setHistoryCard, setHistoryCards } from "../reducers/history";

export const getHistoryCards = (value) => async (dispatch, getState) => {
    const { user, token } = getState().auth;
    value = value ?? "";

    try {
        const url = new URL(
            `${import.meta.env.VITE_BACKEND_API}/api/v1/helper-booking/user/${
                user.id
            }`
        );
        url.searchParams.append("value", value);

        const config = {
            method: "get",
            maxBodyLength: Infinity,
            url: url.toString(),
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };
        const response = await axios.request(config);

        const { data } = response.data;
        // console.log(data);
        dispatch(setHistoryCards(data));
    } catch (error) {
        switch (value) {
            case "ISSUED":
                dispatch(setHistoryCards([]));
                toast.info("Tidak ada riwayat penerbangan yang sudah dibayar");
                break;
            case "UNPAID":
                dispatch(setHistoryCards([]));
                toast.info("Tidak ada riwayat penerbangan yang belum terbayar");
                break;
            case "CANCELLED":
                dispatch(setHistoryCards([]));
                toast.info("Tidak ada riwayat penerbangan yang di cancel");
                break;
            default:
                dispatch(setHistoryCards([]));
            // toast.info(
            //     "Tidak ada riwayat penerbangan, silahkan pesan tiket terlebih dahulu"
            // );
        }
    }
};

export const getHistoryCardDetails =
    (bookingId) => async (dispatch, getState) => {
        const { token } = getState().auth;
        let config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `${
                import.meta.env.VITE_BACKEND_API
            }/api/v1/helper-booking/booking/${bookingId}`,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };

        try {
            const response = await axios.request(config);

            const { data } = response.data;
            dispatch(setHistoryCard(data));
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    };
