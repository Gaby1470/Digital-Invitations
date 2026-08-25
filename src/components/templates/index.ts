// src/components/templates/index.ts
import MinimalistWeddingTemplate from "./MinimalistWeddingTemplate";

import QuinceaneraTemplate from "./QuinceaneraTemplate";
import BirthdayTemplate from "./BirthdayTemplate";
import GenderRevealTemplate from "./GenderRevealTemplate";
import GraduationTemplate from "./GraduationTemplate";
import BaptismTemplate from "./BaptismTemplate";
import TimelineTemplate from "./TimelineTemplate";
import BabyShowerTemplate from "./BabyShowerTemplate";
import GenderRevealBeesTemplate from "./GenderRevealBeesTemplate";
import ModernEventTemplate from "./ModernEventTemplate";
import OldMoneyTemplate from "./OldMoneyTemplate";
import WeddingAquarrelTemplate from "./WeddingAquarrelTemplate";
import SportsBirthdayTemplate from "./SportsBirthdayTemplate";
import PrincessBirthdayTemplate from "./PrincessBirthdayTemplate";
import GardenWeddingTemplate from "./GardenWeddingTemplate";

import ScrapbookGraduationTemplate from "./ScrapbookGraduationTemplate";
import MasqueradeXvTemplate from "./MasqueradeXvTemplate";
import { TemplateConfig } from "@/lib/custom_types";
import { EditorData } from "@/lib/custom_types";
interface TemplateComponentProps {
  template: TemplateConfig;
  data: EditorData;
  invitationId?: string;
  onRsvpClick?: () => void;
}
// This map MUST use the same keys as defined in 'src/lib/templateConfig.ts'
export const TEMPLATE_COMPONENTS: { [key: string]: React.ComponentType<TemplateComponentProps> } = {
  'timeline-wedding': TimelineTemplate,
  'minimalist-wedding': MinimalistWeddingTemplate,
  
  'quinceanera-dream': QuinceaneraTemplate,
  'kids-birthday-bash': BirthdayTemplate,
  'baptism-ethereal': BaptismTemplate,
  'gender-reveal-party': GenderRevealTemplate,
  'graduation-celebration': GraduationTemplate,
  'baby-shower-whimsical': BabyShowerTemplate,
  'gender-reveal-bees': GenderRevealBeesTemplate,
  'scrapbook-graduation': ScrapbookGraduationTemplate,
  'modern-event': ModernEventTemplate,
  'old-money-wedding': OldMoneyTemplate,
  'wedding-aquarrel': WeddingAquarrelTemplate,
  'sports-birthday': SportsBirthdayTemplate,
  'princess-birthday': PrincessBirthdayTemplate,
  'garden-wedding': GardenWeddingTemplate,
  'masquerade-xv': MasqueradeXvTemplate,
};
