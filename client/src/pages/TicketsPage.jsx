import "./TicketsPage.scss";
import { useDispatch } from "react-redux";
import CreateTicketButton from "../components/Buttons/CreateTicketButton";
import URTKLogo from "../assets/logo/urtkLogo.png";
import PlusIcon from "../components/Icons/PlusIcon";
import { AnimatePresence, motion } from "framer-motion";
import TicketsContainer from "../components/TicketsContainer/TicketsContainer";
import {
    getCurrentDate,
    dateFormatter,
    getTicketContainerStatusMode,
    findFirstDifference,
    reverseDate,
} from "../helpers/utils";
import { Button, Stack } from "@chakra-ui/react";
import RepeatIcon from "../components/Icons/RepeatIcon";
import { useEffect, useState } from "react";
import CreateTicketPopup from "../components/Popups/CreateTicketPopup";
import GridSwitcher from "../components/GridSwitcher/GridSwitcher";
import axios from "axios";
import { SERVER_ORIGIN_URI, API_PATH, SERVER_ORIGIN_DOMAIN } from "../api";
import { toastInfo, toastSuccess } from "../helpers/toasts.js";
import { ToastContainer } from "react-toastify";
import useWebSocketConnectionManager from "../hooks/useWebSocketConnectionManager";
import { setMenuCustomers } from "../service/store/slices/MenuCustomerSlice.js";
import { setMenuDates } from "../service/store/slices/MenuDateSlice.js";
import { setMenuLocations } from "../service/store/slices/MenuLocationSlice.js";
import { setMenuPriorities } from "../service/store/slices/MenuPrioritySlice.js";
import { setMenuStatuses } from "../service/store/slices/MenuStatusSlice.js";

const TicketsPage = () => {
    const dispatch = useDispatch();
    const [userData, setUserData] = useState({
        username: localStorage.getItem("username"),
        user_id: localStorage.getItem("user_id"),
        role: localStorage.getItem("role"),
    });
    const [tickets, setTickets] = useState([]);
    const [isUsingFilters, setIsUsingFilters] = useState(false);
    const [isFilterClear, setIsFilterClear] = useState(false);
    const currentDate = dateFormatter(getCurrentDate());
    const userRole = localStorage.getItem("role") || "";
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

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const testUserID = localStorage.getItem("user_id") || 2; // FIXME: TEST USER ID
                const isUserDataStoraged =
                    userData.username && userData.user_id && userData.role;

                if (!isUserDataStoraged) {
                    // if user data doesn't initialized
                    await axios
                        .get(
                            `${SERVER_ORIGIN_URI}${API_PATH}/teachers/${testUserID}`
                        )
                        .then((res) => {
                            localStorage.setItem(
                                "username",
                                res.data.teacher_name
                            );
                            localStorage.setItem("user_id", testUserID);
                            localStorage.setItem("role", res.data.role);

                            setUserData((prev) => ({
                                ...prev,
                                username: res.data.teacher_name,
                                user_id: res.data.teacher_id,
                                role: res.data.role,
                            }));
                        })
                        .catch((err) => {
                            console.error(
                                "Something gone wrong with user storage initialising",
                                err
                            );
                        });
                }
            } catch (error) {
                console.error("Произошла ошибка:", error);
            }
        };

        fetchUserData();
    }, []);

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
            <div className="administrator-tickets-page">
                <div className="container">
                    <div className="administrator-tickets-page__header">
                        <div className="administrator-tickets-page__header-title">
                            УрТК НИЯУ МИФИ
                        </div>
                        <div className="administrator-tickets-page__header-other">
                            <div className="logo">
                                <img src={URTKLogo} />
                            </div>
                            <Stack direction="row" align="end">
                                {isUsingFilters ? (
                                    <AnimatePresence>
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{
                                                opacity: 1,
                                                transition: 0.2,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                transition: 0.2,
                                            }}
                                        >
                                            <Button
                                                colorScheme="red"
                                                variant="ghost"
                                                fontWeight={"400"}
                                                height="35px"
                                                fontSize={14}
                                                className="room"
                                                rightIcon={
                                                    <RepeatIcon
                                                        width="13px"
                                                        height="13px"
                                                    />
                                                }
                                                onClick={() =>
                                                    setIsFilterClear(true)
                                                }
                                            >
                                                Сбросить фильтры
                                            </Button>
                                        </motion.div>
                                    </AnimatePresence>
                                ) : null}

                                {/* <Notification className="notification__trigger" /> */}

                                <GridSwitcher
                                    isGridMode={isGridMode}
                                    handleSwitchToFlexMode={
                                        handleSwitchToFlexMode
                                    }
                                    handleSwitchToGridMode={
                                        handleSwitchToGridMode
                                    }
                                />

                                {userRole.includes("administrator") ? (
                                    <div className="current-time">
                                        {currentDate}
                                    </div>
                                ) : (
                                    <>
                                        <CreateTicketButton
                                            handleOpenPopup={setIsPopupOpen}
                                            className="create-ticket__button"
                                        >
                                            <div className="button__text">
                                                Создать заявку
                                            </div>
                                            <PlusIcon
                                                width="20px"
                                                height="20px"
                                                fill="#7075F1"
                                            />
                                        </CreateTicketButton>
                                    </>
                                )}
                            </Stack>
                        </div>
                    </div>

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
