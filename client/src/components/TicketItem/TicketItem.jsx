import { useState } from 'react'
import CircleStatusIcon from '../Icons/CircleStatusIcon'
import { AnimatePresence } from 'framer-motion'
import AcceptTicketPopup from '../Popups/AcceptTicketPopup'
import ConfirmTicketPopup from '../Popups/ConfirmTicketPopup'
import './TicketItem.scss'
import ViewTicketPopup from '../Popups/ViewTicketPopup'
import { getTicketStateNameById } from '../../helpers/utils'


const PopupBody = ({ status, popupHandler }) => {

    const popupContainers = {
        'Awaiting Review': <AcceptTicketPopup popupHandler={popupHandler} title="Рассмотрение заявки" popupStatus="Подтверждение заявки" />,
        'Awaiting Confirmation': <ConfirmTicketPopup popupHandler={popupHandler} title="Подтверждение выполненных задач" popupStatus="Отправка на проверку" />,
        'Confirmed': <ViewTicketPopup popupHandler={popupHandler} title="Заявка системному администратору" popupStatus="Просмотр заявки" />,
    }
    
    return popupContainers[status]
}


const TicketItemStatus = ({ status }) => {

    if (status === "Awaiting Review") {
        return (
            <div className='ticket-item-status awaiting-review'>
                {/* <CircleStatusIcon mainCircleColor="#C8A837" secondaryCircleColor="#F2E0A1" className="status__icon" /> */}
                <div className="status__text">Ждет рассмотрения</div>
            </div>
        )
    } else if (status === "Awaiting Confirmation") {
        return (
            <div className='ticket-item-status awaiting-confirmation'>
                {/* <CircleStatusIcon mainCircleColor="#7EA8E9" secondaryCircleColor="#7ea8e970" className="status__icon" /> */}
                <div className="status__text">Ждет подтверждения</div>
            </div>
        )
    } else if (status === "Confirmed") {
        return (
            <div className='ticket-item-status confirmed'>
                {/* <CircleStatusIcon mainCircleColor="#89C679" secondaryCircleColor="#B7EAA9" className="status__icon" /> */}
                <div className="status__text">Подтверждено</div>
            </div>
        )
    }
}


const TicketItem = (props) => {

    const { ticket_id, problem_title, description, room_number, customer_name, submission_date, fullData, state_id } = props
    const ticket_status = getTicketStateNameById(state_id)
    const [isPopupOpen, setIsPopupOpen] = useState(false)

    const handlePopup = () => setIsPopupOpen(prev => !prev)

    return (
        <>
            <AnimatePresence>
                {isPopupOpen ? <PopupBody status={ticket_status} popupHandler={handlePopup} /> : null}
            </AnimatePresence>
            <div 
                className='ticket-item'
                onClick={handlePopup}
            >
                <div className="ticket-item__number">{ticket_id}</div>
                <div className="ticket-item__problem">
                    <div className="problem__title">{problem_title}</div>
                    <div className="problem__description">{description}</div>
                </div>
                <div className="ticket-item__location">Аудитория <strong>№{room_number}</strong></div>
                <div className="ticket-item__user">{customer_name}</div>
                <div className="ticket-item__date">{submission_date}</div>
                <div className="ticket-item__status">
                    <TicketItemStatus status={ticket_status} />
                </div>
            </div>
        </>
    )
}

export default TicketItem;