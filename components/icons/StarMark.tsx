import { SVGProps } from "react";

/**
 * The 148 secondary mark — a four-point spark/star used across the
 * interface as a divider, loading indicator and hover accent.
 */
export function StarMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 0c.7 4.6 2.1 7.9 4.2 10 2.1 2.1 5.4 3.5 10 4.2-4.6.7-7.9 2.1-10 4.2-2.1 2.1-3.5 5.4-4.2 10-.7-4.6-2.1-7.9-4.2-10-2.1-2.1-5.4-3.5-10-4.2 4.6-.7 7.9-2.1 10-4.2 2.1-2.1 3.5-5.4 4.2-10Z" />
    </svg>
  );
}
