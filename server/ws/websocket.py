from fastapi import WebSocket
from typing import List, Dict
import json


class WebSocketConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.connection_map: Dict[int, WebSocket] = {}  # Словарь для хранения сопоставления между id и WebSocket
    
    async def connect(self, websocket: WebSocket, client_id: int):
        await websocket.accept()
        self.active_connections.append(websocket)
        self.connection_map[client_id] = websocket

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        for client_id, ws in list(self.connection_map.items()):
            if ws == websocket:
                del self.connection_map[client_id]
                break

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_text(json.dumps(message))

    async def send_personal_message(self, message: dict, client_id: int):
        websocket = self.connection_map.get(client_id)
        if websocket:
            await websocket.send_text(json.dumps(message))

    async def send_message_to_clients(self, message: dict, client_ids: List[int]):
        for client_id in client_ids:
            websocket = self.connection_map.get(client_id)
            if websocket:
                await websocket.send_text(json.dumps(message))