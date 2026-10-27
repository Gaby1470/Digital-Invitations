// src/components/templates/index.ts
import dynamic from "next/dynamic";
import { TemplateConfig } from "@/lib/custom_types";
import { EditorData } from "@/lib/custom_types";

interface TemplateComponentProps {
  template: TemplateConfig;
  data: EditorData;
  invitationId?: string;
  onRsvpClick?: () => void;
}

// Each template is its own chunk; still server-rendered.
// `dynamic<TemplateComponentProps>(() => import(...))` must be called inline so Next can preload the chunk during SSR.
// This map MUST use the same keys as defined in 'src/lib/templateConfig.ts'
export const TEMPLATE_COMPONENTS: { [key: string]: React.ComponentType<TemplateComponentProps> } = {
  'timeline-wedding': dynamic<TemplateComponentProps>(() => import("./TimelineTemplate")),
  'minimalist-wedding': dynamic<TemplateComponentProps>(() => import("./MinimalistWeddingTemplate")),
  
  'quinceanera-dream': dynamic<TemplateComponentProps>(() => import("./QuinceaneraTemplate")),
  'kids-birthday-bash': dynamic<TemplateComponentProps>(() => import("./BirthdayTemplate")),
  'baptism-ethereal': dynamic<TemplateComponentProps>(() => import("./BaptismTemplate")),
  'gender-reveal-party': dynamic<TemplateComponentProps>(() => import("./GenderRevealTemplate")),
  'graduation-celebration': dynamic<TemplateComponentProps>(() => import("./GraduationTemplate")),
  'baby-shower-whimsical': dynamic<TemplateComponentProps>(() => import("./BabyShowerTemplate")),
  'gender-reveal-bees': dynamic<TemplateComponentProps>(() => import("./GenderRevealBeesTemplate")),
  'scrapbook-graduation': dynamic<TemplateComponentProps>(() => import("./ScrapbookGraduationTemplate")),
  'modern-event': dynamic<TemplateComponentProps>(() => import("./ModernEventTemplate")),
  'old-money-wedding': dynamic<TemplateComponentProps>(() => import("./OldMoneyTemplate")),
  'wedding-aquarrel': dynamic<TemplateComponentProps>(() => import("./WeddingAquarrelTemplate")),
  'sports-birthday': dynamic<TemplateComponentProps>(() => import("./SportsBirthdayTemplate")),
  'princess-birthday': dynamic<TemplateComponentProps>(() => import("./PrincessBirthdayTemplate")),
  'garden-wedding': dynamic<TemplateComponentProps>(() => import("./GardenWeddingTemplate")),
  'masquerade-xv': dynamic<TemplateComponentProps>(() => import("./MasqueradeXvTemplate")),
};
