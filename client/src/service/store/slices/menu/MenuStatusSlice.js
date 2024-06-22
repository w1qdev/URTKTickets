import { createSlice } from "@reduxjs/toolkit";
import { getMenuItemsByValue } from "../../../../helpers/utils";

const initialState = {
    currentTitle: "",
    data: [],
};

export const menuStatusSlice = createSlice({
    name: "menuStatus",
    initialState,
    reducers: {
        clearMenuStatuses: (state) => {
            state.currentTitle = "";
            state.data = [];
        },

        setMenuStatusCurrentTitle: (state, action) => {
            state.currentTitle = action.payload.currentTitle;
        },

        setMenuStatuses: (state, action) => {
            state.data = getMenuItemsByValue(
                action.payload.ticketsData,
                "state_id"
            );
        },
    },
});

export const getMenuStatuses = (state) => state.menuStatus;

// Action creators are generated for each case reducer function
export const { clearMenuStatuses, setMenuStatusCurrentTitle, setMenuStatuses } =
    menuStatusSlice.actions;

export default menuStatusSlice.reducer;
