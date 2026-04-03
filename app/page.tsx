'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Cutive_Mono } from 'next/font/google';
import { motion, AnimatePresence } from 'motion/react';

const cutiveMono = Cutive_Mono({
  weight: '400',
  subsets: ['latin'],
});

// ─── Glitch Text ────────────────────────────────────────────────────────────
const GlitchText = ({
  children,
  speed = 0.5,
  className = ''
}: {
  children: string;
  speed?: number;
  className?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const glitchStyles = `
    .glitch-text { position: relative; display: inline-block; cursor: pointer; }
    .glitch-text::before, .glitch-text::after {
      content: attr(data-text);
      position: absolute; top: 0; left: 0;
      width: 100%; height: 100%;
      background: #080b10; overflow: hidden;
      clip-path: inset(0 0 0 0); opacity: 0;
    }
    .glitch-text.active::before {
      opacity: 1;
      text-shadow: var(--before-shadow, 2px 0 cyan);
      animation: glitch-anim-1 var(--before-duration, 0.3s) infinite linear alternate-reverse;
    }
    .glitch-text.active::after {
      opacity: 1;
      text-shadow: var(--after-shadow, -2px 0 red);
      animation: glitch-anim-2 var(--after-duration, 0.4s) infinite linear alternate-reverse;
    }
    @keyframes glitch-anim-1 {
      0%   { clip-path: inset(0 0 85% 0);  transform: translateX(-3px); }
      20%  { clip-path: inset(50% 0 30% 0); transform: translateX(-2px); }
      40%  { clip-path: inset(70% 0 10% 0); transform: translateX(-1px); }
      60%  { clip-path: inset(80% 0 5% 0);  transform: translateX(-3px); }
      80%  { clip-path: inset(40% 0 40% 0); transform: translateX(-2px); }
      100% { clip-path: inset(0 0 80% 0);  transform: translateX(-1px); }
    }
    @keyframes glitch-anim-2 {
      0%   { clip-path: inset(65% 0 15% 0); transform: translateX(2px); }
      20%  { clip-path: inset(30% 0 50% 0); transform: translateX(1px); }
      40%  { clip-path: inset(20% 0 60% 0); transform: translateX(3px); }
      60%  { clip-path: inset(0 0 85% 0);   transform: translateX(2px); }
      80%  { clip-path: inset(85% 0 0 0);   transform: translateX(1px); }
      100% { clip-path: inset(70% 0 10% 0); transform: translateX(3px); }
    }
  `;

  return (
    <>
      <style>{glitchStyles}</style>
      <span
        className={`glitch-text ${isHovered ? 'active' : ''} ${className}`}
        data-text={children}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          '--before-duration': `${0.3 / speed}s`,
          '--after-duration': `${0.4 / speed}s`,
          '--before-shadow': '2px 0 #22d3ee',
          '--after-shadow': '-2px 0 #2dd4bf',
        } as React.CSSProperties}
      >
        {children}
      </span>
    </>
  );
};

// ─── SVG Border Drawing ──────────────────────────────────────────────────────
const DrawingBorder = ({
  isVisible, width, height, duration = 1.5, onComplete
}: {
  isVisible: boolean; width: number; height: number;
  duration?: number; onComplete?: () => void;
}) => {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!isVisible || width === 0 || height === 0) { setProgress(0); return; }
    const startTime = Date.now();
    let frameId: number;
    const animate = () => {
      const p = Math.min((Date.now() - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(eased);
      if (p >= 1) { onCompleteRef.current?.(); } else { frameId = requestAnimationFrame(animate); }
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isVisible, width, height, duration]);

  if (!isVisible || width === 0 || height === 0) return null;
  const radius = 4;
  const perimeter = 2 * (width + height) - 8 * radius + 2 * Math.PI * radius;
  const dashOffset = perimeter * (1 - progress);

  return (
    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <rect
        x="0.5" y="0.5" width={width - 1} height={height - 1} rx={radius} ry={radius}
        fill="none" stroke="#22d3ee" strokeWidth="1"
        style={{
          strokeDasharray: perimeter, strokeDashoffset: dashOffset,
          transform: 'scaleX(-1)', transformOrigin: 'center',
          filter: 'drop-shadow(0 0 4px rgba(34,211,238,0.6))'
        }}
      />
    </svg>
  );
};

