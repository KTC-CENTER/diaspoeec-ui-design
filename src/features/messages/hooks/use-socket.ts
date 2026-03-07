'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getToken } from '@/lib/api/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

let globalSocket: Socket | null = null;

function getOrCreateSocket(): Socket | null {
  const token = getToken();
  if (!token) return null;

  if (globalSocket && !globalSocket.disconnected) {
    return globalSocket;
  }

  // Disconnect stale socket if exists
  if (globalSocket) {
    globalSocket.removeAllListeners();
    globalSocket.disconnect();
  }

  const socket = io(`${API_URL}/chat`, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: Infinity,
  });

  globalSocket = socket;
  return socket;
}

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = getOrCreateSocket();
    if (!socket) return;

    socketRef.current = socket;

    const onConnect = () => {
      console.log('[Socket] Connected');
      setConnected(true);
    };
    const onDisconnect = () => {
      console.log('[Socket] Disconnected');
      setConnected(false);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    // If already connected, set state immediately
    if (socket.connected) {
      setConnected(true);
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      // Keep the global socket alive
    };
  }, []);

  const emit = useCallback(
    (event: string, data?: unknown) => {
      const s = socketRef.current;
      if (!s) return;
      if (s.connected) {
        s.emit(event, data);
      } else {
        // Wait for connection then emit
        s.once('connect', () => s.emit(event, data));
      }
    },
    [],
  );

  const on = useCallback(
    (event: string, handler: (...args: unknown[]) => void) => {
      const s = socketRef.current;
      if (!s) return () => {};
      s.on(event, handler);
      return () => {
        s.off(event, handler);
      };
    },
    [],
  );

  return { socket: socketRef.current, connected, emit, on };
}
