import WorkItem from "../WorkItem/WorkItem"


const WorksList = ({ works }) => {
    return (
        <>
            { works.length ? works.map(work => (
                <WorkItem key={work.text_description} work_data={work} />
            )) : null}
        </>
    )
}

export default WorksList