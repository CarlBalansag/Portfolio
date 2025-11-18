'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const projects = [
  {
    number: '01',
    title: 'Neural Interface',
    description: 'Real-time data visualization platform with WebGL',
    tech: 'React, Three.js, WebGL',
    year: '2024',
  },
  {
    number: '02',
    title: 'Cloud Architecture',
    description: 'Distributed system for high-performance computing',
    tech: 'Node.js, AWS, Docker',
    year: '2024',
  },
  {
    number: '03',
    title: 'Digital Marketplace',
    description: 'E-commerce platform with AI-powered recommendations',
    tech: 'Next.js, Python, TensorFlow',
    year: '2023',
  },
  {
    number: '04',
    title: 'Creative Studio',
    description: 'Portfolio and project management for creative professionals',
    tech: 'TypeScript, Supabase, Tailwind',
    year: '2023',
  },
];

export default function Work() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  return (
    <section
      id="work"
      ref={ref}
      className="min-h-screen flex items-center relative z-10 px-8 py-32"
    >
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-extralight text-white mb-4">
            Selected Work
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-cyan-400 to-transparent" />
        </motion.div>

        <div className="space-y-1">
          {projects.map((project, index) => (
            <ProjectItem
              key={index}
              project={project}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectItem({
  project,
  index,
  isInView,
}: {
  project: (typeof projects)[0];
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group cursor-pointer border-t border-white/10 hover:border-cyan-400/50 transition-all duration-500"
    >
      <div className="py-8 grid grid-cols-12 gap-4 items-center">
        {/* Number */}
        <div className="col-span-2 md:col-span-1">
          <span className="text-gray-500 group-hover:text-cyan-400 transition-colors text-sm">
            {project.number}
          </span>
        </div>

        {/* Title & Description */}
        <div className="col-span-10 md:col-span-6">
          <h3 className="text-2xl md:text-3xl font-light text-white group-hover:text-cyan-400 transition-colors mb-2">
            {project.title}
          </h3>
          <p className="text-gray-400 text-sm md:text-base">{project.description}</p>
        </div>

        {/* Tech */}
        <div className="col-span-6 md:col-span-3 col-start-3 md:col-start-8">
          <p className="text-gray-500 text-xs md:text-sm">{project.tech}</p>
        </div>

        {/* Year */}
        <div className="col-span-4 md:col-span-2 text-right">
          <span className="text-gray-500 text-sm">{project.year}</span>
        </div>
      </div>

      {/* Hover line */}
      <motion.div
        className="h-px bg-gradient-to-r from-cyan-400 to-transparent"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.4 }}
        style={{ transformOrigin: 'left' }}
      />
    </motion.div>
  );
}
