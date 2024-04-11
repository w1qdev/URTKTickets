const SERVER_ORIGIN_URI = "http://localhost:8001";
const API_PATH = "/api";

export const endpoints = {
    GET_ALL_TICKETS: `${SERVER_ORIGIN_URI}${API_PATH}/tickets/`,
    CREATE_TICKET: `${SERVER_ORIGIN_URI}${API_PATH}/tickets/`,
    GET_TEACHER: `${SERVER_ORIGIN_URI}${API_PATH}/teachers/`,
};
