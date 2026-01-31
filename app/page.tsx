'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Cutive_Mono } from 'next/font/google';
import { motion } from 'motion/react';

const cutiveMono = Cutive_Mono({
  weight: '400',
  subsets: ['latin'],
});

// Glitch text effect component - activates on hover
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
    .glitch-text {
      position: relative;
      display: inline-block;
      cursor: pointer;
    }

    .glitch-text::before,
    .glitch-text::after {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #1a1f2e;
      overflow: hidden;
      clip-path: inset(0 0 0 0);
      opacity: 0;
    }

    .glitch-text.active::before {
      opacity: 1;
      text-shadow: var(--before-shadow, 2px 0 cyan);
      animation: glitch-anim-1 var(--before-duration, 0.3s) infinite linear alternate-reverse;
      transform: translateX(-2px);
    }

    .glitch-text.active::after {
      opacity: 1;
      text-shadow: var(--after-shadow, -2px 0 red);
      animation: glitch-anim-2 var(--after-duration, 0.4s) infinite linear alternate-reverse;
      transform: translateX(2px);
    }

    @keyframes glitch-anim-1 {
      0% { clip-path: inset(0 0 85% 0); transform: translateX(-3px); }
      10% { clip-path: inset(15% 0 65% 0); transform: translateX(2px); }
      20% { clip-path: inset(50% 0 30% 0); transform: translateX(-2px); }
      30% { clip-path: inset(5% 0 75% 0); transform: translateX(3px); }
      40% { clip-path: inset(70% 0 10% 0); transform: translateX(-1px); }
      50% { clip-path: inset(25% 0 55% 0); transform: translateX(2px); }
      60% { clip-path: inset(80% 0 5% 0); transform: translateX(-3px); }
      70% { clip-path: inset(10% 0 70% 0); transform: translateX(1px); }
      80% { clip-path: inset(40% 0 40% 0); transform: translateX(-2px); }
      90% { clip-path: inset(60% 0 20% 0); transform: translateX(3px); }
      100% { clip-path: inset(0 0 80% 0); transform: translateX(-1px); }
    }

    @keyframes glitch-anim-2 {
      0% { clip-path: inset(65% 0 15% 0); transform: translateX(2px); }
      10% { clip-path: inset(5% 0 80% 0); transform: translateX(-3px); }
      20% { clip-path: inset(30% 0 50% 0); transform: translateX(1px); }
      30% { clip-path: inset(75% 0 5% 0); transform: translateX(-2px); }
      40% { clip-path: inset(20% 0 60% 0); transform: translateX(3px); }
      50% { clip-path: inset(55% 0 25% 0); transform: translateX(-1px); }
      60% { clip-path: inset(0 0 85% 0); transform: translateX(2px); }
      70% { clip-path: inset(45% 0 35% 0); transform: translateX(-3px); }
      80% { clip-path: inset(85% 0 0 0); transform: translateX(1px); }
      90% { clip-path: inset(35% 0 45% 0); transform: translateX(-2px); }
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
          '--before-shadow': '2px 0 #2dd4bf',
          '--after-shadow': '-2px 0 #2dd4bf',
        } as React.CSSProperties}
      >
        {children}
      </span>
    </>
  );
};

// SVG border drawing animation - draws the border counter-clockwise
const DrawingBorder = ({
  isVisible,
  width,
  height,
  duration = 1.5,
  onComplete
}: {
  isVisible: boolean;
  width: number;
  height: number;
  duration?: number;
  onComplete?: () => void;
}) => {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!isVisible || width === 0 || height === 0) {
      setProgress(0);
      return;
    }

    const startTime = Date.now();
    let frameId: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(elapsed / (duration * 1000), 1);
      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(eased);

      if (p >= 1) {
        onCompleteRef.current?.();
      } else {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isVisible, width, height, duration]);

  if (!isVisible || width === 0 || height === 0) return null;

  // Calculate perimeter for stroke animation
  const radius = 4;
  const perimeter = 2 * (width + height) - 8 * radius + 2 * Math.PI * radius;

  // Counter-clockwise: start from top-left, go up then left
  // We reverse by using a negative dashoffset that decreases
  const dashOffset = perimeter * (1 - progress);

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
    >
      <rect
        x="0.5"
        y="0.5"
        width={width - 1}
        height={height - 1}
        rx={radius}
        ry={radius}
        fill="none"
        stroke="#8891a8"
        strokeWidth="1"
        style={{
          strokeDasharray: perimeter,
          strokeDashoffset: dashOffset,
          // Reverse direction by rotating and flipping
          transform: 'scaleX(-1)',
          transformOrigin: 'center'
        }}
      />
    </svg>
  );
};

