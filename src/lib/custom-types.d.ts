// src/lib/custom-types.d.ts

import { Tables, Json } from './types';

export type EditorData = Partial<Tables<'invitations'>['Row']['data']> & {
  [key: string]: Json | undefined;
};

export interface Palette {
  name: string;
  primary: string;
  secondary?: string;
  background: string;
  text: string;
  dark?: string;
}

export interface TemplateConfig {
  name: string;
  thumbnail: string;
  category: string;
  description: string;
  font: string;
  defaultFont: string;
  fonts: string[];
  palettes: Palette[];
  defaultData: EditorData;
  features: {
    multiEventSchedule?: boolean;
    dressCode?: boolean;
    rsvp?: boolean;
    guestCount?: boolean;
    gallery?: boolean;
    countdown?: { type: string };
    recommendations?: boolean;
    digitalRegistry?: { enabled: boolean, types: string[] };
    songRequests?: boolean;
    courtOfHonor?: boolean;
    uniqueCeremonies?: boolean;
    socialMediaWall?: boolean;
    parentsAndGodparents?: boolean;
    ageSpecificThemes?: string[];
    parentalNotes?: boolean;
    allergyTracker?: boolean;
    genderBetting?: boolean;
    diaperRaffle?: boolean;
    futurePlans?: boolean;
    tributeSection?: boolean;
  };
  formSections?: string[];
}

export type Rsvp = Tables<'rsvps'>['Row'];

export interface CourtMember {
  name: string;
  role: string;
  photoUrl: string;
}

export interface DressCode {
  man: string;
  woman: string;
  pinterestUrlMan?: string;
  pinterestUrlWoman?: string;
}

export interface TimelineItem {
  time: string;
  title: string;
  location: string;
  mapLink?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export interface Godparent {
  name: string;
  role: string;
}

export interface RecommendationItem {
  name: string;
  description: string;
  link: string;
}

export type DressCodeStyle = 'Formal' | 'Semi-Formal' | 'Cocktail' | 'Garden Attire' | 'Casual' | 'Black Tie';
