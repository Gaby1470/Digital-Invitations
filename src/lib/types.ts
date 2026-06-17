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
  photoUrl?: string;
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
  man?: DressCodeStyle;
  woman?: DressCodeStyle;
  pinterestUrlMan?: string;
  pinterestUrlWoman?: string;
};
// --- END DRESS CODE TYPES ---

export type RecommendationItem = {
  name: string;
  description: string;
  link: string;
};

export type TemplateFeatures = {
  gallery?: boolean;
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
    | "Corporate"
    | "General";
  description: string;
  font: string;
  thumbnail?: string;
  fonts?: string[];
  defaultFont?: string;
  palettes?: { name: string; primary: string; text: string; secondary?: string; background?: string; }[];
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
    allergyTrackerTitle?: string;
    allergyTrackerText?: string;
    teamBoyProduct?: string;
    teamGirlProduct?: string;
    [key: string]: any;
  };
  features: TemplateFeatures;
};

export type EditorData = TemplateConfig['defaultData'] & { is_published?: boolean; slug?: string; };
