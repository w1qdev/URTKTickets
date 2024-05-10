import TicketItem from "../TicketItem/TicketItem";
import NoTicketsImage from "../../assets/other/no-tickets-img.png";
import { Skeleton, Stack } from "@chakra-ui/react";
// import { Virtuoso } from "react-virtuoso";
import { useEffect, useState } from "react";

const TicketsList = ({ ticketsData, isFetching, isUsingFilters }) => {
    // const [shownTickets, setShownTickets] = useState([]);

    // const getNextTickets = (step = 15) => {
    //     console.log("endReached");

    //     const nextTickets = ticketsData.slice(
    //         shownTickets.length,
    //         shownTickets.length + step
    //     );

    //     setShownTickets([...shownTickets, ...nextTickets]);

    //     console.log(shownTickets);
    // };

    // useEffect(() => {
    //     getNextTickets(15);
    // }, [ticketsData]);

    let ticketsListContent;
    if (isFetching) {
        // If we still fetching the data from the server
        ticketsListContent = (
            <Stack>
                <Skeleton height="80px" borderRadius="6px" />
                <Skeleton height="80px" borderRadius="6px" />
                <Skeleton height="80px" borderRadius="6px" />
                <Skeleton height="80px" borderRadius="6px" />
                <Skeleton height="80px" borderRadius="6px" />
            </Stack>
        );

        setTimeout(() => {}, 2000);
    } else if (ticketsData.length) {
        // If we get the data from the server, so then show data
        ticketsListContent = ticketsData.map((ticket) => (
            <TicketItem key={ticket.ticket_id} {...ticket} />
        ));
    } else if (isUsingFilters && ticketsData.length === 0) {
        // if we using filters and got 0 results after filtering
        ticketsListContent = (
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
        );
    }

    return (
        <>
            {ticketsListContent}

            {/* {isFetching ? (
                <Stack>
                    <Skeleton height="80px" borderRadius="6px" />
                    <Skeleton height="80px" borderRadius="6px" />
                    <Skeleton height="80px" borderRadius="6px" />
                </Stack>
            ) : null} */}

            {/* {ticketsData.length && !isFetching
                ? ticketsData.map((ticket) => (
                      <TicketItem key={ticket.ticket_id} {...ticket} />
                  ))
                : null} */}

            {/* FIXME: Не работает фильтрация + все ломается при попытке фильтрации */}
            {/* {shownTickets.length && !isFetching ? (
                <Virtuoso
                    style={{
                        overflowX: "hidden",
                        padding: "5px",
                        width: "100%",
                        height: "100%",
                        overflowY: "scroll",
                    }}
                    endReached={getNextTickets}
                    data={shownTickets}
                    itemContent={(_, ticket) => (
                        <TicketItem key={ticket.ticket_id} {...ticket} />
                    )}
                />
            ) : null} */}

            {/* {ticketsData.length === 0 && !isFetching ? (
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
