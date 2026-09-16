/**
 * ZUN wordmark — three squares over the letterforms.
 *
 * Drawn as SVG rather than shipped as a PNG: it stays crisp at every size
 * (login card, menu bar, favicon), costs no bytes, and picks up the theme
 * tokens instead of baking a background in.
 */
export function ZunMark({
  size = 96,
  plate = true,
  className,
}: {
  size?: number;
  /** draw the dark plate behind the mark (off when it sits on one already) */
  plate?: boolean;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label="ZUN"
      className={className}
    >
      {plate && <rect width="120" height="120" rx="14" fill="#0d0f14" />}

      {/* three squares, lightest → strongest, left to right */}
      <g>
        <rect x="34" y="34" width="14.5" height="14.5" fill="#a5c8fa" />
        <rect x="52.75" y="34" width="14.5" height="14.5" fill="#5b9cf8" />
        <rect x="71.5" y="34" width="14.5" height="14.5" fill="#4a90f2" />
      </g>

      <text
        x="60"
        y="82"
        textAnchor="middle"
        fill="#ffffff"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="27"
        fontWeight="700"
        letterSpacing="4.2"
      >
        ZUN
      </text>
    </svg>
  );
}
