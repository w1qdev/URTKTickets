import TasksList from "../TasksList/TasksList"
import Notification from "../Notification/Notification"
import { dateFormatter } from "../../helpers/utils"
import Popup from "./Popup"


const ViewTicketPopup = ({ title, popupStatus, popupHandler, ticketData }) => {

    const { customer_name, problem_title, room_number, submission_date, tasks } = ticketData
    const date = dateFormatter(submission_date)

    return (
        <Popup title={title} popupStatus={popupStatus} popupHandler={popupHandler}>
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

            <div className="body__tasks body__section">
                <div className="body__tasks-title">Список задач</div>
                <div className="body__tasks-items">
                    <TasksList tasksData={tasks} />
                </div>
            </div>

            <div className="body__actions body__section">
                <div className="body__actions-user"><b>Заказчик:</b> {customer_name}</div>

                <Notification type="success" text="Задачи выполнены системным администратором и утверждены заказчиком" />
            </div>
        </Popup>
    )
}

export default ViewTicketPopup
