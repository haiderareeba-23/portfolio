import { useRef, useState } from 'react';

const EMAIL = 'haiderareeba26@gmail.com';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  const copyEmail = async e => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      location.href = 'mailto:' + EMAIL;
    }
  };

  return (
    <section id="contact" className="panel" style={{ '--z': 4 }} aria-label="contact" tabIndex={-1}>
      <div className="inner">
        <p className="eyebrow">· 03 — say hi</p>
        <h2 className="section-title">let's make something <span className="tint">grow</span></h2>
        <div className="contact-grid">
          <a
            className={'c-card' + (copied ? ' copied' : '')}
            href={'mailto:' + EMAIL}
            onClick={copyEmail}
            aria-label="copy email address"
          >
            <span className="squircle sq-mail" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="2.5" y="5" width="19" height="14" rx="3" fill="rgba(255,255,255,.92)" />
                <path d="M3.5 7l8.5 6 8.5-6" stroke="#f2a3a0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h3>email</h3>
            <span className="val">{EMAIL}</span>
            <span className="hint">{copied ? 'copied ✓' : 'click to copy'}</span>
          </a>
          <a className="c-card" href="https://www.linkedin.com/in/areeba-haider-231303abc" target="_blank" rel="noopener noreferrer">
            <span className="squircle sq-in" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="4.5" fill="rgba(255,255,255,.92)" />
                <path d="M8 10.2v6M8 7.6v.1M11.5 16.2v-3.4c0-1.3.9-2.3 2.2-2.3s2.3 1 2.3 2.3v3.4" stroke="#8f93e6" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <h3>linkedin</h3>
            <span className="val">/in/areeba-haider-231303abc</span>
            <span className="hint">open profile ↗</span>
          </a>
          <a className="c-card" href="tel:+923284099249">
            <span className="squircle sq-phone" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M7.1 3.8c.6-.6 1.6-.5 2.1.2l1.5 2.1c.4.6.4 1.4-.1 1.9l-1 1c.8 1.7 2.2 3.1 3.9 3.9l1-1c.5-.5 1.3-.5 1.9-.1l2.1 1.5c.7.5.8 1.5.2 2.1l-1.2 1.2c-.7.7-1.7 1-2.6.7-5-1.6-8.9-5.5-10.5-10.5-.3-.9 0-1.9.7-2.6l1-1.4z" fill="rgba(255,255,255,.92)" />
              </svg>
            </span>
            <h3>phone</h3>
            <span className="val">+92 ··· ·······</span>
            <span className="hint">tap to call</span>
          </a>
        </div>
        <div className="footer-line">
          <span>© 2026 areeba haider</span>
          <a href="#hero">back to top ↑</a>
        </div>
      </div>
    </section>
  );
}
