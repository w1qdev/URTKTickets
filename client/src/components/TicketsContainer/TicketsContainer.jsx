import './TicketsContainer.scss'
import TicketItem from '../TicketItem/TicketItem.jsx';
import NoTicketsImage from '../../assets/other/no-tickets-img.png'
import useGetData from '../../hooks/useGetData';
import { endpoints } from '../../helpers/api';
import { useState } from 'react';


const TicketsContainer = () => {

    const [ticketsData, setTicketsData] = useGetData(`${endpoints.getAllTickets}`, {
        role: localStorage.getItem('role'),
        user_id: localStorage.getItem('user_id'),
    })

    console.log(ticketsData)

    const [tickets, setTickets] = useState([
        {id: 1, status: "Awaiting Review", title: "Устранение технических неполадок", description: "Проблема №1, Проблема №2, Проблема №3", location: "№41", user: "Елена Бушмелёва", date: "17.03.2024", fullData: {} },
        {id: 2, status: "Awaiting Review", title: "Устранение технических неполадок", description: "Проблема №1, Проблема №2, Проблема №3", location: "№45", user: "Елена Бушмелёва", date: "18.03.2024", fullData: {} },
        {id: 3, status: "Awaiting Confirmation", title: "Устранение технических неполадок", description: "Проблема №1, Проблема №2, Проблема №3", location: "№301", user: "Елена Бушмелёва", date: "9.03.2024", fullData: {} },
        {id: 4, status: "Confirmed", title: "Устранение технических неполадок", description: "Проблема №1, Проблема №2, Проблема №3", location: "№31", user: "Елена Бушмелёва", date: "12.03.2024", fullData: {} },
        {id: 5, status: "Awaiting Confirmation", title: "Устранение технических неполадок", description: "Проблема №1, Проблема №2, Проблема №3", location: "№31", user: "Елена Бушмелёва", date: "12.03.2024", fullData: {} },
    ]) 

    const sortedData = [...tickets].sort((a, b) => {
        const statusOrder = {
          "Awaiting Review": 1,
          "Awaiting Confirmation": 2,
          "Confirmed": 3
        };
      
        return statusOrder[a.status] - statusOrder[b.status];
    });


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
                {sortedData.length ? sortedData.map(ticket => (
                    <TicketItem key={ticket.id} {...ticket} />
                )) : (
                    <div className='no-tickets'>
                        <img className='no-tickets__img' src={NoTicketsImage} alt="Нет новых тикетов" />
                        <div className="no-tickets__description">Ой.... У вас нет новых тикетов</div>
                    </div>
                )}    
            </div>
        </div>
    )
}


export default TicketsContainer;