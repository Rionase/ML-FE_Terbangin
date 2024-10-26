import { createSlice } from "@reduxjs/toolkit";

// Define the initial state
const initialState = {
  notifications: [],
  notification: null,
};

// Define the slice
const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
  },
});

// export the setter funtion
export const { setNotifications, setNotification } = notificationSlice.actions;

// export the reducer
export default notificationSlice.reducer;
