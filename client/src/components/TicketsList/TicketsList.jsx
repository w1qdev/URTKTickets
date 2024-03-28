import TicketItem from "../TicketItem/TicketItem"
import NoTicketsImage from '../../assets/other/no-tickets-img.png'


const TicketsList = ({ ticketsData }) => {

    return (
        <>
            {ticketsData.length ? ticketsData.map(ticket => (
                <TicketItem key={ticket.ticket_id} {...ticket} />
            )) : (
                <div className='no-tickets'>
                    <img className='no-tickets__img' src={NoTicketsImage} alt="Нет новых тикетов" />
                    <div className="no-tickets__description">Ой.... У вас нет новых тикетов</div>
                </div>
            )}
        </> 
    )
}


export default TicketsList