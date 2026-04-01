import { cn } from '../utils/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('bg-gray-200 animate-pulse rounded', className)} />
  );
}
