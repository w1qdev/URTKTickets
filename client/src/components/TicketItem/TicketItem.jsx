import { useState } from "react";
import TicketItemStatusBadge from "../Badges/TicketItemStatusBadge/TicketItemStatusBadge";
import { AnimatePresence, motion } from "framer-motion";
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
import Bookmark from "../Icons/Bookmark";
import { Tooltip } from "@chakra-ui/react";

const PopupBody = ({ status, popupHandler, ticketData, sendJsonMessage }) => {
    const popupContainers = {
        "Under review": (
            <AcceptTicketPopup
                sendJsonMessage={sendJsonMessage}
                ticketData={ticketData}
                popupHandler={popupHandler}
                title="Рассмотрение заявки"
                popupStatus="Заявка на рассмотрении"
            />
        ),
        "In progress": (
            <ConfirmTicketPopup
                sendJsonMessage={sendJsonMessage}
                ticketData={ticketData}
                popupHandler={popupHandler}
                title="Подтверждение выполненных задач"
                popupStatus="В процессе выполнения"
            />
        ),
        Completed: (
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
    const {
        ticket_id,
        problem_title,
        room_number,
        customer_name,
        problem_description,
        submission_date,
        deadline_date,
        priority_id,
        state_id,
        sendJsonMessage,
    } = props;
    const ticketStatus = getTicketStateNameById(state_id);
    const deadlineDate = dateFormatter(reverseDate(deadline_date));
    const submissionDate = dateFormatter(submission_date);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const isGridMode =
        localStorage.getItem("isTicketContainerGridMode") || false;
    const isAdministrator =
        localStorage.getItem("role") === "administrator" ? true : false;
    const datesDifference = getDatesDifference(reverseDate(deadline_date));

    const handlePopup = () => setIsPopupOpen((prev) => !prev);

    return (
        <>
            <AnimatePresence>
                {isPopupOpen ? (
                    <PopupBody
                        ticketData={props}
                        status={ticketStatus}
                        popupHandler={handlePopup}
                        sendJsonMessage={sendJsonMessage}
                    />
                ) : null}
            </AnimatePresence>

            {isGridMode === "true" ? (
                <motion.div
                    className="ticket-item grid"
                    onClick={handlePopup}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: 0.2 }}
                >
                    <div className="ticket-item__problem grid">
                        <div className="problem__title grid">
                            {problem_title}
                        </div>

                        {problem_description ? (
                            <div className="problem__description grid">
                                {problem_description}
                            </div>
                        ) : null}
                    </div>

                    <Bookmark
                        className="bookmark grid"
                        priority={priority_id}
                    />

                    <div className="ticket-item__date grid">
                        <div className="date submission grid">
                            <span>Дата создания заявки:</span>
                            <b>{submissionDate}</b>
                        </div>

                        <div className="date deadline">
                            <span>Выполнение до:</span>
                            {isAdministrator ? (
                                <Tooltip
                                    label={`${
                                        datesDifference.days >= -2
                                            ? "Поторопитесь! Вам нужно выполнить задачи этой заявки вовремя!"
                                            : ""
                                    }`}
                                    hasArrow
                                    placement="top"
                                >
                                    <span
                                        className={`deadline-date ${
                                            datesDifference.days >= -2
                                                ? "warn"
                                                : "strong"
                                        }`}
                                    >
                                        {deadlineDate}
                                    </span>
                                </Tooltip>
                            ) : (
                                <b>{deadlineDate}</b>
                            )}
                        </div>
                    </div>

                    <div className="ticket-item__location grid">
                        <span>Аудитория</span> <strong>№{room_number}</strong>
                    </div>
                    <div className="ticket-item__status grid">
                        <TicketItemStatusBadge status={ticketStatus} />
                    </div>
                </motion.div>
            ) : null}

            {isGridMode === "false" ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: 0.2 }}
                    className="ticket-item"
                    onClick={handlePopup}
                >
                    <div className="ticket-item__number">№{ticket_id}</div>
                    <div className="ticket-item__problem">
                        <div className="problem__title">{problem_title}</div>

                        <div className="problem__description">
                            {problem_description}
                        </div>
                    </div>

                    <Bookmark className="bookmark" priority={priority_id} />

                    <div className="ticket-item__location">
                        Аудитория <strong>№{room_number}</strong>
                    </div>
                    <div className="ticket-item__user">{customer_name}</div>
                    <div className="ticket-item__date">
                        <div className="date submission">
                            от {submissionDate}
                        </div>
                        {deadline_date && (
                            <Tooltip
                                label={`Выполнить задачи до ${deadlineDate} года`}
                                hasArrow
                                placement="top"
                            >
                                <div className="date deadline">
                                    {isAdministrator ? (
                                        <span
                                            className={`deadline-date ${
                                                datesDifference.days >= -1
                                                    ? "warn"
                                                    : "strong"
                                            }`}
                                        >
                                            до {deadlineDate}
                                        </span>
                                    ) : (
                                        <b>до {deadlineDate}</b>
                                    )}
                                </div>
                            </Tooltip>
                        )}
                    </div>
                    <div className="ticket-item__status">
                        <TicketItemStatusBadge status={ticketStatus} />
                    </div>
                </motion.div>
            ) : null}
        </>
    );
};

export default TicketItem;
