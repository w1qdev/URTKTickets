import "./TicketsPage.scss";
import { useDispatch } from "react-redux";

import TicketsContainerHeader from "../components/TicketsContainerHeader/TicketsContainerHeader.jsx";
import { AnimatePresence } from "framer-motion";
import TicketsContainer from "../components/TicketsContainer/TicketsContainer";
import {
    dateFormatter,
    findFirstDifference,
    reverseDate,
    getTicketContainerStatusMode,
} from "../helpers/utils";
import { useState } from "react";
import CreateTicketPopup from "../components/Popups/CreateTicketPopup";

import { SERVER_ORIGIN_DOMAIN } from "../api";
import { toastInfo, toastSuccess } from "../helpers/toasts.js";
import { ToastContainer } from "react-toastify";
import useWebSocketConnectionManager from "../hooks/useWebSocketConnectionManager";
import { setMenuCustomers } from "../service/store/slices/menu/MenuCustomerSlice.js";
import { setMenuDates } from "../service/store/slices/menu/MenuDateSlice.js";
import { setMenuLocations } from "../service/store/slices/menu/MenuLocationSlice.js";
import { setMenuPriorities } from "../service/store/slices/menu/MenuPrioritySlice.js";
import { setMenuStatuses } from "../service/store/slices/menu/MenuStatusSlice.js";
import useInitializeUserData from "../hooks/useInitializeUserData.js";

const TicketsPage = () => {
    const dispatch = useDispatch();
    const [userData, setUserData] = useInitializeUserData(2);
    const [tickets, setTickets] = useState([]);
    const [isUsingFilters, setIsUsingFilters] = useState(false);
    const [isFilterClear, setIsFilterClear] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const isAdministrator =
        localStorage.getItem("role") === "administrator" ? true : false;
    const [isGridMode, setIsGridMode] = useState(
        getTicketContainerStatusMode()
    );

    const handleSwitchToGridMode = () => {
        localStorage.setItem("isTicketContainerGridMode", "true");
        setIsGridMode("true");
    };
    const handleSwitchToFlexMode = () => {
        localStorage.setItem("isTicketContainerGridMode", "false");
        setIsGridMode("false");
    };

    const wsActions = {
        onOpen: () => {
            console.log("WebSocket connection established.");
        },
        onClose: () => console.log("WebSocket connection closed."),
        onMessage: (messages) => {
            const newTicketsData = JSON.parse(messages.data);

            const differenceTicket = findFirstDifference(
                newTicketsData.tickets,
                tickets
            ).oldItem;

            if (differenceTicket && isAdministrator === false) {
                // if user is teacher
                if (differenceTicket.state_id === 2) {
                    toastInfo(
                        `Ваша заявка №${differenceTicket.ticket_id}: ${differenceTicket.problem_title} рассмотрена и находится в процессе выполнения.`
                    );
                } else if (differenceTicket.state_id === 3) {
                    toastSuccess(
                        `Ваша заявка №${differenceTicket.ticket_id}: ${differenceTicket.problem_title} успешно выполнена.`
                    );
                }
            } else if (differenceTicket && isAdministrator === true) {
                // if user is administrator
                if (differenceTicket.state_id === 1) {
                    toastInfo(
                        `Вам пришла новая заявка от ${
                            differenceTicket.customer_name
                        }, №${differenceTicket.ticket_id}, ${
                            differenceTicket.problem_title
                        }. Выполнить нужно до ${dateFormatter(
                            reverseDate(differenceTicket.deadline_date)
                        )} года!`
                    );
                } else if (differenceTicket.state_id === 2) {
                    toastInfo(
                        `Вы успешно приняли заявку №${differenceTicket.ticket_id}: ${differenceTicket.problem_title}. Можете приступать к выполнению задач.`
                    );
                } else if (differenceTicket.state_id === 3) {
                    toastSuccess(
                        `Вы успешно выполнили все задачи заявки №${differenceTicket.ticket_id}: ${differenceTicket.problem_title}.`
                    );
                }
            }

            setTickets((prev) => [...newTicketsData.tickets]);

            // Updating all menu items
            dispatch(setMenuCustomers({ ticketsData: newTicketsData.tickets }));
            dispatch(
                setMenuPriorities({ ticketsData: newTicketsData.tickets })
            );
            dispatch(setMenuDates({ ticketsData: newTicketsData.tickets }));
            dispatch(setMenuStatuses({ ticketsData: newTicketsData.tickets }));
            dispatch(setMenuLocations({ ticketsData: newTicketsData.tickets }));
        },
        onError: (event) => console.error("WebSocket error observed:", event),
        shouldReconnect: (closeEvent) => true,
    };

    const { sendJsonMessage } = useWebSocketConnectionManager(
        `ws://${SERVER_ORIGIN_DOMAIN}/ws/tickets/${userData?.user_id}`,
        wsActions
    );

    const handleOpenPopup = () => setIsPopupOpen((prev) => !prev);

    return (
        <>
            <AnimatePresence>
                {isPopupOpen ? (
                    <CreateTicketPopup
                        sendJsonMessage={sendJsonMessage}
                        popupHandler={handleOpenPopup}
                    />
                ) : null}
            </AnimatePresence>

            <div className="tickets-page">
                <div className="container">
                    <TicketsContainerHeader
                        setIsFilterClear={setIsFilterClear}
                        isUsingFilters={isUsingFilters}
                        isAdministrator={isAdministrator}
                        setIsPopupOpen={setIsPopupOpen}
                        handleSwitchToGridMode={handleSwitchToGridMode}
                        handleSwitchToFlexMode={handleSwitchToFlexMode}
                        isGridMode={isGridMode}
                    />

                    {userData.username != null ? (
                        <TicketsContainer
                            handleUsingFilters={setIsUsingFilters}
                            setIsFilterClear={setIsFilterClear}
                            isUsingFilters={isUsingFilters}
                            isFilterClear={isFilterClear}
                            userStoragedData={userData}
                            tickets={tickets}
                            handleTickets={setTickets}
                            sendJsonMessage={sendJsonMessage}
                            isGridMode={isGridMode}
                        />
                    ) : null}
                </div>
            </div>
            <ToastContainer
                className="toasts-container"
                style={{ width: "450px" }}
            />
        </>
    );
};

export default TicketsPage;
