'use client';

import { motion } from 'framer-motion';
import { Play, Youtube } from 'lucide-react';

const videos = [
  { id: 'LzF6O1HgsJg' },
  { id: 'Cu2-t1DWEjI' },
  { id: 'A0UGVonp9D8' },
  { id: 'xjJN_LYV9BE' },
  { id: 'asJkYKXl9fY' },
  { id: 'ffrPGVJ99tA' },
];

export function SeccionYoutube() {
  return (
    <section className="section" style={{ background: '#13151b' }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ y: 15 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="section-tag">Contenido gratuito</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Aprende antes de <span className="text-red-500">dar el paso</span>
          </h2>
          <p className="text-white/55 text-lg max-w-2xl mx-auto">
            Videos reales sobre el proceso de migración a Suiza — sin filtros, sin agencia.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {videos.map((v, i) => (
            <motion.div
              key={i}
              initial={{ y: 15 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: '0px 0px -60px 0px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <a
                href={`https://www.youtube.com/watch?v=${v.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl overflow-hidden"
                style={{ border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="relative aspect-video overflow-hidden bg-black">
                  <img
                    src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
                    alt="Video Migrante Global"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center group-hover:bg-black/10 transition-colors duration-200">
                    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                      <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </div>

        {/* CTA canal completo */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center"
        >
          <a
            href="https://www.youtube.com/@migranteglobal"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'rgba(220,38,38,0.1)',
              border: '1px solid rgba(220,38,38,0.3)',
              color: '#f87171',
            }}
          >
            <Youtube className="w-4 h-4" />
            Ver todos los videos en YouTube
          </a>
        </motion.div>
      </div>
    </section>
  );
}
