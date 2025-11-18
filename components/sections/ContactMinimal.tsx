'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function ContactMinimal() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const contacts = [
    { label: 'Email', value: '[email protected]', href: 'mailto:[email protected]' },
    { label: 'GitHub', value: 'github.com/carlbalansag', href: '#' },
    { label: 'LinkedIn', value: 'linkedin.com/in/carlbalansag', href: '#' },
    { label: 'Twitter', value: '@carlbalansag', href: '#' },
  ];

  return (
    <section
      id="contact"
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
            Let&apos;s Connect
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl font-light text-gray-300 leading-relaxed mb-16 max-w-2xl"
          >
            I&apos;m always interested in hearing about new projects and opportunities.
          </motion.p>

          {/* Contact Info */}
          <div className="space-y-1 mb-20">
            {contacts.map((contact, index) => (
              <motion.a
                key={contact.label}
                href={contact.href}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="group block border-t border-white/10 hover:border-cyan-400/50 transition-all duration-300 py-6"
              >
                <div className="grid grid-cols-3 gap-4 items-center">
                  <span className="text-sm text-gray-500 uppercase tracking-wider">
                    {contact.label}
                  </span>
                  <span className="col-span-2 text-lg md:text-xl text-white group-hover:text-cyan-400 transition-colors">
                    {contact.value}
                  </span>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Carl Balansag. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              Built with Next.js, React & Canvas
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
