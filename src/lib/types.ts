// src/lib/types.ts

export type TimelineItem = {
  time: string;
  title: string;
  location: string;
};

export type CourtMember = {
  name: string;
  role: 'Dama' | 'Chambelán';
  photoUrl: string;
};

export type Godparent = {
  name:string;
  role: string;
  photoUrl: string;
}

// --- DRESS CODE TYPES ---
export type DressCodeStyle = 'Casual' | 'Black Tie' | 'Formal' | 'Semi-Formal' | 'Cocktail' | 'Garden Attire';

export type DressCode = {
  man: DressCodeStyle;
  woman: DressCodeStyle;
  pinterestUrlMan?: string;
  pinterestUrlWoman?: string;
};

export const dressCodeDescriptions: { [key in DressCodeStyle]: string } = {
  'Casual': 'Informal and comfortable. Think sundresses, sandals, and casual button-downs.',
  'Semi-Formal': 'A step above casual. Think cocktail dresses, dress shirts, and slacks.',
  'Cocktail': 'Elegant and party-ready. Think suits, formal cocktail dresses, and heels.',
  'Garden Attire': 'Light fabrics, floral prints, and comfortable but stylish shoes for outdoor terrain.',
  'Formal': 'Tuxedos or dark suits and ties for men, and floor-length gowns or formal cocktail dresses for women.',
  'Black Tie': 'The most formal dress code. Requires tuxedos for men and formal evening gowns for women.',
};
// --- END DRESS CODE TYPES ---

export type RecommendationItem = {
  name: string;
  description: string;
  link: string;
};

export type TemplateFeatures = {
  multiEventSchedule?: boolean;
  countdown?: {
    type: 'flip-clock' | 'minimalist';
  };
  lodgingAndTravel?: boolean;
  recommendations?: boolean;
  digitalRegistry?: {
    enabled: boolean;
    types: ('amazon' | 'zola' | 'cash_fund')[];
  };
  songRequests?: boolean;
  courtOfHonor?: boolean;
  uniqueCeremonies?: boolean;
  socialMediaWall?: boolean;
  ageSpecificThemes?: ('superhero' | 'boho' | 'minimalist')[];
  parentalNotes?: boolean;
  allergyTracker?: boolean;
  genderBetting?: boolean;
  diaperRaffle?: boolean;
  tributeSection?: boolean;
  futurePlans?: boolean;
  godparentsBlock?: boolean;
  religiousVerse?: boolean;
  addToCalendar?: boolean;
  whiteLabel?: boolean;
  linkedInIntegration?: boolean;
  speakerProfile?: boolean;
  resourceDownload?: boolean;
};

export type TemplateConfig = {
  name: string;
  category: 'Wedding' | 'XV Years' | 'Birthday' | 'Baby Shower' | 'Graduation' | 'Baptism' | 'Corporate';
  description: string;
  font: string;
  fonts?: string[];
  defaultFont?: string;
  palettes?: { name: string; primary: string; text: string }[];
  defaultData: {
    heroTitle: string;
    heroNames: string;
    timelineTitle: string;
    galleryTitle?: string;
    timelineItems: TimelineItem[];
    recommendations?: RecommendationItem[];
    courtOfHonor?: CourtMember[];
    godparents?: Godparent[];
        dressCode?: DressCode;
    [key: string]: any;
  };
  features: TemplateFeatures;
};
