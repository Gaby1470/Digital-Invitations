// src/lib/fontConfig.ts

export type Font = {
  family: string;
  category: 'sans-serif' | 'serif' | 'display' | 'handwriting' | 'monospace';
};

export const curatedFontList: Font[] = [
  // Sans-serif
  { family: 'Inter', category: 'sans-serif' },
  { family: 'Roboto', category: 'sans-serif' },
  { family: 'Open Sans', category: 'sans-serif' },
  { family: 'Poppins', category: 'sans-serif' },
  { family: 'Montserrat', category: 'sans-serif' },
  { family: 'Lato', category: 'sans-serif' },
  { family: 'Nunito', category: 'sans-serif' },
  { family: 'Source Sans Pro', category: 'sans-serif' },

  // Serif
  { family: 'Lora', category: 'serif' },
  { family: 'Merriweather', category: 'serif' },
  { family: 'Playfair Display', category: 'serif' },
  { family: 'Cormorant Garamond', category: 'serif' },
  { family: 'Bitter', category: 'serif' },

  // Display
  { family: 'Oswald', category: 'display' },
  { family: 'Lobster', category: 'display' },
  
  // Handwriting
  { family: 'Great Vibes', category: 'handwriting' },
  { family: 'Dancing Script', category: 'handwriting' },
  { family: 'Permanent Marker', category: 'handwriting' },
  { family: 'Caveat', category: 'handwriting' },
  
  // Monospace
  { family: 'Courier Prime', category: 'monospace' },
];
