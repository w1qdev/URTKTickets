import { createSlice } from "@reduxjs/toolkit";
import { getMenuItemsByValue } from "../../../helpers/utils";

const initialState = {
    currentTitle: "",
    data: [],
};

export const menuLocationSlice = createSlice({
    name: "menuLocation",
    initialState,
    reducers: {
        clearMenuLocations: (state) => {
            state.currentTitle = "";
            state.data = [];
        },

        setMenuLocationCurrentTitle: (state, action) => {
            state.currentTitle = action.payload.currentTitle;
        },

        setMenuLocations: (state, action) => {
            state.data = getMenuItemsByValue(
                action.payload.ticketsData,
                "room_number"
            );
        },
    },
});

export const getMenuLocations = (state) => state.menuLocation;

// Action creators are generated for each case reducer function
export const {
    clearMenuLocations,
    setMenuLocationCurrentTitle,
    setMenuLocations,
} = menuLocationSlice.actions;

export default menuLocationSlice.reducer;
