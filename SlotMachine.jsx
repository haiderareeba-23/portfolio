import { useEffect, useRef, useState } from 'react';
import { SECTIONS, LEVER_ORDER } from '../resumeSections';

/* fixed 640x910 design, scaled as one unit */
const DESIGN_W = 640, DESIGN_H = 910;
const REELS = 12;
const CHARSET = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ-'; // space renders blank
const NCH = CHARSET.length;
const CELL_H = 46, WIN_H = 92, REPEATS = 10;

const yFor = pos => (WIN_H - CELL_H) / 2 - pos * CELL_H;

function padWord(word) {
  const w = word.toUpperCase();
  const pad = REELS - w.length;
  const left = Math.floor(pad / 2), right = pad - left;
  return '-'.repeat(left) + w + '-'.repeat(right);
}

const RIVETS = [
  { left: 10, top: 12 }, { right: 10, top: 12 },
  { left: 10, bottom: 12 }, { right: 10, bottom: 12 },
];

export default function SlotMachine() {
  const fitboxRef = useRef(null);
  const designRef = useRef(null);
  const displayRef = useRef(null);
  const leverRef = useRef(null);
  const stripRefs = useRef([]);
  const posRef = useRef(Array.from({ length: REELS }, () => NCH * 3 + CHARSET.indexOf('-')));
  const spinningRef = useRef(false);
  const leverIdxRef = useRef(-1);
  const enlargeScrollYRef = useRef(0);

  const [spinning, setSpinning] = useState(false);
  const [activeChip, setActiveChip] = useState(null);

  /* mount: scale-to-fit, initial reel positions, welcome receipt, global listeners */
  useEffect(() => {
    const design = designRef.current, fitbox = fitboxRef.current, display = displayRef.current;

    const fit = () => {
      const desktop = innerWidth > 920;
      const s = Math.min(
        (desktop ? innerWidth * 0.40 : innerWidth * 0.92) / DESIGN_W,
        (desktop ? innerHeight * 0.86 : innerHeight * 0.80) / DESIGN_H,
        1);
      design.style.transform = `translate(-50%,-50%) scale(${s})`;
      fitbox.style.width = DESIGN_W * s + 'px';
      fitbox.style.height = DESIGN_H * s + 'px';
    };
    fit();
    addEventListener('resize', fit);

    stripRefs.current.forEach((strip, i) => {
      strip.style.transform = `translateY(${yFor(posRef.current[i])}px)`;
    });

    display.innerHTML =
      '<h2>Welcome</h2><p style="text-align:center">Pull the lever — or pick a section above — and the machine will deal out that part of my story.</p>';
    const welcome = setTimeout(() => display.classList.add('out'), 500);

    const onDocClick = e => {
      if (display.classList.contains('enlarged') && !display.contains(e.target)) {
        display.classList.remove('enlarged');
      }
    };
    const onKey = e => { if (e.key === 'Escape') display.classList.remove('enlarged'); };
    const onScroll = () => {
      if (display.classList.contains('enlarged') && Math.abs(scrollY - enlargeScrollYRef.current) > 20) {
        display.classList.remove('enlarged');
      }
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    addEventListener('scroll', onScroll, { passive: true });

    return () => {
      clearTimeout(welcome);
      removeEventListener('resize', fit);
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
      removeEventListener('scroll', onScroll);
    };
  }, []);

  const spinTo = sectionName => {
    if (spinningRef.current) return;
    spinningRef.current = true;
    setSpinning(true);
    setActiveChip(sectionName);

    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const SPIN_MS = reduceMotion ? 50 : 2000, STAGGER_MS = reduceMotion ? 0 : 150;
    const display = displayRef.current;
    display.classList.remove('enlarged');
    display.classList.remove('out');

    const word = padWord(sectionName);
    stripRefs.current.forEach((strip, i) => {
      const targetIdx = CHARSET.indexOf(word[i]);
      const cur = posRef.current[i] % NCH;
      const delta = (2 + Math.floor(i / 4)) * NCH + ((targetIdx - cur + NCH) % NCH || NCH);
      const newPos = posRef.current[i] + delta;
      const dur = SPIN_MS + i * STAGGER_MS;
      strip.style.transition = `transform ${dur}ms cubic-bezier(.14,.6,.18,1)`;
      strip.style.transform = `translateY(${yFor(newPos)}px)`;
      posRef.current[i] = newPos;
      setTimeout(() => {
        const base = NCH * 3 + (posRef.current[i] % NCH);
        strip.style.transition = 'none';
        strip.style.transform = `translateY(${yFor(base)}px)`;
        posRef.current[i] = base;
      }, dur + 30);
    });

    const total = SPIN_MS + (REELS - 1) * STAGGER_MS + 120;
    setTimeout(() => {
      display.innerHTML = SECTIONS[sectionName] +
        `<div class="stamp">★ ${sectionName.toUpperCase()} ★</div>`;
      display.scrollTop = 0;
      requestAnimationFrame(() => requestAnimationFrame(() => display.classList.add('out')));
      spinningRef.current = false;
      setSpinning(false);
    }, total);
  };

  const pullLever = () => {
    if (spinningRef.current) return;
    const lever = leverRef.current;
    lever.classList.add('pulled');
    setTimeout(() => lever.classList.remove('pulled'), 420);
    leverIdxRef.current = (leverIdxRef.current + 1) % LEVER_ORDER.length;
    spinTo(LEVER_ORDER[leverIdxRef.current]);
  };

  const onChip = name => {
    if (spinningRef.current) return;
    const k = LEVER_ORDER.indexOf(name);
    if (k !== -1) leverIdxRef.current = k;
    spinTo(name);
  };

  const onDisplayClick = e => {
    if (e.target.closest('a')) return;
    const display = displayRef.current;
    if (display.classList.contains('out') && !display.classList.contains('enlarged')) {
      display.classList.add('enlarged');
      enlargeScrollYRef.current = scrollY;
    }
  };

  return (
    <div id="fitbox" ref={fitboxRef}>
      <div id="design" ref={designRef}>
        <div className="machine" aria-label="resume slot machine">
          <div className="header">
            <div className="header-panel"><div className="title">AREEBA HAIDER</div></div>
          </div>
          <div className="cabinet">
            {RIVETS.map((pos, i) => <span key={i} className="rivet" style={pos} />)}
            <div className="chips">
              {Object.keys(SECTIONS).map(name => (
                <button
                  key={name}
                  type="button"
                  className={'chip' + (activeChip === name ? ' active' : '')}
                  disabled={spinning}
                  onClick={() => onChip(name)}
                >
                  {name}
                </button>
              ))}
            </div>
            <div className="frame">
              <div className="reel-window">
                <div className="rotor">
                  {Array.from({ length: REELS }, (_, i) => (
                    <div className="reel" key={i}>
                      <div className="strip" ref={el => { stripRefs.current[i] = el; }}>
                        {Array.from({ length: REPEATS }, (_, r) =>
                          [...CHARSET].map((ch, k) => (
                            <div key={`${r}-${k}`} className={'cell' + (ch === '-' ? ' dash' : '')}>
                              {ch === ' ' ? '' : ch}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="print-slot">
                <article
                  className="display"
                  ref={displayRef}
                  aria-live="polite"
                  onClick={onDisplayClick}
                />
              </div>
            </div>
            <div className="bar"></div>
          </div>
          <div className="plinth"></div>
          <div className="plinth2"></div>
          <div
            className="lever"
            ref={leverRef}
            role="button"
            aria-label="pull lever to spin"
            tabIndex={0}
            onClick={pullLever}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pullLever(); }
            }}
          >
            <div className="lever-mount"></div>
            <div className="lever-arm">
              <div className="lever-shaft"></div>
              <div className="lever-knob"></div>
            </div>
            <div className="lever-pivot"></div>
            <div className="lever-hint">PULL</div>
          </div>
        </div>
      </div>
    </div>
  );
}
