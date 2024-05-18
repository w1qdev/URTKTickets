const TicketItemStatusBadge = ({ status }) => {
    if (status === "Under review") {
        return (
            <div className="ticket-item-status awaiting-review">
                {/* <CircleStatusIcon mainCircleColor="#C8A837" secondaryCircleColor="#F2E0A1" className="status__icon" /> */}
                <div className="status__text">На рассмотрении</div>
            </div>
        );
    } else if (status === "In progress") {
        return (
            <div className="ticket-item-status awaiting-confirmation">
                {/* <CircleStatusIcon mainCircleColor="#7EA8E9" secondaryCircleColor="#7ea8e970" className="status__icon" /> */}
                <div className="status__text">Выполняется</div>
            </div>
        );
    } else if (status === "Completed") {
        return (
            <div className="ticket-item-status confirmed">
                {/* <CircleStatusIcon mainCircleColor="#89C679" secondaryCircleColor="#B7EAA9" className="status__icon" /> */}
                <div className="status__text">Выполнено</div>
            </div>
        );
    }
};

export default TicketItemStatusBadge;
