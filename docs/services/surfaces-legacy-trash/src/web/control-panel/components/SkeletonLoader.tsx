'use client';

import { semanticRoles } from '@bthwani/ui-kit';

export interface SkeletonLoaderProps {
  /**  Type of skeleton ('card' | 'list' | 'text' | 'kpi') */
  type?: 'card' | 'list' | 'text' | 'kpi';
  /**  Number of skeletons to display */
  count?: number;
  /**  Whether to show as a grid */
  grid?: boolean;
  /**  Columns for grid */
  columns?: 1 | 2 | 3 | 4;
}

/**
 * Skeleton Pulse Animation
 */
const SkeletonPulse = () => (
  <style>{`
    @keyframes skeleton-pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
    .skeleton-pulse {
      animation: skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  `}</style>
);

/**
 * Single Skeleton Card
 */
const SkeletonCard = () => (
  <div
    className="rounded-lg p-6 skeleton-pulse"
    style={{
      backgroundColor: semanticRoles.surfaceSubtle,
    }}
  >
    <div className="space-y-3">
      <div
        className="h-4 w-20 rounded"
        style={{ backgroundColor: semanticRoles.border }}
      />
      <div
        className="h-8 w-32 rounded"
        style={{ backgroundColor: semanticRoles.border }}
      />
      <div
        className="h-3 w-48 rounded"
        style={{ backgroundColor: semanticRoles.border }}
      />
    </div>
  </div>
);

/**
 * Single Skeleton KPI Card
 */
const SkeletonKPI = () => (
  <div
    className="rounded-lg p-6 skeleton-pulse"
    style={{
      backgroundColor: semanticRoles.surface,
      border: `1px solid ${semanticRoles.border}`,
    }}
  >
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div
            className="h-3 w-20 rounded"
            style={{ backgroundColor: semanticRoles.border }}
          />
          <div
            className="h-6 w-24 rounded"
            style={{ backgroundColor: semanticRoles.border }}
          />
        </div>
        <div
          className="h-9 w-9 rounded"
          style={{ backgroundColor: semanticRoles.border }}
        />
      </div>
      <div
        className="h-3 w-32 rounded"
        style={{ backgroundColor: semanticRoles.border }}
      />
    </div>
  </div>
);

/**
 * Single Skeleton List Item
 */
const SkeletonListItem = () => (
  <div
    className="px-4 py-3 border-b skeleton-pulse"
    style={{ borderColor: semanticRoles.border }}
  >
    <div className="flex items-center gap-3">
      <div
        className="h-8 w-8 rounded-full shrink-0"
        style={{ backgroundColor: semanticRoles.border }}
      />
      <div className="flex-1 space-y-2">
        <div
          className="h-3 w-32 rounded"
          style={{ backgroundColor: semanticRoles.border }}
        />
        <div
          className="h-2 w-48 rounded"
          style={{ backgroundColor: semanticRoles.border }}
        />
      </div>
    </div>
  </div>
);

/**
 * Single Skeleton Text
 */
const SkeletonText = () => (
  <div className="space-y-2">
    <div
      className="h-3 w-full rounded skeleton-pulse"
      style={{ backgroundColor: semanticRoles.border }}
    />
    <div
      className="h-3 w-5/6 rounded skeleton-pulse"
      style={{ backgroundColor: semanticRoles.border }}
    />
  </div>
);

/**
 * SkeletonLoader — Loading state component
 * 
 * Features:
 * - Multiple skeleton types (card, list, text, kpi)
 * - Grid support
 * - Pulsing animation
 * - Clean, modern design
 * 
 * Usage:
 * <SkeletonLoader type="kpi" count={4} columns={4} grid />
 * <SkeletonLoader type="list" count={3} />
 */
export const SkeletonLoader = ({
  type = 'card',
  count = 1,
  grid = false,
  columns = 1,
}: SkeletonLoaderProps) => {
  const skeletons = Array.from({ length: count });

  const renderSkeleton = () => {
    switch (type) {
      case 'kpi':
        return <SkeletonKPI />;
      case 'list':
        return <SkeletonListItem />;
      case 'text':
        return <SkeletonText />;
      case 'card':
      default:
        return <SkeletonCard />;
    }
  };

  return (
    <>
      <SkeletonPulse />
      {grid ? (
        <div
          className={`grid gap-4 grid-cols-1 ${
            columns === 2
              ? 'sm:grid-cols-2'
              : columns === 3
                ? 'sm:grid-cols-3'
                : columns === 4
                  ? 'sm:grid-cols-2 lg:grid-cols-4'
                  : 'sm:grid-cols-1'
          }`}
        >
          {skeletons.map((_, i) => (
            <div key={i}>{renderSkeleton()}</div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {skeletons.map((_, i) => (
            <div key={i}>{renderSkeleton()}</div>
          ))}
        </div>
      )}
    </>
  );
};

export default SkeletonLoader;
