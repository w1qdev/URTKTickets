import { Tooltip } from "@chakra-ui/react";
import { getPriorityById } from "../../helpers/utils";

const bookmarkColorFormatter = (priorityId) => {
    switch (priorityId) {
        case 1:
            return "#4ECB71";
        case 2:
            return "#ffc165";
        case 3:
            return "#FF0000";
    }
};

const Bookmark = ({
    className,
    isUseTooltip = true,
    width,
    height,
    priorityColor,
    priority,
}) => {
    const bookmarkColor = bookmarkColorFormatter(priority);
    const formattedPriority = getPriorityById(priority);

    return (
        <Tooltip
            hasArrow
            label={
                isUseTooltip
                    ? `${formattedPriority} уровень приоритета заявки`
                    : ""
            }
            placement="top"
        >
            <div
                className={className}
                style={{ width: `${width}`, height: `${height}` }}
            >
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M6.66675 28V6.66667C6.66675 5.93333 6.92808 5.30578 7.45075 4.784C7.97341 4.26222 8.60097 4.00089 9.33341 4H22.6667C23.4001 4 24.0281 4.26133 24.5507 4.784C25.0734 5.30667 25.3343 5.93422 25.3334 6.66667V28L16.0001 24L6.66675 28Z"
                        fill={bookmarkColor || priorityColor}
                    />
                </svg>
            </div>
        </Tooltip>
    );
};

export default Bookmark;
