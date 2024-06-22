import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import MenuDateReducer from "./slices/menu/MenuDateSlice";
import MenuLocationReducer from "./slices/menu/MenuLocationSlice";
import MenuStatusReducer from "./slices/menu/MenuStatusSlice";
import MenuCustomerReducer from "./slices/menu/MenuCustomerSlice";
import MenuPriorityReducer from "./slices/menu/MenuPrioritySlice";
import SettingsTicketsReducer from "./slices/settings/SettingsTicketsSlice";

const persistConfig = {
    key: "root",
    storage,
};

const rootReducer = combineReducers({
    // menu and filters reducers
    menuDate: MenuDateReducer,
    menuLocation: MenuLocationReducer,
    menuStatus: MenuStatusReducer,
    menuCustomer: MenuCustomerReducer,
    menuPriority: MenuPriorityReducer,

    // ticket settigns reducers
    settingsTickets: SettingsTicketsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
});

export const persistor = persistStore(store);
export default store;
