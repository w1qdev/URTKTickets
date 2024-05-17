export const SERVER_ORIGIN_PROTOCOL = "http://";
export const SERVER_ORIGIN_DOMAIN = "localhost:8001";
export const SERVER_ORIGIN_URI = SERVER_ORIGIN_PROTOCOL + SERVER_ORIGIN_DOMAIN;

export const API_PATH = "/api";

export const endpoints = {
    GET_ALL_TICKETS: `${SERVER_ORIGIN_URI}${API_PATH}/tickets/`,
    CREATE_TICKET: `${SERVER_ORIGIN_URI}${API_PATH}/tickets/`,
    GET_TEACHER: `${SERVER_ORIGIN_URI}${API_PATH}/teachers/`,
};
