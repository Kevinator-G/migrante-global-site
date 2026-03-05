'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Check, X, Users, Package } from 'lucide-react';
import { Navbar } from './navbar';
import { Footer } from './footer';

interface ServicioTemplateProps {
  titulo: string;
  subtitulo: string;
  icon: React.ComponentType<{ className?: string }>;
  problema: {
    titulo: string;
    descripcion: string;
  };
  incluye: string[];
  noIncluye: string[];
  paraQuien: string[];
  planes: {
    inicio: string;
    estrategia: string;
    perfecto: string;
  };
}

export function ServicioTemplate({
  titulo,
  subtitulo,
  icon: Icon,
  problema,
  incluye,
  noIncluye,
  paraQuien,
  planes,
}: ServicioTemplateProps) {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        {/* Hero */}
        <section className="section bg-gradient-to-br from-black via-dark to-black">
          <div className="max-w-[1200px] mx-auto px-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-bone/60 hover:text-gold transition mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="bg-gradient-to-br from-gold/20 to-red/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon className="w-10 h-10 text-gold" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{titulo}</h1>
              <p className="text-xl text-bone/70">{subtitulo}</p>
            </motion.div>
          </div>
        </section>

        {/* Problema */}
        <section className="section bg-dark">
          <div className="max-w-[1200px] mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card bg-gradient-to-br from-red/10 to-dark border border-red/20"
            >
              <h2 className="text-2xl font-bold mb-4">{problema.titulo}</h2>
              <p className="text-bone/70 text-lg">{problema.descripcion}</p>
            </motion.div>
          </div>
        </section>

        {/* Qué incluye / No incluye */}
        <section className="section bg-black">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="card bg-gradient-to-br from-green/10 to-dark border border-green/20"
              >
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Check className="w-7 h-7 text-green" />
                  Qué Incluye
                </h3>
                <ul className="space-y-3">
                  {incluye.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green flex-shrink-0 mt-0.5" />
                      <span className="text-bone/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="card bg-gradient-to-br from-red/10 to-dark border border-red/20"
              >
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <X className="w-7 h-7 text-red-600" />
                  Qué NO Incluye
                </h3>
                <ul className="space-y-3">
                  {noIncluye.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-bone/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Para quién es */}
        <section className="section bg-dark">
          <div className="max-w-[1200px] mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <Users className="w-10 h-10 text-gold mx-auto mb-4" />
              <h2 className="text-3xl font-bold">Para Quién es Este Servicio</h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {paraQuien.map((perfil, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card text-center"
                >
                  <p className="text-bone/80">{perfil}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Integración con planes */}
        <section className="section bg-black">
          <div className="max-w-[1200px] mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <Package className="w-10 h-10 text-gold mx-auto mb-4" />
              <h2 className="text-3xl font-bold">Cómo se Integra con Nuestros Planes</h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="card"
              >
                <h3 className="text-xl font-bold mb-3 text-gold">Solo Alojamiento</h3>
                <p className="text-bone/70">{planes.inicio}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="card bg-gradient-to-br from-dark to-gray border border-gold/20"
              >
                <h3 className="text-xl font-bold mb-3 text-gold">Pack Completo</h3>
                <p className="text-bone/70">{planes.estrategia}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="card"
              >
                <h3 className="text-xl font-bold mb-3 text-gold">Comunidad</h3>
                <p className="text-bone/70">{planes.perfecto}</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section bg-gradient-to-br from-dark to-black">
          <div className="max-w-[800px] mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">¿Interesado en este servicio?</h2>
              <p className="text-bone/70 mb-8">
                Contáctanos para más información o elige el plan que mejor se adapte a tus
                necesidades.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/#contacto" className="btn-primary text-lg px-8 py-3">
                  Contactar Ahora
                </Link>
                <Link href="/#planes" className="btn-secondary text-lg px-8 py-3">
                  Ver Planes
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="section bg-dark">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="card bg-gray/30 text-center">
              <p className="text-bone/50 text-sm">
                <strong>Importante:</strong> Migrante Global no es una agencia de empleo,
                inmobiliaria ni asesoría legal. Ofrecemos orientación y acompañamiento. No
                garantizamos empleo, residencia ni aprobación de trámites.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
