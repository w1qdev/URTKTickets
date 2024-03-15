

export const getCurrentDate = () => {
    let date = new Date().toJSON().slice(0, 10);
    let currentDateValues = date.split('-')

    let temp = currentDateValues[currentDateValues.length - 1] // 23

    currentDateValues[currentDateValues.length - 1] = currentDateValues[0] // 23 -> 2024
    currentDateValues[0] = temp

    let currentDate = currentDateValues.join('.')
    
    return currentDate
}
