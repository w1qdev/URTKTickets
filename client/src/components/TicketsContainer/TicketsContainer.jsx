import "./TicketsContainer.scss";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import TicketsList from "../TicketsList/TicketsList.jsx";
import Menu from "../Menu/Menu.jsx";
import MenuFilterButton from "../Menu/MenuFilterButton.jsx";
import { endpoints } from "../../api/index.js";
import {
    getMenuItemsByValue,
    mapTicketsDataAndChangeState,
    getTicketIdByStateName,
} from "../../helpers/utils.js";

const TicketsContainer = ({
    handleUsingFilters,
    isUsingFilters,
    setIsFilterClear,
    isFilterClear,
}) => {
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState(tickets);
    const [problemValue, setProblemValue] = useState("");
    const [menuID, setMenuID] = useState({ isIncreasing: null });
    const [menuDate, setMenuDate] = useState({ currentTitle: "", data: [] });
    const [isFetching, setIsFetching] = useState(false);
    const [menuLocation, setMenuLocation] = useState({
        currentTitle: "",
        data: [],
    });
    const [menuStatus, setMenuStatus] = useState({
        currentTitle: "",
        data: [],
    });
    const [menuCustomer, setMenuCustomer] = useState({
        currentTitle: "",
        data: [],
    });

    const mappedMenuStatus = mapTicketsDataAndChangeState(menuStatus.data);

    const handleClickMenuDate = (e) =>
        setMenuDate((prev) => ({
            ...prev,
            currentTitle: e.target.textContent,
        }));
    const handleClickMenuLocation = (e) =>
        setMenuLocation((prev) => ({
            ...prev,
            currentTitle: e.target.textContent,
        }));
    const handleClickMenuStatus = (e) =>
        setMenuStatus((prev) => ({
            ...prev,
            currentTitle: e.target.textContent,
        }));
    const handleClickMenuCustomer = (e) =>
        setMenuCustomer((prev) => ({
            ...prev,
            currentTitle: e.target.textContent,
        }));
    const handleClickMenuID = () =>
        setMenuID((prev) => ({ ...prev, isIncreasing: !prev.isIncreasing }));
    const [activeFiltersCount, setActiveFiltersCount] = useState(0);
    const handleFilters = (value) => handleUsingFilters(value);

    useEffect(() => {
        const fetchData = async () => {
            setIsFetching((prev) => true);
            try {
                await axios
                    .get(endpoints.GET_ALL_TICKETS, {
                        params: {
                            role: localStorage.getItem("role") || "teacher", // Роль пользователя
                            user_id: localStorage.getItem("user_id"), // ID пользователя
                            username: localStorage.getItem("username"),
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
                            setMenuDate((prev) => ({
                                ...prev,
                                data: getMenuItemsByValue(
                                    res.data.tickets,
                                    "submission_date"
                                ),
                            }));
                            setMenuLocation((prev) => ({
                                ...prev,
                                data: getMenuItemsByValue(
                                    res.data.tickets,
                                    "room_number"
                                ),
                            }));
                            setMenuStatus((prev) => ({
                                ...prev,
                                data: getMenuItemsByValue(
                                    res.data.tickets,
                                    "state_id"
                                ),
                            }));
                            setMenuCustomer((prev) => ({
                                ...prev,
                                data: getMenuItemsByValue(
                                    res.data.tickets,
                                    "customer_name"
                                ),
                            }));
                            setTickets(res.data.tickets);
                        } else {
                            setTickets([]);
                        }
                    })
                    .catch((error) => {
                        console.error("Что-то пошло не так", error);
                    });
            } catch (error) {
                console.error("Произошла ошибка:", error);
            }
        };

        fetchData();
        setIsFetching((prev) => false);
    }, []);

    useEffect(() => {
        const newSortedTickets = tickets.slice(); // Создаем копию исходных данных

        // Применяем сортировку в зависимости от значения isIncreasing
        if (menuID.isIncreasing !== null) {
            newSortedTickets.sort((a, b) => {
                // Если isIncreasing равен true, сортируем по возрастанию
                if (menuID.isIncreasing) {
                    return a.ticket_id - b.ticket_id;
                }
                // Иначе сортируем по убыванию
                return b.ticket_id - a.ticket_id;
            });
        }

        const newFilteredTickets = newSortedTickets.filter((ticket) => {
            const currentTicketsStateId = getTicketIdByStateName(
                menuStatus.currentTitle
            );

            // Проверка на соответствие значений из меню и значения проблемы
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

            // Возвращаем результат фильтрации по всем критериям
            return (
                isMenuDateMatch &&
                isMenuLocationMatch &&
                isMenuStatusMatch &&
                isMenuCustomerMatch &&
                isProblemMatch
            );
        });

        // Обновляем состояние отфильтрованных данных
        setFilteredTickets(newFilteredTickets);
    }, [
        menuID.currentTitle,
        menuID.isIncreasing,
        menuDate.currentTitle,
        menuLocation.currentTitle,
        menuStatus.currentTitle,
        menuCustomer.currentTitle,
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
            setMenuDate((prev) => ({ ...prev, currentTitle: "" }));
            setMenuLocation((prev) => ({ ...prev, currentTitle: "" }));
            setMenuStatus((prev) => ({ ...prev, currentTitle: "" }));
            setMenuCustomer((prev) => ({ ...prev, currentTitle: "" }));
            setMenuCustomer((prev) => ({ ...prev, currentTitle: "" }));
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
                {/* <div className="tickets-container__header-item__separator"></div> */}
                <div className="tickets-container__header-item problem">
                    <input
                        className="problem__search"
                        type="text"
                        placeholder="Название проблемы..."
                        value={problemValue}
                        onChange={(e) =>
                            setProblemValue((prev) => e.target.value)
                        }
                    />
                </div>
                {/* <div className="tickets-container__header-item__separator"></div> */}
                <div className="tickets-container__header-item location">
                    <Menu
                        menuItems={menuLocation.data}
                        menuSelectedItem={menuLocation.currentTitle}
                        defaultMenuTitle="Местоположение"
                        handleClick={handleClickMenuLocation}
                        prefix="Аудитория №"
                    />
                </div>
                {/* <div className="tickets-container__header-item__separator"></div> */}
                <div className="tickets-container__header-item user">
                    <Menu
                        menuItems={menuCustomer.data}
                        menuSelectedItem={menuCustomer.currentTitle}
                        defaultMenuTitle="Заказчик"
                        handleClick={handleClickMenuCustomer}
                    />
                </div>
                {/* <div className="tickets-container__header-item__separator"></div> */}
                <div className="tickets-container__header-item date">
                    <Menu
                        menuItems={menuDate.data}
                        menuSelectedItem={menuDate.currentTitle}
                        defaultMenuTitle="Дата"
                        handleClick={handleClickMenuDate}
                    />
                </div>
                {/* <div className="tickets-container__header-item__separator"></div> */}
                <div className="tickets-container__header-item status">
                    <Menu
                        menuItems={mappedMenuStatus}
                        menuSelectedItem={menuStatus.currentTitle}
                        defaultMenuTitle="Статус"
                        handleClick={handleClickMenuStatus}
                    />
                </div>
            </div>

            <div className="tickets-container__problems-list">
                <TicketsList
                    isFetching={isFetching}
                    ticketsData={sortedTickets}
                />
            </div>
        </div>
    );
};

export default TicketsContainer;
