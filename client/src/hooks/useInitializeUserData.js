import { useState, useEffect } from "react";
import axios from "axios";
import { SERVER_ORIGIN_URI, API_PATH } from "../api";

const useInitializeUserData = (userId = 2) => {
    // FIXME: Change default value of userId to nothing
    // FIXME: IT IS JUST TEST VALUE, IN PROD IT MUST BE SOME REAL USER ID
    const [userData, setUserData] = useState({
        username: localStorage.getItem("username"),
        user_id: localStorage.getItem("user_id"),
        role: localStorage.getItem("role"),
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const testUserID = localStorage.getItem("user_id") || userId;
                const isUserDataStoraged =
                    userData.username && userData.user_id && userData.role;

                if (!isUserDataStoraged) {
                    // if user data doesn't initialized
                    await axios
                        .get(
                            `${SERVER_ORIGIN_URI}${API_PATH}/teachers/${testUserID}`
                        )
                        .then((res) => {
                            localStorage.setItem(
                                "username",
                                res.data.teacher_name
                            );
                            localStorage.setItem("user_id", testUserID);
                            localStorage.setItem("role", res.data.role);

                            setUserData((prev) => ({
                                ...prev,
                                username: res.data.teacher_name,
                                user_id: res.data.teacher_id,
                                role: res.data.role,
                            }));
                        })
                        .catch((err) => {
                            console.error(
                                "Something gone wrong with user storage initialising",
                                err
                            );
                        });
                }
            } catch (error) {
                console.error("Произошла ошибка:", error);
            }
        };

        fetchUserData();
    }, []);

    return [userData, setUserData];
};

export default useInitializeUserData;
