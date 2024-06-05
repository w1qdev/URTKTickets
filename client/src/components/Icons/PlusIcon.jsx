const PlusIcon = ({ fill, width, height }) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                style={{ transition: "fill linear 0.2s" }}
                d="M9 6.49902H6.5V8.99902C6.5 9.13163 6.44732 9.25881 6.35355 9.35258C6.25979 9.44635 6.13261 9.49902 6 9.49902C5.86739 9.49902 5.74022 9.44635 5.64645 9.35258C5.55268 9.25881 5.5 9.13163 5.5 8.99902V6.49902H3C2.86739 6.49902 2.74021 6.44635 2.64645 6.35258C2.55268 6.25881 2.5 6.13163 2.5 5.99902C2.5 5.86642 2.55268 5.73924 2.64645 5.64547C2.74021 5.5517 2.86739 5.49902 3 5.49902H5.5V2.99902C5.5 2.86642 5.55268 2.73924 5.64645 2.64547C5.74022 2.5517 5.86739 2.49902 6 2.49902C6.13261 2.49902 6.25979 2.5517 6.35355 2.64547C6.44732 2.73924 6.5 2.86642 6.5 2.99902V5.49902H9C9.13261 5.49902 9.25979 5.5517 9.35355 5.64547C9.44732 5.73924 9.5 5.86642 9.5 5.99902C9.5 6.13163 9.44732 6.25881 9.35355 6.35258C9.25979 6.44635 9.13261 6.49902 9 6.49902Z"
                fill={fill}
            />
        </svg>
    );
};

export default PlusIcon;
