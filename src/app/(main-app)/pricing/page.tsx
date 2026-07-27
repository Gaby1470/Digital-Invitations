'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Re-using the tiers data structure
const tiers = [
  {
    name: 'Plantilla',
    priceId: 'price_template_tier_placeholder',
    price: '$799 MXN',
    description: 'Elige cualquiera de nuestras plantillas y personalízala para tu evento. Ideal para bodas, cumpleaños, baby showers y más.',
    features: [
      'Publicación de la plantilla con:',
      'Plantilla de colores e imagen personalizable',
      'Hasta 150 invitados',
      'URL de la pagina + personalización',
      'Revisón de RSVP y confirmación de asistencia',
    ],
    cta: 'Comenzar',
    primary: true,
  },
  {
    name: 'Personalizado',
    priceId: 'contact',
    price: '$1499 MXN',
    description: 'Un diseño único adaptado a tu evento. Trabajaremos contigo para crear una invitación única.',
    features: [
      'Todo en el paquete de plantilla, más:',
      'Diseño personalizado de tu invitación',
      'Soporte dedicado',
      'URL personalizado',
      'Musica de fondo y animaciones personalizadas',
      'Mapa interactivo y RSVP avanzado',
      'Correción de errores y revisiones',
      'Cuenta regresiva para el evento',
    ],
    cta: 'Contactar',
    primary: false,
  },
];

export default function PricingPage() {
  const router = useRouter();
  return (
    <div className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden bg-slate-50 dark:bg-gray-950">
      {/* Background gradients from home page */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10"></div>
      <div className="absolute -bottom-8 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10"></div>

      <div className="container relative px-4 md:px-6 mx-auto">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Elige el paquete <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">perfecto</span> para tu evento
          </h1>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
            Tenemos opciones que se adaptan a tus necesidades. Ya sea que quieras una plantilla lista para usar o un diseño completamente personalizado.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 max-w-4xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-3xl p-8 shadow-2xl transition-all duration-300 hover:shadow-indigo-500/20 hover:-translate-y-1 ${
                tier.primary
                  ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white ring-2 ring-purple-400'
                  : 'bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-800'
              }`}
            >
              <h2 className={`text-2xl font-bold ${tier.primary ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                {tier.name}
              </h2>
              <p className={`mt-4 flex items-baseline gap-x-2 ${tier.primary ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'}`}>
                <span className="text-5xl font-extrabold tracking-tight">
                  {tier.price}
                </span>
              </p>
              {tier.name === 'Personalizado' && (
                <p className="mt- text-sm italic text-gray-500 dark:text-gray-400">
                  El costo puede variar segun la personalizacion
                </p>
              )}
              <p className={`mt-6 text-base leading-7 ${tier.primary ? 'text-indigo-200' : 'text-gray-600 dark:text-gray-300'}`}>
                {tier.description}
              </p>
              <ul
                role="list"
                className={`mt-10 space-y-4 text-sm leading-6 ${tier.primary ? 'text-indigo-100' : 'text-gray-600 dark:text-gray-400'}`}
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3 items-center">
                    <Check
                      className={`h-6 w-5 flex-none ${tier.primary ? 'text-white' : 'text-indigo-600'}`}
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              {tier.name === 'Plantilla' ? (
                <div className={`mt-10 text-center rounded-lg p-4 ${tier.primary ? 'bg-white/10' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    <p className="font-semibold">Para pagar con transferencia:</p>
                    <p className={`mt-2 text-sm ${tier.primary ? 'text-indigo-200' : 'text-gray-600 dark:text-gray-300'}`}>
                        Por favor, contáctanos para recibir los detalles.
                    </p>
                    <Link href="/contact" className={`mt-4 inline-block font-semibold ${tier.primary ? 'text-white hover:text-indigo-100' : 'text-indigo-600 hover:text-indigo-500'}`}>
                        Contactar ahora &rarr;
                    </Link>
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (tier.priceId === 'contact') {
                      router.push('/contact');
                    }
                  }}
                  disabled={tier.priceId !== 'contact'}
                  className={`mt-10 block w-full rounded-full px-4 py-3 text-center text-base font-semibold leading-6 shadow-md transition-transform active:scale-95 ${
                    tier.primary
                      ? 'bg-white text-indigo-600 hover:bg-indigo-50 focus-visible:outline-white'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:outline-indigo-600'
                  } disabled:opacity-50`}
                >
                  {tier.cta}
                </button>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            ¿Tienes preguntas? <Link href="/contact" className="font-semibold text-indigo-600 hover:text-indigo-500">Contáctanos</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
