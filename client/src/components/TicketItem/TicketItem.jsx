import CircleStatusIcon from '../Icons/CircleStatusIcon'
import './TicketItem.scss'


const TicketItemStatus = ({ status }) => {

    if (status === "Awaiting Review") {
        return (
            <div className='ticket-item-status awaiting-review'>
                <CircleStatusIcon mainCircleColor="#C8A837" secondaryCircleColor="#F2E0A1" className="status__icon" />
                <div className="status__text">Ждет рассмотрения</div>
            </div>
        )
    } else if (status === "Awaiting Confirmation") {
        return (
            <div className='ticket-item-status awaiting-confirmation'>
                <CircleStatusIcon mainCircleColor="#7EA8E9" secondaryCircleColor="#7ea8e970" className="status__icon" />
                <div className="status__text">Ждет подтверждения</div>
            </div>
        )
    } else if (status === "Confirmed") {
        return (
            <div className='ticket-item-status confirmed'>
                <CircleStatusIcon mainCircleColor="#89C679" secondaryCircleColor="#B7EAA9" className="status__icon" />
                <div className="status__text">Подтверждено</div>
            </div>
        )
    }
}


const TicketItem = (props) => {

    const { id, title, description, location, user, date, status } = props

    return (
        <div className='ticket-item'>
            <div className="ticket-item__number">1</div>
            <div className="ticket-item__problem">
                <div className="problem__title">Устранение технических неполадок</div>
                <div className="problem__description">проблема 1, проблема 2, проблема 3....</div>
            </div>
            <div className="ticket-item__location">аудитория <strong>№41</strong></div>
            <div className="ticket-item__user">Елена Бушмелева</div>
            <div className="ticket-item__date">14.02.2024</div>
            <div className="ticket-item__status">
                <TicketItemStatus status={status} />
            </div>
        </div>
    )
}

export default TicketItem;