// Animated box component that draws its border
const AnimatedBox = ({
  children,
  measureContent,
  isVisible,
  delay = 0,
  onAnimationComplete
}: {
  children: React.ReactNode;
  measureContent?: React.ReactNode; // Content used for measuring (full text for sizing)
  isVisible: boolean;
  delay?: number;
  onAnimationComplete?: () => void;
}) => {
  const [phase, setPhase] = useState<'hidden' | 'measuring' | 'expanding' | 'drawing' | 'done'>('hidden');
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const measureRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onAnimationComplete);
  onCompleteRef.current = onAnimationComplete;

  // Phase 1: Start measuring when visible
  useEffect(() => {
    if (!isVisible) {
      setPhase('hidden');
      setDimensions({ width: 0, height: 0 });
      return;
    }

    // Start in measuring phase
    setPhase('measuring');
  }, [isVisible]);

  // Phase 2: Measure and start expanding
  useEffect(() => {
    if (phase !== 'measuring') return;

    const measure = () => {
      if (measureRef.current) {
        const newWidth = measureRef.current.offsetWidth;
        const newHeight = measureRef.current.offsetHeight;
        if (newWidth > 0 && newHeight > 0) {
          setDimensions({ width: newWidth, height: newHeight });
          // Use double RAF to ensure height:0 renders before transition starts
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setPhase('expanding');
            });
          });
        }
      }
    };

    // Small delay to let content render for measurement
    const timeout = setTimeout(measure, 20);
    return () => clearTimeout(timeout);
  }, [phase]);

  // Phase 3: Wait for height expansion, then start drawing
  useEffect(() => {
    if (phase !== 'expanding') return;

    // Wait for height transition (400ms) + delay before starting border draw
    const timeout = setTimeout(() => {
      setPhase('drawing');
    }, delay + 400);

    return () => clearTimeout(timeout);
  }, [phase, delay]);

  // Handle border draw complete
  const handleDrawComplete = useCallback(() => {
    setPhase('done');
    setTimeout(() => {
      onCompleteRef.current?.();
    }, 100);
  }, []);

  if (!isVisible) return null;

  const isExpanded = phase === 'expanding' || phase === 'drawing' || phase === 'done';
  const showBorderAnimation = phase === 'drawing';
  const showStaticBorder = phase === 'done';
  const showContent = phase === 'done';

  return (
    <div style={{ position: 'relative' }}>
      {/* Hidden measure div - only rendered during measuring phase */}
      {phase === 'measuring' && (
        <div
          ref={measureRef}
          style={{
            position: 'absolute',
            visibility: 'hidden',
            opacity: 0,
            pointerEvents: 'none',
            width: '100%',
            zIndex: -1
          }}
          aria-hidden="true"
        >
          <div style={{ padding: '16px' }}>
            {measureContent || children}
          </div>
        </div>
      )}

      {/* Visible box - starts at height 0, expands smoothly */}
      <div
        style={{
          position: 'relative',
          borderRadius: '4px',
          height: isExpanded ? dimensions.height : 0,
          overflow: 'hidden',
          transition: isExpanded ? 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
        }}
      >
        {/* SVG border drawing animation */}
        {showBorderAnimation && dimensions.width > 0 && (
          <DrawingBorder
            isVisible={true}
            width={dimensions.width}
            height={dimensions.height}
            duration={1.2}
            onComplete={handleDrawComplete}
          />
        )}

        {/* Static border after animation completes */}
        {showStaticBorder && (
          <div style={{
            position: 'absolute',
            inset: 0,
            border: '1px solid #8891a8',
            borderRadius: '4px',
            pointerEvents: 'none'
          }} />
        )}

        {/* Content - only rendered after animation completes */}
        <div style={{ padding: '16px' }}>
          {showContent ? children : null}
        </div>
      </div>
    </div>
  );
};

