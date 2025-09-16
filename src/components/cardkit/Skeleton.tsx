function Skeleton({ className = "h-6 rounded-xl bg-neutral-900 animate-pulse" }: {
  className?: string;
}) {
  return <div className={className} />;
}

export default Skeleton;
export { Skeleton }; // <-- provide named export too