'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
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

  const socials = [
    { name: 'GitHub', url: '#', icon: 'github' },
    { name: 'LinkedIn', url: '#', icon: 'linkedin' },
    { name: 'Twitter', url: '#', icon: 'twitter' },
    { name: 'Email', url: 'mailto:[email protected]', icon: 'email' },
  ];

  return (
    <section
      id="contact"
      ref={ref}
      className="min-h-screen flex items-center justify-center relative z-10 px-6 py-20"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="max-w-4xl w-full text-center"
      >
        <motion.h2
          variants={itemVariants}
          className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          Let&apos;s Connect
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          I&apos;m always open to new opportunities and interesting projects. Feel free
          to reach out if you&apos;d like to collaborate!
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {socials.map((social) => (
            <motion.a
              key={social.name}
              href={social.url}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="text-3xl mb-3">
                {social.icon === 'github' && '📱'}
                {social.icon === 'linkedin' && '💼'}
                {social.icon === 'twitter' && '🐦'}
                {social.icon === 'email' && '✉️'}
              </div>
              <div className="text-gray-300 font-medium">{social.name}</div>
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-purple-500"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.a
            href="mailto:[email protected]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/80"
          >
            Get In Touch
          </motion.a>
        </motion.div>

        <motion.footer
          variants={itemVariants}
          className="mt-20 text-gray-500 text-sm"
        >
          <p>&copy; 2024 Carl Balansag. All rights reserved.</p>
        </motion.footer>
      </motion.div>
    </section>
  );
}
