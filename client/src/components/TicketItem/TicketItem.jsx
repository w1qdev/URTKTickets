import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import AcceptTicketPopup from "../Popups/AcceptTicketPopup";
import ConfirmTicketPopup from "../Popups/ConfirmTicketPopup";
import "./TicketItem.scss";
import ViewTicketPopup from "../Popups/ViewTicketPopup";
import {
    getTicketStateNameById,
    reverseDate,
    dateFormatter,
    getDatesDifference,
} from "../../helpers/utils";
import { ticketItemsStatus } from "../../helpers/utils";
import TicketItemTileView from "./TicketItemTileView";
import TicketItemTableView from "./TicketItemTableView";

const PopupContent = ({
    status,
    popupHandler,
    ticketData,
    sendJsonMessage,
}) => {
    const popupContainers = {
        [ticketItemsStatus.underReview]: (
            <AcceptTicketPopup
                sendJsonMessage={sendJsonMessage}
                ticketData={ticketData}
                popupHandler={popupHandler}
                title="Рассмотрение заявки"
                popupStatus="Заявка на рассмотрении"
            />
        ),
        [ticketItemsStatus.inProgress]: (
            <ConfirmTicketPopup
                sendJsonMessage={sendJsonMessage}
                ticketData={ticketData}
                popupHandler={popupHandler}
                title="Подтверждение выполненных задач"
                popupStatus="Подтверждение"
            />
        ),
        [ticketItemsStatus.completed]: (
            <ViewTicketPopup
                sendJsonMessage={sendJsonMessage}
                ticketData={ticketData}
                popupHandler={popupHandler}
                title="Заявка системному администратору"
                popupStatus="Просмотр заявки"
            />
        ),
    };

    return popupContainers[status];
};

const TicketItem = (props) => {
    const { submission_date, deadline_date, state_id, sendJsonMessage } = props;
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const ticketStatus = getTicketStateNameById(state_id);
    const deadlineDate = dateFormatter(reverseDate(deadline_date));
    const submissionDate = dateFormatter(submission_date);
    const isTicketTileMode =
        localStorage.getItem("isTicketContainerGridMode") || false;
    const isAdministrator =
        localStorage.getItem("role") === "administrator" ? true : false;
    const datesDifference = getDatesDifference(reverseDate(deadline_date));
    const isDeadlineComing = datesDifference.days >= -2 && state_id != 3;

    const handlePopup = () => setIsPopupOpen((prev) => !prev);

    return (
        <>
            <AnimatePresence>
                {isPopupOpen ? (
                    <PopupContent
                        ticketData={props}
                        status={ticketStatus}
                        popupHandler={handlePopup}
                        sendJsonMessage={sendJsonMessage}
                    />
                ) : null}
            </AnimatePresence>

            {isTicketTileMode === "true" ? (
                <TicketItemTileView
                    handlePopup={handlePopup}
                    ticketStatus={ticketStatus}
                    deadlineDate={deadlineDate}
                    submissionDate={submissionDate}
                    isAdministrator={isAdministrator}
                    isDeadlineComing={isDeadlineComing}
                    {...props}
                />
            ) : (
                <TicketItemTableView
                    handlePopup={handlePopup}
                    ticketStatus={ticketStatus}
                    deadlineDate={deadlineDate}
                    submissionDate={submissionDate}
                    isAdministrator={isAdministrator}
                    isDeadlineComing={isDeadlineComing}
                    {...props}
                />
            )}
        </>
    );
};

export default TicketItem;
