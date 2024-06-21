import { motion } from "framer-motion";
import { Tooltip } from "@chakra-ui/react";
import Bookmark from "../Icons/Bookmark";
import TicketItemStatusBadge from "../Badges/TicketItemStatusBadge/TicketItemStatusBadge";

const TicketItemTableView = ({
    handlePopup,
    ticket_id,
    problem_title,
    customer_name,
    priority_id,
    room_number,
    problem_description,
    ticketStatus,
    submissionDate,
    isDeadlineComing,
    isAdministrator,
    deadlineDate,
}) => {
    return (
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
                <div className="date submission">от {submissionDate}</div>
                {isAdministrator ? (
                    <Tooltip
                        label={`${
                            isDeadlineComing
                                ? "Поторопитесь! Вам нужно выполнить задачи этой заявки вовремя!"
                                : ""
                        }`}
                        hasArrow
                        placement="top"
                    >
                        <div className="date deadline">
                            <span
                                className={`deadline-date ${
                                    isDeadlineComing ? "warn" : "strong"
                                }`}
                            >
                                до {deadlineDate}
                            </span>
                        </div>
                    </Tooltip>
                ) : (
                    <Tooltip
                        label={`Выполнение задачи до: ${deadlineDate} года`}
                        hasArrow
                        placement="top"
                    >
                        <b>до {deadlineDate}</b>
                    </Tooltip>
                )}
            </div>
            <div className="ticket-item__status">
                <TicketItemStatusBadge status={ticketStatus} />
            </div>
        </motion.div>
    );
};

export default TicketItemTableView;
