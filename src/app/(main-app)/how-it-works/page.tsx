"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  CursorArrowRaysIcon, 
  PaintBrushIcon, 
  PaperAirplaneIcon, 
  SparklesIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const steps = [
  {
    title: "Elige tu Plantilla Perfecta",
    description: "Explora nuestra colección curada de plantillas impresionantes y profesionalmente diseñadas para bodas, cumpleaños, baby showers y más. Encuentra el punto de partida perfecto para tu evento.",
    icon: CursorArrowRaysIcon,
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50 dark:bg-blue-900/20"
  },
  {
    title: "Personaliza y Hazla Tuya",
    description: "Edita fácilmente el texto, sube tus propias fotos, ajusta la paleta de colores y configura las opciones de RSVP usando nuestro editor intuitivo. No se requieren habilidades de programación o diseño.",
    icon: PaintBrushIcon,
    color: "from-indigo-500 to-purple-600",
    bg: "bg-indigo-50 dark:bg-indigo-900/20"
  },
  {
    title: "Publica y Comparte al Instante",
    description: "Una vez que estés satisfecho con tu diseño, ¡publica! Recibirás un enlace hermoso y personalizado que podrás compartir al instante vía WhatsApp, mensaje de texto o correo electrónico.",
    icon: PaperAirplaneIcon,
    color: "from-purple-500 to-pink-600",
    bg: "bg-pink-50 dark:bg-pink-900/20",
    featureTag: "taptoinvite.com/nombre-de-tu-evento"
  }
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-500 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-100/50 dark:bg-indigo-900/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-pink-100/50 dark:bg-pink-900/10 rounded-full blur-3xl pointer-events-none"></div>

      <section className="relative z-10 py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6 text-gray-900 dark:text-white">
              Tu invitación ideal <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">en Tres Pasos</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
              Crea, personaliza y envía hermosas invitaciones digitales en minutos. Gestionar tu evento nunca ha sido tan fácil.
            </p>
          </div>

          {/* Steps Timeline */}
          <div className="relative space-y-12 md:space-y-0 before:absolute before:inset-0 md:before:ml-12 md:before:-translate-x-px md:before:w-0.5 md:before:bg-gradient-to-b md:before:from-indigo-100 md:before:via-pink-200 md:before:to-indigo-100 dark:md:before:from-indigo-900/50 dark:md:before:via-pink-900/50 dark:md:before:to-indigo-900/50">
            
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex flex-col md:flex-row gap-6 md:gap-12 group"
              >
                {/* Timeline Node */}
                <div className="hidden md:flex items-center justify-center w-24 flex-shrink-0 z-10">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 group-hover:-rotate-3 bg-gradient-to-br ${step.color}`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Content Card */}
                <div className="flex-1 bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow relative overflow-hidden">
                  {/* Mobile Icon */}
                  <div className={`md:hidden w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br shadow-md ${step.color}`}>
                    <step.icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                    {step.description}
                  </p>

                  {/* Feature Tag for Step 3 */}
                  {step.featureTag && (
                    <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                        {step.featureTag}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/templates"
              className="inline-flex h-14 items-center justify-center rounded-full bg-indigo-600 px-8 text-lg font-medium text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/50 hover:-translate-y-0.5"
            >
              Empieza a Crear tu Invitación
            </Link>
          </div>

          {/* Premium / Bespoke Upsell Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-32 relative rounded-3xl overflow-hidden bg-gray-900 text-white"
          >
            <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/tap-to-invite-bespoke/1200/600')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/95 to-gray-900/80"></div>
            
            <div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="flex-1 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-pink-300 text-sm font-medium mb-6 backdrop-blur-md border border-white/10">
                  <SparklesIcon className="w-4 h-4" />
                  Servicio de Diseño Personalizado
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  ¿Necesitas un Diseño Completamente Personalizado?
                </h2>
                <p className="text-gray-300 text-lg">
                  Si tienes una visión muy específica, una marca única o deseas una experiencia interactiva creada desde cero solo para tu evento, nuestro equipo de diseño está aquí para ayudarte. Podemos crear una invitación personalizada exactamente según tus sueños.
                </p>
              </div>
              
              <div className="flex-shrink-0 w-full md:w-auto">
                <Link
                  href="/contact"
                  className="w-full md:w-auto inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white text-gray-900 px-8 text-lg font-bold shadow-xl transition-all hover:bg-gray-100 hover:scale-105"
                >
                  <EnvelopeIcon className="w-5 h-5" />
                  Contáctanos
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </section>
    </main>
  );
}
