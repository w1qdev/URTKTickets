import { configureStore } from "@reduxjs/toolkit";
import MenuDateReducer from "./slices/MenuDateSlice";
import MenuLocationReducer from "./slices/MenuLocationSlice";

export const store = configureStore({
    reducer: {
        menuDate: MenuDateReducer,
        menuLocation: MenuLocationReducer,
    },
});
