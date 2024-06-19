import { configureStore } from "@reduxjs/toolkit";
import MenuDateReducer from "./slices/MenuDateSlice";

export const store = configureStore({
    reducer: {
        menuDate: MenuDateReducer,
    },
});
