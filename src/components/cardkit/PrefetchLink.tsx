import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";

function PrefetchLink({
  to,
  prefetchKey,
  fetcher,        // () => Promise<any>
  children,
  ...rest
}: React.ComponentProps<typeof Link> & {
  prefetchKey?: any[];
  fetcher?: () => Promise<any>;
}) {
  const qc = useQueryClient();
  return (
    <Link
      to={to}
      onMouseEnter={async () => {
        if (prefetchKey && fetcher) {
          await qc.prefetchQuery({ queryKey: prefetchKey, queryFn: fetcher, staleTime: 30_000 });
        }
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}

export default PrefetchLink;
export { PrefetchLink }; // <-- provide named export too