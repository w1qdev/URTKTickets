import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { store } from "./service/store/store.js";
import { Provider } from "react-redux";
import App from "./App.jsx";
import "./index.scss";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <ChakraProvider>
                    <App />
                </ChakraProvider>
            </Provider>
        </BrowserRouter>
    </React.StrictMode>
);
