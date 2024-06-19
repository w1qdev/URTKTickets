import { configureStore } from "@reduxjs/toolkit";
import MenuDateReducer from "./slices/MenuDateSlice";
import MenuLocationReducer from "./slices/MenuLocationSlice";
import MenuStatusReducer from "./slices/MenuStatusSlice";
import MenuCustomerReducer from "./slices/MenuCustomerSlice";
import MenuPriorityReducer from "./slices/MenuPrioritySlice";

export const store = configureStore({
    reducer: {
        menuDate: MenuDateReducer,
        menuLocation: MenuLocationReducer,
        menuStatus: MenuStatusReducer,
        menuCustomer: MenuCustomerReducer,
        menuPriority: MenuPriorityReducer,
    },
});
