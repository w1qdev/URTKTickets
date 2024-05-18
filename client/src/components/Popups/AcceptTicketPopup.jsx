import { dateFormatter, reverseDate } from "../../helpers/utils";
import CheckmarkIcon from "../Icons/CheckmarkIcon";
import Button from "../Buttons/Button";
import TasksList from "../TasksList/TasksList";
import { Tooltip } from "@chakra-ui/react";
import Notification from "../Notification/Notification";
import DescriptionFeed from "../DescriptionFeed/DescriptionFeed";
import axios from "axios";
import Popup from "./Popup";
import { useState } from "react";
import { Spinner } from "@chakra-ui/react";

const AcceptTicketPopup = ({
    title,
    popupStatus,
    popupHandler,
    ticketData,
    sendJsonMessage,
}) => {
    const {
        customer_name,
        problem_title,
        room_number,
        submission_date,
        problem_description,
        deadline_date,
        priority_id,
        tasks,
        ticket_id,
    } = ticketData;
    const isAdministrator =
        localStorage.getItem("role") === "administrator" ? true : false;
    const username = localStorage.getItem("username");
    const date = dateFormatter(submission_date);
    const deadlineDate = dateFormatter(reverseDate(deadline_date));
    const [isFetching, setIsFetching] = useState(false);

    const handlerAcceptTicket = async () => {
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
                        administratorUsername: username,
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
                <div className="body__title-label">Название проблемы </div>
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
                    {/* <DatePicker className="date-picker" /> */}
                    <div className="deadline__date">{deadlineDate} г.</div>
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
                </div>

                {isAdministrator ? (
                    <Button onClick={handlerAcceptTicket} bgColor="#1F7EFF">
                        {isFetching ? (
                            <>
                                <div className="button__text">
                                    Выполнение...
                                </div>
                                <Spinner size="sm" color="#fff" />
                            </>
                        ) : (
                            <>
                                <Tooltip
                                    marginBottom="10px"
                                    marginLeft="20px"
                                    hasArrow
                                    label="Вы принимаете заявку и согласны с выполнением списка задач"
                                    placement="top"
                                >
                                    <div className="button__text">
                                        Принять заявку
                                    </div>
                                </Tooltip>
                                <CheckmarkIcon fill="#fff" />
                            </>
                        )}
                    </Button>
                ) : (
                    <Notification
                        type="warning"
                        text="Заявка на рассмотрении у системного администратора"
                    />
                )}
            </div>
        </Popup>
    );
};

export default AcceptTicketPopup;
