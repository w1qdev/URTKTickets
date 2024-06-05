const SendTicketIcon = ({ className, fill }) => {
    return (
        <svg
            className={className}
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g clipPath="url(#clip0_6_879)">
                <path
                    d="M14.3331 4.0275C14.6391 3.18105 13.8188 2.3608 12.9723 2.6675L2.62714 6.40892C1.77784 6.71634 1.67514 7.87517 2.45643 8.3278L5.75868 10.2396L8.70747 7.2908C8.84106 7.16177 9.01999 7.09037 9.20571 7.09199C9.39143 7.0936 9.56909 7.16809 9.70042 7.29943C9.83176 7.43076 9.90625 7.60842 9.90786 7.79414C9.90948 7.97986 9.83808 8.15879 9.70905 8.29238L6.76026 11.2412L8.67276 14.5434C9.12468 15.3247 10.2835 15.2213 10.5909 14.3727L14.3331 4.0275Z"
                    fill="white"
                />
            </g>
            <defs>
                <clipPath id="clip0_6_879">
                    <rect width="17" height="17" fill={fill} />
                </clipPath>
            </defs>
        </svg>
    );
};

export default SendTicketIcon;