// ─── Animated Box ────────────────────────────────────────────────────────────
const AnimatedBox = ({
  children, measureContent, isVisible, delay = 0, onAnimationComplete
}: {
  children: React.ReactNode; measureContent?: React.ReactNode;
  isVisible: boolean; delay?: number; onAnimationComplete?: () => void;
}) => {
  const [phase, setPhase] = useState<'hidden' | 'measuring' | 'expanding' | 'drawing' | 'done'>('hidden');
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const measureRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onAnimationComplete);
  onCompleteRef.current = onAnimationComplete;

  useEffect(() => {
    if (!isVisible) { setPhase('hidden'); setDimensions({ width: 0, height: 0 }); return; }
    setPhase('measuring');
  }, [isVisible]);

  useEffect(() => {
    if (phase !== 'measuring') return;
    const timeout = setTimeout(() => {
      if (measureRef.current) {
        const w = measureRef.current.offsetWidth;
        const h = measureRef.current.offsetHeight;
        if (w > 0 && h > 0) {
          setDimensions({ width: w, height: h });
          requestAnimationFrame(() => requestAnimationFrame(() => setPhase('expanding')));
        }
      }
    }, 20);
    return () => clearTimeout(timeout);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'expanding') return;
    const timeout = setTimeout(() => setPhase('drawing'), delay + 400);
    return () => clearTimeout(timeout);
  }, [phase, delay]);

  const handleDrawComplete = useCallback(() => {
    setPhase('done');
    setTimeout(() => onCompleteRef.current?.(), 100);
  }, []);

  if (!isVisible) return null;

  const isExpanded = phase === 'expanding' || phase === 'drawing' || phase === 'done';
  const showBorderAnimation = phase === 'drawing';
  const showStaticBorder = phase === 'done';
  const showContent = phase === 'done';

  return (
    <div style={{ position: 'relative' }}>
      {phase === 'measuring' && (
        <div ref={measureRef} style={{ position: 'absolute', visibility: 'hidden', opacity: 0, pointerEvents: 'none', width: '100%', zIndex: -1 }} aria-hidden="true">
          <div style={{ padding: '16px' }}>{measureContent || children}</div>
        </div>
      )}
      <div style={{
        position: 'relative', borderRadius: '4px',
        height: isExpanded ? dimensions.height : 0,
        overflow: 'hidden',
        transition: isExpanded ? 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
      }}>
        {showBorderAnimation && dimensions.width > 0 && (
          <DrawingBorder isVisible width={dimensions.width} height={dimensions.height} duration={1.2} onComplete={handleDrawComplete} />
        )}
        {showStaticBorder && (
          <div style={{
            position: 'absolute', inset: 0,
            border: '1px solid #334155',
            borderRadius: '4px', pointerEvents: 'none',
            boxShadow: 'inset 0 0 0 1px rgba(34,211,238,0.08)'
          }} />
        )}
        <div style={{ padding: '16px' }}>
          {showContent ? children : null}
        </div>
      </div>
    </div>
  );
};

// ─── Section Label ───────────────────────────────────────────────────────────
const SectionLabel = ({ label }: { label: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
    <span style={{ color: '#22d3ee', fontSize: '11px', letterSpacing: '3px', fontWeight: 'bold' }}>
      &gt;_
    </span>
    <span style={{ color: '#22d3ee', fontSize: '11px', letterSpacing: '3px' }}>
      {label}
    </span>
    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, rgba(34,211,238,0.3), transparent)' }} />
  </div>
);

// ─── Scramble chars ──────────────────────────────────────────────────────────
const SCRAMBLE_CHARS = '-----/---<<-----//----[]--';

