import axios from "axios";
import { toast } from "react-toastify";

// mendapatkan snap token dan link dari BE
export const generateSnapPayment = (payload) => async (_, getState) => {
    const { totalPrice } = payload;

    if (!totalPrice) {
        return;
    }
    const authToken = getState().auth.token;

    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_API}/api/v1/payment/`,
            JSON.stringify({ totalPrice }),
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            }
        );
        const { data } = response.data;
        // console.log(data);

        return data;
    } catch (e) {
        removeSnapData();
        toast.error(e?.response?.data?.message);
    }
};

// export const updatePayment = (navigate, payload) => async (dispatch, getState) => {
//     const { transaction_id: paymentId, pdf_url: pdfLink } = payload;
//     console.log("ini jalan 1");

//     if (!paymentId) {
//         toast.error("Payment ID must not be empty!");
//         return;
//     }
//     const authToken = getState().auth.token;

//     try {
//         console.log("ini jalan 2");
//         console.log(paymentId);
//         await axios.patch(
//             `${
//                 import.meta.env.VITE_BACKEND_API
//             }/api/v1/payment/id/${paymentId}`,
//             JSON.stringify(payload),
//             {
//                 headers: {
//                     Authorization: `Bearer ${authToken}`,
//                     "Content-Type": "application/json",
//                 },
//             }
//         );
//         console.log("ini jalan 3");
//         if (pdfLink) {
//             dispatch(paymentReducer.setPdfLink(pdfLink));
//         }
//         navigate("/payment-success");
//     } catch (e) {
//         console.log("ini jalan error");
//         toast.error(e?.response?.data?.message);
//     }
// };

const removeSnapData = () => (dispatch) => {
    dispatch(paymentReducer.setSnapToken(null));
    dispatch(paymentReducer.setSnapLink(null));
};
