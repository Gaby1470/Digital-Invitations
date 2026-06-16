// src/components/templates/index.ts
import MinimalistWeddingTemplate from "./MinimalistWeddingTemplate";
import RomanticWeddingTemplate from "./RomanticWeddingTemplate";
import QuinceaneraTemplate from "./QuinceaneraTemplate";
import BirthdayTemplate from "./BirthdayTemplate";
import GenderRevealTemplate from "./GenderRevealTemplate";
import GraduationTemplate from "./GraduationTemplate";
import BaptismTemplate from "./BaptismTemplate";
import CorporateTemplate from "./CorporateTemplate";
import TimelineTemplate from "./TimelineTemplate";
import BabyShowerTemplate from "./BabyShowerTemplate";
import GenderRevealBeesTemplate from "./GenderRevealBeesTemplate";
import ModernEventTemplate from "./ModernEventTemplate";

import ScrapbookGraduationTemplate from "./ScrapbookGraduationTemplate";

// This map MUST use the same keys as defined in 'src/lib/templateConfig.ts'
export const TEMPLATE_COMPONENTS: { [key: string]: React.ComponentType<any> } = {
  'timeline-wedding': TimelineTemplate,
  'minimalist-wedding': MinimalistWeddingTemplate,
  'romantic-wedding': RomanticWeddingTemplate,
  'quinceanera-dream': QuinceaneraTemplate,
  'kids-birthday-bash': BirthdayTemplate,
  'baptism-ethereal': BaptismTemplate,
  'gender-reveal-party': GenderRevealTemplate,
  'graduation-celebration': GraduationTemplate,
  'corporate-summit': CorporateTemplate,
  'baby-shower-whimsical': BabyShowerTemplate,
  'gender-reveal-bees': GenderRevealBeesTemplate,
  'scrapbook-graduation': ScrapbookGraduationTemplate,
  'modern-event': ModernEventTemplate,
};
