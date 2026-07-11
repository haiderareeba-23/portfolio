import { useEffect, useState } from 'react';

const IDS = ['hero', 'skills', 'projects', 'contact'];
const LABELS = { hero: 'intro', skills: 'skills', projects: 'projects', contact: 'contact' };

export default function DotNav() {
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );
    IDS.forEach(id => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const focusTarget = id => {
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = document.getElementById(id);
    if (target) setTimeout(() => target.focus({ preventScroll: true }), reduceMotion ? 50 : 650);
  };

  return (
    <nav id="site-nav" aria-label="section navigation">
      {IDS.map(id => (
        <a
          key={id}
          href={'#' + id}
          aria-label={LABELS[id]}
          className={active === id ? 'active' : ''}
          onClick={() => focusTarget(id)}
        ></a>
      ))}
    </nav>
  );
}
