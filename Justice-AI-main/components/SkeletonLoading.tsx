export default function SkeletonLoading() {
  return (
    <div className="flex items-start space-x-4 animate-pulse max-w-xs md:max-w-md p-4">
      <div className="flex-shrink-0 w-10 h-10 bg-zinc-300 dark:bg-zinc-700 rounded-full skeleton-rgb"></div>
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gradient-to-r from-zinc-300 via-zinc-400 to-zinc-300 dark:from-zinc-700 dark:via-zinc-800 dark:to-zinc-700 rounded w-full skeleton-rgb"></div>
        <div className="h-4 bg-gradient-to-r from-zinc-300 via-zinc-400 to-zinc-300 dark:from-zinc-700 dark:via-zinc-800 dark:to-zinc-700 rounded w-4/5 skeleton-rgb"></div>
        <div className="h-4 bg-gradient-to-r from-zinc-300 via-zinc-400 to-zinc-300 dark:from-zinc-700 dark:via-zinc-800 dark:to-zinc-700 rounded w-3/4 skeleton-rgb"></div>
        <div className="h-4 bg-gradient-to-r from-zinc-300 via-zinc-400 to-zinc-300 dark:from-zinc-700 dark:via-zinc-800 dark:to-zinc-700 rounded w-2/3 skeleton-rgb"></div>
      </div>
    </div>
  );
}
