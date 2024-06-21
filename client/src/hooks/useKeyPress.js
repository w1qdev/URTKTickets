import { useState, useEffect } from "react";

export const useKeyPress = (keyTargetList, callback) => {
    const [isKeyPressed, setIsKeyPressed] = useState(false);

    const upHandler = ({ key }) => {
        keyTargetList.forEach((keyTarget) => {
            if (key === keyTarget) {
                setIsKeyPressed(true);
                callback();
            }
        });
    };

    useEffect(() => {
        window.addEventListener("keyup", upHandler);

        return () => {
            window.removeEventListener("keyup", upHandler);
        };
    }, []);

    return isKeyPressed;
};
