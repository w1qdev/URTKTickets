import { dateFormatter } from "../../helpers/utils"
import CheckmarkIcon from '../Icons/CheckmarkIcon'
import Button from "../Buttons/Button"
import TasksList from "../TasksList/TasksList"
import { Tooltip } from "@chakra-ui/react"
import Notification from "../Notification/Notification"
import axios from 'axios'
import Popup from "./Popup"


const AcceptTicketPopup = ({ title, popupStatus, popupHandler, ticketData }) => {
    const { customer_name, problem_title, room_number, submission_date, tasks } = ticketData
    const isAdministrator = localStorage.getItem('role') === 'administrator' ? true : false
    const date = dateFormatter(submission_date)

    const handlerAcceptTicket = async () => {
        await axios.put(`http://localhost:8001/api/tickets/${ticketData.ticket_id}/change_status/`, {
            new_status_id: ticketData.state_id + 1 <= 3 ? ticketData.state_id + 1 : ticketData.state_id
        })
        .then(res => {
            if (res.data.status === 'OK') {
                window.location.pathname="/tickets"
            }
        })
    }

    return (
        <Popup title={title} popupStatus={popupStatus} popupHandler={popupHandler}> 
            <div className="body__title">
                <div className="body__title-label">Название проблемы: </div>
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

                {isAdministrator ? (
                    <Button
                        onClick={handlerAcceptTicket}
                        bgColor="#1F7EFF"
                    >
                        <Tooltip marginBottom="10px" marginLeft="20px" hasArrow label='Вы принимаете заявку и согласны с выполнением списка задач' placement='top'>
                            <div className="button__text">Принять заявку</div>
                        </Tooltip>
                        <CheckmarkIcon fill="#fff" />
                    </Button>
                ) : (
                    <Notification type="warning" text="Заявка на рассмотрении у системного администратора" />
                )}
                
                
            </div>
        </Popup>
    )
    
}


export default AcceptTicketPopup