import { useState } from "react";
import TicketItemStatusBadge from "../Badges/TicketItemStatusBadge/TicketItemStatusBadge";
import { AnimatePresence } from "framer-motion";
import AcceptTicketPopup from "../Popups/AcceptTicketPopup";
import ConfirmTicketPopup from "../Popups/ConfirmTicketPopup";
import "./TicketItem.scss";
import ViewTicketPopup from "../Popups/ViewTicketPopup";
import {
    getTicketStateNameById,
    reverseDate,
    dateFormatter,
} from "../../helpers/utils";
import Bookmark from "../Icons/Bookmark";
import { Tooltip } from "@chakra-ui/react";

const PopupBody = ({ status, popupHandler, ticketData }) => {
    const popupContainers = {
        "Awaiting Review": (
            <AcceptTicketPopup
                ticketData={ticketData}
                popupHandler={popupHandler}
                title="Рассмотрение заявки"
                popupStatus="Подтверждение заявки"
            />
        ),
        "Awaiting Confirmation": (
            <ConfirmTicketPopup
                ticketData={ticketData}
                popupHandler={popupHandler}
                title="Подтверждение выполненных задач"
                popupStatus="Отправка на проверку"
            />
        ),
        Confirmed: (
            <ViewTicketPopup
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
    } = props;
    const ticketStatus = getTicketStateNameById(state_id);
    const deadlineDate = dateFormatter(reverseDate(deadline_date));
    const submissionDate = dateFormatter(submission_date);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handlePopup = () => setIsPopupOpen((prev) => !prev);

    return (
        <>
            <AnimatePresence>
                {isPopupOpen ? (
                    <PopupBody
                        ticketData={props}
                        status={ticketStatus}
                        popupHandler={handlePopup}
                    />
                ) : null}
            </AnimatePresence>
            <div
                className="ticket-item"
                onClick={handlePopup}
                // style={{ opacity: `${state_id === 3 ? 0.8 : 1}` }}
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
                    {deadline_date && (
                        <Tooltip
                            label={`Выполнить задачи до ${deadlineDate} года`}
                            hasArrow
                            placement="top"
                        >
                            <div className="date deadline">
                                до {deadlineDate}
                            </div>
                        </Tooltip>
                    )}
                </div>
                <div className="ticket-item__status">
                    <TicketItemStatusBadge status={ticketStatus} />
                </div>
            </div>
        </>
    );
};

export default TicketItem;
