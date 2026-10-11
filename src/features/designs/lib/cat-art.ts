import type { CatTheme } from '../model/kids-themes';

/** Small cat footprints follow the frame, outside the content and QR quiet zone. */
export function catPawBorderSVG(
  width: number,
  height: number,
  color: string,
  size = 16,
  spacing = 44,
  inset = 12,
) {
  const paw =
    '<ellipse cx="-5.8" cy="-1.7" rx="2.2" ry="2.8" transform="rotate(-28 -5.8 -1.7)"/><ellipse cx="-2.3" cy="-5.3" rx="2" ry="2.7"/><ellipse cx="2.3" cy="-5.3" rx="2" ry="2.7"/><ellipse cx="5.8" cy="-1.7" rx="2.2" ry="2.8" transform="rotate(28 5.8 -1.7)"/><path d="M-4.8 2.2Q-2.1-1.4 0-.3Q2.1-1.4 4.8 2.2C8.3 7.4 3.2 8.6 0 6.9C-3.2 8.6-8.3 7.4-4.8 2.2Z"/>';
  const footprints: string[] = [];
  const stamp = (x: number, y: number, angle: number) =>
    footprints.push(
      `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${size / 16})">${paw}</g>`,
    );
  const along = (length: number, visit: (position: number, index: number) => void) => {
    const margin = inset + size * 1.6;
    const count = Math.max(2, Math.floor((length - margin * 2) / spacing) + 1);
    for (let i = 0; i < count; i++) visit(margin + (i * (length - margin * 2)) / (count - 1), i);
  };
  along(width, (x, i) => {
    stamp(x, inset, i % 2 ? 10 : -10);
    stamp(x, height - inset, i % 2 ? 170 : 190);
  });
  along(height, (y, i) => {
    stamp(inset, y, i % 2 ? -80 : -100);
    stamp(width - inset, y, i % 2 ? 80 : 100);
  });
  return `<g fill="${color}" opacity=".8" aria-hidden="true">${footprints.join('')}</g>`;
}

/** Original seated cats with animal hats. Shared by the live ficha, QR badge and printed card. */
const catPalettes = {
  'michi-sol': { fur: '#f0c390', line: '#805941' },
  'michi-luna': { fur: '#fff9ed', line: '#72716b' },
} as const;

/** Animal hats frame the face without hiding the cat ears or its signature glasses. */
function catHatSVG(theme: CatTheme) {
  if (theme === 'michi-sol')
    return '<g><path d="M72 52Q59 38 71 29Q82 21 93 35Q113 24 130 27Q150 24 170 35Q181 21 192 29Q204 38 190 53Q211 53 211 72Q223 83 213 99Q224 113 211 128Q210 147 191 149Q185 166 167 161Q151 173 130 166Q109 173 93 161Q74 166 68 149Q49 148 49 130Q36 114 47 99Q37 84 49 73Q49 55 72 52Z" fill="#dfac68" stroke="#a7794c" stroke-width="2.3"/><circle cx="81" cy="39" r="10" fill="#f3cf94"/><circle cx="182" cy="39" r="10" fill="#f3cf94"/><path d="M73 58Q97 39 130 42Q166 39 190 61L197 115Q190 146 130 153Q69 146 63 115Z" fill="#f7d79e"/><path d="M66 71L61 81M61 114L65 124M81 145L89 149M174 149L182 145M200 113L198 122M193 71L199 81" fill="none" stroke="#c18b4e" stroke-width="2"/><path d="M117 45Q130 38 143 45L138 52H122Z" fill="#b9824b"/><path d="M130 52V56M124 56Q127 59 130 56Q133 59 136 56" fill="none" stroke="#a7794c" stroke-width="1.4"/></g>';
  return '<g><circle cx="80" cy="43" r="22" fill="#fff7ee" stroke="#baa493" stroke-width="2.2"/><circle cx="181" cy="43" r="22" fill="#fff7ee" stroke="#baa493" stroke-width="2.2"/><circle cx="80" cy="43" r="12" fill="#e8c6b5"/><circle cx="181" cy="43" r="12" fill="#e8c6b5"/><path d="M76 57Q66 44 82 37Q88 27 101 32Q113 23 130 28Q146 23 160 32Q176 28 182 41Q197 44 191 59Q209 62 205 78Q216 89 206 102Q217 117 204 129Q206 145 188 148Q181 164 165 160Q149 173 130 164Q111 173 95 160Q79 164 71 148Q53 145 56 129Q42 117 53 102Q42 88 54 78Q50 64 76 57Z" fill="#fff7ee" stroke="#baa493" stroke-width="2.2"/><path d="M73 66Q96 43 130 46Q166 43 188 66L197 111Q188 150 130 155Q72 150 64 111Z" fill="#e8d9c6"/><path d="M104 40Q108 35 113 39M146 39Q151 35 156 40M61 91Q58 95 62 99M199 91Q203 96 199 100M78 142Q80 147 86 146M174 146Q180 147 182 142" fill="none" stroke="#dfcfbe" stroke-width="1.6"/><ellipse cx="130" cy="45" rx="6" ry="4" fill="#b89d87"/><path d="M130 49V52M125 52Q127 55 130 52Q133 55 135 52" fill="none" stroke="#b89d87" stroke-width="1.2"/></g>';
}

