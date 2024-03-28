

export const getCurrentDate = () => {
    let date = new Date().toJSON().slice(0, 10);
    let currentDateValues = date.split('-')

    let temp = currentDateValues[currentDateValues.length - 1] // 23

    currentDateValues[currentDateValues.length - 1] = currentDateValues[0] // 23 -> 2024
    currentDateValues[0] = temp

    let currentDate = currentDateValues.join('.')
    
    return currentDate
}


export const getTicketStateNameById = (ticket_id) => {
    switch (ticket_id) {
        case 1: return "Awaiting Review";
        case 2: return "Awaiting Confirmation";
        case 3: return "Confirmed";
    }
} 


export const dateFormatter = (date) => {
    
    const months = [
        "января", "февраля", "марта", "апреля", "мая", "июня",
        "июля", "августа", "сентября", "октября", "ноября", "декабря"
    ];

    // Проверяем формат даты
    if (date.includes('.')) {
        // Если формат даты "день.месяц.год"
        const [day, month, year] = date.split('.');
        return `${day} ${months[parseInt(month) - 1]} ${year}`;
    } else {
        // Если формат даты "год-месяц-день"
        // Создание объекта Date из строки
        const dateObj = new Date(date);

        
        const monthIndex = dateObj.getMonth();
        const month = months[monthIndex];

        // Получение дня и года
        const day = dateObj.getDate();
        const year = dateObj.getFullYear();

        // Формирование отформатированной строки
        return `${day} ${month} ${year}`;
    }
}

