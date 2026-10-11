'use client';

import { useId } from 'react';

export function BodyMap({ chest = false, paused = false }: { chest?: boolean; paused?: boolean }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 250 295" className="body-map" data-paused={paused} aria-hidden="true">
      <defs>
        <pattern id={id} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="currentColor" strokeWidth=".4" opacity=".13" />
        </pattern>
      </defs>
      <rect width="250" height="295" fill={`url(#${id})`} />
      <g fill="none" stroke="currentColor" strokeWidth="1" opacity=".6">
        <ellipse cx="125" cy="29" rx="16" ry="22" />
        <path d="M116 49L111 59 85 66 73 102 66 152 71 170 78 168 87 116 98 91 99 141 93 177 101 231 103 273 116 277 121 229 125 187 129 229 134 277 147 273 149 231 157 177 151 141 152 91 163 116 172 168 179 170 184 152 177 102 165 66 139 59 134 49" />
        <path d="M111 59L125 75 139 59M99 141Q125 154 151 141M93 177Q125 166 157 177M125 75V187M98 91L125 103 152 91M99 114L125 125 151 114M101 231L121 229M129 229L149 231M85 66L125 75 165 66" />
        <path d="M104 77Q94 87 105 107Q116 115 120 99L120 79M146 77Q156 87 145 107Q134 115 130 99L130 79" />
      </g>
      {chest && (
        <g className="chest-signal">
          <circle cx="125" cy="94" r="31" fill="none" stroke="currentColor" opacity=".2" />
          <circle
            cx="125"
            cy="94"
            r="25"
            fill="none"
            stroke="currentColor"
            className="anatomy-ping"
          />
          <path
            d="M104 77Q94 87 105 107Q116 115 120 99L120 79M146 77Q156 87 145 107Q134 115 130 99L130 79"
            fill="currentColor"
            fillOpacity=".15"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <circle cx="125" cy="94" r="3" fill="currentColor" />
          <path d="M149 94H215" stroke="currentColor" strokeWidth=".8" />
          <circle cx="215" cy="94" r="2" fill="currentColor" />
        </g>
      )}
      <g fill="currentColor" opacity=".3">
        <circle cx="17" cy="20" r="2" />
        <circle cx="232" cy="274" r="2" />
      </g>
    </svg>
  );
}

export function CirculationArt({ paused = false }: { paused?: boolean }) {
  return (
    <svg viewBox="0 0 300 350" className="circulation-art" data-paused={paused} aria-hidden="true">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          className="heart-outline"
          d="M147 107C132 63 72 73 80 126C84 163 124 187 151 213C179 187 216 151 218 125C223 86 187 67 166 95C157 107 155 119 147 107Z"
        />
        <path d="M148 107L138 74 138 35M155 115L165 72 190 50M168 105L185 82 218 84M138 74L111 56 111 34M138 49L155 31M185 82L193 64M151 213V265L128 308 125 339M151 265L178 308 182 339M144 231L102 243 73 262 48 264M158 231L201 244 225 266 252 269M112 167L142 145 163 157 188 127M151 213L142 145 138 110M80 126L40 134 19 122M218 125L253 135 281 118" />
        <path
          className="circulation-flow"
          d="M138 35V74L148 107 142 145 151 213V265L178 308 182 339"
          strokeWidth="2.4"
        />
        <circle cx="138" cy="35" r="3" />
        <circle cx="19" cy="122" r="3" />
        <circle cx="281" cy="118" r="3" />
        <circle cx="125" cy="339" r="3" />
        <circle cx="182" cy="339" r="3" />
      </g>
    </svg>
  );
}
