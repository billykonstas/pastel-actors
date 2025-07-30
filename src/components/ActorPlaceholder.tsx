import React from "react";

type PlaceholderProps = {
  name: string;
  size?: number;
  actorId: number;
};

export function ActorPlaceholder({ name, size = 50, actorId }: PlaceholderProps) {
  const colors = ["#f4cccc", "#a2c4c9", "#d5a6bd"];
  const initial = name?.charAt(0).toUpperCase() ?? "?";
  const bgColor = colors[actorId % colors.length];
  const frameColor = "#4a3f35"; // dark brown

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {/* Oval Frame */}
      <ellipse cx="50" cy="50" rx="48" ry="48" fill={bgColor} stroke={frameColor} strokeWidth="4" />

      {/* Inner decorative border */}
      <ellipse
        cx="50"
        cy="50"
        rx="42"
        ry="42"
        fill="none"
        stroke={frameColor}
        strokeWidth="2"
        strokeDasharray="6 3"
      />

      {/* Initial */}
      <text
        x="52%"
        y="65%"
        textAnchor="middle"
        fontSize="42"
        fontFamily="'Cormorant Garamond', serif"
        fontWeight="bold"
        fill={frameColor}
      >
        {initial}
      </text>
    </svg>
  );
}
