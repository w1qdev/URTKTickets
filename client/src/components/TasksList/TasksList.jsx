import AngleIcon from "../Icons/AngleIcon"


const TasksList = ({ tasksData }) => {
    return (
        <>
            {tasksData.length ? tasksData.map(task => (
                <div key={task.pc_name} className="item">
                    <div className="item__general">
                        <div className="item__general-pc">{task.pc_name}</div>
                        <AngleIcon className="item__general-angle" />
                        <div className="item__description">{task.task_description}</div>
                    </div>
                </div>
            )) : null}
        </>
    )
}


export default TasksList