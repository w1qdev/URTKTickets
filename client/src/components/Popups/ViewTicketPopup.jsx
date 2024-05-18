import TasksList from "../TasksList/TasksList";
// import Notification from "../Notification/Notification";
import DescriptionFeed from "../DescriptionFeed/DescriptionFeed";
import { dateFormatter, reverseDate } from "../../helpers/utils";
import DownlaodIcon from "../Icons/DownloadIcon";
import { SERVER_ORIGIN_URI, API_PATH } from "../../api";
import Popup from "./Popup";
import DownloadReportButton from "../Buttons/DownloadReportButton";
import axios from "axios";
import { useState } from "react";
import { Spinner, Tooltip } from "@chakra-ui/react";
import TrashIcon from "../Icons/TrashIcon";

const ViewTicketPopup = ({
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
        problem_description,
        submission_date,
        priority_id,
        tasks,
        ticket_id,
        teacher_id,
    } = ticketData;
    const date = dateFormatter(submission_date);

    const [isFetching, setIsFetching] = useState(false);

    const handleFileOperations = async () => {
        setIsFetching((prev) => true);
        try {
            // Отправка данных на сервер для генерации файла
            await axios.post(`${SERVER_ORIGIN_URI}/generate-report/`, {
                ticketData,
            });

            // Загрузка сгенерированного файла
            const response = await axios.get(
                `${SERVER_ORIGIN_URI}/download-report/report_${ticket_id}.docx`,
                { responseType: "blob" }
            );
            const url = URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Отчет_№${ticket_id}.docx`); // Установите желаемое имя файла
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Ошибка при выполнении операций с файлом:", error);
        }
        setIsFetching((prev) => false);
    };

    const handleRemoveTicket = async () => {
        try {
            await axios
                .delete(`${SERVER_ORIGIN_URI}${API_PATH}/tickets/${ticket_id}`)
                .then((res) => {
                    if (res.status === 200) {
                        console.log("Tickets successfuly removed");
                        sendJsonMessage({
                            action: "remove",
                            user_id: localStorage.getItem("user_id"),
                            username: localStorage.getItem("username"),
                            role: localStorage.getItem("role"),
                            teacher_id: teacher_id,
                        });
                        popupHandler();
                    } else {
                        console.error("Failed to delete ticket", res);
                    }
                });
        } catch (err) {
            console.error("Some error with removing the tickets", err);
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

                <div className="view-ticket__actions">
                    <Tooltip hasArrow label="Удалить заявку" placement="top">
                        <button
                            onClick={handleRemoveTicket}
                            className="remove-ticket"
                        >
                            <TrashIcon
                                className="icon"
                                width="22px"
                                height="22px"
                            />
                        </button>
                    </Tooltip>

                    <DownloadReportButton onClick={handleFileOperations}>
                        {isFetching ? (
                            <>
                                Скачивание...
                                <Spinner size="sm" color="#fff" />
                            </>
                        ) : (
                            <>
                                Скачать отчет
                                <DownlaodIcon width="24px" height="24px" />
                            </>
                        )}
                    </DownloadReportButton>
                </div>
            </div>
        </Popup>
    );
};

export default ViewTicketPopup;
