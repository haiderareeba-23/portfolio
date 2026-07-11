import { useEffect, useRef } from 'react';
import SlotMachine from './SlotMachine';

export default function Hero() {
  const cueRef = useRef(null);

  /* scroll cue fade (0 → 40svh) */
  useEffect(() => {
    const cue = cueRef.current;
    const fadeCue = () => {
      const f = Math.max(0, 1 - scrollY / (innerHeight * 0.4));
      cue.style.opacity = f;
      cue.style.visibility = f === 0 ? 'hidden' : 'visible';
    };
    addEventListener('scroll', fadeCue, { passive: true });
    fadeCue();
    return () => removeEventListener('scroll', fadeCue);
  }, []);

  return (
    <section id="hero" className="panel" style={{ '--z': 1 }} aria-label="introduction" tabIndex={-1}>
      <div className="inner">
        <div className="hero-copy">
          <p className="eyebrow">· hello, i'm</p>
          <h1>areeba<br />haider</h1>
          <p className="hero-role">growth professional</p>
          <p className="hero-blurb">
            i turn product strategy, experiments, GTM, and AI-search optimization into
            compounding growth. pull the lever to see what i do.
          </p>
          <div className="hero-ctas">
            <a className="btn btn-solid" href="#projects">view work</a>
            <a className="btn btn-ghost" href="#contact">say hi</a>
          </div>
        </div>
        <div className="machine-col">
          <p className="eyebrow machine-eyebrow">· 00 — my resume, gamified</p>
          <SlotMachine />
        </div>
        <div className="scroll-cue" ref={cueRef} aria-hidden="true">
          <div className="wheel"></div>
          scroll
        </div>
      </div>
    </section>
  );
}
