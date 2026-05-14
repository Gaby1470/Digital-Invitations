// src/components/templates/index.ts
import MinimalistWeddingTemplate from "./MinimalistWeddingTemplate";
import RomanticWeddingTemplate from "./RomanticWeddingTemplate";
import QuinceaneraTemplate from "./QuinceaneraTemplate";
import BirthdayTemplate from "./BirthdayTemplate";
import BabyShowerTemplate from "./BabyShowerTemplate";
import GraduationTemplate from "./GraduationTemplate";
import BaptismTemplate from "./BaptismTemplate";
import CorporateTemplate from "./CorporateTemplate";
import TimelineTemplate from "./TimelineTemplate";

// This map MUST use the same keys as defined in 'src/lib/templateConfig.ts'
export const TEMPLATE_COMPONENTS: { [key: string]: React.ComponentType<any> } = {
  'timeline-wedding': TimelineTemplate,
  'minimalist-wedding': MinimalistWeddingTemplate,
  'romantic-wedding': RomanticWeddingTemplate,
  'quinceanera-dream': QuinceaneraTemplate,
  'kids-birthday-bash': BirthdayTemplate,
  'baptism-ethereal': BaptismTemplate,
  'gender-reveal-party': BabyShowerTemplate,
  'graduation-celebration': GraduationTemplate,
  'corporate-summit': CorporateTemplate,
};
