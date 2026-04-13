import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3001';

type WebSocketEventCallback = (...args: any[]) => void;

export const useWebSocket = (clienteId?: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Conectado ao socket');
      if (clienteId) {
        newSocket.emit('entrar:sala', clienteId);
      }
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Desconectado do socket');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [clienteId]);

  const subscribe = (event: string, callback: WebSocketEventCallback) => {
    if (socket) {
      socket.on(event, callback);
    }
  };

  const unsubscribe = (event: string) => {
    if (socket) {
      socket.off(event);
    }
  };

  return { socket, isConnected, subscribe, unsubscribe };
};