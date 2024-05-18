import { Menu as ChakraMenu, MenuButton, MenuList } from "@chakra-ui/react";
import "./Notification.scss";
import BellIcon from "../Icons/BellIcon";

const Notification = ({ className, iconFill = "#0000009e" }) => {
    const notificationsCount = 1;

    return (
        <ChakraMenu>
            <MenuButton fontWeight={"400"} fontSize={13} className={className}>
                {notificationsCount ? (
                    <div className="notification__count">
                        {notificationsCount}
                    </div>
                ) : null}

                <div className="icon-container">
                    <BellIcon className="icon" fill={iconFill} />
                </div>
            </MenuButton>
            <MenuList
                padding="3px 0px 3px 0px"
                minWidth="400px"
                fontSize={14}
                maxHeight="450px"
                overflow="auto"
                className="notification__content"
            >
                {/* {menuItems.length
                    ? menuItems.map((menuItem) => (
                          <MenuItem key={menuItem.id} onClick={handleClick}>
                              {menuItem.title}
                          </MenuItem>
                      ))
                    : null} */}
                <div className="notification__item">
                    <div className="item__header">5 минут назад</div>

                    <div className="item__body">
                        <div className="item__info">
                            <div className="item__info-title">
                                Устранение технических неполадок
                            </div>

                            <div className="item__info-text customer">
                                От: <b>Землянов Даниил</b>
                            </div>

                            <div className="item__info-text deadline_date">
                                Выполнить до: <b>12 мая 2024 года</b>
                            </div>
                        </div>

                        <div className="notification__item-status">
                            <div className="text">Теперь в процессе</div>
                            <div className="status awaiting-confirmation">
                                Выполняется
                            </div>
                        </div>

                        <div className="notification__item-ticket-id">№12</div>
                    </div>
                </div>
            </MenuList>
        </ChakraMenu>
    );
};

export default Notification;
