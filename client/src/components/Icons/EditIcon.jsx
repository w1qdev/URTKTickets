const EditIcon = ({ className, width = "32", height = "32" }) => {
    return (
        <svg
            className={className}
            width={width}
            height={height}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M9.33325 9.33325H7.99992C7.29267 9.33325 6.6144 9.6142 6.1143 10.1143C5.6142 10.6144 5.33325 11.2927 5.33325 11.9999V23.9999C5.33325 24.7072 5.6142 25.3854 6.1143 25.8855C6.6144 26.3856 7.29267 26.6666 7.99992 26.6666H19.9999C20.7072 26.6666 21.3854 26.3856 21.8855 25.8855C22.3856 25.3854 22.6666 24.7072 22.6666 23.9999V22.6666"
                stroke="#545454"
                strokeWidth="2.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M21.3333 6.66657L25.3333 10.6666M27.18 8.7799C27.7051 8.25477 28.0001 7.54254 28.0001 6.7999C28.0001 6.05725 27.7051 5.34503 27.18 4.8199C26.6549 4.29477 25.9426 3.99976 25.2 3.99976C24.4574 3.99976 23.7451 4.29477 23.22 4.8199L12 15.9999V19.9999H16L27.18 8.7799Z"
                stroke="#545454"
                strokeWidth="2.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default EditIcon;
