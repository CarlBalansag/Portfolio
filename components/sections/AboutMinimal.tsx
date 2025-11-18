'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function AboutMinimal() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const skills = [
    'React / Next.js',
    'TypeScript',
    'Node.js',
    'Python',
    'WebGL / Three.js',
    'Cloud Architecture',
    'UI/UX Design',
    'Creative Coding',
  ];

  return (
    <section
      id="about"
      ref={ref}
      className="min-h-screen flex items-center relative z-10 px-8 py-32"
    >
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-7xl font-extralight text-white mb-12">
            About
          </h2>

          <div className="grid md:grid-cols-2 gap-16">
            {/* Left Column - Bio */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-xl md:text-2xl font-light text-gray-300 leading-relaxed mb-6">
                I build digital products that blend technology with creativity.
              </p>
              <p className="text-gray-400 leading-relaxed mb-6">
                With a passion for clean code and beautiful interfaces, I create
                experiences that are both functional and delightful. My work spans
                full-stack development, creative coding, and interactive design.
              </p>
              <p className="text-gray-400 leading-relaxed">
                When I&apos;m not coding, you&apos;ll find me exploring new technologies,
                contributing to open source, or experimenting with generative art.
              </p>

              <motion.a
                href="#contact"
                className="inline-block mt-8 text-white hover:text-cyan-400 transition-colors group"
                whileHover={{ x: 5 }}
              >
                <span className="text-sm tracking-widest uppercase">Get in touch</span>
                <div className="h-px bg-white group-hover:bg-cyan-400 transition-colors mt-1" />
              </motion.a>
            </motion.div>

            {/* Right Column - Skills */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h3 className="text-sm tracking-widest uppercase text-gray-500 mb-6">
                Expertise
              </h3>
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.05 }}
                    className="group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-px bg-cyan-400/50 group-hover:w-12 group-hover:bg-cyan-400 transition-all duration-300" />
                      <span className="text-gray-300 group-hover:text-white transition-colors">
                        {skill}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
