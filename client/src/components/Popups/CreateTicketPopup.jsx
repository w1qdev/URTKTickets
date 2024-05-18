import { getCurrentDate, addDaysToCurrentDate } from "../../helpers/utils";
import Button from "../Buttons/Button";
import { Tooltip, Spinner } from "@chakra-ui/react";
import SendTicketIcon from "../Icons/SendTicketIcon";
import TasksList from "../TasksList/TasksList";
import DescriptionFeed from "../DescriptionFeed/DescriptionFeed";
import TaskAndDescriptionController from "../TaskAndDescriptionController/TaskAndDescriptionController";
import EditIcon from "../Icons/EditIcon";
import axios from "axios";
import Popup from "./Popup";
import MenuGroup from "../Menu/MenuGroup";
import { useEffect, useRef, useState } from "react";
import { endpoints } from "../../api/index";
import { reverseDate } from "../../helpers/utils";
import QuestionIcon from "../Icons/QuestionIcon";

const CreateTicketPopup = ({ popupHandler, sendJsonMessage }) => {
    const currentDate = getCurrentDate();
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const inputRef = useRef(null);
    const [room, setRoom] = useState(null);
    const [ticketTitle, setTicketTitle] = useState(
        "Устранение технических неполадок"
    );
    const [ticketDescription, setTicketDescription] = useState("");
    const [tasks, setTasks] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [currentTask, setCurrentTask] = useState({
        pc_name: "",
        task_description: "",
    });
    const [menuRoomsList, setMenuRoomsList] = useState([
        {
            id: 1,
            menuOptionGroupTitle: "этаж 4",
            items: [
                { id: 1, title: "41" },
                { id: 2, title: "42" },
                { id: 3, title: "43" },
                { id: 4, title: "44" },
                { id: 5, title: "45" },
            ],
        },
        {
            id: 1,
            menuOptionGroupTitle: "этаж 3",
            items: [
                { id: 1, title: "31" },
                { id: 2, title: "32" },
                { id: 3, title: "33" },
                { id: 4, title: "34" },
                { id: 5, title: "35" },
            ],
        },
        {
            id: 1,
            menuOptionGroupTitle: "этаж 2",
            items: [
                { id: 1, title: "21" },
                { id: 2, title: "22" },
                { id: 3, title: "23" },
                { id: 4, title: "24" },
                { id: 5, title: "25" },
            ],
        },
    ]);
    const [selectedLevelOfImportance, setSelectedLevelOfImportant] =
        useState(1);
    const [selectedDeadlineDate, setSelectedDeadlineDate] = useState({
        date: addDaysToCurrentDate(selectedLevelOfImportance * 3).date,
        difference: addDaysToCurrentDate(selectedLevelOfImportance * 3)
            .difference,
    });
    const [isCreatingTask, setIsCreatingTask] = useState(false);
    const [isCreatingDescription, setIsCreatingDescription] = useState(false);

    const handleRoom = (e) => {
        setRoom((prev) => e.target.textContent);
    };

    const handleInputType = (e) => {
        const { name, value } = e.target;

        setCurrentTask((prevTask) => {
            const updatedTask = { ...prevTask, [name]: value };
            return updatedTask;
        });
    };

    const handleTicketDescription = (e) => {
        setTicketDescription((prev) => e.target.value);
    };

    const handleCreatingTask = () => {
        setIsCreatingTask((prev) => !prev);
    };

    const handleCreateDescription = () => {
        setIsCreatingDescription((prev) => !prev);
    };

    const handleRemoveDescription = () => {
        setTicketDescription((prev) => "");
        setIsCreatingDescription((prev) => false);
    };

    const handleSaveTasks = () => {
        const newTask = {
            id: Date.now(),
            pc_name: currentTask.pc_name,
            task_description: currentTask.task_description,
        };

        // Обновляем состояние tasks, объединяя новую задачу с текущим списком задач
        setTasks((prevTasks) => prevTasks.concat(newTask));

        // Очищаем текущую задачу, чтобы подготовиться к следующей
        setCurrentTask({ pc_name: "", task_description: "" });
        setIsCreatingTask(false);
    };

    const handleCancelTask = () => {
        setCurrentTask({ pc_name: "", task_description: "" });
        setIsCreatingTask(false);
    };

    const handleEditButtonClick = () => {
        inputRef.current.focus();
    };

    const handleDeadlineDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const today = new Date();
        const nextDay = new Date(today);
        nextDay.setDate(nextDay.getDate());

        if (selectedDate <= nextDay) {
            // Дата меньше текущей даты плюс один день
            console.log("Выбранная дата меньше текущей даты плюс один день");
        } else {
            // Дата установлена правильно
            setSelectedDeadlineDate((prev) => ({
                ...prev,
                date: e.target.value,
            }));
        }
    };

    const handleCreateTicket = async () => {
        setIsFetching(true);
        try {
            const ticket = {
                problem_title: ticketTitle,
                customer_name: localStorage.getItem("username"),
                room_number: room,
                state_id: 1,
                submission_date: currentDate,
                problem_description: ticketDescription,
                tasks: tasks,
                teacher_id: localStorage.getItem("user_id"),
                priority_id: parseInt(selectedLevelOfImportance),
                deadline_date: selectedDeadlineDate.date.replaceAll("-", "."),
            };

            await axios.post(endpoints.CREATE_TICKET, ticket).then((res) => {
                if (res.data.status === "OK" && res.data.ticket) {
                    sendJsonMessage({
                        action: "update",
                        user_id: localStorage.getItem("user_id"),
                        username: localStorage.getItem("username"),
                        role: localStorage.getItem("role"),
                        ticket_id: res.data.ticket.ticket_id,
                    });
                    popupHandler();
                }
            });
        } catch (error) {
            console.log(error);
        } finally {
            setIsFetching(false);
        }
    };

    const handleRemoveTask = (id) => {
        setTasks((prevTasks) => {
            return prevTasks.filter((task) => task.id !== id);
        });
    };

    useEffect(() => {
        let daysToAdd = 0;

        switch (selectedLevelOfImportance) {
            case 1:
                daysToAdd = 14;
                break;
            case 2:
                daysToAdd = 7;
                break;
            case 3:
                daysToAdd = 3;
                break;
        }

        setSelectedDeadlineDate((prev) => ({
            date: addDaysToCurrentDate(daysToAdd).date,
            difference: addDaysToCurrentDate(daysToAdd).difference,
        }));
    }, [selectedLevelOfImportance]);

    useEffect(() => {
        if (tasks.length && room && ticketTitle) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [tasks, room, ticketTitle]);

    return (
        <Popup
            title="Заявка системному администратору"
            popupStatus="Создание заявки"
            popupHandler={popupHandler}
        >
            <div className="body__title">
                <div className="body__title-label">Название проблемы *</div>
                <input
                    className="body__title-text"
                    value={ticketTitle}
                    onChange={(e) => setTicketTitle(e.target.value)}
                    placeholder="Устранение технических неполадок...."
                    ref={inputRef}
                />
                <Tooltip
                    hasArrow
                    label="Редактировать название проблемы"
                    placement="top"
                    bg="gray.600"
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
                    <div className="title">Аудитория *</div>
                    <MenuGroup
                        menuItems={menuRoomsList}
                        defaultMenuTitle="Аудитория не выбрана"
                        handleClick={handleRoom}
                        menuSelectedItem={room}
                    />
                </div>
                <div className="body__location__ticket-register-date">
                    <div className="date-text">Дата регистрации заявки</div>
                    <div className="date">{currentDate}</div>
                </div>
            </div>

            <div className="body__deadline body__section">
                <div className="body__deadline__date">
                    <div className="title">Выполнить задачу до</div>
                    {/* <DatePicker className="date-picker" /> */}
                    <input
                        min={reverseDate(currentDate)}
                        type="date"
                        className="date"
                        onChange={handleDeadlineDateChange}
                        value={selectedDeadlineDate.date}
                    />
                    {/* <div className="difference">
                        {selectedDeadlineDate.difference}
                    </div> */}
                </div>
            </div>

            <div className="body__tasks body__section">
                <div className="body__tasks-title">Список задач *</div>
                <div className="body__tasks-items">
                    <TasksList
                        handleRemoveTask={handleRemoveTask}
                        tasksData={tasks}
                        isRemovable={true}
                    />

                    <TaskAndDescriptionController
                        isCreatingTask={isCreatingTask}
                        isCreatingDescription={isCreatingDescription}
                        handleCreatingTask={handleCreatingTask}
                        handleCreateDescription={handleCreateDescription}
                        currentTask={currentTask}
                        ticketDescription={ticketDescription}
                        handleRemoveDescription={handleRemoveDescription}
                        handleTicketDescription={handleTicketDescription}
                        handleInputType={handleInputType}
                        handleRemoveTask={handleCancelTask}
                        handleSaveTasks={handleSaveTasks}
                    />

                    <DescriptionFeed
                        isCreatingDescription={isCreatingDescription}
                        descriptionText={ticketDescription}
                        isRemovable={true}
                        handleEditDescription={handleCreateDescription}
                        handleRemoveDescription={handleRemoveDescription}
                    />
                </div>
            </div>

            <div className="body__actions body__section">
                <div className="body__actions-levels">
                    <div className="levels__title">Уровень приоритета</div>
                    <QuestionIcon
                        width="20px"
                        height="20px"
                        className="question-icon"
                        fill="#333"
                        tooltipText="В зависимости от уровня приоритета задачи, сроки выполнения будут изменяться. Низкий уровень приоритета: 14 дней, Средний уровень приоритета: 7 дней, Высокий уровень приоритета: 3 дня"
                    />
                    <div className="levels">
                        <button
                            className={`level__button start ${
                                selectedLevelOfImportance === 1 && "selected"
                            }`}
                            onClick={() => setSelectedLevelOfImportant(1)}
                        >
                            Низкий
                        </button>
                        <button
                            className={`level__button mid ${
                                selectedLevelOfImportance === 2 && "selected"
                            }`}
                            onClick={() => setSelectedLevelOfImportant(2)}
                        >
                            Средний
                        </button>
                        <button
                            className={`level__button end ${
                                selectedLevelOfImportance === 3 && "selected"
                            }`}
                            onClick={() => setSelectedLevelOfImportant(3)}
                        >
                            Высокий
                        </button>
                    </div>
                </div>
                {isFetching ? (
                    <Button
                        bgColor={isButtonDisabled ? "#696969" : "#1F7EFF"}
                        isDisabled={isButtonDisabled}
                    >
                        <div className="button__text">Создание...</div>
                        <Spinner size="sm" color="#fff" />
                    </Button>
                ) : (
                    <Tooltip
                        hasArrow
                        label={
                            isButtonDisabled
                                ? "Похоже, что вы не указали аудиторию, или не добавили хотя бы одну задачу"
                                : null
                        }
                        placement="top"
                        bg="gray.800"
                        openDelay={200}
                    >
                        <div>
                            <Button
                                bgColor={
                                    isButtonDisabled ? "#696969" : "#1F7EFF"
                                }
                                onClick={
                                    isButtonDisabled ? null : handleCreateTicket
                                }
                                isDisabled={isButtonDisabled}
                            >
                                <div className="button__text">
                                    Создать заявку
                                </div>

                                <SendTicketIcon
                                    className="send-ticket-icon"
                                    fill="#fff"
                                />
                            </Button>
                        </div>
                    </Tooltip>
                )}
            </div>
        </Popup>
    );
};

export default CreateTicketPopup;
