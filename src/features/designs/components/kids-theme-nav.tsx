import Link from 'next/link';
import { kidsThemeList, kidsThemes, type KidsTheme } from '../model/kids-themes';

export function KidsThemeNav({ theme }: { theme: KidsTheme }) {
  return (
    <nav aria-label="Diseños infantiles">
      {kidsThemeList.map((id, index) => (
        <Link
          key={id}
          href={`/conceptos/${id}`}
          aria-label={`${kidsThemes[id].name} · ${kidsThemes[id].label}`}
          aria-current={theme === id ? 'page' : undefined}
        >
          <small>0{index + 3}</small> <span>{kidsThemes[id].name}</span>
        </Link>
      ))}
    </nav>
  );
}
