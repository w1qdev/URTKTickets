import './TicketsContainer.scss'
import TicketItem from '../TicketItem/TicketItem.jsx';
import NoTicketsImage from '../../assets/other/no-tickets-img.png'
import axios from 'axios'
import { useState, useEffect, useMemo } from 'react';


const TicketsContainer = () => {

    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8001/api/tickets/', {
                    params: {
                        role: localStorage.getItem('role') || 'teacher', // Роль пользователя
                        user_id: localStorage.getItem('user_id')  // ID пользователя
                    },
                });

                console.log(response.data)

                if (response.data.tickets?.length){
                    setTickets(response.data.tickets);
                } else {
                    setTickets([])
                }
                    
            } catch (error) {
                console.error('Произошла ошибка:', error);
            }
        };

        fetchData();

    }, []);

    const sortedTickets = useMemo(() => {
        return tickets.slice().sort((a, b) => a.state_id - b.state_id);
      }, [tickets]);

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
                {sortedTickets.length ? sortedTickets.map(ticket => (
                    <TicketItem key={ticket.ticket_id} {...ticket} />
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