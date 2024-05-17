import TicketItem from "../TicketItem/TicketItem";
import NoTicketsImage from "../../assets/other/no-tickets-img.png";
import { Skeleton, Stack } from "@chakra-ui/react";
import { Virtuoso } from "react-virtuoso";
import { useEffect, useState } from "react";

const TicketsList = ({
    ticketsData,
    isFetching,
    isUsingFilters,
    sendJsonMessage,
}) => {
    const isGridMode =
        localStorage.getItem("isTicketContainerGridMode") || false;

    let ticketsListContent;
    if (isFetching) {
        // If we still fetching the data from the server
        if (isGridMode === "true") {
            ticketsListContent = (
                <>
                    <Stack>
                        <Skeleton
                            width="99%"
                            height="170px"
                            borderRadius="6px"
                        />
                    </Stack>
                    <Stack>
                        <Skeleton
                            width="99%"
                            height="170px"
                            borderRadius="6px"
                        />
                    </Stack>
                    <Stack>
                        <Skeleton
                            width="99%"
                            height="170px"
                            borderRadius="6px"
                        />
                    </Stack>
                    <Stack>
                        <Skeleton
                            width="99%"
                            height="170px"
                            borderRadius="6px"
                        />
                    </Stack>
                    <Stack>
                        <Skeleton
                            width="99%"
                            height="170px"
                            borderRadius="6px"
                        />
                    </Stack>
                    <Stack>
                        <Skeleton
                            width="99%"
                            height="170px"
                            borderRadius="6px"
                        />
                    </Stack>
                </>
            );
        } else if (isGridMode === "false") {
            ticketsListContent = (
                <Stack>
                    <Skeleton height="80px" borderRadius="6px" />
                    <Skeleton height="80px" borderRadius="6px" />
                    <Skeleton height="80px" borderRadius="6px" />
                    <Skeleton height="80px" borderRadius="6px" />
                    <Skeleton height="80px" borderRadius="6px" />
                </Stack>
            );
        }
    } else if (ticketsData.length) {
        // If we get the data from the server, so then show data
        ticketsListContent = ticketsData.map((ticket) => (
            <TicketItem
                key={ticket.ticket_id}
                sendJsonMessage={sendJsonMessage}
                {...ticket}
            />
        ));

        // ticketsListContent = (
        //     <Virtuoso
        //         style={{
        //             padding: "5px",
        //             width: "100%",
        //             height: "100%",
        //             overflowX: "hidden",
        //             overflowY: "auto",
        //         }}
        //         data={ticketsData}
        //         itemContent={(_, ticket) => (
        //             <TicketItem key={ticket.ticket_id} {...ticket} />
        //         )}
        //     />
        // );
    } else if (isUsingFilters || ticketsData.length === 0) {
        // if we using filters and got 0 results after filtering
        ticketsListContent = (
            <div
                className="no-tickets"
                style={{ width: `${isGridMode === "true" ? "304%" : "100%"}` }}
            >
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

    return <>{ticketsListContent}</>;
};

export default TicketsList;
