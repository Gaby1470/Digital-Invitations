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
  name: string;
  role: string;
  photoUrl: string;
}

export type TemplateFeatures = {
  multiEventSchedule?: boolean;
  countdown?: {
    type: 'flip-clock' | 'minimalist';
  };
  lodgingAndTravel?: boolean;
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
    courtOfHonor?: CourtMember[];
    godparents?: Godparent[];
    dressCode?: { title: string; description: string };
    [key: string]: any;
  };
  features: TemplateFeatures;
};
