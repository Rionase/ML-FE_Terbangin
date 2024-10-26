import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";

export const createPassanger =
    (passangerData) => async (dispatch, getState) => {
        const { user, token } = getState().auth;

        const userId = user.id;

        const mapPassangerData = (type, passangers) => {
            return passangers.map((passanger, index) => {
                let fullName = passanger.fullName;
                let birthDate = passanger.dateOfBirth;
                let identityId = passanger.idNumber;
                let identityIdExpired = passanger.expiryDate;
                let title = passanger.title;
                let nationality = passanger.nationality;
                let issuingCountry = passanger.issuingCountry;

                if (type === "BABY") {
                    fullName = `Baby ${index + 1}`;
                    birthDate = moment().format("YYYY-MM-DD");
                    identityId = `BABY-${moment().valueOf()}`;
                    title = "MR";
                    nationality = "Earth";
                    issuingCountry = "Earth";
                }

                if (identityIdExpired === "") {
                    identityIdExpired = null;
                }

                return {
                    userId: userId,
                    type: type,
                    title,
                    fullName,
                    familyName: passanger.familyName || null,
                    birthDate,
                    nationality,
                    identityId,
                    issuingCountry,
                    identityIdExpired,
                };
            });
        };

        const allPassangers = [
            ...mapPassangerData("ADULT", passangerData.adult),
            ...mapPassangerData("CHILD", passangerData.child),
            ...mapPassangerData("BABY", passangerData.baby),
        ];

        const config = {
            method: "post",
            url: `${import.meta.env.VITE_BACKEND_API}/api/v1/passanger`,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        const createdPassangers = [];

        try {
            for (const passanger of allPassangers) {
                const response = await axios.request({
                    ...config,
                    data: JSON.stringify(passanger),
                });
                const { data } = response.data;
                createdPassangers.push(data);
            }

            return createdPassangers;
        } catch (error) {
            console.log(error);
            toast.error(
                error?.response?.data?.message ||
                    "Terjadi kesalahan saat menambahkan penumpang."
            );
        }
    };