// Scramble characters for the glitch effect
const SCRAMBLE_CHARS = '-----/---<<-----//----[]--';

// Reusable style for section labels (INFO, SKILLS, PROJECTS, etc.)
const sectionLabelStyle: React.CSSProperties = {
  color: '#8891a8',
  fontSize: '13px',
  letterSpacing: '2px',
  marginBottom: '15px'
};

// Reusable style for external links
const linkStyle: React.CSSProperties = {
  color: '#8891a8',
  fontSize: '13px',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  transition: 'color 0.2s ease'
};

const TerminalTextAnimation = () => {
  // Text content to animate
  const content = {
    greeting: "Hello, Im Carl Balansag",
    intro: "I'm a Full Stack Developer based in Sacramento, California. I enjoy combining code, animation, interactivity, and generative design to build engaging digital experiences. I'm currently studying Computer Science at Sacramento State and enjoy creating projects that solve real-world problems through thoughtful design and making my life easier with automation projects.",
    skills: ['JavaScript', 'TypeScript', 'Python', 'C++', 'React', 'Next.js', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Tailwind CSS', 'AWS', 'Docker', 'Git', 'Discord.js', 'REST APIs'],
    labs: [
      {
        id: "03/2022",
        title: "History Day School Project",
        description: "State-recognized educational website combining clean design with effective storytelling. Built with HTML/CSS/JS ",
        tech: ["HTML", "CSS", "JavaScript"],
        github: "https://github.com/CarlBalansag/HistoryDay",
        website: "https://history-day.vercel.app/",
        image: "/images/projects/SpotifyImage.png"
      },
      {
        id: "05/2025",
        title: "Spotify Analytic & Playback Web App",
        description: "Full-stack music dashboard with personalized insights, in-browser playback, and 30% faster load times through optimized API architecture.",
        tech: ["React", "Node.js", "Spotify API"],
        github: "https://github.com/CarlBalansag/Code_The_Dream_PreReq",
        website: "https://spotify.carltechs.com/",
        image: "/images/projects/SpotifyImage.png"
      },
      {
        id: "10/2025",
        title: "NASA Space Apps Hackathon",
        description: "Machine Learning powered exoplanet detector using TensorFlow + NASA data set. Built full-stack web app in 24-hour hackathon with real-time visualization.",
        tech: ["React", "Python", "NASA API"],
        github: "https://github.com/CarlBalansag/ExoPlanet",
        image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=300&fit=crop"
      },
      {
        id: "01/2026",
        title: "Automated Reseller Inventory System",
        description: "Discord Bot with AI analytics serving 500+ active users. Automated inventory tracking + Google Sheets integration eliminates manual data entry.",
        tech: ["Python", "Discord.js", "PostgreSQL"],
        github: "https://github.com/CarlBalansag/DiscordInventory",
        image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop"
      },
    ],
    experience: [
      {
        title: "Shift Leader",
        company: "Jack In the Box",
        date: "October 2022 - Present",
        bullets: [
          "Train 15+ team members, improving onboarding efficiency",
          "Managed daily operations including food preparation, cash handling, customer resolution, and safety compliance.",
        ]
      },
      {
        title: "Web Developer Intern",
        company: "Bay Valley Tech",
        date: "February 2023 - August 2024",
        bullets: [
          "Developed and maintained responsive web apps using JavaScript, React, Node.js, and Express.",
          "Integrated APIs and backend services; assisted with cloud deployments and optimized app performance.",
          "Collaborated with team members using GitHub to ensure version control and project planning meetings."
        ]
      },
      {
        title: "Real Estate Intern",
        company: "VDR Real Estate",
        date: "March 2024 - July 2024",
        bullets: [
          "Provided software training and technical support to real estate staff, improving team efficiency.",
          "Created internal documentation and training decks using Microsoft Word, Excel, and PowerPoint",
          "Monitored tech trends and recommended tools to optimize business operations."
        ]
      },
      {
        title: "Student Assistant",
        company: "California Air Resource Board",
        date: "July 2025 - December 2025",
        bullets: [
          "Process air quality and vehicle regulation citations, ensuring accurate documentation.",
          "Documented processes, tracked incidents, and updated system records for accuracy.",
          "Assist in the preparation of internal reports by analyzing citation and complaint data."
        ]
      },
      {
        title: "Student Assistant",
        company: "California Transportation",
        date: "December 2025 - Present",
        bullets: [
          "Analyzed and coded traffic collision reports into standardized database format for district-wide safety analysis",
          "Developed automated workflows in Excel and PowerAutomate to streamline data entry and reporting processes",
          "Processed and validated large datasets from multiple sources, ensuring data integrity and consistency across databases"
        ]
      },
    ],
    contacts: [
      { type: "Email", value: "Carl.C.Balansag@gmail.com", href: "mailto:Carl.C.Balansag@gmail.com" },
      { type: "LinkedIn", value: "linkedin.com/CarlBalansag", href: "https://www.linkedin.com/in/carl-balansag-a96b30227/" },
      { type: "GitHub", value: "github.com/CarlBalansag", href: "https://github.com/CarlBalansag" },
    ]
  };

  const [showGreeting, setShowGreeting] = useState(false);
  const [displayedIntro, setDisplayedIntro] = useState('');
  const [displayedLabs, setDisplayedLabs] = useState<{ id: string; text: string }[]>([]);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (projectsRef.current && !projectsRef.current.contains(event.target as Node)) {
        setExpandedProject(null);
      }
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
  const [displayedExperience, setDisplayedExperience] = useState<{
    title: string;
    company: string;
    date: string;
    bullets: string[];
  }[]>([]);
  // Track which experience box animation has completed (to sequence them)
  const [completedExperienceBoxes, setCompletedExperienceBoxes] = useState(0);
  // Track which experience boxes have finished drawing (to start text animation)
  const [experienceBoxesDrawn, setExperienceBoxesDrawn] = useState<Set<number>>(new Set());
  // Track which animations have already been started (to prevent re-triggering)
  const startedAnimationsRef = useRef<Set<number>>(new Set());
  // Store cleanup functions per index (so we don't cancel other animations)
  const animationCleanupsRef = useRef<{ [key: number]: (() => void)[] }>({});
  // Track animated text separately from placeholder text
  const [animatedExpText, setAnimatedExpText] = useState<{
    [key: number]: { title: string; company: string; date: string; bullets: string[] };
  }>({});

  // Typewriter effect for title - character by character reveal
  // Speed is controlled by msPerChar (higher = slower). Default: 80ms per character
  // To make faster: decrease msPerChar (e.g., 40 for 2x faster)
  // To make slower: increase msPerChar (e.g., 120 for 1.5x slower)
  const typewriterText = (
    text: string,
    callback: (value: string) => void,
    msPerChar = 80  // LINE TO EDIT FOR TITLE TYPING SPEED
  ): (() => void) => {
    let currentIndex = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const type = () => {
      if (currentIndex <= text.length) {
        callback(text.slice(0, currentIndex));
        currentIndex++;
        timeoutId = setTimeout(type, msPerChar);
      }
    };

    type();

    return () => clearTimeout(timeoutId);
  };

  // Scramble text effect - progressive fill then random letter reveal
  const scrambleText = (
    text: string,
    callback: (value: string) => void,
    durationMultiplier = 1
  ): (() => void) => {
    const length = text.length;
    const startTime = Date.now();
    let frameId: number;

    // Create a reveal order that prefers earlier characters but is somewhat random
    const revealOrder = Array.from({ length }, (_, i) => i)
      .sort((a, b) => {
        // Weight: lower index = higher weight (more likely to be first)
        // Add randomness
        const weightA = (length - a) * 2 + Math.random() * length;
        const weightB = (length - b) * 2 + Math.random() * length;
        return weightB - weightA;
      });

    // State for scramble characters to manage flicker speed
    const scrambleState = Array.from({ length }, () => ({
      char: SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)],
      nextUpdate: 0
    }));

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;

      // Dynamic duration based on length and multiplier
      // Base duration + time per char
      const totalDuration = (800 + length * 50) * durationMultiplier;
      const progress = Math.min(elapsed / totalDuration, 1);

      // Easing for reveal (easeOutCubic)
      const ease = 1 - Math.pow(1 - progress, 3);

      // Fill phase: Text grows from 0 to length
      // It should be faster than the reveal
      const fillDuration = totalDuration * 0.6;
      const fillProgress = Math.min(elapsed / fillDuration, 1);
      // Use easeOutQuad for fill
      const fillEase = 1 - (1 - fillProgress) * (1 - fillProgress);
      const visibleLength = Math.floor(fillEase * length);

      // Reveal phase
      const revealCount = Math.floor(ease * length);

      let result = '';
      let allRevealed = true;

      for (let i = 0; i < length; i++) {
        // If we haven't "typed" this far yet, stop
        if (i >= visibleLength) {
          allRevealed = false;
          break;
        }

        const isRevealed = revealOrder.indexOf(i) < revealCount;

        if (isRevealed || /\s/.test(text[i])) {
          result += text[i];
        } else {
          allRevealed = false;
          // Scramble char
          const state = scrambleState[i];
          // Update scramble char only periodically to reduce flicker
          if (now > state.nextUpdate) {
            state.char = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
            state.nextUpdate = now + 80 + Math.random() * 100; // Update every 80-180ms
          }
          result += state.char;
        }
      }

      callback(result);

      if (!allRevealed || visibleLength < length) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    // Return cleanup function
    return () => cancelAnimationFrame(frameId);
  };

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const cleanups: (() => void)[] = [];

    // Show greeting with Motion typewriter effect
    timeouts.push(setTimeout(() => {
      setShowGreeting(true);
    }, 500));

    // Show INFO label and intro text
    timeouts.push(setTimeout(() => {
      setShowInfo(true);
      cleanups.push(scrambleText(content.intro, setDisplayedIntro, 0.8));
    }, 2000));

    // Show SKILLS section - one box at a time with scramble
    timeouts.push(setTimeout(() => {
      setShowSkills(true);
      // Initialize with empty strings
      setDisplayedSkills(content.skills.map(() => ''));

      // Show each skill one at a time: fade in box, then scramble text
      const skillDuration = 400; // Time per skill (fade + scramble overlap)
      content.skills.forEach((skill, index) => {
        // Show the box
        timeouts.push(setTimeout(() => {
          setVisibleSkillCount(index + 1);

          // Start scramble shortly after box appears
          timeouts.push(setTimeout(() => {
            cleanups.push(scrambleText(skill, (text) => {
              setDisplayedSkills(prev => {
                const updated = [...prev];
                updated[index] = text;
                return updated;
              });
            }, 0.8)); // Faster scramble
          }, 100)); // Small delay after box appears
        }, index * skillDuration));
      });
    }, 3500));

    // Show LABS label
    timeouts.push(setTimeout(() => {
      setShowLabs(true);
    }, 4500));

    // Show EXPERIENCE section label
    timeouts.push(setTimeout(() => {
      setShowExperience(true);
    }, 5500));

    // Initialize ALL experience items at once (for box sizing)
    // The completedExperienceBoxes state controls which box can start drawing
    // Each box starts drawing when the previous one finishes
    timeouts.push(setTimeout(() => {
      setDisplayedExperience(
        content.experience.map(exp => ({
          title: exp.title,
          company: exp.company,
          date: exp.date,
          bullets: exp.bullets
        }))
      );
      // Pre-initialize animated text as empty for all items to prevent flash
      const initialAnimatedText: { [key: number]: { title: string; company: string; date: string; bullets: string[] } } = {};
      content.experience.forEach((exp, idx) => {
        initialAnimatedText[idx] = { title: '', company: '', date: '', bullets: exp.bullets.map(() => '') };
      });
      setAnimatedExpText(initialAnimatedText);
    }, 6000)); // All items appear at 6000ms, sequencing controlled by completedExperienceBoxes

    // Animate lab items with scramble effect
    content.labs.forEach((lab, index) => {
      timeouts.push(setTimeout(() => {
        setDisplayedLabs(prev => {
          const newLabs = [...prev];
          if (!newLabs[index]) {
            newLabs[index] = { id: lab.id, text: '' };
          }

          cleanups.push(scrambleText(lab.title, (text) => {
            setDisplayedLabs(prevLabs => {
              const updated = [...prevLabs];
              if (updated[index]) {
                updated[index] = { id: lab.id, text: text };
              }
              return updated;
            });
          }, 1.2)); // Slightly slower for short text

          return newLabs;
        });
      }, 5000 + (index * 100))); // Stagger each lab item
    });

    return () => {
      timeouts.forEach(clearTimeout);
      cleanups.forEach(c => c());
    };
  }, []);

  // Trigger text animations when box drawing completes
  useEffect(() => {
    // Check each experience item - if box is drawn but animation not started yet
    experienceBoxesDrawn.forEach((index) => {
      // Skip if animation already started for this index
      if (startedAnimationsRef.current.has(index)) return;
      startedAnimationsRef.current.add(index);

      const exp = content.experience[index];
      if (!exp) return;

      // Initialize cleanup array for this index
      animationCleanupsRef.current[index] = [];

      // Initialize animated text as empty immediately
      setAnimatedExpText(prev => ({
        ...prev,
        [index]: { title: '', company: '', date: '', bullets: exp.bullets.map(() => '') }
      }));

      // Start animations immediately (no delay needed now)
      // Title: Typewriter effect (character by character)
      const titleCleanup = typewriterText(exp.title, (text) => {
        setAnimatedExpText(prev => ({
          ...prev,
          [index]: { ...prev[index], title: text }
        }));
      }, 80); // 80ms per char - LINE TO EDIT FOR TITLE SPEED
      animationCleanupsRef.current[index].push(titleCleanup);

      // Company: Scramble effect (starts after title begins)
      const companyTimeout = setTimeout(() => {
        const companyCleanup = scrambleText(exp.company, (text) => {
          setAnimatedExpText(prev => ({
            ...prev,
            [index]: { ...prev[index], company: text }
          }));
        }, 1.5); // 1.5x slower - LINE TO EDIT FOR COMPANY SCRAMBLE SPEED
        animationCleanupsRef.current[index].push(companyCleanup);
      }, 300);
      animationCleanupsRef.current[index].push(() => clearTimeout(companyTimeout));

      // Date: Scramble effect
      const dateTimeout = setTimeout(() => {
        const dateCleanup = scrambleText(exp.date, (text) => {
          setAnimatedExpText(prev => ({
            ...prev,
            [index]: { ...prev[index], date: text }
          }));
        }, 1.2); // 1.2x slower - LINE TO EDIT FOR DATE SCRAMBLE SPEED
        animationCleanupsRef.current[index].push(dateCleanup);
      }, 400);
      animationCleanupsRef.current[index].push(() => clearTimeout(dateTimeout));

      // Bullets: Scramble effect for each bullet point
      exp.bullets.forEach((bullet, bulletIdx) => {
        const bulletTimeout = setTimeout(() => {
          const bulletCleanup = scrambleText(bullet, (text) => {
            setAnimatedExpText(prev => {
              const newBullets = [...(prev[index]?.bullets || [])];
              newBullets[bulletIdx] = text;
              return {
                ...prev,
                [index]: { ...prev[index], bullets: newBullets }
              };
            });
          }, 1.4); // 1.4x slower - LINE TO EDIT FOR BULLET SCRAMBLE SPEED
          animationCleanupsRef.current[index].push(bulletCleanup);
        }, 500 + bulletIdx * 150); // Stagger each bullet by 150ms
        animationCleanupsRef.current[index].push(() => clearTimeout(bulletTimeout));
      });
    });

    // No cleanup here - animations run independently and complete on their own
  }, [experienceBoxesDrawn]);

  // Trigger contacts animation when the last experience box finishes drawing
  useEffect(() => {
    const lastExperienceIndex = content.experience.length - 1;

    // Check if last experience box has been drawn
    if (!experienceBoxesDrawn.has(lastExperienceIndex)) return;

    // Don't re-trigger if contacts already showing
    if (showContacts) return;

    // Small delay after last box finishes, then show contacts
    const timeout = setTimeout(() => {
      setShowContacts(true);
      // Initialize with empty strings
      setDisplayedContacts(content.contacts.map(() => ''));

      // Animate each contact value with scramble effect
      content.contacts.forEach((contact, index) => {
        setTimeout(() => {
          scrambleText(contact.value, (text) => {
            setDisplayedContacts(prev => {
              const updated = [...prev];
              updated[index] = text;
              return updated;
            });
          }, 1.0);
        }, index * 200); // Stagger each contact
      });
    }, 500); // Small delay after last experience box

    return () => clearTimeout(timeout);
  }, [experienceBoxesDrawn, showContacts]);

  return (
    <div className={cutiveMono.className} style={{
      backgroundColor: '#1a1f2e',
      color: '#ffffff',
      minHeight: '100vh',
      padding: '40px 20px',
      fontSize: '16px',
      lineHeight: '1.6',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        maxWidth: '800px',
        width: '100%'
      }}>
        {/* Greeting */}
        <h1 style={{
          fontSize: '38px',
          fontWeight: '300',
          marginBottom: '40px',
          letterSpacing: '2px'
        }}>
          {showGreeting && content.greeting.split('').map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1, duration: 0 }}
            >
              {letter}
            </motion.span>
          ))}
        </h1>

        {/* Info Section */}
        {showInfo && (
          <div style={{ marginBottom: '40px' }}>
            <div style={sectionLabelStyle}>
              INFO
            </div>
            <p style={{
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#d0d4e4'
            }}>
              {displayedIntro}
            </p>
          </div>
        )}

        {/* Skills Section */}
        {showSkills && (
          <div style={{ marginBottom: '40px' }}>
            <div style={sectionLabelStyle}>
              SKILLS
            </div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              {content.skills.slice(0, visibleSkillCount).map((skill, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #2dd4bf',
                    borderRadius: '4px',
                    color: '#2dd4bf',
                    fontSize: '14px',
                    minWidth: 'fit-content'
                  }}
                >
                  {/* Use invisible placeholder for sizing, show scrambled text on top */}
                  <span style={{ position: 'relative' }}>
                    <span style={{ visibility: 'hidden' }}>{skill}</span>
                    <span style={{ position: 'absolute', left: 0, top: 0 }}>
                      {displayedSkills[index] ?? ''}
                    </span>
                  </span>
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {/* Labs Section */}
        {showLabs && (
          <div style={{ marginBottom: '40px' }}>
            <div style={{ ...sectionLabelStyle, marginBottom: '20px' }}>
              PROJECTS
            </div>
            <div
              ref={projectsRef}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '12px',
                fontSize: '16px'
              }}
            >
              {displayedLabs.map((lab, index) => {
                const project = content.labs[index];
                const isExpanded = expandedProject === index;
                return (
                  <div
                    key={index}
                    style={{
                      opacity: lab.text ? 1 : 0,
                      transition: 'opacity 0.3s ease',
                      position: 'relative'
                    }}
                  >
                    {/* Project header row */}
                    <div
                      style={{
                        display: 'flex',
                        cursor: 'pointer',
                        color: '#9ca3b8'
                      }}
                      onClick={() => setExpandedProject(isExpanded ? null : index)}
                    >
                      <span style={{ color: '#8891a8', marginRight: '12px', flexShrink: 0 }}>
                        {lab.id}
                      </span>
                      <span style={{
                        color: isExpanded ? '#ffffff' : '#d0d4e4',
                        transition: 'color 0.2s ease'
                      }}>
                        {lab.text && <GlitchText speed={0.5}>{lab.text}</GlitchText>}
                      </span>
                    </div>

                    {/* Dropdown content - absolute positioned overlay */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          marginTop: '8px',
                          zIndex: 10
                        }}
                      >
                        <div style={{
                          padding: '16px',
                          border: '1px solid #8891a8',
                          borderRadius: '4px',
                          backgroundColor: '#1a1f2e',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                          width: '400px'  // EDIT THIS VALUE to change dropdown width
                        }}>
                        {/* Description */}
                        <p style={{
                          color: '#d0d4e4',
                          fontSize: '14px',
                          margin: '0 0 12px 0',
                          lineHeight: '1.6'
                        }}>
                          {project?.description}
                        </p>

                        {/* Tech Stack */}
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '8px',
                          marginBottom: project?.github ? '12px' : 0
                        }}>
                          {project?.tech.map((tech, techIdx) => (
                            <span
                              key={techIdx}
                              style={{
                                padding: '4px 10px',
                                border: '1px solid #2dd4bf',
                                borderRadius: '4px',
                                color: '#2dd4bf',
                                fontSize: '12px'
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Links */}
                        <div style={{
                          display: 'flex',
                          gap: '16px',
                          marginTop: '12px'
                        }}>
                          <a
                            href={project?.github || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={linkStyle}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#8891a8')}
                          >
                            GitHub →
                          </a>
                          {project?.website && (
                            <a
                              href={project.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={linkStyle}
                              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                              onMouseLeave={(e) => (e.currentTarget.style.color = '#8891a8')}
                            >
                              Website →
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {showExperience && (
          <div style={{ marginTop: '40px' }}>
            <div style={{ ...sectionLabelStyle, marginBottom: '20px' }}>
              EXPERIENCE
            </div>
            <div style={{ position: 'relative', paddingLeft: '24px' }}>
              {/* Timeline vertical line */}
              <div style={{
                position: 'absolute',
                left: '6px',
                top: '8px',
                bottom: '8px',
                width: '1px',
                backgroundColor: '#8891a8'
              }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {displayedExperience.map((exp, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    {/* Timeline dot */}
                    <div style={{
                      position: 'absolute',
                      left: '-24px',
                      top: '20px',
                      width: '13px',
                      height: '13px',
                      borderRadius: '50%',
                      backgroundColor: '#1a1f2e',
                      border: '2px solid #8891a8'
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
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <div>
                              <h3 style={{ fontSize: '16px', fontWeight: 'normal', color: '#ffffff', margin: '0 0 4px 0' }}>
                                {exp.title}
                              </h3>
                              <h4 style={{ fontSize: '14px', fontWeight: 'normal', color: '#8891a8', margin: 0 }}>
                                {exp.company}
                              </h4>
                            </div>
                            <span style={{ fontSize: '14px', color: '#8891a8', flexShrink: 0, marginLeft: '16px' }}>
                              {exp.date}
                            </span>
                          </div>
                          <ul style={{ fontSize: '15px', lineHeight: '1.6', color: '#9ca3b8', margin: 0, paddingLeft: '0', listStyle: 'none' }}>
                            {exp.bullets.map((bullet, bulletIdx) => (
                              <li key={bulletIdx} style={{ paddingLeft: '16px', position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 0, color: '#8891a8' }}>-</span>
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        </>
                      }
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <h3 style={{
                            fontSize: '16px',
                            fontWeight: 'normal',
                            color: '#ffffff',
                            margin: '0 0 4px 0'
                          }}>
                            {animatedExpText[index]?.title ?? ''}
                          </h3>
                          <h4 style={{
                            fontSize: '14px',
                            fontWeight: 'normal',
                            color: '#8891a8',
                            margin: 0
                          }}>
                            {animatedExpText[index]?.company ?? ''}
                          </h4>
                        </div>
                        <span style={{
                          fontSize: '14px',
                          color: '#8891a8',
                          flexShrink: 0,
                          marginLeft: '16px'
                        }}>
                          {animatedExpText[index]?.date ?? ''}
                        </span>
                      </div>
                      <ul style={{
                        fontSize: '15px',
                        lineHeight: '1.6',
                        color: '#9ca3b8',
                        margin: 0,
                        paddingLeft: '0',
                        listStyle: 'none'
                      }}>
                        {(animatedExpText[index]?.bullets || []).map((bullet, bulletIdx) => (
                          <li key={bulletIdx} style={{ paddingLeft: '16px', position: 'relative' }}>
                            <span style={{ position: 'absolute', left: 0, color: '#8891a8' }}>-</span>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </AnimatedBox>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contacts Section */}
        {showContacts && (
          <div style={{ marginTop: '40px' }}>
            <div style={{ ...sectionLabelStyle, marginBottom: '20px' }}>
              CONTACTS
            </div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px 24px',
              fontSize: '16px'
            }}>
              {content.contacts.map((contact, index) => (
                <a
                  key={index}
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    textDecoration: 'none',
                    color: '#d0d4e4',
                    transition: 'color 0.2s ease'
                  }}
                >
                  <span style={{ color: '#8891a8', marginRight: '12px', flexShrink: 0 }}>
                    {contact.type}
                  </span>
                  <span style={{ color: '#d0d4e4', position: 'relative' }}>
                    {/* Invisible placeholder for sizing */}
                    <span style={{ visibility: 'hidden' }}>{contact.value}</span>
                    {/* Scrambled text with glitch on hover */}
                    <span style={{ position: 'absolute', left: 0, top: 0 }}>
                      {displayedContacts[index] && (
                        <GlitchText speed={0.5}>{displayedContacts[index]}</GlitchText>
                      )}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TerminalTextAnimation;
