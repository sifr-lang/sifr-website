import React from "react";

interface SifrLogoProps {
  className?: string;
  size?: number | string;
}

export const SifrLogo: React.FC<SifrLogoProps> = ({ className = "", size = "100%" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Core Teal-to-Blue Body Gradient */}
        <linearGradient id="sifrTealBody" x1="100" y1="100" x2="412" y2="412" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#06b6d4" /> {/* Cyan 500 */}
          <stop offset="35%" stopColor="#0ea5e9" /> {/* Sky 500 */}
          <stop offset="70%" stopColor="#0284c7" /> {/* Sky 600 */}
          <stop offset="100%" stopColor="#1e3a8a" /> {/* Blue 900 */}
        </linearGradient>

        {/* Head/Tail Orange-to-Yellow Accent Gradient */}
        <linearGradient id="sifrOrangeAccent" x1="180" y1="90" x2="430" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24" /> {/* Amber 400 */}
          <stop offset="50%" stopColor="#f97316" /> {/* Orange 500 */}
          <stop offset="100%" stopColor="#ea580c" /> {/* Orange 600 */}
        </linearGradient>

        {/* Inner shadow/depth overlay */}
        <linearGradient id="sifrShadowOverlay" x1="256" y1="120" x2="256" y2="450" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {/* Main Teal-Blue Swirling Body */}
      {/* This draws the primary circular crescent body of the snake that starts from bottom left, swings wide around the bottom and right, and curls back in at the top. */}
      <path
        d="M 190 180 
           C 200 160, 240 150, 270 155 
           C 340 165, 395 220, 395 300
           C 395 385, 315 450, 240 435
           C 170 420, 115 350, 115 270
           C 115 210, 150 150, 195 125
           C 165 155, 140 215, 145 275
           C 150 335, 190 385, 250 395
           C 305 405, 360 360, 360 300
           C 360 235, 310 190, 250 180
           C 225 175, 205 178, 190 180 Z"
        fill="url(#sifrTealBody)"
      />

      {/* Extra Body Sweeks/Depth layer for 3D effect */}
      <path
        d="M 150 270 
           C 150 350, 210 400, 280 400
           C 350 400, 410 330, 410 256
           C 410 180, 350 120, 280 120
           C 240 120, 200 135, 180 160
           C 210 140, 260 135, 300 145
           C 360 160, 390 220, 390 275
           C 390 340, 330 385, 266 385
           C 200 385, 160 340, 150 270 Z"
        fill="url(#sifrShadowOverlay)"
      />

      {/* Top Snake Orange Head & Upper Loop Accent */}
      {/* This starts on the inside of the left loop, curves over the top, and models the rounded snout/head pointing down and right. */}
      <path
        d="M 190 180 
           C 188 150, 210 115, 250 100
           C 290 85, 360 105, 395 145
           C 415 170, 420 185, 418 188
           C 415 190, 400 185, 390 175
           C 375 160, 350 145, 310 135
           C 280 128, 250 132, 230 145
           C 205 160, 195 175, 190 180 Z"
        fill="url(#sifrOrangeAccent)"
      />

      {/* Head details: Rounded snout, eye contour */}
      <path
        d="M 380 135
           C 390 145, 412 165, 418 185
           C 422 190, 420 193, 415 190
           C 410 185, 395 180, 385 175
           C 365 165, 345 155, 325 150
           C 350 142, 365 138, 380 135 Z"
        fill="url(#sifrOrangeAccent)"
      />

      {/* Bottom Left Flame/Tail Accent */}
      {/* This forms the fine tail tip that curls out gracefully at the bottom-left of the logo. */}
      <path
        d="M 115 310
           C 105 310, 92 315, 85 308
           C 95 315, 115 325, 130 345
           C 145 365, 190 385, 220 395
           C 195 385, 162 380, 142 360
           C 125 340, 120 320, 115 310 Z"
        fill="url(#sifrOrangeAccent)"
      />
    </svg>
  );
};
