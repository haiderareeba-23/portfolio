import { Fragment, useEffect, useRef, useState } from 'react';

const BLOBS = [
  { g: 'g2', x: '2%',  y: '56%', s: '128px', d: '0ms',   label: ['product', 'strategy'] },
  { g: 'g1', x: '11%', y: '38%', s: '148px', d: '90ms',  label: ['growth', 'experiments'] },
  { g: 'g3', x: '21%', y: '22%', s: '134px', d: '180ms', label: ['a/b', 'testing'] },
  { g: 'g4', x: '31%', y: '10%', s: '150px', d: '270ms', label: ['SEO'] },
  { g: 'g2', x: '42%', y: '3%',  s: '140px', d: '360ms', label: ['AI-search', '(GEO)'] },
  { g: 'g1', x: '53%', y: '5%',  s: '158px', d: '450ms', label: ['analytics'] },
  { g: 'g3', x: '64%', y: '12%', s: '136px', d: '540ms', label: ['GTM', 'strategy'] },
  { g: 'g2', x: '73%', y: '24%', s: '150px', d: '630ms', label: ['content', 'strategy'] },
  { g: 'g4', x: '81%', y: '38%', s: '132px', d: '720ms', label: ['funnel', 'design'] },
  { g: 'g1', x: '85%', y: '52%', s: '144px', d: '810ms', label: ['lifecycle', '& email'] },
  { g: 'g3', x: '90%', y: '66%', s: '120px', d: '900ms', label: ['user', 'research'] },
];

export default function Skills() {
  const ref = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { setOn(true); io.disconnect(); }
      }),
      { threshold: 0.15 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="skills"
      ref={ref}
      className={'panel' + (on ? ' on' : '')}
      style={{ '--z': 2 }}
      aria-label="skills"
      tabIndex={-1}
    >
      <div className="inner">
        <p className="eyebrow">· 01 — toolkit</p>
        <h2 className="section-title">things i'm <span className="tint">good at</span></h2>
        <div className="arc arc-flex" role="list">
          {BLOBS.map((b, i) => (
            <div
              key={i}
              className={`blob ${b.g}`}
              role="listitem"
              style={{ '--x': b.x, '--y': b.y, '--s': b.s, '--d': b.d }}
            >
              {b.label.map((line, j) => (
                <Fragment key={j}>{j > 0 && <br />}{line}</Fragment>
              ))}
            </div>
          ))}
        </div>
        <p className="skills-cap">{'// eleven ways to move a metric'}</p>
      </div>
    </section>
  );
}
