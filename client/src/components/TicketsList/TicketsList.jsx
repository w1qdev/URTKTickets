import TicketItem from "../TicketItem/TicketItem";
import NoTicketsImage from "../../assets/other/no-tickets-img.png";
import { Skeleton, Stack } from "@chakra-ui/react";

const TicketsList = ({ ticketsData, isFetching }) => {
    return (
        <>
            {isFetching ? (
                <Stack>
                    <Skeleton height="80px" borderRadius="6px" />
                    <Skeleton height="80px" borderRadius="6px" />
                    <Skeleton height="80px" borderRadius="6px" />
                </Stack>
            ) : null}

            {isFetching === false && ticketsData.length
                ? ticketsData.map((ticket) => (
                      <TicketItem key={ticket.ticket_id} {...ticket} />
                  ))
                : null}

            {/* {!isFetching && ticketsData.length === 0 ? (
                <div className="no-tickets">
                    <img
                        className="no-tickets__img"
                        src={NoTicketsImage}
                        alt="Нет новых тикетов"
                    />
                    <div className="no-tickets__description">
                        Ой.... Тикеты не найдены
                    </div>
                </div>
            ) : null} */}
        </>
    );
};

export default TicketsList;
