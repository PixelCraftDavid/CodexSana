import type { CompanionTheme } from '../model/kids-themes';

/** Original vector mascots. The same artwork is used on screen and in print exports. */
export function companionHeadSVG(theme: CompanionTheme) {
  if (theme === 'nutria-perla')
    return `<g stroke-linecap="round" stroke-linejoin="round">
    <circle cx="67" cy="85" r="13" fill="#9f7357" stroke="#70503f" stroke-width="2.1"/><circle cx="193" cy="85" r="13" fill="#9f7357" stroke="#70503f" stroke-width="2.1"/>
    <circle cx="67" cy="85" r="7" fill="#dcac97"/><circle cx="193" cy="85" r="7" fill="#dcac97"/>
    <path d="M64 105Q62 65 130 65Q198 65 196 105Q198 143 168 158Q130 174 92 158Q62 143 64 105Z" fill="#a77b5f" stroke="#70503f" stroke-width="2.2"/>
    <path d="M83 111Q91 97 110 102Q130 109 150 102Q169 97 177 111Q190 137 167 152Q130 170 93 152Q70 137 83 111Z" fill="#eed1ad"/>
    <g class="companion-eyes" fill="#392a24"><ellipse cx="93" cy="98" rx="9.5" ry="11.5"/><ellipse cx="167" cy="98" rx="9.5" ry="11.5"/><circle cx="90" cy="94" r="3.2" fill="#fffdf8"/><circle cx="164" cy="94" r="3.2" fill="#fffdf8"/><circle cx="96" cy="102" r="1.5" fill="#e8c8a7"/><circle cx="170" cy="102" r="1.5" fill="#e8c8a7"/></g>
    <ellipse cx="85" cy="122" rx="10" ry="5.5" fill="#dd9b86" opacity=".6"/><ellipse cx="175" cy="122" rx="10" ry="5.5" fill="#dd9b86" opacity=".6"/>
    <ellipse cx="113" cy="131" rx="20" ry="15" fill="#fff0d7"/><ellipse cx="147" cy="131" rx="20" ry="15" fill="#fff0d7"/>
    <path d="M118 113Q130 105 142 113Q145 123 130 126Q115 123 118 113Z" fill="#51382d"/>
    <path d="M130 126V132Q123 141 116 134M130 132Q137 141 144 134" fill="none" stroke="#70503f" stroke-width="1.8"/>
    <path d="M99 124L68 115M99 131L64 132M99 138L73 148M161 124L192 115M161 131L196 132M161 138L187 148" fill="none" stroke="#8f6850" stroke-width="1.5"/>
    <g aria-label="Gorrito de ranita">
      <circle cx="85" cy="43" r="16" fill="#a2c984" stroke="#567448" stroke-width="2"/><circle cx="175" cy="43" r="16" fill="#a2c984" stroke="#567448" stroke-width="2"/>
      <ellipse cx="85" cy="43" rx="10" ry="11" fill="#fffdf0"/><ellipse cx="175" cy="43" rx="10" ry="11" fill="#fffdf0"/>
      <ellipse cx="87" cy="44" rx="5.5" ry="7" fill="#344536"/><ellipse cx="173" cy="44" rx="5.5" ry="7" fill="#344536"/>
      <circle cx="85" cy="41" r="2" fill="#fff"/><circle cx="171" cy="41" r="2" fill="#fff"/>
      <path d="M72 66L77 49Q80 36 130 36Q180 36 183 49L188 66Z" fill="#b8d99a" stroke="#567448" stroke-width="2"/>
      <ellipse cx="104" cy="54" rx="6" ry="3" fill="#e9a798"/><ellipse cx="156" cy="54" rx="6" ry="3" fill="#e9a798"/>
      <path d="M122 49Q123 58 130 58Q137 58 138 49" fill="none" stroke="#567448" stroke-width="1.8"/>
      <path d="M70 65Q130 53 190 65L211 78Q215 85 202 84Q130 73 58 84Q45 85 49 78Z" fill="#93bd7d" stroke="#567448" stroke-width="2"/>
      <path d="M77 72Q130 63 183 72" fill="none" stroke="#d9e9bd" stroke-width="1.4"/>
    </g>
  </g>`;
  return `<g stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="84" cy="57" rx="11" ry="13" transform="rotate(-20 84 57)" fill="#c59671" stroke="#896547" stroke-width="2.2"/>
    <ellipse cx="176" cy="57" rx="11" ry="13" transform="rotate(20 176 57)" fill="#c59671" stroke="#896547" stroke-width="2.2"/>
    <ellipse cx="84" cy="57" rx="5.5" ry="7" fill="#e8b3a2"/><ellipse cx="176" cy="57" rx="5.5" ry="7" fill="#e8b3a2"/>
    <path d="M67 98C65 69 87 51 130 51C173 51 195 69 193 98Q207 121 191 141Q172 160 130 162Q88 160 69 141Q53 121 67 98Z" fill="#d7b083" stroke="#896547" stroke-width="2.3"/>
    <path d="M82 84Q91 68 110 66" fill="none" stroke="#ecd0aa" stroke-width="3.4"/>
    <path d="M119 100Q130 92 141 100Q151 108 150 125L149 140Q147 149 130 150Q113 149 111 140L110 125Q109 108 119 100Z" fill="#b98868"/>
    <g class="companion-eyes" fill="#674735"><ellipse cx="95" cy="98" rx="5.5" ry="7" transform="rotate(-10 95 98)"/><ellipse cx="165" cy="98" rx="5.5" ry="7" transform="rotate(10 165 98)"/><circle cx="93.5" cy="96" r="1.7" fill="#fff5df"/><circle cx="163.5" cy="96" r="1.7" fill="#fff5df"/></g>
    <ellipse cx="85" cy="116" rx="11" ry="6" fill="#e9a48e" opacity=".65"/><ellipse cx="175" cy="116" rx="11" ry="6" fill="#e9a48e" opacity=".65"/>
    <ellipse cx="123" cy="111" rx="2.7" ry="2.1" fill="#78523d"/><ellipse cx="137" cy="111" rx="2.7" ry="2.1" fill="#78523d"/>
    <path d="M130 129V135M124 135Q127 138 130 135Q133 138 136 135" fill="none" stroke="#78523d" stroke-width="1.7"/>
    <path d="M75 125L79 128M82 126L85 130M178 126L175 130M185 125L181 128" fill="none" stroke="#b78c64" stroke-width="1.3"/>
  </g>`;
}

