import { useEffect, useRef, useState } from 'react';

/* EDIT ME: swap in your real projects */
const PROJECTS = [
  {
    title: 'AI-Search Visibility Program',
    tag: 'geo · aeo · llm citations',
    text: 'Built the playbook for getting product pages cited by ChatGPT, Perplexity & AI Overviews — lifting AI-referred signups.',
    href: '#',
    d: '0ms', grad: 'linear-gradient(135deg,#CE9FFC,#7367F0)', tilt: '-3deg',
  },
  {
    title: 'Onboarding Experiment Suite',
    tag: 'activation · a/b testing',
    text: 'Ran a season of onboarding experiments — copy, sequencing, aha-moment nudges — compounding into a double-digit activation lift.',
    href: '#',
    d: '110ms', grad: 'linear-gradient(135deg,#F97794,#623AA2)', tilt: '2deg',
  },
  {
    title: 'Content Growth Engine',
    tag: 'seo · editorial ops',
    text: 'Designed a keyword-to-publish pipeline that scaled organic content velocity without sacrificing quality or rankings.',
    href: '#',
    d: '220ms', grad: 'linear-gradient(135deg,#E2B0FF,#9F44D3)', tilt: '-2deg',
  },
  {
    title: 'Pricing Page CRO',
    tag: 'conversion · gtm',
    text: 'Rebuilt the pricing experience around objections & anchoring — a cleaner path from "curious" to "customer".',
    href: '#',
    d: '330ms', grad: 'linear-gradient(135deg,#F761A1,#8C1BAB)', tilt: '3deg',
  },
];

export default function Projects() {
  const ref = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { setOn(true); io.disconnect(); }
      }),
      { threshold: 0.20 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="projects"
      ref={ref}
      className={'panel' + (on ? ' on' : '')}
      style={{ '--z': 3 }}
      aria-label="selected work"
      tabIndex={-1}
    >
      <div className="inner">
        <p className="eyebrow">· 02 — selected work</p>
        <h2 className="section-title">out of the <span className="tint">folder</span></h2>
        <div className="folder" aria-hidden="true"></div>
        <div className="cards">
          {PROJECTS.map(p => (
            <a
              key={p.title}
              className="card"
              href={p.href}
              onClick={e => { if (p.href === '#') e.preventDefault(); }}
              style={{ '--d': p.d, '--grad': p.grad, '--tilt': p.tilt }}
            >
              <div className="thumb"><span className="go">↗</span></div>
              <div className="card-body">
                <h3>{p.title}</h3>
                <span className="tag">{p.tag}</span>
                <p>{p.text}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
