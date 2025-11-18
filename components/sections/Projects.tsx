'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const projects = [
  {
    title: 'Project One',
    description:
      'A full-stack application built with modern web technologies. Features real-time updates and a beautiful user interface.',
    tags: ['React', 'Node.js', 'MongoDB'],
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Project Two',
    description:
      'E-commerce platform with advanced features including payment integration, inventory management, and analytics dashboard.',
    tags: ['Next.js', 'TypeScript', 'Stripe'],
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Project Three',
    description:
      'Mobile-first social media application with real-time chat, notifications, and content sharing capabilities.',
    tags: ['React Native', 'Firebase', 'Redux'],
    gradient: 'from-orange-500 to-red-500',
  },
  {
    title: 'Project Four',
    description:
      'AI-powered analytics dashboard with data visualization, predictive modeling, and automated reporting features.',
    tags: ['Python', 'TensorFlow', 'D3.js'],
    gradient: 'from-green-500 to-teal-500',
  },
];

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
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
      id="projects"
      ref={ref}
      className="min-h-screen flex items-center justify-center relative z-10 px-6 py-20"
    >
      <div className="max-w-6xl w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold mb-16 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          Featured Projects
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              <h3 className="text-2xl font-bold mb-4 text-white relative z-10">
                {project.title}
              </h3>

              <p className="text-gray-400 mb-6 leading-relaxed relative z-10">
                {project.description}
              </p>

              <div className="flex gap-3 flex-wrap relative z-10">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-purple-500"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
