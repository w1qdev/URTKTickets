import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isShowCompletedTickets: true,
};

export const settingsTicketsSlice = createSlice({
    name: "settingsTickets",
    initialState,
    reducers: {
        switchIsShowDoneTickets: (state) => {
            state.isShowCompletedTickets = !state.isShowCompletedTickets;
        },
    },
});

export const getIsShowCompletedTickets = (state) =>
    state.settingsTickets.isShowCompletedTickets;

export const { switchIsShowDoneTickets } = settingsTicketsSlice.actions;
export default settingsTicketsSlice.reducer;
