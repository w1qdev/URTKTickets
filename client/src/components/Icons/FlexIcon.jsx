const FlexIcon = ({
    width = "25px",
    height = "25px",
    fill = "#111111",
    className,
}) => {
    return (
        <svg
            className={className}
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect x="3" y="4" width="18" height="4" rx="2" fill={fill} />
            <rect x="3" y="10" width="18" height="4" rx="2" fill={fill} />
            <rect x="3" y="16" width="18" height="4" rx="2" fill={fill} />
        </svg>
    );
};

export default FlexIcon;
