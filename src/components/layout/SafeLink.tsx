import * as React from "react";
import { useLocation } from "wouter";

type Props = React.PropsWithChildren<{
  href: string;
  className?: string;
  "aria-label"?: string;
  "data-testid"?: string;
}>;

/**
 * SafeLink
 * - Uses wouter's navigate when router context is available
 * - Falls back to history.pushState + popstate when it's not, so UI never crashes
 */
export default function SafeLink({ href, className, children, ...rest }: Props) {
  let navigate: ((to: string) => void) | null = null;
  try {
    // may throw if context is undefined in some builds — that's okay
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const tuple = useLocation();
    if (Array.isArray(tuple) && typeof tuple[1] === "function") navigate = tuple[1];
  } catch {
    // ignore; we'll use the fallback
  }

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!href || href.startsWith("http")) return; // let external links behave normally
    e.preventDefault();
    if (navigate) {
      navigate(href);
    } else {
      // fallback: manual client-side navigation
      try {
        window.history.pushState({}, "", href);
        window.dispatchEvent(new PopStateEvent("popstate"));
      } catch {
        window.location.assign(href);
      }
    }
  };

  return (
    <a href={href} onClick={onClick} className={className} {...rest}>
      {children}
    </a>
  );
}