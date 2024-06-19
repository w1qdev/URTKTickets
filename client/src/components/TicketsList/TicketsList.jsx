import TicketItem from "../TicketItem/TicketItem";
import { Skeleton, Stack } from "@chakra-ui/react";
import { Virtuoso, VirtuosoGrid } from "react-virtuoso";
import NoTicketItems from "../NoTicketItems/NoTicketItems";

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
        //     <VirtuosoGrid
        //         style={{ width: "700px", height: "100%"  }}
        //         data={ticketsData}
        //         itemContent={(_, ticket) => (
        //             <TicketItem key={ticket.ticket_id} {...ticket} />
        //         )}
        //     />
        // );
    } else if (isUsingFilters && ticketsData.length === 0) {
        // if user using filters and got 0 results after filtering
        ticketsListContent = (
            <NoTicketItems isGridMode={isGridMode}>
                По вашему запросу ничего не найдено
            </NoTicketItems>
        );
    } else if (isUsingFilters === false || ticketsData.length === 0) {
        ticketsListContent = (
            <NoTicketItems isGridMode={isGridMode}>
                Тут пока нет тикетов 😊
            </NoTicketItems>
        );
    }
    return <>{ticketsListContent}</>;
};

export default TicketsList;