export function catHeadSVG(theme: CatTheme) {
  const sunny = theme === 'michi-sol';
  const { fur, line } = catPalettes[theme];
  return `<g stroke-linecap="round" stroke-linejoin="round">
    ${catHatSVG(theme)}
    <g transform="translate(19.5 18) scale(.85 .88)">
    <path d="M62 77L58 29Q58 20 67 25L99 49M163 49L195 25Q204 20 204 30L199 80" fill="${fur}" stroke="${line}" stroke-width="2.8"/>
    <path d="M67 59L66 36 88 51M176 51L196 35 194 61" fill="#efa5a2"/>
    <path d="M87 48Q130 30 174 49C207 62 219 96 207 124C197 152 161 164 130 164C95 164 60 151 51 123C40 96 53 62 87 48Z" fill="${fur}" stroke="${line}" stroke-width="2.8"/>
    ${sunny ? '<g fill="#c48c55"><path d="M112 43L120 68Q122 74 127 69L124 40Z"/><path d="M137 40L135 67Q139 74 143 69L150 43Z"/><path d="M54 92L72 99 53 107M206 91L189 99 208 107"/></g>' : '<path d="M71 56Q89 44 99 48L96 80Q80 87 62 82Z" fill="#eadbc4"/><path d="M180 52Q199 60 201 80L181 85 175 67Z" fill="#eadbc4"/>'}
    <ellipse cx="80" cy="125" rx="12" ry="6" fill="#ed9891" opacity=".6"/><ellipse cx="182" cy="125" rx="12" ry="6" fill="#ed9891" opacity=".6"/>
    ${sunny ? '<g class="cat-shades"><path d="M72 87H111Q119 87 118 96L114 111Q112 119 95 119Q78 119 75 111L70 96Q67 87 72 87ZM149 87H188Q193 87 191 96L187 111Q184 119 168 119Q152 119 149 111L144 96Q142 87 149 87Z" fill="#2b403d" stroke="#2b403d" stroke-width="3"/><path d="M117 94Q132 86 145 94M69 91L58 86M193 91L204 85" fill="none" stroke="#2b403d" stroke-width="4"/><path d="M82 92L92 92 80 108M161 92L171 92 157 108" fill="#b5d6ca" opacity=".65"/></g>' : '<g class="cat-eyes"><ellipse cx="96" cy="101" rx="8" ry="11" fill="#385750"/><ellipse cx="166" cy="101" rx="8" ry="11" fill="#385750"/><circle cx="93" cy="97" r="3" fill="#fff"/><circle cx="163" cy="97" r="3" fill="#fff"/></g><g fill="none" stroke="#99697a" stroke-width="4"><circle cx="95" cy="100" r="24"/><circle cx="167" cy="100" r="24"/><path d="M119 98Q131 91 143 98M70 93L55 87M192 93L206 87"/></g><path d="M77 87Q83 82 88 83M149 87Q155 82 160 83" stroke="#fff" opacity=".8" stroke-width="2.5" fill="none"/>'}
    <path d="M125 119Q131 116 138 119L132 125Q130 127 128 125Z" fill="#ba7780"/>
    <path d="M131 126V132Q121 144 112 133M131 132Q142 144 150 133" fill="none" stroke="${line}" stroke-width="2.4"/>
    <g stroke="${line}" stroke-width="1.8" opacity=".65"><path d="M69 125L45 122M69 133L47 138M191 125L216 122M191 133L213 138"/></g>
    </g>
  </g>`;
}

