/**
 * Every UI glyph in the design is inline SVG. Icons inherit currentColor unless the
 * design pins a specific fill, so a parent can recolour them on open/closed states.
 */
type IconProps = {
  className?: string;
  size?: number | string;
};

const base = (size: number | string | undefined, fallback: number) => ({
  width: size ?? fallback,
  height: size ?? fallback,
  "aria-hidden": true as const,
  focusable: "false" as const,
});

export function ArrowUpRight({ className, size }: IconProps) {
  return (
    <svg
      {...base(size, 18)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      className={className}
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

export function ArrowRight({ className, size }: IconProps) {
  return (
    <svg
      {...base(size, 18)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      className={className}
    >
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function Star({ className, size }: IconProps) {
  return (
    <svg
      {...base(size, 24)}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 2l2.6 6.3L21 9l-4.8 4.2L17.6 20 12 16.6 6.4 20l1.4-6.8L3 9l6.4-.7z" />
    </svg>
  );
}

/** The four-point sparkle used as a marquee separator and hero chip. */
export function Sparkle4({ className, size }: IconProps) {
  return (
    <svg
      {...base(size, 22)}
      viewBox="0 0 22 22"
      fill="currentColor"
      className={className}
    >
      <path d="M11 0c1 5 2 6 7 7-5 1-6 2-7 7-1-5-2-6-7-7 5-1 6-2 7-7z" />
    </svg>
  );
}

/** Two-leaf sparkle that trails the H1. */
export function Sparkle2({ className, size }: IconProps) {
  return (
    <svg
      {...base(size, 26)}
      viewBox="0 0 26 26"
      fill="currentColor"
      className={className}
    >
      <path d="M4 4c6 2 9 5 11 11-6-2-9-5-11-11z" />
      <path d="M15 17c4 1 6 3 7 7-4-1-6-3-7-7z" />
    </svg>
  );
}

/** Width-driven: the glyph's natural ratio is 46:34. */
export function QuoteMark({
  className,
  width = 46,
}: {
  className?: string;
  width?: number;
}) {
  return (
    <svg
      width={width}
      height={Math.round((width * 34) / 46)}
      viewBox="0 0 46 34"
      fill="currentColor"
      aria-hidden
      focusable="false"
      className={className}
    >
      <path d="M0 34V19C0 8.5 6.5 1 17 0v7C11 8 8 12 8 17h9v17H0zM26 34V19C26 8.5 32.5 1 43 0v7c-6 1-9 5-9 12h9v15H26z" />
    </svg>
  );
}

export function Shield({ className, size }: IconProps) {
  return (
    <svg
      {...base(size, 20)}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 3l7 4v5c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V7z" />
    </svg>
  );
}

export function GraduationCap({ className, size }: IconProps) {
  return (
    <svg
      {...base(size, 24)}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 3 1 8l11 5 9-4.1V15h2V8zM5 13.2V17c0 1.7 3.1 3 7 3s7-1.3 7-3v-3.8l-7 3.2z" />
    </svg>
  );
}

export function Briefcase({ className, size }: IconProps) {
  return (
    <svg
      {...base(size, 24)}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M9 3h6v2h4a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h4zm2 2v0h2V5z" />
    </svg>
  );
}

export function Bulb({ className, size }: IconProps) {
  return (
    <svg
      {...base(size, 24)}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 2a5 5 0 015 5c0 2-1 3-1 5H8c0-2-1-3-1-5a5 5 0 015-5zM9 14h6v2H9zm1 4h4l-1 3h-2z" />
    </svg>
  );
}

export function Person({ className, size }: IconProps) {
  return (
    <svg
      {...base(size, 24)}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 4a6 6 0 016 6h-4a2 2 0 10-4 0H6a6 6 0 016-6z" />
    </svg>
  );
}

export function Check({ className, size }: IconProps) {
  return (
    <svg
      {...base(size, 12)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.4"
      strokeLinecap="round"
      className={className}
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function Envelope({ className, size }: IconProps) {
  return (
    <svg
      {...base(size, 20)}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M2 5h20v14H2zm2 2v.3l8 5 8-5V7H4zm16 3.4l-8 5-8-5V17h16z" />
    </svg>
  );
}

export function MapPin({ className, size }: IconProps) {
  return (
    <svg
      {...base(size, 19)}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 2a7 7 0 00-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
    </svg>
  );
}

export function SpeechBubble({ className, size }: IconProps) {
  return (
    <svg
      {...base(size, 30)}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M4 4h16v11H8l-4 4z" />
    </svg>
  );
}

export function Phone({ className, size }: IconProps) {
  return (
    <svg
      {...base(size, 26)}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M6.6 10.8a15.6 15.6 0 006.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 013 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.2 1.1z" />
    </svg>
  );
}

export function PaperPlane({ className, size }: IconProps) {
  return (
    <svg
      {...base(size, 18)}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M2 21l20-9L2 3v7l14 2-14 2z" />
    </svg>
  );
}

export function LinkedIn({ className, size }: IconProps) {
  return (
    <svg
      {...base(size, 20)}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95C20.3 8.75 21 11 21 14.1V21h-4v-6.1c0-1.45-.03-3.32-2.02-3.32-2.02 0-2.33 1.58-2.33 3.21V21H9z" />
    </svg>
  );
}

export function GitHub({ className, size }: IconProps) {
  return (
    <svg
      {...base(size, 20)}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 .5A11.5 11.5 0 00.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.25.8-.55v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.35-1.3-1.7-1.3-1.7-1.05-.7.1-.7.1-.7 1.15.1 1.75 1.2 1.75 1.2 1 1.75 2.65 1.25 3.3.95.1-.75.4-1.25.75-1.55-2.55-.3-5.25-1.3-5.25-5.7 0-1.25.45-2.3 1.15-3.1-.1-.3-.5-1.5.1-3.1 0 0 .95-.3 3.15 1.2a10.9 10.9 0 015.7 0C18.9 4.15 19.85 4.45 19.85 4.45c.6 1.6.2 2.8.1 3.1.75.8 1.15 1.85 1.15 3.1 0 4.4-2.7 5.4-5.3 5.7.45.4.8 1.15.8 2.3v3.05c0 .3.2.65.8.55A11.5 11.5 0 0023.5 12 11.5 11.5 0 0012 .5z" />
    </svg>
  );
}

export function Menu({ className, size }: IconProps) {
  return (
    <svg
      {...base(size, 22)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      className={className}
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function Close({ className, size }: IconProps) {
  return (
    <svg
      {...base(size, 22)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      className={className}
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
