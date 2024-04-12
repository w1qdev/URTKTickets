const TicketItemStatusBadge = ({ status }) => {
    const role = localStorage.getItem("role");

    if (status === "Awaiting Review") {
        return (
            <div className="ticket-item-status awaiting-review">
                {/* <CircleStatusIcon mainCircleColor="#C8A837" secondaryCircleColor="#F2E0A1" className="status__icon" /> */}
                <div className="status__text">Ждет рассмотрения</div>
            </div>
        );
    } else if (status === "Awaiting Confirmation") {
        return (
            <div className="ticket-item-status awaiting-confirmation">
                {/* <CircleStatusIcon mainCircleColor="#7EA8E9" secondaryCircleColor="#7ea8e970" className="status__icon" /> */}
                <div className="status__text">Ждет подтверждения</div>
            </div>
        );
    } else if (status === "Confirmed") {
        return (
            <div className="ticket-item-status confirmed">
                {/* <CircleStatusIcon mainCircleColor="#89C679" secondaryCircleColor="#B7EAA9" className="status__icon" /> */}
                <div className="status__text">Подтверждено</div>
            </div>
        );
    }
};

export default TicketItemStatusBadge;
