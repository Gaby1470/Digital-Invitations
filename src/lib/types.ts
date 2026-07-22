// src/lib/types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          plan: string | null
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          plan?: string | null
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          plan?: string | null
          stripe_customer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      invitations: {
        Row: {
          id: string
          user_id: string
          slug: string | null
          template_name: string | null
          invitation_data: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          slug?: string | null
          template_name?: string | null
          invitation_data?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          slug?: string | null
          template_name?: string | null
          invitation_data?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitations_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      guest_parties: {
        Row: {
          id: string
          invitation_id: string
          party_name: string
          allocated_seats: number
          rsvp_slug: string
          created_at: string | null
        }
        Insert: {
          id?: string
          invitation_id: string
          party_name: string
          allocated_seats: number
          rsvp_slug?: string
          created_at?: string | null
        }
        Update: {
          id?: string
          invitation_id?: string
          party_name?: string
          allocated_seats?: number
          rsvp_slug?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guest_parties_invitation_id_fkey"
            columns: ["invitation_id"]
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          }
        ]
      }
      rsvps: {
        Row: {
          id: string
          guest_party_id: string
          attending_count: number
          guest_names: string[] | null
          notes: string | null
          submitted_at: string | null
        }
        Insert: {
          id?: string
          guest_party_id: string
          attending_count: number
          guest_names?: string[] | null
          notes?: string | null
          submitted_at?: string | null
        }
        Update: {
          id?: string
          guest_party_id?: string
          attending_count?: number
          guest_names?: string[] | null
          notes?: string | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_guest_party_id_fkey"
            columns: ["guest_party_id"]
            referencedRelation: "guest_parties"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_unique_rsvp_slug: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

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
  mapLink?: string;
  imageSrc?: string;
  imageAlt?: string;
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
  man?: DressCodeStyle | string;
  woman?: DressCodeStyle | string;
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
  guestCount?: boolean;
  rsvp?: boolean;
  parentsAndGodparents?: boolean;
  dressCode?: boolean;
};

export type TemplateConfig = {
  name: string;
  category:
    | "Boda"
    | "XV Años"
    | "Cumpleaños"
    | "Cumpleaños Infantil"
    | "Baby Shower"
    | "Graduación"
    | "Bautizo"
    | "Corporativo"
    | "General";
  description: string;
  font: string;
  thumbnail?: string;
  fonts?: string[];
  defaultFont?: string;
  palettes?: { name: string; primary: string; text: string; secondary?: string; background?: string; dark?: string; }[];
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
    event_date?: string;
    primaryColor?: string;
    textColor?: string;
    backgroundColor?: string;
    hero_image_url?: string;
    family_image_url?: string;
    parentsNames?: string;
    parentsDescription?: string;
    dateSubtitle?: string;
    degreeType?: string;
    age?: string | number;
    venue_city?: string;
    locationName?: string;
    mainVenueAddress?: string;
    receptionTitle?: string;
    receptionText?: string;
    receptionPlace?: string;
    guestCount?: string | number;
    giftTitle?: string;
    giftMessage?: string;
    giftRegistryUrl?: string;
    galleryImages?: string[];
    babyName?: string;
    timeRange?: string;
    timeSubtitle?: string;
    rsvpDeadline?: string;
    rsvpContact?: string;
    location?: string;
    eventDate?: string;
    photoSharingUrl?: string;
    theme?: string;
    parentalNotes?: string;
    parentalNotesTitle?: string;
    speakerImages?: string[];
    heroSubtitle?: string;
    borderColor?: string;
    selectionColor?: string;
    futurePlans?: string;
    secondaryColor?: string;
    mainTitle?: string;
    eventName?: string;
    eventDescription?: string;
    venueName?: string;
    hostNames?: string;
    partner1Name?: string;
    partner2Name?: string;
    quote?: string;
    partner1Parents?: string[];
    partner2Parents?: string[];
    venueDividerText?: string;
    itineraryItems?: TimelineItem[];
    discoBallImage?: string;
    starBalloonImage?: string;
    guestbookPolaroidImage?: string;
    tribute?: string;
    buttonTextColor?: string;
    dressCodeTitle?: string;
    dressCodeDetails?: string;
    photoUrl?: string;
    childName?: string;
    time?: string;
    extraInfo?: string;
    startTime?: string;
    endTime?: string;
    rsvpDateText?: string;
    textPrimary?: string;
    textGold?: string;
    textDark?: string;
  };
  features: TemplateFeatures;
  formSections?: string[];
};

export type EditorData = TemplateConfig['defaultData'] & { is_published?: boolean; slug?: string; };