export function companionBodySVG(theme: CompanionTheme) {
  if (theme === 'nutria-perla')
    return `<g stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="137" cy="278" rx="83" ry="8" fill="#28545d" opacity=".08"/>
    <path class="otter-tail" d="M179 236Q211 256 238 239Q251 234 247 245Q232 272 204 266L174 255Z" fill="#9f7357" stroke="#70503f" stroke-width="2.2"/>
    <path d="M90 151Q73 177 76 220Q76 256 103 267H159Q185 256 184 222Q188 178 171 151Z" fill="#a77b5f" stroke="#70503f" stroke-width="2.2"/>
    <ellipse cx="130" cy="227" rx="34" ry="36" fill="#eed1ad"/>
    <path d="M94 154Q75 159 72 188L77 231Q79 238 100 241L128 243L133 237L138 243Q166 242 184 235L187 188Q183 160 166 154Z" fill="#f4c59b" stroke="#b18763" stroke-width="1.9"/>
    <path d="M97 155Q108 169 130 174Q152 169 164 155L157 178Q142 182 130 176Q119 183 103 178Z" fill="#f9dcb6" stroke="#b18763" stroke-width="1.4"/>
    <path d="M133 179V236" fill="none" stroke="#d6a778" stroke-width="1.2"/><circle cx="139" cy="223" r="2" fill="#b18763"/><circle cx="139" cy="234" r="2" fill="#b18763"/>
    <path d="M91 173Q68 173 66 195Q65 214 93 216L108 201L103 188Z" fill="#f4c59b" stroke="#b18763" stroke-width="1.9"/>
    <path d="M169 173Q192 173 194 195Q195 214 166 216L151 201L157 188Z" fill="#f4c59b" stroke="#b18763" stroke-width="1.9"/>
    <path d="M88 205L103 198L109 206L95 217ZM151 201L166 208L161 218L147 210Z" fill="#f9dcb6" stroke="#b18763" stroke-width="1.2"/>
    <g class="otter-syringe"><g transform="rotate(38 130 212)">
      <rect x="125" y="158" width="12" height="22" rx="5" fill="#a8d4d4" stroke="#567f86" stroke-width="1.8"/>
      <rect x="127" y="177" width="8" height="8" rx="2" fill="#79b3b6" stroke="#567f86" stroke-width="1.5"/>
      <rect x="117" y="184" width="28" height="53" rx="5" fill="#fffdf8" stroke="#567f86" stroke-width="2"/>
      <path d="M121 190H141V211H121Z" fill="#d4e9e6"/>
      <path d="M121 200H129M121 207H127M121 214H129M121 221H127" fill="none" stroke="#567f86" stroke-width="1.4"/>
      <path d="M113 237H149M131 238V254" fill="none" stroke="#567f86" stroke-width="3"/>
      <rect x="120" y="252" width="22" height="7" rx="3.5" fill="#d4e9e6" stroke="#567f86" stroke-width="1.8"/>
      <path d="M136 189V229" fill="none" stroke="#fff" stroke-width="2"/>
    </g></g>
    <path d="M97 195Q106 188 115 195Q122 203 116 213Q111 220 99 216Q90 210 97 195Z" fill="#a77b5f" stroke="#70503f" stroke-width="1.9"/>
    <path d="M107 197L113 201M103 203L110 207M102 209L108 212" fill="none" stroke="#70503f" stroke-width="1.2"/>
    <path d="M155 198Q163 195 168 203Q174 215 164 219Q153 223 147 211Q144 203 155 198Z" fill="#a77b5f" stroke="#70503f" stroke-width="1.9"/>
    <path d="M154 202L160 205M153 208L160 211M155 214L161 216" fill="none" stroke="#70503f" stroke-width="1.2"/>
    <ellipse cx="99" cy="266" rx="22" ry="12" fill="#9f7357" stroke="#70503f" stroke-width="2.1"/><ellipse cx="162" cy="266" rx="22" ry="12" fill="#9f7357" stroke="#70503f" stroke-width="2.1"/>
    <path d="M90 267V271M98 268V273M106 267V271M154 267V271M162 268V273M170 267V271" fill="none" stroke="#70503f" stroke-width="1.4"/>
  </g>`;
  return `<g stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="130" cy="270" rx="73" ry="8" fill="#304867" opacity=".08"/>
    <path d="M92 236H168L171 254Q166 267 152 267H109Q95 265 89 253Z" fill="#c4d4e5" stroke="#a0adbc" stroke-width="1.4"/>
    <path d="M130 249V264" fill="none" stroke="#a0adbc" stroke-width="1.2"/>
    <ellipse cx="81" cy="220" rx="10" ry="13" transform="rotate(10 81 220)" fill="#d7b083" stroke="#896547" stroke-width="1.8"/>
    <path d="M76 221L77 226M82 222L83 227" fill="none" stroke="#a17b58" stroke-width="1.2"/>
    <path d="M100 157Q84 159 77 183Q72 197 73 211Q79 217 90 213L101 183L106 164Z" fill="#fffaf2" stroke="#a0adbc" stroke-width="1.8"/>
    <path d="M73 207Q80 212 92 208L90 214Q79 218 73 212Z" fill="#dce6f1" stroke="#a0adbc" stroke-width="1.2"/>
    <g class="capi-wave">
      <path d="M210 186Q216 177 214 170Q211 162 218 160Q226 157 230 166Q235 177 224 189Z" fill="#d7b083" stroke="#896547" stroke-width="1.8"/>
      <path d="M218 165L220 171M224 165L226 170" fill="none" stroke="#a17b58" stroke-width="1.2"/>
      <path d="M161 155Q180 158 186 180L198 192Q204 196 212 182L225 189Q217 211 202 211Q187 210 176 195L164 180Z" fill="#fffaf2" stroke="#a0adbc" stroke-width="1.8"/>
      <path d="M210 182L225 188L223 194L208 188Z" fill="#dce6f1" stroke="#a0adbc" stroke-width="1.2"/>
    </g>
    <path d="M101 151Q87 162 84 183L87 232Q88 245 97 247Q130 254 164 247Q176 245 177 232L180 183Q175 161 159 151Z" fill="#fffaf2" stroke="#a0adbc" stroke-width="1.8"/>
    <path d="M114 153L130 176L146 153Z" fill="#c4d4e5" stroke="#a0adbc" stroke-width="1.2"/>
    <path d="M113 157L109 165L122 175L127 167ZM147 157L151 165L138 175L133 167Z" fill="#fffdf8" stroke="#bac5d1" stroke-width="1.2"/>
    <path d="M132 177V243" fill="none" stroke="#d3dce6" stroke-width="1.1"/><circle cx="137" cy="224" r="2" fill="#8e9eb1"/><circle cx="137" cy="239" r="2" fill="#8e9eb1"/>
    <path d="M113 166V179Q113 197 130 197Q147 197 147 179V166" fill="none" stroke="#304867" stroke-width="2.2"/>
    <path d="M130 197Q128 215 145 215Q163 215 163 204" fill="none" stroke="#304867" stroke-width="2.1"/>
    <circle cx="163" cy="201" r="6" fill="#efbf99" stroke="#304867" stroke-width="1.5"/><circle cx="163" cy="201" r="2.8" fill="#fffaf2"/>
    <path d="M97 220H117V231Q116 239 107 239Q98 239 97 231ZM149 221H169V231Q168 239 159 239Q150 239 149 231Z" fill="#f8f6f0" stroke="#bdc8d4" stroke-width="1.2"/>
    <rect x="156" y="176" width="16" height="10" rx="2.5" fill="#f5ddc4" stroke="#d9b99a" stroke-width=".8"/><path d="M159 180Q161 178 163 180Q165 182 161 184Q157 182 159 180Z" fill="#bb8462"/><path d="M165 179H169M165 182H168" stroke="#bb8462" stroke-width=".8"/>
    <ellipse cx="92" cy="258" rx="22" ry="11" fill="#c59671" stroke="#896547" stroke-width="2.1"/><ellipse cx="168" cy="258" rx="22" ry="11" fill="#c59671" stroke="#896547" stroke-width="2.1"/>
    <path d="M85 259V263M92 260V264M161 260V264M168 259V263" fill="none" stroke="#896547" stroke-width="1.4"/>
  </g>`;
}

export function companionSymbolSVG(theme: CompanionTheme) {
  return theme === 'nutria-perla'
    ? '<g fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" transform="rotate(30 32 30)"><rect x="23" y="14" width="18" height="31" rx="4" fill="currentColor" fill-opacity=".1"/><path d="M32 5V14M23 5H41M19 15H45M32 45V56M25 22H31M25 29H33M25 36H31"/></g>'
    : '<g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M32 51C-3 28 5 6 22 12Q29 14 32 22Q36 10 48 11C67 13 63 34 32 51Z" fill="currentColor" fill-opacity=".1"/><path d="M10 31H23L29 24L35 38L41 31H53"/></g>';
}
