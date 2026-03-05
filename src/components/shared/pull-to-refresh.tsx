'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const THRESHOLD = 80;
const MAX_PULL = 120;

interface PullToRefreshProps {
  children: React.ReactNode;
}

export function PullToRefresh({ children }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const pulling = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const isAtTop = useCallback(() => {
    return window.scrollY <= 0;
  }, []);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (isRefreshing) return;
      if (isAtTop()) {
        startY.current = e.touches[0].clientY;
        pulling.current = true;
      }
    },
    [isAtTop, isRefreshing],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!pulling.current || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const diff = currentY - startY.current;

      if (diff > 0 && isAtTop()) {
        // Apply resistance: the further you pull, the harder it gets
        const distance = Math.min(diff * 0.5, MAX_PULL);
        setPullDistance(distance);

        if (distance > 10) {
          e.preventDefault();
        }
      } else {
        pulling.current = false;
        setPullDistance(0);
      }
    },
    [isAtTop, isRefreshing],
  );

  const handleTouchEnd = useCallback(async () => {
    if (!pulling.current) return;
    pulling.current = false;

    if (pullDistance >= THRESHOLD) {
      setIsRefreshing(true);
      setPullDistance(THRESHOLD);

      await queryClient.invalidateQueries();

      // Small delay so the user sees the spinner
      await new Promise((r) => setTimeout(r, 400));
      setIsRefreshing(false);
    }

    setPullDistance(0);
  }, [pullDistance, queryClient]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const indicatorOpacity = Math.min(pullDistance / THRESHOLD, 1);
  const indicatorScale = 0.5 + indicatorOpacity * 0.5;
  const rotation = isRefreshing ? undefined : pullDistance * 3;

  return (
    <div ref={containerRef}>
      {/* Pull indicator */}
      <div
        className="pointer-events-none fixed left-0 right-0 z-50 flex justify-center"
        style={{
          top: `calc(var(--safe-area-top, env(safe-area-inset-top, 0px)) + 3.5rem)`,
          transform: `translateY(${pullDistance - 40}px)`,
          opacity: indicatorOpacity,
          transition: pulling.current ? 'none' : 'all 0.3s ease-out',
        }}
      >
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg"
          style={{ transform: `scale(${indicatorScale})` }}
        >
          <Loader2
            className={`h-5 w-5 text-forest-700 ${isRefreshing ? 'animate-spin' : ''}`}
            style={rotation !== undefined ? { transform: `rotate(${rotation}deg)` } : undefined}
          />
        </div>
      </div>

      {/* Content with pull offset */}
      <div
        style={{
          transform: pullDistance > 0 ? `translateY(${pullDistance}px)` : undefined,
          transition: pulling.current ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
}
