export function TaskCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-start gap-4 animate-pulse">
      <div className="w-5 h-5 rounded bg-gray-200 shrink-0 mt-0.5" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
      <div className="flex gap-2">
        <div className="w-7 h-7 bg-gray-200 rounded" />
        <div className="w-7 h-7 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
