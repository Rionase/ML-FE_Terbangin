import axios from "axios";
import { toast } from "react-toastify";
import { register } from "./auth";
import { updateProfileEmailPhone } from "./profile";

export const generateOTP =
    (navigate, name, email, phoneNumber, password, picture, setLoading) =>
    async () => {
        setLoading(true);

        let data = JSON.stringify({
            email,
        });

        let config = {
            method: "post",
            url: `${
                import.meta.env.VITE_BACKEND_API
            }/api/v1/verification/generate-otp-email`,
            headers: {
                "Content-Type": "application/json",
            },
            data,
        };

        try {
            const response = await axios.request(config);

            const { data } = response.data;
            // console.log(data);
            toast.success(response.data.message, {
                position: "top-center",
            });
            navigate("/verification", {
                state: {
                    name,
                    email,
                    phoneNumber,
                    password,
                    picture,
                },
            });
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

export const generateOTPProfile =
    (navigate, email, phoneNumber, setLoading) => async () => {
        setLoading(true);

        let data;
        let config;

        if (email && !phoneNumber) {
            data = JSON.stringify({
                email,
            });

            config = {
                method: "post",
                url: `${
                    import.meta.env.VITE_BACKEND_API
                }/api/v1/verification/generate-otp-email`,
                headers: {
                    "Content-Type": "application/json",
                },
                data,
            };
        } else if (phoneNumber && !email) {
            // data = JSON.stringify({
            //     phoneNumber,
            // });

            // config = {
            //     method: "post",
            //     url: `${
            //         import.meta.env.VITE_BACKEND_API
            //     }/api/v1/verification/generate-otp-sms`,
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     data,
            // };
        }

        try {
            const response = await axios.request(config);

            const { data } = response.data;
            // console.log(data);
            toast.success(response.data.message, {
                position: "top-center",
            });
            navigate("/verification-profile", {
                state: {
                    email,
                    phoneNumber,
                },
            });
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

export const verifyOTP =
    (navigate, name, email, phoneNumber, password, picture, otp, setLoading) =>
    async (dispatch) => {
        setLoading(true);

        let data = JSON.stringify({
            email,
            otp,
        });

        let config = {
            method: "post",
            url: `${
                import.meta.env.VITE_BACKEND_API
            }/api/v1/verification/verify-otp`,
            headers: {
                "Content-Type": "application/json",
            },
            data,
        };

        try {
            const response = await axios.request(config);

            const { message } = response.data;

            toast.success(message, {
                position: "top-center",
            });
            dispatch(
                register(
                    navigate,
                    name,
                    email,
                    phoneNumber,
                    password,
                    picture,
                    setLoading
                )
            );
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

export const verifyOTPProfile =
    (navigate, email, phoneNumber, otp, setLoading) => async (dispatch) => {
        setLoading(true);
        let data;

        if (email) {
            data = JSON.stringify({
                email,
                otp,
            });
        } else if (phoneNumber) {
            data = JSON.stringify({
                phoneNumber,
                otp,
            });
        }

        let config = {
            method: "post",
            url: `${
                import.meta.env.VITE_BACKEND_API
            }/api/v1/verification/verify-otp`,
            headers: {
                "Content-Type": "application/json",
            },
            data,
        };

        try {
            const response = await axios.request(config);
            const { data } = response.data;
            // console.log(data);

            toast.success("Verification success. Updating profile...", {
                position: "top-center",
            });

            dispatch(
                updateProfileEmailPhone(
                    navigate,
                    email,
                    phoneNumber,
                    setLoading
                )
            );
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

export const generateLink = (email, setLoading) => async () => {
    setLoading(true);

    let data = JSON.stringify({
        email,
    });

    let config = {
        method: "post",
        url: `${
            import.meta.env.VITE_BACKEND_API
        }/api/v1/verification/generate-link`,
        headers: {
            "Content-Type": "application/json",
        },
        data,
    };

    try {
        const response = await axios.request(config);
        // console.log(response.data);
        toast.success(response.data.message, {
            position: "top-center",
        });
    } catch (error) {
        toast.error(error?.response?.data?.message);
    } finally {
        setLoading(false);
    }
};

export const verifyLink = (navigate, token) => async () => {
    let config = {
        method: "get",
        url: `${
            import.meta.env.VITE_BACKEND_API
        }/api/v1/verification/verify-link?token=${token}`,
        headers: {
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await axios.request(config);
        const { data } = response.data;
        // console.log(data);
        navigate("/forget-password", {
            state: {
                id: data.id,
                token,
            },
        });
        toast.success(data.message, {
            position: "top-center",
        });
    } catch (error) {
        navigate("/login");
        toast.error(error?.response?.data?.message);
    }
};

export const updateForgetPasswordUser =
    (navigate, token, newPassword, userId, setLoading) => async () => {
        setLoading(true);

        let data = JSON.stringify({
            token,
            newPassword,
            userId,
        });

        let config = {
            method: "patch",
            url: `${
                import.meta.env.VITE_BACKEND_API
            }/api/v1/verification/update-password`,
            headers: {
                "Content-Type": "application/json",
            },
            data,
        };

        try {
            const response = await axios.request(config);

            const { data } = response.data;
            // console.log(data);

            // console.log("id: ", userId, "\nnewPassword: ", newPassword);

            navigate("/login");

            toast.success(
                "Your password has been updated successfully. Please login."
            );
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };
