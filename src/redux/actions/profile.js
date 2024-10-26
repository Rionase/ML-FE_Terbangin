import axios from "axios";
import { toast } from "react-toastify";
import { getProfile } from "./auth";

export const getUserByEmail = (email) => async () => {
    let config = {
        method: "get",
        url: `${
            import.meta.env.VITE_BACKEND_API
        }/api/v1/profile/email/${email}`,
    };

    try {
        const response = await axios.request(config);
        const { data } = response.data;

        return data;
    } catch (error) {
        console.log(error);
    }
};

export const getUserByPhoneNumber = (phoneNumber) => async () => {
    let config = {
        method: "get",
        url: `${
            import.meta.env.VITE_BACKEND_API
        }/api/v1/profile/phone/${phoneNumber}`,
    };

    try {
        const response = await axios.request(config);
        const { data } = response.data;

        return data;
    } catch (error) {
        console.log(error);
    }
};

export const updateProfile =
    (navigate, fullName, picture, setLoading, setIsEditing) =>
    async (dispatch, getState) => {
        setLoading(true);
        const { user, token } = getState().auth;

        const form = new FormData();
        form.append("fullName", fullName);
        if (picture) {
            form.append("picture", picture);
        }

        let config = {
            method: "patch",
            maxBodyLength: Infinity,
            url: `${import.meta.env.VITE_BACKEND_API}/api/v1/profile/id/${
                user.id
            }`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: form,
        };

        try {
            await axios.request(config);

            toast.success("Profile updated successfully");
            dispatch(getProfile());
            navigate("/profile");
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
            setIsEditing(false);
        }
    };

export const updatePassword =
    (navigate, password, setLoading) => async (dispatch, getState) => {
        setLoading(true);
        const { user, token } = getState().auth;

        let form = new FormData();
        form.append("password", password);

        let config = {
            method: "patch",
            maxBodyLength: Infinity,
            url: `${import.meta.env.VITE_BACKEND_API}/api/v1/profile/id/${
                user.id
            }`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: form,
        };

        try {
            await axios.request(config);

            toast.success("Password updated successfully");
            navigate("/profile");
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

export const updateProfileEmailPhone =
    (navigate, email, phoneNumber, setLoading) =>
    async (dispatch, getState) => {
        setLoading(true);
        const { user, token } = getState().auth;
        let form = new FormData();

        if (email) {
            form.append("email", email);
        }
        if (phoneNumber) {
            form.append("phoneNumber", phoneNumber);
        }

        let config = {
            method: "patch",
            maxBodyLength: Infinity,
            url: `${import.meta.env.VITE_BACKEND_API}/api/v1/profile/id/${
                user.id
            }`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: form,
        };

        try {
            const response = await axios.request(config);
            const { data } = response.data;

            toast.success(data.message, {
                position: "top-center",
            });
            navigate("/profile");
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };
