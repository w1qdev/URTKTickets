import { createSlice } from "@reduxjs/toolkit";
import {
    getMenuItemsByValue,
    mapPrioritiesAndChangeState,
} from "../../../../helpers/utils";

const initialState = {
    currentTitle: "",
    data: [],
};

export const menuPrioritySlice = createSlice({
    name: "menuPriority",
    initialState,
    reducers: {
        clearMenuPriorities: (state) => {
            state.currentTitle = "";
            state.data = [];
        },

        setMenuPriorityCurrentTitle: (state, action) => {
            state.currentTitle = action.payload.currentTitle;
        },

        setMenuPriorities: (state, action) => {
            state.data = mapPrioritiesAndChangeState(
                getMenuItemsByValue(action.payload.ticketsData, "priority_id")
            );
        },
    },
});

export const getMenuPriorities = (state) => state.menuPriority;

// Action creators are generated for each case reducer function
export const {
    clearMenuPriorities,
    setMenuPriorityCurrentTitle,
    setMenuPriorities,
} = menuPrioritySlice.actions;

export default menuPrioritySlice.reducer;
