// src/components/templates/shared/DressCodePreview.tsx
"use client";
import { DressCode, dressCodeDescriptions } from "@/lib/types";

type DressCodePreviewProps = {
  dressCode: DressCode;
  primaryColor?: string;
  textColor?: string;
};

const illustrations = {
  'Formal': {
    male: 'https://storage.googleapis.com/gemini-generative-ai/outfit-illustrations/formal_male.svg',
    female: 'https://storage.googleapis.com/gemini-generative-ai/outfit-illustrations/formal_female.svg'
  },
  'Semi-Formal': {
    male: 'https://storage.googleapis.com/gemini-generative-ai/outfit-illustrations/semi_formal_male.svg',
    female: 'https://storage.googleapis.com/gemini-generative-ai/outfit-illustrations/semi_formal_female.svg'
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
            Men's Inspiration
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
            Women's Inspiration
          </a>
        )}
      </div>
    );
  }

  const manIllustration = illustrations[dressCode.man];
  const womanIllustration = illustrations[dressCode.woman];

  return (
    <div className="text-center">
      <div className="flex justify-center items-start gap-8 md:gap-16">
        <div className="text-center flex-1">
          <img src={manIllustration.male} alt="Male attire illustration" className="h-48 md:h-64 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold mb-2" style={{ color: primaryColor }}>{dressCode.man}</h3>
          <p className="text-md max-w-xs mx-auto" style={{ color: textColor, opacity: 0.8 }}>
            {dressCodeDescriptions[dressCode.man]}
          </p>
        </div>
        <div className="text-center flex-1">
          <img src={womanIllustration.female} alt="Female attire illustration" className="h-48 md:h-64 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold mb-2" style={{ color: primaryColor }}>{dressCode.woman}</h3>
          <p className="text-md max-w-xs mx-auto" style={{ color: textColor, opacity: 0.8 }}>
            {dressCodeDescriptions[dressCode.woman]}
          </p>
        </div>
      </div>
    </div>
  );
}