// ─── Link style ─────────────────────────────────────────────────────────────
const linkStyle: React.CSSProperties = {
  color: '#64748b',
  fontSize: '13px',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  transition: 'color 0.2s ease'
};

// ─── Main Component ──────────────────────────────────────────────────────────
const TerminalTextAnimation = () => {
  const content = {
    greeting: "Hello, I'm Carl Balansag",
    intro: "I'm a Developer based in Sacramento, California. I enjoy combining code, animation, interactivity, and generative design to build engaging digital experiences. I'm currently studying Computer Science at Sacramento State and enjoy creating projects that solve real-world problems through thoughtful design and making my life easier with automation projects.",
    skills: ['JavaScript', 'TypeScript', 'Python', 'C++', 'React', 'Next.js', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Tailwind CSS', 'AWS', 'Docker', 'Git', 'Discord.js', 'REST APIs'],
    labs: [
      { id: "03/2022", title: "History Day School Project", description: "State-recognized educational website combining clean design with effective storytelling. Built with HTML/CSS/JS", tech: ["HTML", "CSS", "JavaScript"], github: "https://github.com/CarlBalansag/HistoryDay", website: "https://history-day.vercel.app/" },
      { id: "05/2025", title: "Spotify Analytic & Playback Web App", description: "Full-stack music dashboard with personalized insights, in-browser playback, and 30% faster load times through optimized API architecture.", tech: ["React", "Node.js", "Spotify API"], github: "https://github.com/CarlBalansag/Code_The_Dream_PreReq", website: "https://spotify.carltechs.com/" },
      { id: "10/2025", title: "NASA Space Apps Hackathon", description: "Machine Learning powered exoplanet detector using TensorFlow + NASA data set. Built full-stack web app in 24-hour hackathon with real-time visualization.", tech: ["React", "Python", "NASA API"], github: "https://github.com/CarlBalansag/ExoPlanet" },
      { id: "01/2026", title: "Automated Reseller Inventory System", description: "Discord Bot with AI analytics serving 500+ active users. Automated inventory tracking + Google Sheets integration eliminates manual data entry.", tech: ["Python", "Discord.js", "PostgreSQL"], github: "https://github.com/CarlBalansag/DiscordInventory" },
    ],
    experience: [
      { title: "Shift Leader", company: "Jack In the Box", date: "Oct 2022 – Present", bullets: ["Train 15+ team members, improving onboarding efficiency", "Managed daily operations including food preparation, cash handling, customer resolution, and safety compliance."] },
      { title: "Web Developer Intern", company: "Bay Valley Tech", date: "Feb 2023 – Aug 2024", bullets: ["Developed and maintained responsive web apps using JavaScript, React, Node.js, and Express.", "Integrated APIs and backend services; assisted with cloud deployments and optimized app performance.", "Collaborated with team members using GitHub to ensure version control and project planning meetings."] },
      { title: "Real Estate Intern", company: "VDR Real Estate", date: "Mar 2024 – Jul 2024", bullets: ["Provided software training and technical support to real estate staff, improving team efficiency.", "Created internal documentation and training decks using Microsoft Word, Excel, and PowerPoint", "Monitored tech trends and recommended tools to optimize business operations."] },
      { title: "Student Assistant", company: "California Air Resource Board", date: "Jul 2025 – Dec 2025", bullets: ["Process air quality and vehicle regulation citations, ensuring accurate documentation.", "Documented processes, tracked incidents, and updated system records for accuracy.", "Assist in the preparation of internal reports by analyzing citation and complaint data."] },
      { title: "Student Assistant", company: "California Transportation", date: "Dec 2025 – Present", bullets: ["Analyzed and coded traffic collision reports into standardized database format for district-wide safety analysis", "Developed automated workflows in Excel and PowerAutomate to streamline data entry and reporting processes", "Processed and validated large datasets from multiple sources, ensuring data integrity and consistency across databases"] },
    ],
    contacts: [
      { type: "EMAIL", value: "Carl.C.Balansag@gmail.com", href: "mailto:Carl.C.Balansag@gmail.com" },
      { type: "LINKEDIN", value: "linkedin.com/in/carl-balansag", href: "https://www.linkedin.com/in/carl-balansag-a96b30227/" },
      { type: "GITHUB", value: "github.com/CarlBalansag", href: "https://github.com/CarlBalansag" },
      { type: "RESUME", value: "view resume →", href: "/resume.pdf" },
    ]
  };

  const [showGreeting, setShowGreeting] = useState(false);
  const [displayedIntro, setDisplayedIntro] = useState('');
  const [displayedLabs, setDisplayedLabs] = useState<{ id: string; text: string }[]>([]);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (projectsRef.current && !projectsRef.current.contains(e.target as Node)) setExpandedProject(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [showInfo, setShowInfo] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const [displayedSkills, setDisplayedSkills] = useState<string[]>([]);
  const [visibleSkillCount, setVisibleSkillCount] = useState(0);
  const [showLabs, setShowLabs] = useState(false);
  const [showExperience, setShowExperience] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [displayedContacts, setDisplayedContacts] = useState<string[]>([]);
  const [displayedExperience, setDisplayedExperience] = useState<{ title: string; company: string; date: string; bullets: string[] }[]>([]);
  const [completedExperienceBoxes, setCompletedExperienceBoxes] = useState(0);
  const [experienceBoxesDrawn, setExperienceBoxesDrawn] = useState<Set<number>>(new Set());
  const startedAnimationsRef = useRef<Set<number>>(new Set());
  const animationCleanupsRef = useRef<{ [key: number]: (() => void)[] }>({});
  const [animatedExpText, setAnimatedExpText] = useState<{ [key: number]: { title: string; company: string; date: string; bullets: string[] } }>({});

  const typewriterText = (text: string, callback: (v: string) => void, msPerChar = 80): (() => void) => {
    let i = 0;
    let tid: ReturnType<typeof setTimeout>;
    const type = () => { if (i <= text.length) { callback(text.slice(0, i++)); tid = setTimeout(type, msPerChar); } };
    type();
    return () => clearTimeout(tid);
  };

  const scrambleText = (text: string, callback: (v: string) => void, durationMultiplier = 1): (() => void) => {
    const length = text.length;
    const startTime = Date.now();
    let frameId: number;
    const revealOrder = Array.from({ length }, (_, i) => i).sort((a, b) => {
      const wA = (length - a) * 2 + Math.random() * length;
      const wB = (length - b) * 2 + Math.random() * length;
      return wB - wA;
    });
    const scrambleState = Array.from({ length }, () => ({
      char: SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)],
      nextUpdate: 0
    }));
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const totalDuration = (400 + length * 25) * durationMultiplier;
      const progress = Math.min(elapsed / totalDuration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const fillProgress = Math.min(elapsed / (totalDuration * 0.6), 1);
      const fillEase = 1 - (1 - fillProgress) * (1 - fillProgress);
      const visibleLength = Math.floor(fillEase * length);
      const revealCount = Math.floor(ease * length);
      let result = '';
      let allRevealed = true;
      for (let i = 0; i < length; i++) {
        if (i >= visibleLength) { allRevealed = false; break; }
        const isRevealed = revealOrder.indexOf(i) < revealCount;
        if (isRevealed || /\s/.test(text[i])) { result += text[i]; }
        else {
          allRevealed = false;
          const state = scrambleState[i];
          if (now > state.nextUpdate) { state.char = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]; state.nextUpdate = now + 80 + Math.random() * 100; }
          result += state.char;
        }
      }
      callback(result);
      if (!allRevealed || visibleLength < length) { frameId = requestAnimationFrame(animate); }
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  };

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const cleanups: (() => void)[] = [];

    timeouts.push(setTimeout(() => setShowGreeting(true), 300));

    timeouts.push(setTimeout(() => {
      setShowInfo(true);
      cleanups.push(scrambleText(content.intro, setDisplayedIntro, 0.8));
    }, 1000));

    timeouts.push(setTimeout(() => {
      setShowSkills(true);
      setDisplayedSkills(content.skills.map(() => ''));
      content.skills.forEach((skill, index) => {
        timeouts.push(setTimeout(() => {
          setVisibleSkillCount(index + 1);
          timeouts.push(setTimeout(() => {
            cleanups.push(scrambleText(skill, (text) => {
              setDisplayedSkills(prev => { const u = [...prev]; u[index] = text; return u; });
            }, 0.8));
          }, 60));
        }, index * 200));
      });
    }, 2000));

    timeouts.push(setTimeout(() => setShowLabs(true), 2800));
    timeouts.push(setTimeout(() => setShowExperience(true), 3400));

    timeouts.push(setTimeout(() => {
      setDisplayedExperience(content.experience.map(exp => ({ title: exp.title, company: exp.company, date: exp.date, bullets: exp.bullets })));
      const init: { [k: number]: { title: string; company: string; date: string; bullets: string[] } } = {};
      content.experience.forEach((exp, idx) => { init[idx] = { title: '', company: '', date: '', bullets: exp.bullets.map(() => '') }; });
      setAnimatedExpText(init);
    }, 3800));

    content.labs.forEach((lab, index) => {
      timeouts.push(setTimeout(() => {
        setDisplayedLabs(prev => {
          const nl = [...prev];
          if (!nl[index]) nl[index] = { id: lab.id, text: '' };
          cleanups.push(scrambleText(lab.title, (text) => {
            setDisplayedLabs(p => { const u = [...p]; if (u[index]) u[index] = { id: lab.id, text }; return u; });
          }, 1.2));
          return nl;
        });
      }, 3000 + index * 60));
    });

    return () => { timeouts.forEach(clearTimeout); cleanups.forEach(c => c()); };
  }, []);

  useEffect(() => {
    experienceBoxesDrawn.forEach((index) => {
      if (startedAnimationsRef.current.has(index)) return;
      startedAnimationsRef.current.add(index);
      const exp = content.experience[index];
      if (!exp) return;
      animationCleanupsRef.current[index] = [];
      setAnimatedExpText(prev => ({ ...prev, [index]: { title: '', company: '', date: '', bullets: exp.bullets.map(() => '') } }));
      const tc = typewriterText(exp.title, (text) => setAnimatedExpText(prev => ({ ...prev, [index]: { ...prev[index], title: text } })), 40);
      animationCleanupsRef.current[index].push(tc);
      const cto = setTimeout(() => {
        const cc = scrambleText(exp.company, (text) => setAnimatedExpText(prev => ({ ...prev, [index]: { ...prev[index], company: text } })), 1.5);
        animationCleanupsRef.current[index].push(cc);
      }, 300);
      animationCleanupsRef.current[index].push(() => clearTimeout(cto));
      const dto = setTimeout(() => {
        const dc = scrambleText(exp.date, (text) => setAnimatedExpText(prev => ({ ...prev, [index]: { ...prev[index], date: text } })), 1.2);
        animationCleanupsRef.current[index].push(dc);
      }, 400);
      animationCleanupsRef.current[index].push(() => clearTimeout(dto));
      exp.bullets.forEach((bullet, bIdx) => {
        const bto = setTimeout(() => {
          const bc = scrambleText(bullet, (text) => {
            setAnimatedExpText(prev => { const nb = [...(prev[index]?.bullets || [])]; nb[bIdx] = text; return { ...prev, [index]: { ...prev[index], bullets: nb } }; });
          }, 1.4);
          animationCleanupsRef.current[index].push(bc);
        }, 250 + bIdx * 80);
        animationCleanupsRef.current[index].push(() => clearTimeout(bto));
      });
    });
  }, [experienceBoxesDrawn]);

  useEffect(() => {
    const lastIdx = content.experience.length - 1;
    if (!experienceBoxesDrawn.has(lastIdx) || showContacts) return;
    const timeout = setTimeout(() => {
      setShowContacts(true);
      setDisplayedContacts(content.contacts.map(() => ''));
      content.contacts.forEach((contact, index) => {
        setTimeout(() => {
          scrambleText(contact.value, (text) => {
            setDisplayedContacts(prev => { const u = [...prev]; u[index] = text; return u; });
          }, 1.0);
        }, index * 200);
      });
    }, 500);
    return () => clearTimeout(timeout);
  }, [experienceBoxesDrawn, showContacts]);

  return (
    <div className={`${cutiveMono.className} portfolio-root`} style={{
      backgroundColor: '#080b10',
      color: '#f1f5f9',
      minHeight: '100vh',
      padding: '60px 20px 80px',
      fontSize: '15px',
      lineHeight: '1.7',
      display: 'flex',
      justifyContent: 'center',
      position: 'relative',
      overflowX: 'hidden'
    }}>

      {/* Scanline overlay */}
      <div className="scanlines" aria-hidden="true" />

      {/* Outer container */}
      <div style={{
        maxWidth: '820px',
        width: '100%',
        position: 'relative',
        zIndex: 1
      }}>

        {/* ── Greeting ─────────────────────────────────────────── */}
        <div style={{ marginBottom: '56px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '400', letterSpacing: '1px', margin: '0 0 12px 0', lineHeight: 1.2 }}>
            {showGreeting && (() => {
              const nameStart = content.greeting.indexOf('Carl Balansag');
              return content.greeting.split('').map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.07, duration: 0 }}
                  style={i >= nameStart ? { color: '#22d3ee' } : undefined}
                >
                  {letter}
                </motion.span>
              ));
            })()}
          </h1>
          {showGreeting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: content.greeting.length * 0.07 + 0.2, duration: 0.4 }}
              style={{ color: '#475569', fontSize: '13px', letterSpacing: '1.5px' }}
            >
              Software Engineer · CS @ Sacramento State
            </motion.div>
          )}
        </div>

        {/* ── INFO ─────────────────────────────────────────────── */}
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
            style={{ marginBottom: '48px' }}
          >
            <SectionLabel label="INFO" />
            <p style={{ fontSize: '14px', lineHeight: '1.9', color: '#cbd5e1', margin: 0, paddingLeft: '4px' }}>
              {displayedIntro}
            </p>
          </motion.div>
        )}

        {/* ── SKILLS ───────────────────────────────────────────── */}
        {showSkills && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
            style={{ marginBottom: '48px' }}
          >
            <SectionLabel label="SKILLS" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingLeft: '4px' }}>
              {content.skills.slice(0, visibleSkillCount).map((skill, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="skill-badge"
                  style={{
                    padding: '5px 14px',
                    border: '1px solid rgba(34,211,238,0.3)',
                    borderRadius: '3px',
                    color: '#22d3ee',
                    fontSize: '12px',
                    letterSpacing: '0.5px',
                    background: 'rgba(34,211,238,0.04)',
                    minWidth: 'fit-content',
                    cursor: 'default'
                  }}
                >
                  <span style={{ position: 'relative' }}>
                    <span style={{ visibility: 'hidden' }}>{skill}</span>
                    <span style={{ position: 'absolute', left: 0, top: 0 }}>{displayedSkills[index] ?? ''}</span>
                  </span>
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── PROJECTS ─────────────────────────────────────────── */}
        {showLabs && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
            style={{ marginBottom: '48px' }}
          >
            <SectionLabel label="PROJECTS" />
            <div ref={projectsRef} style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '4px' }}>
              {displayedLabs.map((lab, index) => {
                const project = content.labs[index];
                const isExpanded = expandedProject === index;
                return (
                  <div key={index} style={{ opacity: lab.text ? 1 : 0, transition: 'opacity 0.3s ease' }}>
                    <div
                      onClick={() => setExpandedProject(isExpanded ? null : index)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '10px 12px',
                        cursor: 'pointer',
                        borderRadius: '3px',
                        background: 'transparent',
                        borderLeft: isExpanded ? '2px solid #22d3ee' : '2px solid transparent',
                      }}
                    >
                      <span style={{ color: '#334155', fontSize: '12px', flexShrink: 0, minWidth: '52px' }}>
                        {lab.id}
                      </span>
                      <span style={{ color: isExpanded ? '#f1f5f9' : '#cbd5e1', flex: 1, transition: 'color 0.15s ease' }}>
                        {lab.text && <GlitchText speed={0.5}>{lab.text}</GlitchText>}
                      </span>
                      <span style={{ color: '#475569', fontSize: '12px', transition: 'color 0.15s ease, transform 0.2s ease', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block' }}>
                        ∨
                      </span>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{
                            margin: '0 0 8px 0',
                            padding: '16px 16px 16px 20px',
                            background: 'rgba(13,17,23,0.8)',
                            borderLeft: '2px solid rgba(34,211,238,0.2)',
                            borderBottom: '1px solid rgba(34,211,238,0.1)',
                            borderRight: '1px solid rgba(34,211,238,0.05)',
                            borderRadius: '0 3px 3px 0'
                          }}>
                            <p style={{ color: '#cbd5e1', fontSize: '13px', margin: '0 0 14px 0', lineHeight: '1.7' }}>
                              {project?.description}
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                              {project?.tech.map((tech, tIdx) => (
                                <span key={tIdx} style={{
                                  padding: '3px 10px', border: '1px solid rgba(34,211,238,0.25)',
                                  borderRadius: '3px', color: '#22d3ee', fontSize: '11px',
                                  background: 'rgba(34,211,238,0.04)'
                                }}>{tech}</span>
                              ))}
                            </div>
                            <div style={{ display: 'flex', gap: '20px' }}>
                              {project?.github && (
                                <a href={project.github} target="_blank" rel="noopener noreferrer" style={linkStyle}
                                  onMouseEnter={(e) => { e.currentTarget.style.color = '#22d3ee'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; }}>
                                  GitHub →
                                </a>
                              )}
                              {project?.website && (
                                <a href={project.website} target="_blank" rel="noopener noreferrer" style={linkStyle}
                                  onMouseEnter={(e) => { e.currentTarget.style.color = '#22d3ee'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; }}>
                                  Live →
                                </a>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── EXPERIENCE ───────────────────────────────────────── */}
        {showExperience && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
            style={{ marginBottom: '48px' }}
          >
            <SectionLabel label="EXPERIENCE" />
            <div style={{ position: 'relative', paddingLeft: '28px' }}>
              {/* Timeline line */}
              <div style={{
                position: 'absolute', left: '8px', top: '10px', bottom: '10px',
                width: '1px',
                background: 'linear-gradient(to bottom, rgba(34,211,238,0.6), rgba(34,211,238,0.1))'
              }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                {displayedExperience.map((exp, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    {/* Timeline dot */}
                    <div style={{
                      position: 'absolute', left: '-40px', top: '20px',
                      width: '9px', height: '9px', borderRadius: '50%',
                      background: '#080b10',
                      border: '1.5px solid #22d3ee',
                      boxShadow: '0 0 6px rgba(34,211,238,0.5)',
                      zIndex: 1
                    }} />

                    <AnimatedBox
                      isVisible={(!!exp.title || exp.title === '') && index <= completedExperienceBoxes}
                      delay={0}
                      onAnimationComplete={() => {
                        setCompletedExperienceBoxes(prev => Math.max(prev, index + 1));
                        setExperienceBoxesDrawn(prev => new Set([...prev, index]));
                      }}
                      measureContent={
                        <>
                          <div className="exp-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                            <div>
                              <div style={{ fontSize: '15px', color: '#f1f5f9', marginBottom: '3px' }}>{exp.title}</div>
                              <div style={{ fontSize: '12px', color: '#22d3ee' }}>{exp.company}</div>
                            </div>
                            <span className="exp-date" style={{ fontSize: '12px', color: '#64748b', flexShrink: 0, marginLeft: '16px' }}>{exp.date}</span>
                          </div>
                          <ul style={{ fontSize: '13px', lineHeight: '1.7', color: '#b0bcd0', margin: 0, paddingLeft: 0, listStyle: 'none' }}>
                            {exp.bullets.map((b, bi) => (
                              <li key={bi} style={{ paddingLeft: '14px', position: 'relative', marginBottom: '3px' }}>
                                <span style={{ position: 'absolute', left: 0, color: '#22d3ee', opacity: 0.5 }}>›</span>
                                {b}
                              </li>
                            ))}
                          </ul>
                        </>
                      }
                    >
                      <div className="exp-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div>
                          <div style={{ fontSize: '15px', color: '#f1f5f9', marginBottom: '3px' }}>
                            {animatedExpText[index]?.title ?? ''}
                          </div>
                          <div style={{ fontSize: '12px', color: '#22d3ee' }}>
                            {animatedExpText[index]?.company ?? ''}
                          </div>
                        </div>
                        <span className="exp-date" style={{ fontSize: '12px', color: '#64748b', flexShrink: 0, marginLeft: '16px' }}>
                          {animatedExpText[index]?.date ?? ''}
                        </span>
                      </div>
                      <ul style={{ fontSize: '13px', lineHeight: '1.7', color: '#b0bcd0', margin: 0, paddingLeft: 0, listStyle: 'none' }}>
                        {(animatedExpText[index]?.bullets || []).map((bullet, bIdx) => (
                          <li key={bIdx} style={{ paddingLeft: '14px', position: 'relative', marginBottom: '3px' }}>
                            <span style={{ position: 'absolute', left: 0, color: '#22d3ee', opacity: 0.5 }}>›</span>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </AnimatedBox>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── CONTACTS ─────────────────────────────────────────── */}
        {showContacts && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <SectionLabel label="CONTACT" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '4px' }}>
              {content.contacts.map((contact, index) => (
                <a
                  key={index}
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-row"
                  style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', padding: '8px 10px', borderRadius: '3px' }}
                  onMouseEnter={(e) => { (e.currentTarget.querySelector('.contact-arrow') as HTMLElement)!.style.opacity = '1'; (e.currentTarget.querySelector('.contact-arrow') as HTMLElement)!.style.transform = 'translateX(3px)'; }}
                  onMouseLeave={(e) => { (e.currentTarget.querySelector('.contact-arrow') as HTMLElement)!.style.opacity = '0'; (e.currentTarget.querySelector('.contact-arrow') as HTMLElement)!.style.transform = 'translateX(0)'; }}
                >
                  <span style={{ color: '#22d3ee', fontSize: '11px', letterSpacing: '2px', minWidth: '80px' }}>
                    {contact.type}
                  </span>
                  <span style={{ color: '#cbd5e1', fontSize: '14px', flex: 1 }}>
                    <span style={{ visibility: 'hidden', position: 'absolute' }}>{contact.value}</span>
                    {displayedContacts[index] && <GlitchText speed={0.5}>{displayedContacts[index]}</GlitchText>}
                  </span>
                  <span
                    className="contact-arrow"
                    style={{ color: '#22d3ee', fontSize: '14px', opacity: 0, transition: 'opacity 0.15s ease, transform 0.15s ease' }}
                  >
                    →
                  </span>
                </a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer */}
        {showContacts && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.6 }}
            style={{ marginTop: '60px', borderTop: '1px solid rgba(34,211,238,0.08)', paddingTop: '20px', color: '#1e293b', fontSize: '11px', letterSpacing: '1px' }}
          >
            © {new Date().getFullYear()} Carl Balansag
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default TerminalTextAnimation;
