
import { getCurrentDate } from "../../helpers/utils";
import Button from "../Buttons/Button";
import PlusIcon from "../Icons/PlusIcon";
import CheckmarkIcon from "../Icons/CheckmarkIcon";
import CloseIcon from "../Icons/CloseIcon";
import TextDescriprtionIcon from '../Icons/TextDescriptionIcon'
import { AnimatePresence, motion } from 'framer-motion'
import AngleIcon from "../Icons/AngleIcon";
import SendTicketIcon from '../Icons/SendTicketIcon'
import Popup from "./Popup";
import { useState } from "react";


const CreateTicketPopup = ({ popupHandler }) => {

    const currentDate = getCurrentDate()
    const [isCreatingTask, setIsCreatingTask] = useState(false)

    const [isDropDownMenuOpen, setIsDropDownMenuOpen] = useState(false)

    const toggleDropDownMenu = () => {
        setIsDropDownMenuOpen(prev => !prev);
    };

    const handleCreatingTask = () => setIsCreatingTask(prev => !prev)

    return (
        <Popup
            title="Заявка системному администратору" 
            popupStatus="Создание заявки"
            popupHandler={popupHandler}
        >
            <div className="body__location body__section">
                <div className="body__location__room">
                    <div className="title">Аудитория</div>
                    <div 
                        className="room"
                        onClick={toggleDropDownMenu}
                    >
                        <div className="room__number">41</div>
                        <div className="chevron-icon"></div>

                        {isDropDownMenuOpen ? (
                            <ul className="dropdown-list">
                                <li className="dropdown-item">Пункт 1</li>
                                <li className="dropdown-item">Пункт 2</li>
                                <li className="dropdown-item">Пункт 3</li>
                            </ul>
                        ) : null}
                    </div>
                </div>
                <div className="body__location__ticket-register-date">
                    <div className="date-text">Дата регистрации заявки</div>
                    <div className="date">{currentDate}</div>
                </div>
            </div>

            <div className="body__tasks body__section">
                <div className="body__tasks-title">Список задач</div>
                <div className="body__tasks-items">
                    {/* <div className="item">
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

                                
                                    <div 
                                        className="actions"
                                    >
                                        <div className="actions__save">
                                            <CheckmarkIcon fill="#343434" />
                                        </div>
                                        <div className="actions__remove">
                                            <CloseIcon fill="#343434" />
                                        </div>
                                        <div className="actions__add-description">
                                            <TextDescriprtionIcon fill="#343434" />
                                        </div>
                                    </div>
                            </div>
                            
                        </div>
                    </div> */}


                    {!isCreatingTask ? (
                        <AnimatePresence>
                            <motion.button 
                                className="create__task-button"
                                onClick={handleCreatingTask}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, transition: 0.2 }}
                            >
                                <div className="button__text">Добавить задачу</div>
                                <PlusIcon width="20" height="20" fill="#5383FF" />
                            </motion.button>
                        </AnimatePresence>
                    ) : (
                        <AnimatePresence>
                            <motion.div 
                                className="new-item"
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 , transition: 0.3}}
                                exit={{ scale: 0.95, opacity: 0, transition: 0.2 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="new-item__general">
                                    <input className="new-item__general-pc" type="text" placeholder="ПК №1" />
                                    <AngleIcon className="item__general-angle" />
                                    <input className="new-item__general-task type-install" type="text" placeholder="Установка ПО" />

                                    <div className="actions">
                                        <div className="actions__save">
                                            <CheckmarkIcon fill="#343434" />
                                        </div>
                                        <div className="actions__remove">
                                            <CloseIcon fill="#343434" />
                                        </div>
                                        <div className="actions__add-description">
                                            <TextDescriprtionIcon fill="#343434" />
                                        </div>
                                    </div>

                                </div>
                                
                            </motion.div>
                        </AnimatePresence>
                    )}

                    

                </div>
            </div>

            <div className="body__actions body__section">
                <div className="body__actions-user"><b>Исполнитель:</b> Андрей Ларионов</div>
                <Button
                    bgColor="#1F7EFF"
                >
                    <div className="button__text">Создать заявку</div>
                    <SendTicketIcon className="send-ticket-icon" fill="#fff" />
                </Button>
                
            </div>
        </Popup>
    )
}


export default CreateTicketPopup;