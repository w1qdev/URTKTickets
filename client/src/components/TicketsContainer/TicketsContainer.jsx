import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import "./TicketsContainer.scss";
import TicketsList from "../TicketsList/TicketsList.jsx";
import { endpoints } from "../../api/index.js";
import {
    getMenuItemsByValue,
    getTicketIdByStateName,
    getPriorityById,
} from "../../helpers/utils.js";
import {
    clearMenuDates,
    setMenuDates,
    getMenuDates,
} from "../../service/store/slices/menu/MenuDateSlice.js";
import {
    clearMenuLocations,
    setMenuLocations,
    getMenuLocations,
} from "../../service/store/slices/menu/MenuLocationSlice.js";
import {
    clearMenuStatuses,
    setMenuStatuses,
    getMenuStatuses,
} from "../../service/store/slices/menu/MenuStatusSlice.js";
import {
    clearMenuCustomers,
    setMenuCustomers,
    getMenuCustomers,
} from "../../service/store/slices/menu/MenuCustomerSlice.js";
import {
    clearMenuPriorities,
    setMenuPriorities,
    getMenuPriorities,
} from "../../service/store/slices/menu/MenuPrioritySlice.js";
import TicketsContainerMenu from "./TicketsContainerMenu.jsx";

const TicketsContainer = ({
    handleUsingFilters,
    isUsingFilters,
    setIsFilterClear,
    isFilterClear,
    userStoragedData,
    sendJsonMessage,
    tickets,
    handleTickets,
    isGridMode,
}) => {
    const dispatch = useDispatch();

    const menuDate = useSelector(getMenuDates);
    const menuLocation = useSelector(getMenuLocations);
    const menuStatus = useSelector(getMenuStatuses);
    const menuCustomer = useSelector(getMenuCustomers);
    const menuPriority = useSelector(getMenuPriorities);

    const [filteredTickets, setFilteredTickets] = useState(tickets);
    const [problemValue, setProblemValue] = useState("");
    const [menuID, setMenuID] = useState({ isIncreasing: false });
    const [isFetching, setIsFetching] = useState(false);
    const [activeFiltersCount, setActiveFiltersCount] = useState(0);

    const handleClearFilters = () => {
        dispatch(clearMenuDates());
        dispatch(clearMenuLocations());
        dispatch(clearMenuStatuses());
        dispatch(clearMenuCustomers());
        dispatch(clearMenuPriorities());
    };

    useEffect(() => {
        handleClearFilters();
        const fetchData = async () => {
            try {
                setIsFetching(true);
                await axios
                    .get(endpoints.GET_ALL_TICKETS, {
                        params: {
                            role: userStoragedData?.role, // Роль пользователя
                            user_id: userStoragedData?.user_id, // ID пользователя
                            username: userStoragedData?.username,
                        },
                    })
                    .then((res) => {
                        if (res.data.tickets?.length) {
                            setMenuID((prev) => ({
                                ...prev,
                                data: getMenuItemsByValue(
                                    res.data.tickets,
                                    "ticket_id"
                                ),
                            }));
                            dispatch(
                                setMenuDates({ ticketsData: res.data.tickets })
                            );

                            dispatch(
                                setMenuLocations({
                                    ticketsData: res.data.tickets,
                                })
                            );

                            dispatch(
                                setMenuStatuses({
                                    ticketsData: res.data.tickets,
                                })
                            );

                            dispatch(
                                setMenuCustomers({
                                    ticketsData: res.data.tickets,
                                })
                            );

                            dispatch(
                                setMenuPriorities({
                                    ticketsData: res.data.tickets,
                                })
                            );

                            handleTickets(res.data.tickets);
                        } else {
                            handleTickets([]);
                        }
                    })
                    .catch((error) => {
                        console.error("Что-то пошло не так", error);
                    });
            } catch (error) {
                console.error("Произошла ошибка:", error);
            }
            setIsFetching(false);
        };

        fetchData();
    }, []);

    useEffect(() => {
        let sortedTickets = [...tickets]; // Создаем копию исходного массива

        // Применяем сортировку в зависимости от значения isIncreasing
        if (menuID.isIncreasing !== null) {
            sortedTickets.sort((a, b) => {
                // Если isIncreasing равен true, сортируем по возрастанию
                if (menuID.isIncreasing) {
                    return a.ticket_id - b.ticket_id;
                }
                // Иначе сортируем по убыванию
                return b.ticket_id - a.ticket_id;
            });
        }

        // Применяем фильтрацию к уже отсортированным данным
        const filteredTickets = sortedTickets.filter((ticket) => {
            const currentTicketsStateId = getTicketIdByStateName(
                menuStatus.currentTitle
            );

            const isMenuDateMatch = menuDate.currentTitle
                ? ticket.submission_date === menuDate.currentTitle
                : true;
            const isMenuLocationMatch = menuLocation.currentTitle
                ? ticket.room_number === menuLocation.currentTitle
                : true;
            const isMenuStatusMatch = menuStatus.currentTitle
                ? ticket.state_id === currentTicketsStateId
                : true;
            const isMenuCustomerMatch = menuCustomer.currentTitle
                ? ticket.customer_name === menuCustomer.currentTitle
                : true;
            const isProblemMatch = problemValue
                ? ticket.problem_title
                      .toLowerCase()
                      .includes(problemValue.toLowerCase()) ||
                  ticket.ticket_id.toString().includes(problemValue) ||
                  ticket.customer_name
                      .toLowerCase()
                      .includes(problemValue.toLowerCase())
                : true;
            const isPriorityMatch = menuPriority.currentTitle
                ? getPriorityById(ticket.priority_id) ===
                  menuPriority.currentTitle
                : true;

            return (
                isMenuDateMatch &&
                isMenuLocationMatch &&
                isMenuStatusMatch &&
                isMenuCustomerMatch &&
                isProblemMatch &&
                isPriorityMatch
            );
        });

        // Обновляем состояние отфильтрованных данных
        setFilteredTickets(filteredTickets);
    }, [
        menuID.currentTitle,
        menuID.isIncreasing,
        menuDate.currentTitle,
        menuLocation.currentTitle,
        menuStatus.currentTitle,
        menuCustomer.currentTitle,
        menuPriority.currentTitle,
        problemValue,
        tickets,
    ]);

    useEffect(() => {
        const activeFilters = [
            menuID.currentTitle,
            menuDate.currentTitle,
            menuLocation.currentTitle,
            menuStatus.currentTitle,
            menuCustomer.currentTitle,
            menuPriority.currentTitle,
            problemValue,
        ];

        const count = activeFilters.filter(
            (filter) => filter && filter !== ""
        ).length;
        setActiveFiltersCount(count);
    }, [
        menuID.currentTitle,
        menuDate.currentTitle,
        menuLocation.currentTitle,
        menuStatus.currentTitle,
        menuCustomer.currentTitle,
        menuPriority.currentTitle,
        problemValue,
    ]);

    const sortedTickets = useMemo(() => {
        return filteredTickets.slice().sort((a, b) => a.state_id - b.state_id);
    }, [filteredTickets]);

    return (
        <div className="tickets-container">
            <TicketsContainerMenu
                isFilterClear={isFilterClear}
                activeFiltersCount={activeFiltersCount}
                handleUsingFilters={handleUsingFilters}
                setIsFilterClear={setIsFilterClear}
                menuID={menuID}
                problemValue={problemValue}
                setProblemValue={setProblemValue}
                setMenuID={setMenuID}
            />

            <motion.div
                className={`tickets-container__problems-list ${
                    isGridMode === "true" ? "grid-mode" : "list-mode"
                }`}
            >
                <TicketsList
                    sendJsonMessage={sendJsonMessage}
                    isFetching={isFetching}
                    ticketsData={sortedTickets}
                    isUsingFilters={isUsingFilters}
                />
            </motion.div>
        </div>
    );
};

export default TicketsContainer;
