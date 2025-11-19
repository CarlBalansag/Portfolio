'use client';

import React, { useState, useEffect } from 'react';
import { Cutive_Mono } from 'next/font/google';
import { motion } from 'motion/react';

const cutiveMono = Cutive_Mono({
  weight: '400',
  subsets: ['latin'],
});

const TerminalTextAnimation = () => {
  // Scramble characters for the glitch effect
  const scrambleChars = '-----/---<<-----//----[]--';
  
  // Text content to animate
  const content = {
    greeting: "Hello, Im Carl Balansag",
    intro: "I am a Full Stack Developer, from Sacramento California who likes to mix code, animation, interactivity and generative design. I work across the full JavaScript stack and have presented my work at conferences like Resonate and FITC. Formerly Google Creative Lab / Qwiki / FI. Currently Spotify.",
    labs: [
      { id: "000", title: "Primordial Soup" },
      { id: "001", title: "Tensor Field" },
      { id: "002", title: "Neuro Synth" },
      { id: "003", title: "Recursion Toy" },
      { id: "004", title: "Magic Beans" },
      { id: "005", title: "Kinetic Canvas" },
      { id: "006", title: "Math for Motion" },
      { id: "007", title: "Tentacles" },
      { id: "008", title: "Organis.ms" },
      { id: "009", title: "Make Our Mark" },
      { id: "010", title: "Unwrapaggeddon" },
      { id: "011", title: "Muscular Hydrostats" },
      { id: "012", title: "Plasmatic Isosurface" },
      { id: "013", title: "Mushroom Coral" },
      { id: "014", title: "Moon Lander" },
      { id: "015", title: "Smack My Glitch Up" },
      { id: "016", title: "Crystallization" },
      { id: "017", title: "WebGL GPU Particles" },
      { id: "018", title: "Coffee Physics" },
      { id: "019", title: "Show Me Your Bits" },
      { id: "020", title: "Fold Scroll" }
    ]
  };

  const [showGreeting, setShowGreeting] = useState(false);
  const [displayedIntro, setDisplayedIntro] = useState('');
  const [displayedLabs, setDisplayedLabs] = useState<{ id: string; text: string }[]>([]);
  const [showInfo, setShowInfo] = useState(false);
  const [showLabs, setShowLabs] = useState(false);

  // Scramble text effect - progressive fill then random letter reveal
  const scrambleText = (
    text: string,
    callback: (value: string) => void,
    delay = 30
  ): ReturnType<typeof setInterval> => {
    const length = text.length;
    const revealed = new Array(length).fill(false);
    let scrambleFillIndex = 0;
    const fillSpeed = 6; // Characters to add per frame during fill phase

    // Map each character position to its word index
    const words: { start: number; end: number; index: number }[] = [];
    let wordIndex = 0;
    let inWord = false;
    let wordStart = 0;

    for (let i = 0; i < length; i++) {
      const isSpace = /\s/.test(text[i]);

      if (!isSpace && !inWord) {
        wordStart = i;
        inWord = true;
      } else if ((isSpace || i === length - 1) && inWord) {
        words.push({
          start: wordStart,
          end: i === length - 1 && !isSpace ? i + 1 : i,
          index: wordIndex
        });
        wordIndex++;
        inWord = false;
      }
    }

    const getWordIndex = (pos: number): number => {
      for (const word of words) {
        if (pos >= word.start && pos < word.end) {
          return word.index;
        }
      }
      return words.length;
    };

    const interval = setInterval(() => {
      // Continue filling scramble chars progressively
      if (scrambleFillIndex < length) {
        scrambleFillIndex += fillSpeed;
      }

      // Start revealing random letters once we have some scramble chars filled
      // Use a dynamic threshold based on text length (20% of text or minimum 3 chars)
      const revealThreshold = Math.max(3, Math.floor(length * 0.2));
      if (scrambleFillIndex > revealThreshold) {
        const revealCount = Math.floor(Math.random() * 4.5) + 1;  // Reveals 2-5 chars per frame (faster)

        for (let i = 0; i < revealCount; i++) {
          const unrevealed: number[] = [];

          // Only consider positions within the filled area
          for (let pos = 0; pos < Math.min(scrambleFillIndex, length); pos++) {
            if (!revealed[pos] && !/\s/.test(text[pos])) {
              unrevealed.push(pos);
            }
          }

          if (unrevealed.length === 0) break;

          // Weight earlier words higher
          const weights = unrevealed.map(pos => {
            const wIdx = getWordIndex(pos);
            return Math.max(1, (words.length - wIdx) * 2 + Math.random() * 3);
          });

          const totalWeight = weights.reduce((a, b) => a + b, 0);
          let random = Math.random() * totalWeight;

          let selectedPos = unrevealed[0];
          for (let j = 0; j < weights.length; j++) {
            random -= weights[j];
            if (random <= 0) {
              selectedPos = unrevealed[j];
              break;
            }
          }

          revealed[selectedPos] = true;
        }
      }

      // Build output with animated scramble chars
      let result = '';
      for (let i = 0; i < Math.min(scrambleFillIndex, length); i++) {
        if (revealed[i]) {
          result += text[i];
        } else if (/\s/.test(text[i])) {
          result += text[i];
        } else {
          result += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        }
      }

      callback(result);

      // Check if done (all filled and all revealed)
      const allRevealed = revealed.every((r, i) => r || /\s/.test(text[i]));
      if (scrambleFillIndex >= length && allRevealed) {
        clearInterval(interval);
      }
    }, delay);

    return interval;
  };

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    // Show greeting with Motion typewriter effect
    timeouts.push(setTimeout(() => {
      setShowGreeting(true);
    }, 500));

    // Show INFO label and intro text
    timeouts.push(setTimeout(() => {
      setShowInfo(true);
      intervals.push(scrambleText(content.intro, setDisplayedIntro, 35));
    }, 2000));

    // Show LABS label
    timeouts.push(setTimeout(() => {
      setShowLabs(true);
    }, 4500));

    // Animate lab items with scramble effect
    content.labs.forEach((lab, index) => {
      timeouts.push(setTimeout(() => {
        setDisplayedLabs(prev => {
          const newLabs = [...prev];
          if (!newLabs[index]) {
            newLabs[index] = { id: lab.id, text: '' };
          }
          
          intervals.push(scrambleText(lab.title, (text) => {
            setDisplayedLabs(prevLabs => {
              const updated = [...prevLabs];
              if (updated[index]) {
                updated[index] = { id: lab.id, text: text };
              }
              return updated;
            });
          }, 40));
          
          return newLabs;
        });
      }, 5000 + (index * 100))); // Stagger each lab item
    });

    return () => {
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, []);

  return (
    <div className={cutiveMono.className} style={{
      backgroundColor: '#1a1f2e',
      color: '#ffffff',
      minHeight: '100vh',
      padding: '40px 20px',
      fontSize: '14px',
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
          fontSize: '32px',
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
            <div style={{
              color: '#606980',
              fontSize: '11px',
              letterSpacing: '2px',
              marginBottom: '15px'
            }}>
              INFO
            </div>
            <p style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#d0d4e4'
            }}>
              {displayedIntro}
            </p>
          </div>
        )}

        {/* Labs Section */}
        {showLabs && (
          <div>
            <div style={{
              color: '#606980',
              fontSize: '11px',
              letterSpacing: '2px',
              marginBottom: '20px'
            }}>
              LABS
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '12px',
              fontSize: '14px'
            }}>
            {displayedLabs.map((lab, index) => (
              <div 
                key={index} 
                style={{
                  opacity: lab.text ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                  color: '#9ca3b8'
                }}
              >
                <span style={{ color: '#606980', marginRight: '12px' }}>
                  {lab.id}
                </span>
                <span style={{ 
                  color: '#d0d4e4',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease'
                }}
                  onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.target.style.color = '#d0d4e4'}
                >
                  {lab.text}
                </span>
              </div>
            ))}
            </div>
          </div>
        )}

        {/* Optional: Cursor blink animation */}
        <style jsx>{`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }

          .cursor::after {
            content: '_';
            animation: blink 1s infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default TerminalTextAnimation;
