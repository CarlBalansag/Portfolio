'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section
      id="about"
      ref={ref}
      className="min-h-screen flex items-center justify-center relative z-10 px-6"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="max-w-4xl"
      >
        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
        >
          Carl Balansag
        </motion.h1>

        <motion.h2
          variants={itemVariants}
          className="text-3xl md:text-4xl text-gray-300 mb-8"
        >
          Full Stack Developer
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-xl text-gray-400 leading-relaxed mb-8 max-w-2xl"
        >
          Crafting elegant solutions to complex problems. Passionate about creating
          beautiful, performant web experiences that make a difference.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex gap-6 flex-wrap"
        >
          {['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS'].map(
            (skill) => (
              <motion.span
                key={skill}
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all cursor-default"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {skill}
              </motion.span>
            )
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
