import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { mapTicketsDataAndChangeState } from "../../helpers/utils";
import Menu from "../Menu/Menu";
import MenuPriorityFilter from "../Menu/MenuPriorityFilter";
import MenuFilterButton from "../Menu/MenuFilterButton";
import {
    setMenuDateCurrentTitle,
    getMenuDates,
} from "../../service/store/slices/menu/MenuDateSlice.js";
import {
    setMenuLocationCurrentTitle,
    getMenuLocations,
} from "../../service/store/slices/menu/MenuLocationSlice.js";
import {
    setMenuStatusCurrentTitle,
    getMenuStatuses,
} from "../../service/store/slices/menu/MenuStatusSlice.js";
import {
    setMenuCustomerCurrentTitle,
    getMenuCustomers,
} from "../../service/store/slices/menu/MenuCustomerSlice.js";
import {
    setMenuPriorityCurrentTitle,
    getMenuPriorities,
} from "../../service/store/slices/menu/MenuPrioritySlice.js";
import SearchIcon from "../Icons/SearchIcon.jsx";

const TicketsContainerMenu = ({
    isFilterClear,
    activeFiltersCount,
    handleUsingFilters,
    setProblemValue,
    setMenuID,
    setIsFilterClear,
    menuID,
    problemValue,
}) => {
    const dispatch = useDispatch();
    const menuDate = useSelector(getMenuDates);
    const menuLocation = useSelector(getMenuLocations);
    const menuStatus = useSelector(getMenuStatuses);
    const menuCustomer = useSelector(getMenuCustomers);
    const menuPriority = useSelector(getMenuPriorities);
    const [isSearchInputFocused, setIsSearchInputFocused] = useState(false);
    const searchInputRef = useRef();

    const mappedMenuStatus = mapTicketsDataAndChangeState(menuStatus.data);

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

    const handleSearchInputClick = () => {
        searchInputRef.current.focus();
    };

    const handleFilters = (value) => handleUsingFilters(value);

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

    useEffect(() => {
        // Проверяем, есть ли хотя бы один активный фильтр
        if (activeFiltersCount > 0) {
            handleFilters(true);
        } else {
            handleFilters(false);
        }
    }, [activeFiltersCount]);

    return (
        <div className="tickets-container__header">
            <div className="tickets-container__header-item number">
                <MenuFilterButton
                    title="Номер"
                    isIncreasing={menuID.isIncreasing}
                    handleClick={handleClickMenuID}
                />
            </div>
            <div className="tickets-container__header-item problem">
                <div
                    className={`search ${
                        isSearchInputFocused ? "focused" : ""
                    }`}
                    onClick={handleSearchInputClick}
                >
                    <input
                        className="problem__search"
                        type="text"
                        placeholder="Название проблемы..."
                        ref={searchInputRef}
                        value={problemValue}
                        onChange={handleChangeMenuInputValue}
                        onFocus={() => setIsSearchInputFocused((prev) => true)}
                        onBlur={() => setIsSearchInputFocused((prev) => false)}
                    />
                    <SearchIcon className="search__icon" />
                </div>
            </div>

            <div className="tickets-container__header-item priority">
                <MenuPriorityFilter
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
                    itemPerfix="№"
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
                    defaultMenuTitle="Дата создания"
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
    );
};

export default TicketsContainerMenu;
