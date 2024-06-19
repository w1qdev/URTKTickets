import AngleIcon from "../Icons/AngleIcon";
import TrashIcon from "../Icons/TrashIcon";
import { Tooltip } from "@chakra-ui/react";
import "./TasksList.scss";

const TasksList = ({ tasksData, handleRemoveTask, isRemovable = false }) => {
    return (
        <>
            {tasksData.length
                ? tasksData.map((task) => (
                      <div key={task.id} className="item">
                          <div className="item__general">
                              <div className="item__general-pc">
                                  {task.pc_name}
                              </div>
                              <AngleIcon className="item__general-angle" />
                              <div className="item__description">
                                  {task.task_description}
                              </div>

                              {isRemovable ? (
                                  <div className="enviroment">
                                      <Tooltip
                                          hasArrow
                                          label="Удалить задачу"
                                          placement="top"
                                          bg="gray.700"
                                      >
                                          <button
                                              onClick={() =>
                                                  handleRemoveTask(task.id)
                                              }
                                              className="enviroment remove"
                                          >
                                              <TrashIcon
                                                  className="trash-icon"
                                                  width="20px"
                                                  height="20px"
                                              />
                                          </button>
                                      </Tooltip>
                                  </div>
                              ) : null}
                          </div>
                      </div>
                  ))
                : null}
        </>
    );
};

export default TasksList;
