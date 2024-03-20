import WorksList from "../WorksList/WorksList"
import AngleIcon from "../Icons/AngleIcon"

const TasksList = ({ tasksData }) => {
    console.log(tasksData)

    return (
        <>
            {tasksData.length ? tasksData.map(task => (
                <div key={task.pc_name} className="item">
                    <div className="item__general">
                        <div className="item__general-pc">{task.pc_name}</div>
                        <AngleIcon className="item__general-angle" />
                        <WorksList works={task.works} />
                    </div>
                </div>
            )) : null}
        </>
    )
}


export default TasksList