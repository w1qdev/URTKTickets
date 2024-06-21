import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { mapTicketsDataAndChangeState } from "../../helpers/utils";
import Menu from "../Menu/Menu";
import MenuPriorityFilter from "../Menu/MenuPriorityFilter";
import MenuFilterButton from "../Menu/MenuFilterButton";
import {
    setMenuDateCurrentTitle,
    getMenuDates,
} from "../../service/store/slices/MenuDateSlice";
import {
    setMenuLocationCurrentTitle,
    getMenuLocations,
} from "../../service/store/slices/MenuLocationSlice";
import {
    setMenuStatusCurrentTitle,
    getMenuStatuses,
} from "../../service/store/slices/MenuStatusSlice";
import {
    setMenuCustomerCurrentTitle,
    getMenuCustomers,
} from "../../service/store/slices/MenuCustomerSlice";
import {
    setMenuPriorityCurrentTitle,
    getMenuPriorities,
} from "../../service/store/slices/MenuPrioritySlice";

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
                <input
                    className="problem__search"
                    type="text"
                    placeholder="Название проблемы..."
                    value={problemValue}
                    onChange={handleChangeMenuInputValue}
                />
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
