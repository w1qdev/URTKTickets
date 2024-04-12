import { dateFormatter, reverseDate } from "../../helpers/utils";
import CheckmarkIcon from "../Icons/CheckmarkIcon";
import TasksList from "../TasksList/TasksList";
import axios from "axios";
import { Tooltip } from "@chakra-ui/react";
import Button from "../Buttons/Button";
import Notification from "../Notification/Notification";
import Bookmark from "../Icons/Bookmark";
import Popup from "./Popup";

const ConfirmTicketPopup = ({
    title,
    popupStatus,
    popupHandler,
    ticketData,
}) => {
    const {
        customer_name,
        problem_title,
        room_number,
        submission_date,
        deadline_date,
        priority_id,
        tasks,
    } = ticketData;
    const date = dateFormatter(submission_date);
    const deadlineDate = dateFormatter(reverseDate(deadline_date));
    const isAdministrator =
        localStorage.getItem("role") === "administrator" ? true : false;

    const handleConfirmTicket = async () => {
        await axios
            .put(
                `http://localhost:8001/api/tickets/${ticketData.ticket_id}/change_status/`,
                {
                    new_status_id:
                        ticketData.state_id + 1 <= 3
                            ? ticketData.state_id + 1
                            : ticketData.state_id,
                }
            )
            .then((res) => {
                if (res.data.status === "OK") {
                    window.location.pathname = "/tickets";
                }
            });
    };

    return (
        <Popup
            title={title}
            popupStatus={popupStatus}
            popupHandler={popupHandler}
            ticketPriority={priority_id}
        >
            <div className="body__title">
                <div className="body__title-label">Заголовок проблемы: </div>
                <div className="body__title-text">{problem_title}</div>
            </div>

            <div className="body__location body__section">
                <div className="body__location__room">
                    <div className="title">Аудитория</div>
                    <div className="room">{room_number}</div>
                </div>
                <div className="body__location__ticket-register-date">
                    <div className="date-text">Дата регистрации заявки</div>
                    <div className="date">{date}</div>
                </div>
            </div>

            <div className="body__deadline body__section">
                <div className="body__deadline__date">
                    <div className="title">
                        <b>Выполнить задачу до</b>
                    </div>
                    <div className="deadline__date">{deadlineDate} г.</div>
                </div>
            </div>

            <div className="body__tasks body__section">
                <div className="body__tasks-title">Список задач</div>
                <div className="body__tasks-items">
                    <TasksList tasksData={tasks} />
                </div>
            </div>

            <div className="body__actions body__section">
                <div className="body__actions-user">
                    <b>Заказчик:</b> {customer_name}
                </div>

                {!isAdministrator ? (
                    <Notification
                        type="warning"
                        text="Задачи заявки находятся в процессе выполнения системным администратором"
                    />
                ) : (
                    <Button onClick={handleConfirmTicket} bgColor="#99D16F">
                        <Tooltip
                            marginBottom="10px"
                            marginLeft="20px"
                            hasArrow
                            label="Вы подтверждаете, что все задачи были выполнены"
                            placement="top"
                        >
                            <div className="button__text">Задачи выполнены</div>
                        </Tooltip>
                        <CheckmarkIcon fill="#fff" />
                    </Button>
                )}
            </div>
        </Popup>
    );
};

export default ConfirmTicketPopup;
