// src/components/editor/form-sections/ParentsAndGodparentsSection.tsx
"use client";

import { ListEditor } from '../shared/ListEditor';
import { CollapsibleSection } from '../shared/CollapsibleSection';

type ParentsAndGodparentsSectionProps = {
  partner1Parents: string[];
  partner2Parents: string[];
  godparents: string[];
  onUpdate: (data: any) => void;
  partner1Name?: string;
  partner2Name?: string;
};

export function ParentsAndGodparentsSection({
  partner1Parents,
  partner2Parents,
  godparents,
  onUpdate,
  partner1Name = "Partner 1",
  partner2Name = "Partner 2",
}: ParentsAndGodparentsSectionProps) {
  return (
    <CollapsibleSection title="Family & Godparents">
      <div className="space-y-6 pt-4">
        <ListEditor
          label={`Parents of ${partner1Name}`}
          items={partner1Parents || []}
          onUpdate={(newParents) => onUpdate({ partner1Parents: newParents })}
          placeholder="Enter parent's full name"
          verb="Add Parent"
        />
        <ListEditor
          label={`Parents of ${partner2Name}`}
          items={partner2Parents || []}
          onUpdate={(newParents) => onUpdate({ partner2Parents: newParents })}
          placeholder="Enter parent's full name"
          verb="Add Parent"
        />
        <ListEditor
          label="Godparents"
          items={godparents || []}
          onUpdate={(newGodparents) => onUpdate({ godparents: newGodparents })}
          placeholder="Enter godparent's full name"
          verb="Add Godparent"
        />
      </div>
    </CollapsibleSection>
  );
}
