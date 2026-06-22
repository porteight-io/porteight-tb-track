type PinMarkerOptions = {
  color?: string;
  number: string;
};

function createPinMarkerSvg({ color = "#dc2626", number }: PinMarkerOptions) {
  const fontSize = number.length > 1 ? 11 : 14;

  return `<svg
    width="44"
    height="56"
    viewBox="0 0 44 56"
    xmlns="http://www.w3.org/2000/svg"
>
    <defs>
        <filter id="shadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="2"
                flood-color="#000"
                flood-opacity="0.28"
            />
        </filter>
    </defs>

    <g filter="url(#shadow)">
        <!-- Circle -->
        <circle
            cx="22"
            cy="20"
            r="18"
            fill="${color}"
            stroke="#c62828"
            stroke-width="2"
        />

        <!-- Bottom point -->
        <path
            d="M17 34
               L22 48
               L27 34
               Q22 38 17 34Z"
            fill="${color}"
            stroke="#c62828"
            stroke-width="2"
            stroke-linejoin="round"
        />
    </g>

    <text
        x="22"
        y="22"
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="Georgia, serif"
        font-size="${fontSize}"
        font-weight="700"
        fill="#fff"
    >
        ${number}
    </text>
</svg>`;
}

function toDataUrl(svg: string) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export const startMarkerIconUrl = toDataUrl(
  createPinMarkerSvg({
    number: "4",
  }),
);

export const endMarkerIconUrl = toDataUrl(
  createPinMarkerSvg({
    number: "8",
  }),
);

export function getStoppageMarkerIconUrl(number: number) {
  return toDataUrl(createPinMarkerSvg({ number: String(number) }));
}
