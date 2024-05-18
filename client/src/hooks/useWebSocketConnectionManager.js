import useWebSocket from "react-use-websocket";

const useWebSocketConnectionManager = (wsPath, wsActions) => {
    const { sendJsonMessage } = useWebSocket(wsPath, { ...wsActions });

    return { sendJsonMessage };
};

export default useWebSocketConnectionManager;
