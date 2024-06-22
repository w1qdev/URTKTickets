import { createSlice } from "@reduxjs/toolkit";
import { getMenuItemsByValue } from "../../../../helpers/utils";

const initialState = {
    currentTitle: "",
    data: [],
};

export const menuDateSlice = createSlice({
    name: "menuDate",
    initialState,
    reducers: {
        clearMenuDates: (state) => {
            state.currentTitle = "";
            state.data = [];
        },

        setMenuDateCurrentTitle: (state, action) => {
            state.currentTitle = action.payload.currentTitle;
        },

        setMenuDates: (state, action) => {
            state.data = getMenuItemsByValue(
                action.payload.ticketsData,
                "submission_date"
            );
        },
    },
});

export const getMenuDates = (state) => state.menuDate;

// Action creators are generated for each case reducer function
export const { clearMenuDates, setMenuDateCurrentTitle, setMenuDates } =
    menuDateSlice.actions;

export default menuDateSlice.reducer;
