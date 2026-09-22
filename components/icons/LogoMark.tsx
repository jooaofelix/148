import Image from "next/image";

interface LogoMarkProps {
  className?: string;
  priority?: boolean;
}

/**
 * The official 148 mark (blackletter numeral + star), transparent cutout.
 * Naturally tall/vertical — size by height, let width follow.
 */
export function LogoMark({ className = "", priority = false }: LogoMarkProps) {
  return (
    <Image
      src="/images/brand/148-mark-transparent.webp"
      alt="148"
      width={1038}
      height={1196}
      priority={priority}
      className={`h-full w-auto ${className}`}
    />
  );
}
