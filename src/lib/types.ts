// src/lib/types.ts

export type Rsvp = {
  id: number;
  invitation_id: string;
  name: string;
  status: 'ATTENDING' | 'DECLINED';
  plus_ones: number;
  message: string | null;
  created_at: string;
};

export type TimelineItem = {
  time: string;
  title: string;
  location: string;
};

export type CourtMember = {
  name: string;
  role: "Dama" | "Chambelán";
  photoUrl: string;
};

export type Godparent = {
  name: string;
  role: string;
  photoUrl: string;
};

// --- DRESS CODE TYPES ---
export type DressCodeStyle =
  | "Casual"
  | "Black Tie"
  | "Formal"
  | "Semi-Formal"
  | "Cocktail"
  | "Garden Attire";

export type DressCode = {
  man: DressCodeStyle;
  woman: DressCodeStyle;
  pinterestUrlMan?: string;
  pinterestUrlWoman?: string;
};

export const dressCodeDescriptions: { [key in DressCodeStyle]: string } = {
  Casual:
    "Informal y comodo. Piensa en vestidos de verano, camisas sin corbata y zapatos cómodos.",
  "Semi-Formal":
    "Un nivel por encima de lo casual. Piensa en vestidos de cóctel, camisas de vestir y pantalones elegantes.",
  Cocktail:
    "Elegante y listo para la fiesta. Piensa en trajes, vestidos de cóctel formales y tacones.",
  "Garden Attire":
    "Tejidos ligeros, estampados florales y zapatos cómodos pero elegantes para terrenos al aire libre.",
  Formal:
    "Esmoquin o trajes oscuros y corbatas para hombres, y vestidos largos para mujeres.",
  "Black Tie":
    "El código de vestimenta más formal. Requiere esmoquin para hombres y vestidos de noche formales para mujeres.",
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
    type: "flip-clock" | "minimalist";
  };
  lodgingAndTravel?: boolean;
  recommendations?: boolean;
  digitalRegistry?: {
    enabled: boolean;
    types: ("amazon" | "zola" | "cash_fund")[];
  };
  songRequests?: boolean;
  courtOfHonor?: boolean;
  uniqueCeremonies?: boolean;
  socialMediaWall?: boolean;
  ageSpecificThemes?: ("superhero" | "boho" | "minimalist")[];
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
  category:
    | "Wedding"
    | "XV Years"
    | "Birthday"
    | "Kids Birthday"
    | "Baby Shower"
    | "Graduation"
    | "Baptism"
    | "Corporate";
  description: string;
  font: string;
  thumbnail?: string;
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
