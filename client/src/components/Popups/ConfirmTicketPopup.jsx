import { getCurrentDate } from "../../helpers/utils";
import { AnimatePresence, motion } from 'framer-motion'
import CloseIcon from "../Icons/CloseIcon";
import TextDescriptionIcon from "../Icons/TextDescriptionIcon";
import AngleIcon from "../Icons/AngleIcon";
import CheckmarkIcon from "../Icons/CheckmarkIcon";
import Button from "../Buttons/Button";
import Popup from "./Popup";


const ConfirmTicketPopup = ({ title, popupStatus, popupHandler }) => {

    const currentDate = getCurrentDate()

    const handleConfirmTicket = () => {

    }

    return (
        <Popup title={title} popupStatus={popupStatus} popupHandler={popupHandler}>
            <div className="body__location body__section">
                <div className="body__location__room">
                    <div className="title">Аудитория</div>
                    <div className="room">41</div>
                </div>
                <div className="body__location__ticket-register-date">
                    <div className="date-text">Дата регистрации заявки</div>
                    <div className="date">{currentDate}</div>
                </div>
            </div>

            <div className="body__tasks body__section">
                <div className="body__tasks-title">Список задач</div>
                <div className="body__tasks-items">
                    <div className="item">
                        <div className="item__general">
                            <div className="item__general-pc">ПК №4</div>
                            <AngleIcon className="item__general-angle" />

                            <div className="item__general__tasks">
                                <div className="item__general__tasks-task type-fix">Ремонт ПК</div>
                                <div className="item__general__tasks-task type-clear">Чистка ПК</div>
                                <div className="item__general__tasks-task type-clear">Чистка ПК</div>
                                <div className="item__general__tasks-task type-clear">Чистка ПК</div>
                                <div className="item__general__tasks-task type-install">Установка ПО</div>
                                <div className="item__general__tasks-task type-install">Установка ПО</div>
                                <div className="item__general__tasks-task type-install">Установка ПО</div>
                                <div className="item__general__tasks-task type-install">Установка ПО</div>
                                <div className="item__general__tasks-task type-install">Установка ПО</div>
                                <div className="item__general__tasks-task type-install">Установка ПО</div>
                                <div className="item__general__tasks-task type-not-working">Периферия не работает</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="body__actions body__section">
                <div className="body__actions-user"><b>Исполнитель:</b> Андрей Ларионов</div>
                <Button
                    onCLick={handleConfirmTicket}
                    bgColor="#99D16F"
                >
                    <div className="button__text">Задачи выполнены</div>
                    <CheckmarkIcon fill="#fff" />
                </Button>
                
            </div>
        </Popup>
    )
}


export default ConfirmTicketPopup;