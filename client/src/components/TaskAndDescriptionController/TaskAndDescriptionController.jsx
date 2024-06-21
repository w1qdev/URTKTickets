import { AnimatePresence, motion } from "framer-motion";
import { Tooltip } from "@chakra-ui/react";
import PlusIcon from "../Icons/PlusIcon";
import TextDescriptionIcon from "../Icons/TextDescriptionIcon";
import AngleIcon from "../Icons/AngleIcon";
// import { useKeyPress } from "../../hooks/useKeyPress";

const TaskAndDescriptionController = (props) => {
    let controllerBody;

    // FIXME: Save task doesn't work when user press Enter button
    // const isPressedSubmitButton = useKeyPress(["Enter"], () => {
    //     props.handleSaveTasks();
    // });

    if (!props.isCreatingTask && !props.isCreatingDescription) {
        controllerBody = (
            <AnimatePresence>
                <div className="task__buttons">
                    <motion.button
                        className="create__task-button"
                        onClick={props.handleCreatingTask}
                        type="submit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: 0.2 }}
                    >
                        <div className="button__text">Добавить задачу</div>
                        <PlusIcon width="20" height="20" fill="#56ea4e" />
                    </motion.button>
                    {props.ticketDescription.length <= 0 && (
                        <Tooltip
                            label="Добавить описание заявки"
                            hasArrow
                            placement="top"
                        >
                            <motion.button
                                className="add__description-button"
                                onClick={props.handleCreateDescription}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{
                                    opacity: 0,
                                    transition: 0.2,
                                }}
                            >
                                <TextDescriptionIcon
                                    width="15px"
                                    height="15px"
                                    fill="#979797"
                                />
                            </motion.button>
                        </Tooltip>
                    )}
                </div>
            </AnimatePresence>
        );
    }
    if (props.isCreatingTask) {
        controllerBody = (
            <AnimatePresence>
                <motion.div
                    className="new-item"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1, transition: 0.3 }}
                    exit={{
                        scale: 0.95,
                        opacity: 0,
                        transition: 0.2,
                    }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="new-item__general">
                        <input
                            className="new-item__general-pc"
                            type="text"
                            placeholder="ПК №1"
                            name="pc_name"
                            value={props.currentTask.pc_name}
                            onChange={props.handleInputType}
                        />

                        <AngleIcon className="item__general-angle" />

                        <textarea
                            className="new-item__general-task type-install"
                            type="text"
                            placeholder="Установка ПО"
                            name="task_description"
                            value={props.currentTask.task_description}
                            onChange={props.handleInputType}
                        />

                        <div className="actions">
                            <div
                                className="action"
                                onClick={props.handleRemoveTask}
                            >
                                <div className="actions__remove">Отмена</div>
                            </div>

                            {props.currentTask.pc_name &&
                            props.currentTask.task_description ? (
                                <>
                                    <div
                                        className="action"
                                        onClick={props.handleSaveTasks}
                                    >
                                        <Tooltip
                                            hasArrow
                                            label="Сохранить изменения"
                                            placement="top"
                                            bg="gray.600"
                                            openDelay={200}
                                        >
                                            <div className="actions__save">
                                                Добавить задачу
                                            </div>
                                        </Tooltip>
                                    </div>
                                </>
                            ) : null}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    if (props.isCreatingDescription) {
        controllerBody = (
            <AnimatePresence>
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1, transition: 0.3 }}
                    exit={{
                        scale: 0.95,
                        opacity: 0,
                        transition: 0.2,
                    }}
                    transition={{ duration: 0.4 }}
                >
                    <textarea
                        value={props.ticketDescription}
                        onChange={props.handleTicketDescription}
                        autoFocus
                        placeholder="Ваш комментарий..."
                        className="ticket-description"
                    />

                    <div className="actions">
                        <div
                            className="action"
                            onClick={props.handleRemoveDescription}
                            style={{ marginRight: "5px" }}
                        >
                            <div className="actions__remove">
                                Отмена
                                {/* <CloseIcon fill="#343434" /> */}
                            </div>
                        </div>

                        {props.ticketDescription.length ? (
                            <>
                                <div
                                    className="action"
                                    onClick={props.handleCreateDescription}
                                >
                                    <div className="actions__save">
                                        Добавить комментарий
                                        {/* <CheckmarkIcon fill="#343434" /> */}
                                    </div>
                                </div>
                            </>
                        ) : null}
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    return controllerBody;
};

export default TaskAndDescriptionController;
