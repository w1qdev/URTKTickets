const RepeatIcon = ({ width = "10px", height = "10px", fill = "#F24E1E" }) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g clipPath="url(#clip0_192_2)">
                <path
                    d="M0 14.0001C0 15.1063 0.89375 16.0001 2 16.0001C3.10625 16.0001 4 15.1063 4 14.0001C4 10.6876 6.6875 8.00008 10 8.00008H20V10.0001C20 10.8063 20.4875 11.5376 21.2375 11.8501C21.9875 12.1626 22.8438 11.9876 23.4188 11.4188L27.4188 7.41883C28.2 6.63758 28.2 5.36883 27.4188 4.58758L23.4188 0.587576C22.8438 0.0125759 21.9875 -0.156174 21.2375 0.156326C20.4875 0.468826 20 1.19383 20 2.00008V4.00008H10C4.475 4.00008 0 8.47508 0 14.0001ZM32 18.0001C32 16.8938 31.1063 16.0001 30 16.0001C28.8937 16.0001 28 16.8938 28 18.0001C28 21.3126 25.3125 24.0001 22 24.0001H12V22.0001C12 21.1938 11.5125 20.4626 10.7625 20.1501C10.0125 19.8376 9.15625 20.0126 8.58125 20.5813L4.58125 24.5813C3.8 25.3626 3.8 26.6313 4.58125 27.4126L8.58125 31.4126C9.15625 31.9876 10.0125 32.1563 10.7625 31.8438C11.5125 31.5313 12 30.8063 12 29.9938V28.0001H22C27.525 28.0001 32 23.5251 32 18.0001Z"
                    fill="#F24E1E"
                />
            </g>
            <defs>
                <clipPath id="clip0_192_2">
                    <rect width="100%" height="100%" fill={fill} />
                </clipPath>
            </defs>
        </svg>
    );
};

export default RepeatIcon;
