const DownlaodIcon = ({
    width = "32px",
    height = "32px",
    fill = "#ffffff",
    className,
}) => {
    return (
        <svg
            width={width}
            height={height}
            className={className}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M16.0002 21.3333L9.3335 14.6666L11.2002 12.7333L14.6668 16.1999V5.33325H17.3335V16.1999L20.8002 12.7333L22.6668 14.6666L16.0002 21.3333ZM8.00016 26.6666C7.26683 26.6666 6.63927 26.4057 6.1175 25.8839C5.59572 25.3621 5.33438 24.7341 5.3335 23.9999V19.9999H8.00016V23.9999H24.0002V19.9999H26.6668V23.9999C26.6668 24.7333 26.4059 25.3613 25.8842 25.8839C25.3624 26.4066 24.7344 26.6675 24.0002 26.6666H8.00016Z"
                fill={fill}
            />
        </svg>
    );
};

export default DownlaodIcon;
