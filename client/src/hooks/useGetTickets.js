import axios from "axios";
import { endpoints } from "../api";
import { useState, useEffect } from "react";

const useGetTickets = (params) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsFetching(true);
            try {
                const response = await axios.get(endpoints.GET_ALL_TICKETS, {
                    params,
                });
                setData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setIsFetching(false);
            }
        };

        fetchData();
    }, [params]);

    return { data, error, isFetching };
};

export default useGetTickets;
