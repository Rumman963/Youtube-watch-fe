export function WatchIcon(){


    return <div>

        <svg
  width="100"
  height="100"
  viewBox="0 0 220 140"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
    <linearGradient id="frame" x1="30" y1="35" x2="190" y2="105">
      <stop offset="0" stop-color="#FFFFFF"/>
      <stop offset="1" stop-color="#D9D9E2"/>
    </linearGradient>

    <linearGradient id="lens" x1="40" y1="45" x2="180" y2="105">
      <stop offset="0" stop-color="#151923"/>
      <stop offset="1" stop-color="#080A10"/>
    </linearGradient>

    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>


  <g filter="url(#glow)" fill="#FF1020">
    <rect x="106" y="10" width="8" height="22" rx="4"/>
    <rect x="82" y="15" width="8" height="20" rx="4"
          transform="rotate(-38 82 15)"/>
    <rect x="134" y="15" width="8" height="20" rx="4"
          transform="rotate(38 134 15)"/>
  </g>

  
  <path
    d="
      M18 52
      Q18 42 30 40
      Q66 34 92 42
      Q101 45 110 53
      Q119 45 128 42
      Q154 34 190 40
      Q202 42 202 52
      L202 65
      Q202 74 194 77
      L187 80
      Q183 109 155 112
      Q127 115 119 91
      L115 78
      Q112 72 110 72
      Q108 72 105 78
      L101 91
      Q93 115 65 112
      Q37 109 33 80
      L26 77
      Q18 74 18 65
      Z
    "
    fill="url(#frame)"
    stroke="#101218"
    stroke-width="3"
  />

 
  <path
    d="
      M34 53
      Q61 46 86 51
      Q96 53 99 63
      L94 89
      Q89 103 67 104
      Q43 103 39 85
      Z
    "
    fill="url(#lens)"
  />

  <path
    d="
      M186 53
      Q159 46 134 51
      Q124 53 121 63
      L126 89
      Q131 103 153 104
      Q177 103 181 85
      Z
    "
    fill="url(#lens)"
  />

  
  <path
    d="M43 75 Q65 55 91 75 Q65 96 43 75Z"
    fill="white"
  />

  <path
    d="M177 75 Q155 55 129 75 Q155 96 177 75Z"
    fill="white"
  />


  <circle cx="67" cy="75" r="13" fill="#101218"/>
  <circle cx="67" cy="75" r="9" fill="#171B25"/>


  <circle cx="153" cy="75" r="13" fill="#101218"/>
  <circle cx="153" cy="75" r="9" fill="#171B25"/>

 
  <path
    d="M64 69 L64 81 Q64 84 67 82 L74 76 Q76 75 74 73 L67 68 Q64 66 64 69Z"
    fill="#FF1020"
  />

  
  <path
    d="M150 69 L150 81 Q150 84 153 82 L160 76 Q162 75 160 73 L153 68 Q150 66 150 69Z"
    fill="#FF1020"
  />


  <circle cx="71" cy="70" r="3" fill="white"/>
  <circle cx="157" cy="70" r="3" fill="white"/>


  <path
    d="M42 55 L57 50 L46 70Z"
    fill="#667085"
    opacity="0.35"
  />

  <path
    d="M178 55 L163 50 L174 70Z"
    fill="#667085"
    opacity="0.35"
  />

  
  <rect x="27" y="54" width="13" height="5" rx="2.5" fill="#FF1020"/>
  <rect x="180" y="54" width="13" height="5" rx="2.5" fill="#FF1020"/>

</svg>
    </div>
}