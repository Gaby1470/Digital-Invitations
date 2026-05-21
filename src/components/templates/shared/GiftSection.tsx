// src/components/templates/shared/GiftSection.tsx
import { Gift } from "lucide-react";

type GiftSectionProps = {
  giftRegistryUrl?: string;
  primaryColor?: string;
  textColor?: string;
};

export default function GiftSection({
  giftRegistryUrl,
  primaryColor,
  textColor,
}: GiftSectionProps) {
  if (!giftRegistryUrl) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 px-4 bg-white bg-opacity-50">
      <div className="container mx-auto max-w-2xl text-center">
        <div 
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100"
          style={{ borderColor: primaryColor ? `${primaryColor}20` : '#e5e7eb' }}
        >
          <div 
            className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: primaryColor ? `${primaryColor}15` : '#f0f0f0' }}
          >
            <Gift size={40} style={{ color: primaryColor || '#111' }} />
          </div>
          <h2 
            className="text-4xl font-bold mb-4" 
            style={{ color: textColor }}
          >
            Mesa de Regalos
          </h2>
          <p 
            className="text-lg text-gray-600 mb-8"
            style={{ color: textColor ? `${textColor}B3` : '#4b5563' }}
          >
            Tu presencia es nuestro mayor regalo. Pero si deseas obsequiarnos algo, hemos preparado una mesa de regalos con cariño.
          </p>
          <a
            href={giftRegistryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 text-lg font-semibold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
            style={{ 
              backgroundColor: primaryColor || '#111', 
              color: 'white',
              boxShadow: `0 4px 20px ${primaryColor ? `${primaryColor}40` : '#00000040'}`
            }}
          >
            Ver Opciones de Regalo
          </a>
        </div>
      </div>
    </section>
  );
}
