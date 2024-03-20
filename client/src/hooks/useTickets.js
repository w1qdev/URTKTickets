import { useState, useEffect } from 'react';
import axios from 'axios';


const useTickets = (searchUrl) => {
    const [tickets, setTickets] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${searchUrl}`, {
                    params: {
                        role: localStorage.getItem('role') || 'teacher', // Роль пользователя
                        user_id: localStorage.getItem('user_id')  // ID пользователя
                    },
                });

                console.log(response)

                if (response.data.tickets){
                    setTickets(response.data.tickets);
                } else {
                    setTickets([])
                }
                    
            } catch (error) {
                console.error('Произошла ошибка:', error);
            }
        };

        fetchData();
    }, [searchUrl]);


    return {tickets, setTickets}
}

export default useTickets;