import "./AdministratorTicketsPage.scss";
import CreateTicketButton from "../components/Buttons/CreateTicketButton";
import URTKLogo from "../assets/logo/urtkLogo.png";
import PlusIcon from "../components/Icons/PlusIcon";
// import BlueLine from '../assets/other/blue-line.png'
import { AnimatePresence, motion } from "framer-motion";
import TicketsContainer from "../components/TicketsContainer/TicketsContainer";
import {
    getCurrentDate,
    dateFormatter,
    getTicketContainerStatusMode,
    initializeStorageUserData,
} from "../helpers/utils";
import { Button, Stack } from "@chakra-ui/react";
import RepeatIcon from "../components/Icons/RepeatIcon";
import { useEffect, useState } from "react";
import CreateTicketPopup from "../components/Popups/CreateTicketPopup";
import GridSwitcher from "../components/GridSwitcher/GridSwitcher";
import axios from "axios";
import { SERVER_ORIGIN_URI, API_PATH } from "../api";

const AdministratorTicketsPage = () => {
    const [userData, setUserData] = useState({
        username: localStorage.getItem("username"),
        user_id: localStorage.getItem("user_id"),
        role: localStorage.getItem("role"),
    });
    console.log(userData.username != null);
    const [isUsingFilters, setIsUsingFilters] = useState(false);
    const [isFilterClear, setIsFilterClear] = useState(false);
    const currentDate = dateFormatter(getCurrentDate());
    const userRole = localStorage.getItem("role") || "";
    const [isPopupOpen, setIsPopupOpen] = useState(false);
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
    const handleOpenPopup = () => setIsPopupOpen((prev) => !prev);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const testUserID = 2; // FIXME: TEST USER ID
                const isUserDataStoraged =
                    userData.username && userData.user_id && userData.role;

                if (!isUserDataStoraged) {
                    // if user data doesn't initialized
                    await axios
                        .get(
                            `${SERVER_ORIGIN_URI}${API_PATH}/teachers/${testUserID}`
                        )
                        .then((res) => {
                            console.log(res.data);
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

    console.log(userData);

    return (
        <>
            <AnimatePresence>
                {isPopupOpen ? (
                    <CreateTicketPopup popupHandler={handleOpenPopup} />
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
                        />
                    ) : null}
                </div>
            </div>
        </>
    );
};

export default AdministratorTicketsPage;
