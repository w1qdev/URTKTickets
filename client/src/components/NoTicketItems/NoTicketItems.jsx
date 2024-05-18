import NoTicketsImage from "../../assets/other/no-tickets-img.png";

const NoTicketItems = ({ isGridMode, children }) => {
    return (
        <div
            className="no-tickets"
            style={{ width: `${isGridMode === "true" ? "303%" : "100%"}` }}
        >
            <img
                className="no-tickets__img"
                src={NoTicketsImage}
                alt="Нет новых тикетов"
            />
            <div className="no-tickets__description">{children}</div>
        </div>
    );
};

export default NoTicketItems;
