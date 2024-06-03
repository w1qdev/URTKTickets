import { getTicketStateNameById } from "../../helpers/utils";
import RelativeTime from "../RelativeTime/RelativeTime";

const NotificationItem = ({
    deadlineDate,
    problemTitle,
    ticketId,
    stateId,
    createdAt,
}) => {
    const ticketStatus = getTicketStateNameById(stateId);

    return (
        <div className="notification__item">
            <RelativeTime className="item__header" date={createdAt} />

            <div className="item__body">
                <div className="item__info">
                    <div className="item__info-title">{problemTitle}</div>

                    <div className="item__info-text customer">
                        От: <b>Землянов Даниил</b>
                    </div>

                    <div className="item__info-text deadline_date">
                        Выполнить до: <b>{deadlineDate} года</b>
                    </div>
                </div>

                <div className="notification__item-status">
                    <div className="text">Теперь в процессе</div>
                    <div className="status awaiting-confirmation">
                        {ticketStatus}
                    </div>
                </div>

                <div className="notification__item-ticket-id">№{ticketId}</div>
            </div>
        </div>
    );
};

export default NotificationItem;
