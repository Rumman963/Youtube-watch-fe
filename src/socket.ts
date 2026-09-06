import { WS_BASE_URL } from "./config";

let socket: WebSocket | null = null;

export function connectSocket(token: string) {
  socket = new WebSocket(`${WS_BASE_URL}?token=${token}`);
  return socket;
}

export function getSocket() {
  return socket;
}