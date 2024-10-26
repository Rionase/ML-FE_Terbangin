import { createSlice } from "@reduxjs/toolkit";

// initial state

const initialState = {
    historycards: [],
    historycard: [],
};

// define the slice
const historySlice = createSlice({
    name: "history",
    initialState,
    reducers: {
        setHistoryCards: (state, action) => {
            state.historycards = action.payload;
        },
        setHistoryCard: (state, action) => {
            state.historycard = action.payload;
        },
        resetHistoryState(state) {
            state.historycards = [];
            state.historycard = [];
        },
    },
});

// exoirt the setter function
export const { setHistoryCards, setHistoryCard, resetHistoryState } =
    historySlice.actions;

// export the reducer
export default historySlice.reducer;
