import { motion } from "framer-motion";
import { Tooltip } from "@chakra-ui/react";
import RelativeTime from "../RelativeTime/RelativeTime";
import Bookmark from "../Icons/Bookmark";
import TicketItemStatusBadge from "../Badges/TicketItemStatusBadge/TicketItemStatusBadge";

const TicketItemTileView = ({
    handlePopup,
    ticket_id,
    created_at,
    problem_title,
    customer_name,
    priority_id,
    room_number,
    submissionDate,
    isAdministrator,
    ticketStatus,
    isDeadlineComing,
    deadlineDate,
}) => {
    return (
        <motion.div
            className="ticket-item grid"
            onClick={handlePopup}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: 0.2 }}
        >
            <div className="ticket-item__header grid">
                <div className="header-ticket-id grid">№{ticket_id} •</div>
                <RelativeTime className="timer" date={created_at} />
            </div>

            <div className="ticket-item__problem grid">
                <div className="problem__title grid">{problem_title}</div>
            </div>

            <Bookmark className="bookmark grid" priority={priority_id} />

            <div className="ticket-item__date grid">
                {isAdministrator ? (
                    <div className="date submission grid">
                        <span>Заказчик:</span>
                        <b>{customer_name}</b>
                    </div>
                ) : (
                    <div className="date submission grid">
                        <span>Дата создания:</span>
                        <b>{submissionDate}</b>
                    </div>
                )}

                <div className="date deadline">
                    <span>Выполнение до:</span>
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
                            <span
                                className={`deadline-date ${
                                    isDeadlineComing ? "warn" : "strong"
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
    );
};

export default TicketItemTileView;
