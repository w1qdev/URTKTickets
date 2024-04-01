import { getCurrentDate } from "../../helpers/utils";
import Button from "../Buttons/Button";
import PlusIcon from "../Icons/PlusIcon";
import CheckmarkIcon from "../Icons/CheckmarkIcon";
import CloseIcon from "../Icons/CloseIcon";
import { AnimatePresence, motion } from 'framer-motion'
import { Tooltip } from '@chakra-ui/react'
import AngleIcon from "../Icons/AngleIcon";
import SendTicketIcon from '../Icons/SendTicketIcon'
import TasksList from "../TasksList/TasksList";
import EditIcon from "../Icons/EditIcon";
import axios from 'axios'
import Popup from "./Popup";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuOptionGroup,
    MenuDivider,
    Button as ChakraButton
  } from '@chakra-ui/react' 
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useEffect, useRef, useState } from "react";


const CreateTicketPopup = ({ popupHandler }) => {

    const currentDate = getCurrentDate()

    const [isButtonDisabled, setIsButtonDisabled] = useState(true)
    const inputRef = useRef(null)
    const [room, setRoom] = useState(null)
    const [ticketTitle, setTicketTitle] = useState("Устранение технических неполадок")
    const [tasks, setTasks] = useState([])
    const [currentTask, setCurrentTask] = useState({
        pc_name: '',
        task_description: ''
    })

    const [isCreatingTask, setIsCreatingTask] = useState(false)

    const handleRoom = (e) => {
        setRoom(prev => e.target.textContent)
    }

    const handleInputType = (e) => {
        const { name, value } = e.target

        setCurrentTask(prevTask => {
            const updatedTask = {...prevTask, [name]: value};
            return updatedTask;
        });
    }

    const handleCreatingTask = () => {
        setIsCreatingTask(prev => !prev)
    }

    const handleSaveTasks = () => {
        const newTask = {
            pc_name: currentTask.pc_name,
            task_description: currentTask.task_description
        };
    
        // Обновляем состояние tasks, объединяя новую задачу с текущим списком задач
        setTasks(prevTasks => prevTasks.concat(newTask));
        
        // Очищаем текущую задачу, чтобы подготовиться к следующей
        setCurrentTask({ pc_name: '', task_description: '' });
        setIsCreatingTask(false)
    }

    const handlerRemoveTask = () => {
        setCurrentTask({ pc_name: '', task_description: '' });
        setIsCreatingTask(false)
    }

    const handleEditButtonClick = () => {
        inputRef.current.focus();
    }

    const handleCreateTicket =  async () => {
        try {
            const ticket = {
                problem_title: ticketTitle,
                customer_name: localStorage.getItem('username'),
                room_number: room,
                state_id: 1,
                submission_date: currentDate,
                tasks: tasks,
                teacher_id: localStorage.getItem('user_id'),
            };

            await axios.post('http://127.0.0.1:8001/api/tickets/', ticket)
            .then(res => {
                if (res.data.status === 'OK') {
                    window.location.pathname = '/tickets'
                }
            })
        } catch(error) {
            console.log(error)
        }    
    }

    useEffect(() => {
        if (tasks.length && room && ticketTitle) {
            setIsButtonDisabled(false)
        } else {
            setIsButtonDisabled(true)
        }
    }, [tasks, room, ticketTitle])

    return (
        <Popup
            title="Заявка системному администратору" 
            popupStatus="Создание заявки"
            popupHandler={popupHandler}
        >
        <div className="body__title">
            <div className="body__title-label">Название проблемы: </div>
            <input 
                className="body__title-text" 
                value={ticketTitle} 
                onChange={(e) => setTicketTitle(e.target.value)} 
                placeholder="Устранение технических неполадок...."
                ref={inputRef}
            />
            <Tooltip 
                hasArrow 
                label='Редактировать название проблемы' 
                placement="top" 
                bg='gray.600'
                openDelay={200}
            >
                <div 
                    className="body__title-icon"
                    onClick={handleEditButtonClick}
                >
                    <EditIcon className="icon" />
                </div>
            </Tooltip>
        </div>

        <div className="body__location body__section">
            <div className="body__location__room">
                <div className="title">Аудитория</div>
                <Menu>
                    <MenuButton className="room" as={ChakraButton} rightIcon={<ChevronDownIcon />}>
                        {room ? (
                            <>№ {room}</>
                        ) : 'Аудитория не выбрана'}
                    </MenuButton>
                    <MenuList minWidth='240px' maxHeight='200px' overflow="auto">
                        <MenuOptionGroup title='4 Этаж'>
                            <MenuItem onClick={handleRoom}>40</MenuItem>
                            <MenuItem onClick={handleRoom}>41</MenuItem>
                            <MenuItem onClick={handleRoom}>42</MenuItem>
                            <MenuItem onClick={handleRoom}>43</MenuItem>
                            <MenuItem onClick={handleRoom}>44</MenuItem>
                            <MenuItem onClick={handleRoom}>45</MenuItem>
                        </MenuOptionGroup>
                        <MenuDivider />
                        <MenuOptionGroup title='3 Этаж'>
                            <MenuItem onClick={handleRoom}>30</MenuItem>
                            <MenuItem onClick={handleRoom}>31</MenuItem>
                            <MenuItem onClick={handleRoom}>32</MenuItem>
                            <MenuItem onClick={handleRoom}>33</MenuItem>
                            <MenuItem onClick={handleRoom}>34</MenuItem>
                            <MenuItem onClick={handleRoom}>35</MenuItem>
                        </MenuOptionGroup>
                        <MenuDivider />
                        <MenuOptionGroup title='2 Этаж'>
                            <MenuItem onClick={handleRoom}>20</MenuItem>
                            <MenuItem onClick={handleRoom}>21</MenuItem>
                            <MenuItem onClick={handleRoom}>22</MenuItem>
                            <MenuItem onClick={handleRoom}>23</MenuItem>
                            <MenuItem onClick={handleRoom}>24</MenuItem>
                            <MenuItem onClick={handleRoom}>25</MenuItem>
                        </MenuOptionGroup>
                    </MenuList>
                </Menu>

            </div>
            <div className="body__location__ticket-register-date">
                <div className="date-text">Дата регистрации заявки</div>
                <div className="date">{currentDate}</div>
            </div>
        </div>

        <div className="body__tasks body__section">
            <div className="body__tasks-title">Список задач</div>
            <div className="body__tasks-items">

                <TasksList tasksData={tasks} />

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
                            <PlusIcon width="20" height="20" fill="#56ea4e" />
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
                                <input 
                                    className="new-item__general-pc" 
                                    type="text" 
                                    placeholder="ПК №1"
                                    name="pc_name" 
                                    value={currentTask.pc_name}
                                    onChange={handleInputType}
                                />

                                <AngleIcon className="item__general-angle" />
                                    
                                {/* <WorksList works={currentTask.works} /> */}

                                <textarea 
                                    className="new-item__general-task type-install" 
                                    type="text" 
                                    placeholder="Установка ПО" 
                                    name="task_description"
                                    value={currentTask.task_description}
                                    onChange={handleInputType}
                                />

                                <div className="actions">
                                    { currentTask.pc_name && currentTask.task_description ? (
                                        <>
                                            <div 
                                                className="action"
                                                onClick={handleSaveTasks}
                                            >
                                                <Tooltip 
                                                    hasArrow 
                                                    label='Сохранить изменения' 
                                                    placement="top" 
                                                    bg='gray.600'
                                                    openDelay={200}
                                                >
                                                    <div className="actions__save">
                                                        <CheckmarkIcon fill="#343434" />
                                                    </div>
                                                </Tooltip>
                                            </div>

                                            <div 
                                                className="action"
                                                onClick={handlerRemoveTask}
                                            >
                                                <Tooltip 
                                                    hasArrow 
                                                    label='Удалить задачу' 
                                                    placement="top" 
                                                    bg='gray.600'
                                                    openDelay={200}
                                                >
                                                    <div className="actions__remove">
                                                        <CloseIcon fill="#343434" />
                                                    </div>
                                                </Tooltip>
                                            </div>
                                        </>
                                    ) : null}
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
                bgColor={isButtonDisabled ? "#696969" : "#1F7EFF"}
                onClick={isButtonDisabled ? null : handleCreateTicket}
            >
                <div className="button__text">Создать заявку</div>
                <SendTicketIcon className="send-ticket-icon" fill="#fff" />
            </Button>
            
        </div>
    </Popup>
    )
}


export default CreateTicketPopup;