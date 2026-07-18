"use client";
import { DressCode, DressCodeStyle } from "@/lib/types";

type DressCodePreviewProps = {
  dressCode: DressCode;
  primaryColor?: string;
  textColor?: string;
};

const illustrations: Record<DressCodeStyle, { male: string; female: string; }> = {
  'Formal': {
    male: 'https://ykgyfxtzjedgastsuuaj.supabase.co/storage/v1/object/public/invitation-images/public/Attire/blacktie-man.png',
    female: 'https://ykgyfxtzjedgastsuuaj.supabase.co/storage/v1/object/public/invitation-images/public/Attire/blacktie-female.png'
  },
  'Semi-Formal': {
    male: 'https://ykgyfxtzjedgastsuuaj.supabase.co/storage/v1/object/public/invitation-images/public/Attire/formal-man.png',
    female: 'https://ykgyfxtzjedgastsuuaj.supabase.co/storage/v1/object/public/invitation-images/public/Attire/formal-female.png'
  },
  'Cocktail': {
    male: 'https://storage.googleapis.com/gemini-generative-ai/outfit-illustrations/cocktail_male.svg',
    female: 'https://storage.googleapis.com/gemini-generative-ai/outfit-illustrations/cocktail_female.svg'
  },
  'Garden Attire': {
    male: 'https://storage.googleapis.com/gemini-generative-ai/outfit-illustrations/garden_male.svg',
    female: 'https://storage.googleapis.com/gemini-generative-ai/outfit-illustrations/garden_female.svg'
  },
  'Casual': {
    male: 'https://storage.googleapis.com/gemini-generative-ai/outfit-illustrations/casual_male.svg',
    female: 'https://storage.googleapis.com/gemini-generative-ai/outfit-illustrations/casual_female.svg'
  },
  'Black Tie': {
    male: 'https://storage.googleapis.com/gemini-generative-ai/outfit-illustrations/black_tie_male.svg',
    female: 'https://storage.googleapis.com/gemini-generative-ai/outfit-illustrations/black_tie_female.svg'
  }
};

const isValidDressCodeStyle = (style: string): style is DressCodeStyle => {
    return style in illustrations;
}

export function DressCodePreview({ dressCode, primaryColor, textColor }: DressCodePreviewProps) {
  if (dressCode.pinterestUrlMan || dressCode.pinterestUrlWoman) {
    return (
      <div className="flex justify-center items-center gap-4">
        {dressCode.pinterestUrlMan && (
          <a
            href={dressCode.pinterestUrlMan}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 px-10 py-3 rounded-full transition-colors duration-300 font-sans text-sm tracking-widest uppercase"
            style={{ 
              border: `1px solid ${primaryColor || '#111'}`, 
              color: primaryColor || '#111',
              backgroundColor: 'transparent'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = primaryColor ? `${primaryColor}10` : '#f0f0f0'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Inspiracion para Hombres
          </a>
        )}
        {dressCode.pinterestUrlWoman && (
          <a
            href={dressCode.pinterestUrlWoman}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 px-10 py-3 rounded-full transition-colors duration-300 font-sans text-sm tracking-widest uppercase"
            style={{ 
              border: `1px solid ${primaryColor || '#111'}`, 
              color: primaryColor || '#111',
              backgroundColor: 'transparent'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = primaryColor ? `${primaryColor}10` : '#f0f0f0'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Inspiracion para Mujeres
          </a>
        )}
      </div>
    );
  }

  if (dressCode.man && dressCode.woman) {
    if (isValidDressCodeStyle(dressCode.man) && isValidDressCodeStyle(dressCode.woman)) {
        const manIllustration = illustrations[dressCode.man];
        const womanIllustration = illustrations[dressCode.woman];

        if (manIllustration && womanIllustration) {
        return (
            <div className="text-center">
            <div className="flex justify-center items-start gap-8 md:gap-16">
                <div className="text-center flex-1">
                <img src={manIllustration.male} alt="Male attire illustration" className="h-48 md:h-64 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2" style={{ color: primaryColor }}>Hombres</h3>
                <p className="text-md max-w-xs mx-auto" style={{ color: textColor, opacity: 0.8 }}>
                    {dressCode.man}
                </p>
                </div>
                <div className="text-center flex-1">
                <img src={womanIllustration.female} alt="Female attire illustration" className="h-48 md:h-64 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2" style={{ color: primaryColor }}>Mujeres</h3>
                <p className="text-md max-w-xs mx-auto" style={{ color: textColor, opacity: 0.8 }}>
                    {dressCode.woman}
                </p>
                </div>
            </div>
            </div>
        );
        }
    }
  }

  return null;
}
