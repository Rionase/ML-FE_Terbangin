import axios from "axios";
import { toast } from "react-toastify";

export const getDestinations = () => async () => {
    let config = {
        method: "get",
        url: `${import.meta.env.VITE_BACKEND_API}/api/v1/airport`,
        headers: {
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await axios.request(config);

        const { data } = response.data;
        // console.log(data);
        return data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
};