export function catBodySVG(theme: CatTheme) {
  const sunny = theme === 'michi-sol';
  const { fur, line } = catPalettes[theme];
  return `<g stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="133" cy="278" rx="72" ry="10" fill="${sunny ? '#ba7a45' : '#538c79'}" opacity=".1"/>
    <path class="cat-tail" d="M184 237Q235 253 239 215Q241 194 222 193Q210 193 212 206" fill="none" stroke="${line}" stroke-width="18"/>
    <path class="cat-tail" d="M184 237Q235 253 239 215Q241 194 222 193Q210 193 212 206" fill="none" stroke="${fur}" stroke-width="12"/>
    <path d="M88 153Q71 181 75 224Q73 258 99 268H166Q192 257 186 225Q194 181 174 153Z" fill="${sunny ? fur : '#e9ca80'}" stroke="${line}" stroke-width="2.8"/>
    <ellipse cx="130" cy="217" rx="35" ry="36" fill="${sunny ? '#ffe7c5' : '#f6e2ad'}"/>
    <ellipse cx="97" cy="266" rx="24" ry="12" fill="${fur}" stroke="${line}" stroke-width="2.8"/><ellipse cx="167" cy="266" rx="24" ry="12" fill="${fur}" stroke="${line}" stroke-width="2.8"/>
    <path d="M89 269V273M99 269V274M160 269V274M170 269V273" stroke="${line}" stroke-width="1.7"/>
    ${sunny ? `<path d="M88 157Q130 173 175 157L157 178L136 190L128 175 115 190 98 179Z" fill="#e57958" stroke="#b56547" stroke-width="2"/><path d="M136 176L141 179 139 183 135 181Z" fill="#fff7de"/><path d="M173 184Q202 183 209 155L212 141Q225 130 230 143L225 168Q213 205 184 212" fill="${fur}" stroke="${line}" stroke-width="2.8"/><path d="M215 144L220 149M221 139L226 145" stroke="${line}" stroke-width="1.6"/><path d="M79 184Q57 188 56 213Q58 227 76 218L96 203" fill="${fur}" stroke="${line}" stroke-width="2.8"/>` : `<path d="M125 165L128 231M135 168L132 231" stroke="#bba465" fill="none" stroke-width="2"/><circle cx="133" cy="187" r="3" fill="#ad8f48"/><path class="cat-book" d="M84 199Q103 193 131 204Q155 193 178 199L174 240Q152 238 131 249Q108 238 87 240Z" fill="#fefbf0" stroke="#4b8273" stroke-width="2.5"/><path d="M131 205V244M98 209L118 214M97 220L117 225M145 214L166 209M145 225L165 220" fill="none" stroke="#aec4ae" stroke-width="2"/><path d="M80 187Q56 188 66 213Q75 224 88 214L97 207M181 187Q201 189 193 214Q183 224 172 214L164 207" fill="${fur}" stroke="${line}" stroke-width="2.8"/><path d="M149 203L157 201 154 218 151 215 147 218Z" fill="#dd9bab"/>`}
  </g>`;
}
