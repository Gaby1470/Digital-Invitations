"use client";

import { useState } from 'react';
import { 
  EnvelopeIcon, 
  ChatBubbleLeftRightIcon, 
  SparklesIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate an API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-500 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100/40 dark:bg-indigo-900/10 rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-100/40 dark:bg-pink-900/10 rounded-full blur-3xl pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

      <section className="relative z-10 py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6 text-gray-900 dark:text-white">
              Contáctanos <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">Te ayudamos</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
              Ya sea que necesites ayuda, tengas preguntas o quieras compartir tu experiencia, estamos aquí para escucharte. Completa el formulario a continuación o contáctanos directamente por correo electrónico. ¡Esperamos saber de ti!
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-12 lg:gap-8 items-start">
            
            {/* Left Column: Contact Info & Upsell */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Información de Contacto</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4 text-gray-600 dark:text-gray-400">
                    <EnvelopeIcon className="w-6 h-6 text-indigo-500 shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Correo Electrónico</p>
                      <a href="mailto:hello@taptoinvite.com" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">hello@taptoinvite.com</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 text-gray-600 dark:text-gray-400">
                    <ChatBubbleLeftRightIcon className="w-6 h-6 text-pink-500 shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Horario de Soporte</p>
                      <p>Lunes - Viernes</p>
                      <p>7:00 AM - 6:00 PM (EST)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bespoke Design Callout */}
              <div className="bg-gradient-to-br from-indigo-900 to-gray-900 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl transform group-hover:scale-150 transition-transform duration-700"></div>
                
                <SparklesIcon className="w-8 h-8 text-pink-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Servicio de Diseño Personalizado</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                 Buscas un diseño completamente personalizado para tu invitación? Nuestro equipo de diseñadores expertos puede crear una experiencia interactiva única, adaptada a tu visión y estilo. Desde conceptos hasta animaciones, haremos que tu invitación sea verdaderamente inolvidable.
                </p>
                <button 
                  onClick={() => setFormData({ ...formData, subject: 'Bespoke Design Inquiry' })}
                  className="text-sm font-semibold text-pink-400 hover:text-pink-300 transition-colors flex items-center gap-1"
                >
                  Selecciona este asunto &rarr;
                </button>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100 dark:border-gray-800 relative">
                
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center h-full min-h-[400px] animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                      <CheckCircleIcon className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">¡Mensaje Enviado!</h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md">
                      Gracias por contactarnos. Nuestro equipo revisará tu mensaje y se pondrá en contacto contigo dentro de 24-48 horas.
                    </p>
                    <button 
                      onClick={() => setIsSubmitted(false)}
                      className="mt-8 text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                    >
                      Enviar otro mensaje
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Tu Nombre</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Correo Electrónico</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-300">Asunto</label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none appearance-none"
                      >
                        <option value="General Inquiry">Consulta General</option>
                        <option value="Technical Support">Soporte Técnico</option>
                        <option value="Billing Question">Pregunta de Facturación</option>
                        <option value="Bespoke Design Inquiry">Consulta de Diseño Personalizado ✨</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">Mensaje</label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
                        placeholder="¿Cómo podemos ayudarte?"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-14 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Enviando...
                        </>
                      ) : (
                        'Enviar Mensaje'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
