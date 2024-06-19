import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import "./TicketsContainer.scss";
import TicketsList from "../TicketsList/TicketsList.jsx";
import Menu from "../Menu/Menu.jsx";
import MenuFilterButton from "../Menu/MenuFilterButton.jsx";
import { endpoints } from "../../api/index.js";
import {
    getMenuItemsByValue,
    mapTicketsDataAndChangeState,
    getTicketIdByStateName,
    getPriorityById,
} from "../../helpers/utils.js";
import {
    clearMenuDates,
    setMenuDateCurrentTitle,
    setMenuDates,
    getMenuDates,
} from "../../service/store/slices/MenuDateSlice.js";
import {
    clearMenuLocations,
    setMenuLocationCurrentTitle,
    setMenuLocations,
    getMenuLocations,
} from "../../service/store/slices/MenuLocationSlice.js";
import {
    clearMenuStatuses,
    setMenuStatusCurrentTitle,
    setMenuStatuses,
    getMenuStatuses,
} from "../../service/store/slices/MenuStatusSlice.js";
import {
    clearMenuCustomers,
    setMenuCustomerCurrentTitle,
    setMenuCustomers,
    getMenuCustomers,
} from "../../service/store/slices/MenuCustomerSlice.js";
import {
    clearMenuPriorities,
    setMenuPriorityCurrentTitle,
    getMenuPriorities,
    setMenuPriorities,
} from "../../service/store/slices/MenuPrioritySlice.js";

const TicketsContainer = ({
    handleUsingFilters,
    isUsingFilters,
    setIsFilterClear,
    isFilterClear,
    userStoragedData,
    sendJsonMessage,
    tickets,
    handleTickets,
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
    const isGridMode =
        localStorage.getItem("isTicketContainerGridMode") || false;
    const mappedMenuStatus = mapTicketsDataAndChangeState(menuStatus.data);

    const handleClearFilters = () => {
        dispatch(clearMenuDates());
        dispatch(clearMenuLocations());
        dispatch(clearMenuStatuses());
        dispatch(clearMenuCustomers());
        dispatch(clearMenuPriorities());
    };

    const handleClickMenuDate = (e) => {
        dispatch(
            setMenuDateCurrentTitle({ currentTitle: e.target.textContent })
        );
    };

    const handleClickMenuLocation = (e) => {
        dispatch(
            setMenuLocationCurrentTitle({ currentTitle: e.target.textContent })
        );
    };

    const handleClickMenuStatus = (e) => {
        dispatch(
            setMenuStatusCurrentTitle({ currentTitle: e.target.textContent })
        );
    };
    const handleClickMenuCustomer = (e) => {
        dispatch(
            setMenuCustomerCurrentTitle({ currentTitle: e.target.textContent })
        );
    };

    const handleClickMenuPriority = (e) => {
        dispatch(
            setMenuPriorityCurrentTitle({ currentTitle: e.target.textContent })
        );
    };

    const handleClickMenuID = () =>
        setMenuID((prev) => ({ ...prev, isIncreasing: !prev.isIncreasing }));

    const handleChangeMenuInputValue = (e) => {
        setProblemValue((prev) => e.target.value);
    };

    const [activeFiltersCount, setActiveFiltersCount] = useState(0);
    const handleFilters = (value) => handleUsingFilters(value);

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

    useEffect(() => {
        // Проверяем, есть ли хотя бы один активный фильтр
        if (activeFiltersCount > 0) {
            handleFilters(true);
        } else {
            handleFilters(false);
        }
    }, [activeFiltersCount]);

    useEffect(() => {
        if (isFilterClear) {
            dispatch(setMenuDateCurrentTitle({ currentTitle: "" }));
            dispatch(setMenuLocationCurrentTitle({ currentTitle: "" }));
            dispatch(setMenuStatusCurrentTitle({ currentTitle: "" }));
            dispatch(setMenuCustomerCurrentTitle({ currentTitle: "" }));
            dispatch(setMenuPriorityCurrentTitle({ currentTitle: "" }));
            setProblemValue("");
            handleFilters(false);
            setIsFilterClear(false);
        }
    }, [isFilterClear]);

    const sortedTickets = useMemo(() => {
        return filteredTickets.slice().sort((a, b) => a.state_id - b.state_id);
    }, [filteredTickets]);

    return (
        <div className="tickets-container">
            <div className="tickets-container__header">
                <div className="tickets-container__header-item number">
                    <MenuFilterButton
                        title="Номер"
                        isIncreasing={menuID.isIncreasing}
                        handleClick={handleClickMenuID}
                    />
                </div>
                <div className="tickets-container__header-item problem">
                    <input
                        className="problem__search"
                        type="text"
                        placeholder="Название проблемы..."
                        value={problemValue}
                        onChange={handleChangeMenuInputValue}
                    />
                </div>

                <div className="tickets-container__header-item priority">
                    <Menu
                        menuItems={menuPriority.data}
                        menuSelectedItem={menuPriority.currentTitle}
                        defaultMenuTitle="Приоритет"
                        handleClick={handleClickMenuPriority}
                    />
                </div>

                <div className="tickets-container__header-item location">
                    <Menu
                        menuItems={menuLocation.data}
                        menuSelectedItem={menuLocation.currentTitle}
                        defaultMenuTitle="Местоположение"
                        handleClick={handleClickMenuLocation}
                        prefix="Аудитория №"
                    />
                </div>
                <div className="tickets-container__header-item user">
                    <Menu
                        menuItems={menuCustomer.data}
                        menuSelectedItem={menuCustomer.currentTitle}
                        defaultMenuTitle="Заказчик"
                        handleClick={handleClickMenuCustomer}
                    />
                </div>
                <div className="tickets-container__header-item date">
                    <Menu
                        menuItems={menuDate.data}
                        menuSelectedItem={menuDate.currentTitle}
                        defaultMenuTitle="Дата"
                        handleClick={handleClickMenuDate}
                    />
                </div>
                <div className="tickets-container__header-item status">
                    <Menu
                        menuItems={mappedMenuStatus}
                        menuSelectedItem={menuStatus.currentTitle}
                        defaultMenuTitle="Статус"
                        handleClick={handleClickMenuStatus}
                    />
                </div>
            </div>

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
