const CircleStatusIcon = ({
    mainCircleColor,
    secondaryCircleColor,
    className,
}) => {
    return (
        <svg
            className={className}
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect width="10" height="10" rx="5" fill={secondaryCircleColor} />
            <rect
                x="2"
                y="2"
                width="6"
                height="6"
                rx="3"
                fill={mainCircleColor}
            />
        </svg>
    );
};

export default CircleStatusIcon;
