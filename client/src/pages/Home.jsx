import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Layers, 
  FileSpreadsheet, 
  Download, 
  Award, 
  ShieldCheck, 
  ExternalLink, 
  ArrowRight,
  Sun,
  Moon
} from 'lucide-react';
import { TEMPLATES } from '../templates/CertificateTemplates';
import Silk from '../components/Silk';

const PREVIEW_DATA = {
  recipientName: 'Alex Mercer',
  certificateTitle: 'Certificate of Excellence',
  courseName: 'Advanced Full-Stack Engineering',
  organizationName: 'Tech Academy Global',
  description: 'For successfully demonstrating core competencies in high-performance cloud architecture, design patterns, and deployment strategies.',
  issueDate: '2026-06-27',
  certificateNumber: 'CERT-2026-884920',
  instructorName: 'Dr. Sarah Connor',
  signatureImage: '',
  logoImage: '',
  verificationUrl: 'http://localhost:5173/verify/CERT-2026-884920'
};

// ─── Custom loading screen ───
function LoadingScreen({ onComplete }) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const words = ['Design', 'Deploy', 'Verify', 'Certify'];

  useEffect(() => {
    let frameId;
    let startTime = null;
    const duration = 2700;
    const animate = (ts) => {
      if (!startTime) startTime = ts;
      const progress = ts - startTime;
      const c = Math.min(Math.floor((progress / duration) * 100), 100);
      setCount(c);
      if (progress < duration) {
        frameId = requestAnimationFrame(animate);
      } else {
        setTimeout(onComplete, 400);
      }
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = setInterval(() => setWordIndex(p => (p + 1) % words.length), 900);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ backgroundColor: 'hsl(var(--bg))', color: 'hsl(var(--text))' }} className="fixed inset-0 z-[9999] flex flex-col justify-between p-8 md:p-16 select-none transition-colors duration-300">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}
        className="text-xs uppercase tracking-[0.3em] font-semibold text-muted">
        CertifyAI — Workspace
      </motion.div>

      <div className="flex justify-center items-center h-24 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span key={wordIndex}
            initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 0.8 }} exit={{ y: -24, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-5xl md:text-7xl font-display italic text-text-primary">
            {words[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="space-y-6">
        <div className="flex justify-end">
          <span className="text-8xl md:text-9xl font-display text-text-primary tabular-nums tracking-tighter leading-none">
            {String(count).padStart(3, '0')}
          </span>
        </div>
        <div className="h-[3px] w-full rounded-full overflow-hidden bg-text-primary/10">
          <div className="h-full origin-left transition-transform duration-75"
            style={{ transform: `scaleX(${count / 100})`, background: 'linear-gradient(90deg,#89AACC,#4E85BF)', width: '100%', boxShadow: '0 0 12px rgba(137,170,204,0.6)' }} />
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [roleIndex, setRoleIndex] = useState(0);
  const marqueeRef = useRef(null);

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return true; // default dark
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const roles = ['AI assistant', 'bulk generator', 'credential vault', 'QR validator'];

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setRoleIndex(p => (p + 1) % roles.length), 2000);
    return () => clearInterval(id);
  }, []);

  // GSAP marquee animation
  useEffect(() => {
    if (isLoading || !marqueeRef.current) return;
    let gsapInstance;
    import('gsap').then(({ gsap }) => {
      gsapInstance = gsap.to(marqueeRef.current, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 });
    }).catch(() => {});
    return () => { if (gsapInstance) gsapInstance.kill(); };
  }, [isLoading]);

  const templates = [
    { id: 'classic-gold', name: 'Classic Gold', desc: 'Traditional borders, warm sepia palette.' },
    { id: 'modern-blue', name: 'Modern Blue', desc: 'Clean layout with blueprint nodes.' },
    { id: 'elegant-black', name: 'Elegant Black', desc: 'Ivory backdrop with gold details.' },
    { id: 'luxury-premium', name: 'Luxury Premium', desc: 'Emerald patterns, golden marble veins.' },
  ];

  const features = [
    { title: 'Gemini & Groq AI Writers', desc: 'Writes elegant, hyper-personalized academic recognition paragraphs based on custom metadata.', icon: <Sparkles className="w-5 h-5 text-indigo-400" />, tag: 'AI Engine' },
    { title: 'Bulk CSV Generation', desc: 'Parse bulk Excel sheets in real-time, matching columns to certificate variables, then compile to a ZIP.', icon: <FileSpreadsheet className="w-5 h-5 text-emerald-400" />, tag: 'Automated' },
    { title: 'QR Registry Verification', desc: 'Prints unique QR codes pointing to our secure verification endpoint so employers can check legitimacy.', icon: <ShieldCheck className="w-5 h-5 text-blue-400" />, tag: 'Cryptographic' },
    { title: 'No-Dependency PDF Output', desc: 'Custom high-DPI canvas capture lets vector SVG backgrounds render beautifully with no CORS issues.', icon: <Download className="w-5 h-5 text-pink-400" />, tag: 'Lossless PDF' },
  ];

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div key="loader" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <LoadingScreen onComplete={() => setIsLoading(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
          className="min-h-screen font-sans overflow-x-hidden bg-bg text-text-primary transition-colors duration-300">

          {/* ── Navbar ── */}
          <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
            <div className={`inline-flex items-center gap-3 rounded-full border px-4 py-2 backdrop-blur-xl transition-all duration-300 ${scrollY > 80 ? 'border-stroke shadow-lg shadow-black/20' : 'border-stroke/40'}`}
              style={{ backgroundColor: 'rgba(var(--nav-bg), 0.85)' }}>
              
              <Link to="/" className="flex items-center gap-2 group hover:scale-[1.01] transition-transform">
                <div className="relative w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-blue-600" />
                  <div className="absolute inset-[2px] rounded-full flex items-center justify-center text-[10px] font-display italic font-bold text-text-primary"
                    style={{ backgroundColor: 'hsl(var(--bg))' }}>CA</div>
                </div>
                <span className="text-sm font-bold tracking-tight font-display italic text-text-primary">
                  Certify<span className="text-blue-600 dark:text-blue-400 font-extrabold">AI</span>
                </span>
              </Link>
              
              <div className="hidden sm:block w-px h-5 bg-stroke" />
              
              <div className="hidden md:flex items-center gap-0.5">
                <a href="#hero" className="text-xs rounded-full px-3 py-1.5 font-medium bg-text-primary/10 text-text-primary">Home</a>
                <a href="#templates" className="text-xs rounded-full px-3 py-1.5 font-medium text-muted hover:text-text-primary transition-colors">Templates</a>
                <a href="#features" className="text-xs rounded-full px-3 py-1.5 font-medium text-muted hover:text-text-primary transition-colors">Workflows</a>
                <Link to="/create-certificate" className="text-xs rounded-full px-3 py-1.5 font-medium text-muted hover:text-text-primary transition-colors">Dashboard</Link>
              </div>
              
              <div className="w-px h-5 bg-stroke" />
              
              {/* Theme Toggle */}
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-text-primary/10 rounded-full transition-colors text-muted hover:text-text-primary"
                title="Toggle Theme"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <Link to="/create-certificate"
                className="text-xs font-semibold rounded-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md shadow-blue-500/10">
                Generate ↗
              </Link>
            </div>
          </nav>

          {/* ── Hero ── */}
          <section id="hero" className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
            {/* Rich hero background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Central radial glow */}
              <div className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(78,133,191,0.15) 0%, transparent 70%)' }} />
              
              {/* React Bits Silk Component Backdrop */}
              <div className="absolute inset-0 z-0 opacity-[0.18] dark:opacity-[0.12] pointer-events-none">
                <Silk
                  speed={3}
                  scale={0.65}
                  color={darkMode ? '#4f46e5' : '#818cf8'}
                  noiseIntensity={0.8}
                  rotation={0.4}
                />
              </div>

              {/* Rotating Container for Orbs */}
              <div className="absolute inset-0 animate-orb-rotate origin-center opacity-70">
                {/* Top-left blue orb */}
                <div className="absolute rounded-full"
                  style={{ width: '600px', height: '600px', top: '-150px', left: '-150px', background: 'radial-gradient(circle, rgba(78,133,191,0.35) 0%, transparent 70%)', filter: 'blur(60px)' }} />
                {/* Bottom-right teal orb */}
                <div className="absolute rounded-full"
                  style={{ width: '500px', height: '500px', bottom: '-150px', right: '-150px', background: 'radial-gradient(circle, rgba(137,170,204,0.28) 0%, transparent 70%)', filter: 'blur(80px)' }} />
              </div>

              {/* Center indigo glow */}
              <div className="absolute rounded-full animate-pulse"
                style={{ width: '400px', height: '400px', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(40px)', animationDuration: '6s' }} />
              
              {/* Dot grid */}
              <div className="absolute inset-0 opacity-[0.4] dark:opacity-100"
                style={{ backgroundImage: 'radial-gradient(circle, rgba(var(--text),0.06) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
              {/* Bottom fade */}
              <div className="absolute bottom-0 left-0 right-0 h-48"
                style={{ background: 'linear-gradient(to top, hsl(var(--bg)) 0%, transparent 100%)' }} />
            </div>

            <motion.div className="z-10 space-y-6 max-w-4xl" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}>
              <p className="text-xs text-muted uppercase tracking-[0.3em] font-semibold">Gemini & Groq AI Engines Inside</p>

              <h1 className="text-7xl md:text-9xl font-display italic font-light leading-[0.85] tracking-tight text-text-primary">
                CertifyAI
              </h1>

              <div className="text-xl md:text-2xl font-light text-muted h-10 flex items-center justify-center gap-2">
                A secure{' '}
                <AnimatePresence mode="wait">
                  <motion.span key={roleIndex}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="font-display italic text-text-primary font-medium">{roles[roleIndex]}</motion.span>
                </AnimatePresence>
                {' '}built for scale.
              </div>

              <p className="text-sm md:text-base text-muted max-w-md mx-auto font-light leading-relaxed">
                Design stunning professional credentials instantly. Power text with Groq Llama 3.3, upload sheets for bulk generation, and verify records with a QR scan.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/create-certificate"
                  className="px-8 py-3.5 font-semibold rounded-full text-sm transition-all hover:opacity-90 hover:scale-[1.02] text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/10">
                  Launch Dashboard
                </Link>
                <a href="#templates"
                  className="px-8 py-3.5 font-semibold rounded-full text-sm border border-stroke bg-surface text-text-primary transition-all hover:bg-text-primary/5 flex items-center justify-center gap-2">
                  Explore Templates <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
              <span className="text-[10px] text-muted tracking-[0.2em] uppercase font-semibold">Scroll</span>
              <div className="w-px h-10 overflow-hidden rounded-full bg-stroke">
                <div className="w-full h-1/2 animate-scroll-down bg-blue-600" />
              </div>
            </div>
          </section>

          {/* ── Templates Section ── */}
          <section id="templates" className="py-16 border-t border-stroke">
            <div className="max-w-[1200px] mx-auto px-6 md:px-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-px bg-stroke" />
                    <span className="text-xs text-muted uppercase tracking-[0.3em] font-semibold">Selected Designs</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-display font-light text-text-primary">
                    Featured <span className="italic">templates</span>
                  </h2>
                  <p className="text-muted text-xs mt-2 max-w-md font-light leading-relaxed">
                    Print-ready vector backdrops, dynamically loaded into our layout renderer.
                  </p>
                </div>
                <Link to="/create-certificate"
                  className="hidden md:inline-flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-full border border-stroke text-text-primary bg-surface hover:bg-text-primary/5 transition-all">
                  Open Generator <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {templates.map((t, i) => (
                  <motion.div key={t.id}
                    className="rounded-2xl overflow-hidden border border-stroke bg-surface relative group shadow-sm flex flex-col transition-all hover:shadow-md"
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5, delay: i * 0.08 }}>
                    <div className="w-full aspect-[1.45] relative overflow-hidden flex items-center justify-center bg-bg/40 dark:bg-bg/20 border-b border-stroke">
                      {/* Live miniature scaled certificate rendering */}
                      <div className="absolute pointer-events-none select-none origin-center transform-gpu"
                        style={{
                          width: '1000px',
                          height: '707px',
                          transform: 'scale(0.24)',
                        }}
                      >
                        <div className="w-full h-full bg-white rounded overflow-hidden shadow-xl">
                          {React.createElement(TEMPLATES[t.id] || TEMPLATES['classic-gold'], { data: PREVIEW_DATA })}
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex-grow flex flex-col justify-between bg-surface">
                      <div>
                        <h4 className="text-sm font-bold text-text-primary mb-1">{t.name}</h4>
                        <p className="text-[11px] text-muted font-light leading-relaxed mb-3">{t.desc}</p>
                      </div>
                      <Link to="/create-certificate"
                        className="inline-flex items-center justify-center text-center py-2 text-[10px] font-semibold rounded-xl w-full text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm shadow-blue-500/10">
                        Select Template
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Feature Pills ── */}
          <section id="features" className="py-24 border-t border-stroke">
            <div className="max-w-[1200px] mx-auto px-6 md:px-12">
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-px bg-stroke" />
                  <span className="text-xs text-muted uppercase tracking-[0.3em] font-semibold">Modular Pipelines</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-light text-text-primary">
                  Production <span className="italic">workflows</span>
                </h2>
              </div>
              <div className="space-y-4">
                {features.map((f, i) => (
                  <motion.div key={i}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 border border-stroke rounded-[28px] md:rounded-full bg-surface transition-all duration-300 group hover:shadow-sm"
                    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full border border-stroke bg-bg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        {f.icon}
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-text-primary">{f.title}</h4>
                        <p className="text-xs text-muted font-light mt-0.5 max-w-xl">{f.desc}</p>
                      </div>
                    </div>
                    <span className="ml-16 md:ml-0 text-[10px] font-mono px-3 py-1 rounded-full border border-stroke flex-shrink-0 bg-bg text-muted">{f.tag}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Stats ── */}
          <section className="py-20 border-y border-stroke bg-surface">
            <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              {[['99.9%', 'Render Accuracy'], ['< 1.5s', 'AI Copywriting Speed'], ['7+', 'Premium Light Templates']].map(([val, label]) => (
                <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                  <span className="text-5xl md:text-6xl font-display italic text-text-primary block mb-2">{val}</span>
                  <span className="text-xs text-muted uppercase tracking-[0.2em] font-semibold">{label}</span>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── Footer ── */}
          <footer className="relative pt-24 pb-12 overflow-hidden border-t border-stroke bg-bg">
            <div className="absolute inset-0 pointer-events-none opacity-[0.2] dark:opacity-100"
              style={{ backgroundImage: 'radial-gradient(circle,rgba(var(--text),0.02) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />

            <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12">
              {/* Marquee */}
              <div className="overflow-hidden py-6 border-y border-stroke/85 mb-20 select-none">
                <div ref={marqueeRef} className="whitespace-nowrap inline-flex gap-12"
                  style={{ fontSize: 'clamp(3rem,8vw,7rem)', fontFamily: '"Instrument Serif",serif', fontStyle: 'italic', color: 'rgba(128,128,128,0.1)', lineHeight: 1 }}>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span key={i}>BUILDING THE FUTURE • CERTIFYAI • </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="text-center mb-20 space-y-8">
                <h3 className="text-4xl md:text-5xl font-display font-light text-text-primary leading-tight max-w-xl mx-auto">
                  Ready to deploy credential workflows?
                </h3>
                <Link to="/create-certificate"
                  className="inline-block px-10 py-4 font-semibold rounded-full text-white transition-all hover:opacity-90 hover:scale-105"
                  style={{ background: 'linear-gradient(90deg,#89AACC,#4E85BF)' }}>
                  Get Started Now ↗
                </Link>
              </div>

              {/* Bottom bar */}
              <div className="pt-8 border-t border-stroke flex flex-col sm:flex-row justify-between items-center gap-6 text-xs text-muted">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Available for custom integrations</span>
                </div>
                <div className="flex gap-6 font-medium">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors flex items-center gap-1">
                    Github <ExternalLink className="w-3 h-3" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors flex items-center gap-1">
                    LinkedIn <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p>© 2026 CertifyAI — Built for speed.</p>
              </div>
            </div>
          </footer>
        </motion.div>
      )}
    </>
  );
}
