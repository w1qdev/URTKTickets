import './TicketsContainer.scss'
import TicketItem from '../TicketItem/TicketItem.jsx';


const TicketsContainer = () => {
    return (
        <div className="tickets-container">
            <div className="tickets-container__header">
                <div className="tickets-container__header-item number">Номер</div>
                <div className="tickets-container__header-item__separator"></div>
                <div className="tickets-container__header-item problem">Проблема</div>
                <div className="tickets-container__header-item__separator"></div>
                <div className="tickets-container__header-item location">Местоположение</div>
                <div className="tickets-container__header-item__separator"></div>
                <div className="tickets-container__header-item user">Заказчик</div>
                <div className="tickets-container__header-item__separator"></div>
                <div className="tickets-container__header-item date">Дата</div>
                <div className="tickets-container__header-item__separator"></div>
                <div className="tickets-container__header-item status">Статус</div>
            </div>

            <div className="tickets-container__problems-list">
                <TicketItem status="Awaiting Review" />
                <TicketItem status="Awaiting Confirmation" />
                <TicketItem status="Awaiting Confirmation" />
                <TicketItem status="Awaiting Confirmation" />
                <TicketItem status="Awaiting Confirmation" />
                <TicketItem status="Confirmed" />
                <TicketItem status="Confirmed" />
                <TicketItem status="Confirmed" />
                <TicketItem status="Confirmed" />
                <TicketItem status="Confirmed" />
            </div>
        </div>
    )
}


export default TicketsContainer;