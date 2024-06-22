import { configureStore } from "@reduxjs/toolkit";
import MenuDateReducer from "./slices/menu/MenuDateSlice";
import MenuLocationReducer from "./slices/menu/MenuLocationSlice";
import MenuStatusReducer from "./slices/menu/MenuStatusSlice";
import MenuCustomerReducer from "./slices/menu/MenuCustomerSlice";
import MenuPriorityReducer from "./slices/menu/MenuPrioritySlice";
import SettingsTicketsReducer from "./slices/settings/SettingsTicketsSlice";

export const store = configureStore({
    reducer: {
        // menu and filters reducers
        menuDate: MenuDateReducer,
        menuLocation: MenuLocationReducer,
        menuStatus: MenuStatusReducer,
        menuCustomer: MenuCustomerReducer,
        menuPriority: MenuPriorityReducer,

        // ticket settigns reducers
        settingsTickets: SettingsTicketsReducer,
    },
});
