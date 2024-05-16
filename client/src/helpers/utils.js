import axios from "axios";
import { SERVER_ORIGIN_URI, API_PATH } from "../api";

export const getCurrentDate = () => {
    let date = new Date().toJSON().slice(0, 10);
    let currentDateValues = date.split("-");

    let temp = currentDateValues[currentDateValues.length - 1]; // 23

    currentDateValues[currentDateValues.length - 1] = currentDateValues[0]; // 23 -> 2024
    currentDateValues[0] = temp;

    let currentDate = currentDateValues.join(".");

    return currentDate;
};

export const getTicketStateNameById = (ticket_id) => {
    switch (ticket_id) {
        case 1:
            return "Under review";
        case 2:
            return "In progress";
        case 3:
            return "Completed";
    }
};

export const getTicketIdByStateName = (ticket_name) => {
    switch (ticket_name) {
        case "На рассмотрении":
            return 1;
        case "Выполняется":
            return 2;
        case "Выполнено":
            return 3;
    }
};

export const mapPrioritiesAndChangeState = (data) => {
    const mappedData = data.map((item) => {
        let newState;
        switch (item.title) {
            case "1":
                newState = "Низкий";
                break;
            case "2":
                newState = "Средний";
                break;
            case "3":
                newState = "Высокий";
                break;
        }
        return {
            ...item,
            title: newState,
        };
    });

    return mappedData;
};

export const getPriorityById = (priority_id) => {
    switch (priority_id) {
        case 1:
            return "Низкий";
        case 2:
            return "Средний";
        case 3:
            return "Высокий";
    }
};

export const mapTicketsDataAndChangeState = (data) => {
    const mappedData = data.map((item) => {
        let newState;
        switch (item.title) {
            case "1":
                newState = "На рассмотрении";
                break;
            case "2":
                newState = "Выполняется";
                break;
            case "3":
                newState = "Выполнено";
                break;
            default:
                newState = "Unknown State"; // Обработка для неизвестных значений state_id
                break;
        }
        return {
            ...item,
            title: newState,
        };
    });
    return mappedData;
};

export const dateFormatter = (date) => {
    const months = [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря",
    ];

    // Проверяем формат даты
    if (date.includes(".")) {
        // Если формат даты "день.месяц.год"
        const [day, month, year] = date.split(".");
        return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
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
};

export const reverseDate = (date) => {
    // Проверяем, является ли входная дата строкой
    if (typeof date !== "string") {
        throw new Error("Input should be a string");
    }

    // Разделяем строку по точке
    const parts = date.split(".");

    // Проверяем, что входная строка содержит три части (день, месяц, год)
    if (parts.length !== 3) {
        throw new Error('Input date should be in the format "dd.mm.yyyy"');
    }

    // Переставляем части местами и объединяем их в новую строку
    const reversedDate = `${parts[2]}.${parts[1]}.${parts[0]}`;

    return reversedDate;
};

export const getMenuItemsByValue = (data, value) => {
    const result = [];
    const uniqueValues = new Set();

    data.forEach((item) => {
        const itemValue = String(item[value]);
        if (!uniqueValues.has(itemValue)) {
            result.push({
                id: result.length + 1,
                title: itemValue,
            });
            uniqueValues.add(itemValue);
        }
    });

    return result;
};

// Вспомогательная функция для добавления нуля перед числом, если оно меньше 10
function padZero(num) {
    return num < 10 ? "0" + num : num;
}

export const addDaysToCurrentDate = (days) => {
    var currentDate = new Date();
    var futureDate = new Date(currentDate.getTime());
    futureDate.setDate(currentDate.getDate() + days);

    var difference = Math.ceil(
        (futureDate - currentDate) / (1000 * 60 * 60 * 24)
    ); // Разница в днях

    // Форматирование даты в виде "гггг-мм-дд"
    var formattedDate =
        futureDate.getFullYear() +
        "-" +
        padZero(futureDate.getMonth() + 1) +
        "-" +
        padZero(futureDate.getDate());

    return {
        date: formattedDate,
        difference: difference,
    };
};

export const getTicketContainerStatusMode = () => {
    let status = localStorage.getItem("isTicketContainerGridMode");

    if (status === null) {
        status = localStorage.setItem("isTicketContainerGridMode", "false");
    }

    return status;
};

export const initializeStorageUserData = (user_id) => {
    const isUserDataStoraged =
        localStorage.getItem("username") &&
        localStorage.getItem("user_id") &&
        localStorage.getItem("role");

    if (!isUserDataStoraged) {
        // if user data doesn't initialized
        axios
            .get(`${SERVER_ORIGIN_URI}${API_PATH}/teachers/${user_id}`)
            .then((res) => {
                localStorage.setItem("username", res.data.teacher_name);
                localStorage.setItem("user_id", user_id);
                localStorage.setItem("role", res.data.role);
            })
            .catch((err) => {
                console.error(
                    "Something gone wrong with user storage initialising",
                    err
                );
            });
    }

    return {
        username: localStorage.getItem("username"),
        user_id: localStorage.getItem("user_id"),
        role: localStorage.getItem("role"),
    };
};

export const getDatesDifference = (inputDate) => {
    const [day, month, year] = inputDate.split(".").map(Number);

    // Создаем объект даты для переданной даты
    const passedDate = new Date(year, month - 1, day);

    // Получаем текущую дату
    const currentDate = new Date();

    // Вычисляем разницу в миллисекундах между текущей датой и переданной датой
    const differenceInMs = currentDate - passedDate;

    // Преобразуем разницу в дни, часы, минуты и секунды
    const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
    const differenceInHours = Math.floor(
        (differenceInMs / (1000 * 60 * 60)) % 24
    );
    const differenceInMinutes = Math.floor((differenceInMs / (1000 * 60)) % 60);
    const differenceInSeconds = Math.floor((differenceInMs / 1000) % 60);

    return {
        days: differenceInDays,
        hours: differenceInHours,
        minutes: differenceInMinutes,
        seconds: differenceInSeconds,
    };
};
