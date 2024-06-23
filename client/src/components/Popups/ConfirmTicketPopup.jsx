import { dateFormatter, reverseDate } from "../../helpers/utils";
import CheckmarkIcon from "../Icons/CheckmarkIcon";
import TasksList from "../TasksList/TasksList";
import axios from "axios";
import { Tooltip } from "@chakra-ui/react";
import Button from "../Buttons/Button";
import Blockquote from "../Blockquotes/Blockquote";
import DescriptionFeed from "../DescriptionFeed/DescriptionFeed";
import Popup from "./Popup";
import { useState } from "react";
import { Spinner } from "@chakra-ui/react";

const ConfirmTicketPopup = ({
    title,
    popupStatus,
    popupHandler,
    ticketData,
    sendJsonMessage,
}) => {
    const {
        customer_name,
        performer_name,
        problem_title,
        room_number,
        submission_date,
        deadline_date,
        problem_description,
        priority_id,
        ticket_id,
        tasks,
    } = ticketData;
    const date = dateFormatter(submission_date);
    const deadlineDate = dateFormatter(reverseDate(deadline_date));
    const isAdministrator =
        localStorage.getItem("role") === "administrator" ? true : false;
    const [isFetching, setIsFetching] = useState(false);

    const handleConfirmTicket = async () => {
        setIsFetching(true);
        try {
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
                        sendJsonMessage({
                            action: "update",
                            user_id: localStorage.getItem("user_id"),
                            username: localStorage.getItem("username"),
                            role: localStorage.getItem("role"),
                            ticket_id: ticket_id,
                        });
                        popupHandler();
                    }
                });
        } catch (err) {
            console.error(err);
        } finally {
            setIsFetching(false);
        }
    };

    return (
        <Popup
            title={title}
            popupStatus={popupStatus}
            popupHandler={popupHandler}
            ticketPriority={priority_id}
        >
            <div className="body__title">
                <div className="body__title-label">Заголовок проблемы </div>
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
                        <b>Выполнить задачи до</b>
                    </div>
                    <div className="deadline__date">{deadlineDate}</div>
                </div>
            </div>

            <div className="body__tasks">
                <div className="body__tasks-title">Список задач</div>
                <div className="body__tasks-items">
                    <TasksList tasksData={tasks} />
                </div>
            </div>

            <DescriptionFeed descriptionText={problem_description} />

            <div className="body__actions body__section">
                <div className="body__actions-users">
                    <div>
                        <b>Заказчик:</b> {customer_name}
                    </div>
                    <div>
                        <b>Исполнитель:</b> {performer_name}
                    </div>
                </div>

                {!isAdministrator ? (
                    <Blockquote
                        type="warning"
                        text="Задачи заявки находятся в процессе выполнения системным администратором"
                    />
                ) : (
                    <Tooltip
                        hasArrow
                        label={
                            !isFetching &&
                            "Вы подтверждаете, что все задачи были выполнены"
                        }
                        placement="top"
                    >
                        <div>
                            <Button
                                onClick={handleConfirmTicket}
                                bgColor="#99D16F"
                            >
                                {isFetching ? (
                                    <>
                                        <div
                                            className="button__text"
                                            style={{ marginRight: "8px" }}
                                        >
                                            Выполнение...
                                        </div>
                                        <Spinner size="sm" color="#fff" />
                                    </>
                                ) : (
                                    <>
                                        <div
                                            className="button__text"
                                            style={{ marginRight: "8px" }}
                                        >
                                            Задачи выполнены
                                        </div>

                                        <CheckmarkIcon fill="#fff" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </Tooltip>
                )}
            </div>
        </Popup>
    );
};

export default ConfirmTicketPopup;
