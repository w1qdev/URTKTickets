import "./TicketsContainerHeader.scss";

import { AnimatePresence, motion } from "framer-motion";
import { Button, Stack } from "@chakra-ui/react";

import GridSwitcher from "../../components/GridSwitcher/GridSwitcher";
import RepeatIcon from "../../components/Icons/RepeatIcon";
import CreateTicketButton from "../../components/Buttons/CreateTicketButton";
import URTKLogo from "../../assets/logo/urtkLogo.png";
import PlusIcon from "../../components/Icons/PlusIcon";
import { dateFormatter, getCurrentDate } from "../../helpers/utils";
import MenuSorting from "../Menu/MenuSorting";
import Switch from "../Switch/Switch";
// import Notification from "../Notification/Notification";

const TicketsContainerHeader = ({
    isUsingFilters,
    setIsFilterClear,
    isAdministrator,
    setIsPopupOpen,
    handleSwitchToGridMode,
    handleSwitchToFlexMode,
    isGridMode = { isGridMode },
}) => {
    const currentDate = dateFormatter(getCurrentDate());

    const handleUsingFilters = () => {
        setIsFilterClear(true);
    };

    return (
        <div className="tickets-page__header">
            <div className="tickets-page__header-title">УрТК НИЯУ МИФИ</div>
            <div className="tickets-page__header-other">
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
                                    onClick={handleUsingFilters}
                                >
                                    Сбросить фильтры
                                </Button>
                            </motion.div>
                        </AnimatePresence>
                    ) : null}
                    {/* <Notification className="notification__trigger" /> */}
                    {/* <div className="menu-sorting__container">
                        <div className="menu-sorting__subtext">
                            Сортировка по{" "}
                        </div>

                        <MenuSorting currentSortStatus="Дате создания" />
                    </div> */}

                    <Switch label="Показывать выполненные заявки?" />

                    <GridSwitcher
                        isGridMode={isGridMode}
                        handleSwitchToFlexMode={handleSwitchToFlexMode}
                        handleSwitchToGridMode={handleSwitchToGridMode}
                    />
                    {isAdministrator === true ? (
                        <div className="current-time">{currentDate}</div>
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
    );
};

export default TicketsContainerHeader;
