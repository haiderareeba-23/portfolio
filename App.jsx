import Ballpit from './components/Ballpit';
import DotNav from './components/DotNav';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';

export default function App() {
  return (
    <>
      <Ballpit />
      <DotNav />
      <main className="stack">
        <Hero />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </>
  );
}
