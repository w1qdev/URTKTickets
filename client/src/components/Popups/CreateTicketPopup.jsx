import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Tooltip, Spinner } from "@chakra-ui/react";

import Button from "../Buttons/Button";
import SendTicketIcon from "../Icons/SendTicketIcon";
import TasksList from "../TasksList/TasksList";
import DescriptionFeed from "../DescriptionFeed/DescriptionFeed";
import TaskAndDescriptionController from "../TaskAndDescriptionController/TaskAndDescriptionController";
import EditIcon from "../Icons/EditIcon";
import Popup from "./Popup";
import MenuGroup from "../Menu/MenuGroup";
import { endpoints } from "../../api/index";
import QuestionIcon from "../Icons/QuestionIcon";
import { toastSuccess } from "../../helpers/toasts";
import {
    menuRoomsData,
    reverseDate,
    getCountDeadlineDaysByLevelOfImportance,
    getCurrentDate,
    addDaysToCurrentDate,
    levelsOfTicketPriority,
} from "../../helpers/utils";

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
    const [menuRoomsList, setMenuRoomsList] = useState([...menuRoomsData]);
    const [selectedLevelOfImportance, setSelectedLevelOfImportant] = useState(
        levelsOfTicketPriority.mid
    );
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
        console.log(currentTask.pc_name);
        if (currentTask.pc_name === "" || currentTask.task_description === "") {
            // if labels empty
            return;
        }

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
        const currentDate = new Date();
        const nextDay = new Date(currentDate);
        nextDay.setDate(nextDay.getDate());

        if (selectedDate < nextDay) {
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
                deadline_date: selectedDeadlineDate.date.replaceAll("-", "."),
                problem_description: ticketDescription,
                tasks: tasks,
                teacher_id: localStorage.getItem("user_id"),
                priority_id: parseInt(selectedLevelOfImportance),
                createdAt: new Date(),
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
                    toastSuccess(
                        "Ваша заявка успешно создана и будет рассмотрена в ближайшее время."
                    );
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
        let daysToAdd = getCountDeadlineDaysByLevelOfImportance(
            selectedLevelOfImportance
        );

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
                <div className="body__title-label">
                    Название проблемы{" "}
                    <span style={{ color: "red", fontWeight: "800" }}>*</span>
                </div>
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
                    <div className="title">
                        Аудитория{" "}
                        <span style={{ color: "red", fontWeight: "800" }}>
                            *
                        </span>
                    </div>
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
                    <input
                        min={reverseDate(currentDate)}
                        type="date"
                        className="date"
                        onChange={handleDeadlineDateChange}
                        value={selectedDeadlineDate.date}
                    />
                </div>
            </div>

            <div className="body__tasks body__section">
                <div className="body__tasks-title">
                    Список задач{" "}
                    {tasks.length === 0 && (
                        <span style={{ opacity: 0.5 }}>
                            (минимум 1 задача){" "}
                        </span>
                    )}
                    <span style={{ color: "red", fontWeight: "800" }}>*</span>
                </div>
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
                                selectedLevelOfImportance ===
                                    levelsOfTicketPriority.low && "selected"
                            }`}
                            onClick={() => setSelectedLevelOfImportant(1)}
                        >
                            Низкий
                        </button>
                        <button
                            className={`level__button mid ${
                                selectedLevelOfImportance ===
                                    levelsOfTicketPriority.mid && "selected"
                            }`}
                            onClick={() => setSelectedLevelOfImportant(2)}
                        >
                            Средний
                        </button>
                        <button
                            className={`level__button end ${
                                selectedLevelOfImportance ===
                                    levelsOfTicketPriority.high && "selected"
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
                        <div
                            className="button__text"
                            style={{ marginRight: "8px" }}
                        >
                            Создание...
                        </div>
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
                                <div
                                    className="button__text"
                                    style={{ marginRight: "8px" }}
                                >
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
