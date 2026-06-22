type PinMarkerOptions = {
  color: string;
  darkColor: string;
  number: string;
};

function createPinMarkerSvg({ color, darkColor, number }: PinMarkerOptions) {
  return `<svg width="100%" viewBox="0 0 680 320" role="img" xmlns="http://www.w3.org/2000/svg">
  <title>Map pin with checkered flag</title>
  <g transform="translate(340, 30)">
    <ellipse cx="0" cy="195" rx="12" ry="4" fill="#00000022"/>

    <path d="M0 185 C-48 185 -62 145 -62 110 C-62 55 -35 20 0 20 C35 20 62 55 62 110 C62 145 48 185 0 185 Z" fill="${color}"/>
    <path d="M0 185 C-48 185 -62 145 -62 110 C-62 80 -45 50 -20 35 C-10 65 -5 100 0 120 C5 100 10 65 20 35 C45 50 62 80 62 110 C62 145 48 185 0 185 Z" fill="${darkColor}" opacity="0.4"/>

    <circle cx="0" cy="105" r="40" fill="white" opacity="0.95"/>

    <text
      x="0"
      y="90"
      text-anchor="middle"
      font-family="Arial, sans-serif"
      font-size="40"
      font-weight="700"
      fill="${color}"
    >
      ${number}
    </text>

    <line
      x1="10"
      y1="12"
      x2="10"
      y2="-144"
      stroke="white"
      stroke-width="4"
      stroke-linecap="round"
    />

    <g transform="translate(10,-144) scale(4.2)">
      <rect x="0" y="0" width="10" height="10" fill="${color}"/>
      <rect x="10" y="0" width="10" height="10" fill="white"/>
      <rect x="20" y="0" width="10" height="10" fill="${color}"/>
      <rect x="30" y="0" width="10" height="10" fill="white"/>
      <rect x="40" y="0" width="10" height="10" fill="${color}"/>

      <rect x="0" y="10" width="10" height="10" fill="white"/>
      <rect x="10" y="10" width="10" height="10" fill="${color}"/>
      <rect x="20" y="10" width="10" height="10" fill="white"/>
      <rect x="30" y="10" width="10" height="10" fill="${color}"/>
      <rect x="40" y="10" width="10" height="10" fill="white"/>

      <rect x="0" y="20" width="10" height="10" fill="${color}"/>
      <rect x="10" y="20" width="10" height="10" fill="white"/>
      <rect x="20" y="20" width="10" height="10" fill="${color}"/>
      <rect x="30" y="20" width="10" height="10" fill="white"/>
      <rect x="40" y="20" width="10" height="10" fill="${color}"/>
    </g>
  </g>
</svg>`;
}

function toDataUrl(svg: string) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export const startMarkerIconUrl = toDataUrl(
  createPinMarkerSvg({
    color: "#E53935",
    darkColor: "#CC2222",
    number: "4",
  }),
);

export const endMarkerIconUrl = toDataUrl(
  createPinMarkerSvg({
    color: "#43A047",
    darkColor: "#2E7D32",
    number: "8",
  }),
);