

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
