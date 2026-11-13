'use client';
import { useEffect, useState } from 'react';
import { cx } from '@/lib/format';

export function Toc({ sections }: { sections: { id: string; title: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id);
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (vis) setActive(vis.target.id);
    }, { rootMargin: '-140px 0px -60% 0px' });
    sections.forEach((s) => { const el = document.getElementById(s.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [sections]);
  const links = (
    <ul className="space-y-1 text-sm">
      {sections.map((s) => (
        <li key={s.id}><a href={`#${s.id}`} aria-current={active === s.id ? 'location' : undefined} className={cx('block border-l-2 py-1.5 pl-4', active === s.id ? 'border-primary font-medium text-ink' : 'border-line text-muted hover:text-ink')}>{s.title}</a></li>
      ))}
    </ul>
  );
  return (
    <nav aria-label="On this page">
      <details className="border border-line bg-surface p-4 lg:hidden"><summary className="cursor-pointer text-sm font-medium">On this page</summary><div className="mt-3">{links}</div></details>
      <div className="sticky top-40 hidden lg:block"><p className="eyebrow mb-3">On this page</p>{links}</div>
    </nav>
  );
}
