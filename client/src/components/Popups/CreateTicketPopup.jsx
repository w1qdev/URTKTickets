
import { getCurrentDate } from "../../helpers/utils";
import Button from "../Buttons/Button";
import PlusIcon from "../Icons/PlusIcon";
import CheckmarkIcon from "../Icons/CheckmarkIcon";
import CloseIcon from "../Icons/CloseIcon";
import TextDescriprtionIcon from '../Icons/TextDescriptionIcon'
import { AnimatePresence, motion } from 'framer-motion'
import { Tooltip } from '@chakra-ui/react'
import AngleIcon from "../Icons/AngleIcon";
import WorksList from "../WorksList/WorksList";
import SendTicketIcon from '../Icons/SendTicketIcon'
import TasksList from "../TasksList/TasksList";
import EditIcon from "../Icons/EditIcon";
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
import { useRef, useState } from "react";
import WorkItem from "../WorkItem/WorkItem";


const CreateTicketPopup = ({ popupHandler }) => {

    const currentDate = getCurrentDate()

    const inputRef = useRef(null)
    const [room, setRoom] = useState(null)
    const [taskTitle, setTaskTitle] = useState("Устранение технических неполадок")
    const [tasks, setTasks] = useState([])
    const [currentTask, setCurrentTask] = useState({
        pc_name: '',
        works: []
    })
    const [currentWorkDescription, setCurrentWorkDescription] = useState({ task_description: "" })

    const [isCreatingTask, setIsCreatingTask] = useState(false)

    const [isDropDownMenuOpen, setIsDropDownMenuOpen] = useState(false)
    
    const toggleDropDownMenu = () => {
        setIsDropDownMenuOpen(prev => !prev);
    };

    const handleRoom = (e) => {
        setRoom(prev => e.target.textContent)
    }

    const handleInputType = (e) => {
        const { name, value } = e.target

        if (name === "pc_name") {
            setCurrentTask(prevTask => {
                const updatedTask = {...prevTask, [name]: value};
                return updatedTask;
            });
        } 
        
        if (name === "task_description") {
            setCurrentWorkDescription(prevDescription => {
                const updatedDescription = {...prevDescription, [name]: value};
                return updatedDescription;
            });
        }
        
        console.log(currentTask, currentWorkDescription)
    }

    const handleCreatingTask = () => {
        setIsCreatingTask(prev => !prev)
    }

    const handleSaveTasks = () => {
        const newTask = {
            pc_name: currentTask.pc_name,
            works: currentTask.works
        };
    
        // Обновляем состояние tasks, объединяя новую задачу с текущим списком задач
        setTasks(prevTasks => prevTasks.concat(newTask));

        

        // Очищаем текущую задачу, чтобы подготовиться к следующей
        setCurrentTask({ pc_name: '', works: [] });
        setIsCreatingTask(false)
    }

    const handlerRemoveTask = () => {
        setCurrentTask({ pc_name: '', works: [] });
        setIsCreatingTask(false)
    }

    const handleAddTask = () => {
        // Проверяем, что task_description не пустой
        if (currentWorkDescription.task_description.trim() !== '') {
            // Создаем новую задачу
            const newTask = { task_description: currentWorkDescription.task_description };
            
            // Добавляем новую задачу в массив works в объекте currentTask
            setCurrentTask(prevTask => ({
                ...prevTask,
                works: [...prevTask.works, newTask]
            }));
            
            // Очищаем task_description
            setCurrentWorkDescription(prevDescription => ({
                ...prevDescription,
                task_description: ''
            }));
        }
    }

    const handleEditButtonClick = () => {
        inputRef.current.focus();
    }

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
                    value={taskTitle} 
                    onChange={(e) => setTaskTitle(e.target.value)} 
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
                                    <input 
                                        className="new-item__general-pc" 
                                        type="text" 
                                        placeholder="ПК №1"
                                        name="pc_name" 
                                        value={currentTask.pc_name}
                                        onChange={handleInputType}
                                    
                                    />

                                    <AngleIcon className="item__general-angle" />
                                        
                                    <WorksList works={currentTask.works} />

                                    <input 
                                        className="new-item__general-task type-install" 
                                        type="text" 
                                        placeholder="Установка ПО" 
                                        name="task_description"
                                        value={currentWorkDescription.task_description}
                                        onChange={handleInputType}
                                    
                                    />

                                    <div className="actions">
                                        { currentTask.pc_name && currentWorkDescription.task_description ? (
                                            <div 
                                                className="action"
                                                onClick={handleAddTask}
                                            >
                                                <Tooltip 
                                                    hasArrow 
                                                    label='Сохранить задачу' 
                                                    placement="top" 
                                                    bg='gray.600'
                                                    openDelay={200}
                                                >
                                                    <div className="actions__save">
                                                        <PlusIcon fill="#343434" />
                                                    </div>
                                                </Tooltip>
                                            </div>
                                        ) : null}



                                        { currentTask.works.length ? (
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
                                                <div 
                                                    className="action"
                                                
                                                >
                                                    <Tooltip 
                                                        hasArrow 
                                                        label='Добавить подробное описание проблемы' 
                                                        placement="top" 
                                                        bg='gray.600'
                                                        openDelay={200}
                                                    >
                                                        <div className="actions__add-description">
                                                            <TextDescriprtionIcon fill="#343434" />
                                                        </div>
                                                    </Tooltip>
                                                </div>
                                            </>
                                        ) : null }
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