import { toast, Slide } from "react-toastify";

const defaultConfig = {
    position: "bottom-right",
    autoClose: 10 * 1000, // 10 sec
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Slide,
};

export const toastInfo = (text, userConfig = {}) => {
    toast.info(text, {
        ...defaultConfig,
        ...userConfig,
    });
};

export const toastSuccess = (text, userConfig = {}) => {
    toast.success(text, {
        ...defaultConfig,
        ...userConfig,
    });
};

export const toastError = (text, userConfig = {}) => {
    toast.error(text, {
        ...defaultConfig,
        ...userConfig,
    });
};

export const toastWarning = (text, userConfig = {}) => {
    toast.warn(text, {
        ...defaultConfig,
        ...userConfig,
    });
};
