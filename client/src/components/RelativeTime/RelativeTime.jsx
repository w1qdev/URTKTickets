import { getRelativeTimeString } from "../../helpers/utils";
import { useEffect, useState } from "react";

const RelativeTime = ({ className, date }) => {
    let [relativeTime, setRelativeTile] = useState(
        getRelativeTimeString(new Date(date))
    );

    const updateDate = () => {
        setRelativeTile(getRelativeTimeString(new Date(date)));
    };

    useEffect(() => {
        // Функция для обновления данных
        const timeInterval = 1 * 60 * 1000; // 1 minute to update the state
        const interval = setInterval(() => updateDate(), timeInterval);

        return () => clearInterval(interval);
    }, []);

    return <div className={className}>{relativeTime}</div>;
};

export default RelativeTime;
