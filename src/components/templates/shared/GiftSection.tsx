// src/components/templates/shared/GiftSection.tsx
import { Gift } from "lucide-react";

type GiftSectionProps = {
  giftUrl?: string;
  giftTitle?: string;
  giftMessage?: string;
  giftButtonText?: string;
  primaryColor?: string;
  textColor?: string;
};

function normalizeExternalUrl(value?: string): string {
  if (!value) return '#';
  const trimmed = value.trim();
  if (!trimmed) return '#';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export default function GiftSection({
  giftUrl,
  giftTitle,
  giftMessage,
  giftButtonText,
  primaryColor,
  textColor,
}: GiftSectionProps) {
  if (!giftUrl) {
    return null;
  }

  const finalGiftUrl = normalizeExternalUrl(giftUrl);

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-2xl text-center space-y-6">
        <div
          className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
          style={{ backgroundColor: primaryColor ? `${primaryColor}15` : '#f0f0f0' }}
        >
          <Gift size={40} style={{ color: primaryColor || '#111' }} />
        </div>
        <h2
          className="text-4xl font-bold"
          style={{ color: textColor }}
        >
          {giftTitle || 'Mesa de Regalos'}
        </h2>
        <p
          className="text-lg text-gray-600 max-w-xl mx-auto"
          style={{ color: textColor ? `${textColor}B3` : '#4b5563' }}
        >
          {giftMessage || 'Tu presencia es nuestro mayor regalo. Pero si deseas obsequiarnos algo, hemos preparado una mesa de regalos con cariño.'}
        </p>
        <a
          href={finalGiftUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-10 py-4 text-lg font-semibold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
          style={{
            backgroundColor: primaryColor || '#111',
            color: 'white',
            boxShadow: `0 4px 20px ${primaryColor ? `${primaryColor}40` : '#00000040'}`
          }}
        >
          {giftButtonText || 'Ver Opciones de Regalo'}
        </a>
      </div>
    </section>
  );
}
