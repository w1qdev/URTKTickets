import { createSlice } from "@reduxjs/toolkit";
import { getMenuItemsByValue } from "../../../helpers/utils";

const initialState = {
    currentTitle: "",
    data: [],
};

export const menuCustomerSlice = createSlice({
    name: "menuCustomer",
    initialState,
    reducers: {
        clearMenuCustomers: (state) => {
            state.currentTitle = "";
            state.data = [];
        },

        setMenuCustomerCurrentTitle: (state, action) => {
            state.currentTitle = action.payload.currentTitle;
        },

        setMenuCustomers: (state, action) => {
            state.data = getMenuItemsByValue(
                action.payload.ticketsData,
                "customer_name"
            );
        },
    },
});

export const getMenuCustomers = (state) => state.menuCustomer;

// Action creators are generated for each case reducer function
export const {
    clearMenuCustomers,
    setMenuCustomerCurrentTitle,
    setMenuCustomers,
} = menuCustomerSlice.actions;

export default menuCustomerSlice.reducer;
