import { useState } from 'react'
import TicketItemStatusBadge from '../Badges/TicketItemStatusBadge/TicketItemStatusBadge'
import { AnimatePresence } from 'framer-motion'
import AcceptTicketPopup from '../Popups/AcceptTicketPopup'
import ConfirmTicketPopup from '../Popups/ConfirmTicketPopup'
import './TicketItem.scss'
import ViewTicketPopup from '../Popups/ViewTicketPopup'
import { getTicketStateNameById } from '../../helpers/utils'


const PopupBody = ({ status, popupHandler, ticketData }) => {

    const popupContainers = {
        'Awaiting Review': <AcceptTicketPopup ticketData={ticketData} popupHandler={popupHandler} title="Рассмотрение заявки" popupStatus="Подтверждение заявки" />,
        'Awaiting Confirmation': <ConfirmTicketPopup ticketData={ticketData} popupHandler={popupHandler} title="Подтверждение выполненных задач" popupStatus="Отправка на проверку" />,
        'Confirmed': <ViewTicketPopup ticketData={ticketData} popupHandler={popupHandler} title="Заявка системному администратору" popupStatus="Просмотр заявки" />,
    }
    
    return popupContainers[status]
}

const TicketItem = (props) => {

    const { ticket_id, problem_title, task_description, room_number, customer_name, submission_date, tasks, state_id } = props
    const ticket_status = getTicketStateNameById(state_id)
    const [isPopupOpen, setIsPopupOpen] = useState(false)

    const handlePopup = () => setIsPopupOpen(prev => !prev)

    return (
        <>
            <AnimatePresence>
                {isPopupOpen ? <PopupBody ticketData={props} status={ticket_status} popupHandler={handlePopup} /> : null}
            </AnimatePresence>
            <div 
                className='ticket-item'
                onClick={handlePopup}
            >
                <div className="ticket-item__number">{ticket_id}</div>
                <div className="ticket-item__problem">
                    <div className="problem__title">{problem_title}</div>
                    <div className="problem__description">{task_description}</div>
                </div>
                <div className="ticket-item__location">Аудитория <strong>№{room_number}</strong></div>
                <div className="ticket-item__user">{customer_name}</div>
                <div className="ticket-item__date">{submission_date}</div>
                <div className="ticket-item__status">
                    <TicketItemStatusBadge status={ticket_status} />
                </div>
            </div>
        </>
    )
}

export default TicketItem;