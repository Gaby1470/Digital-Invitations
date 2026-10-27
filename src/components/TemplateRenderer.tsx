// src/components/TemplateRenderer.tsx
"use client";

import { TemplateConfig } from "@/lib/custom_types";
import { EditorData } from "@/lib/custom_types";
import { TEMPLATE_COMPONENTS } from "./templates";
import { AmbientAudioPlayer } from "./shared/AmbientAudioPlayer";
import EnvelopeGate from "./shared/EnvelopeGate";

type TemplateRendererProps = {
  templateId: string;
  template: TemplateConfig;
  data: EditorData;
  invitationId?: string;
  onRsvpClick?: () => void;
  // Only the public viewer shows the opening envelope; editor previews don't
  envelope?: boolean;
};

export default function TemplateRenderer({ templateId, template, data, invitationId, onRsvpClick, envelope = false }: TemplateRendererProps) {
  const rawId = templateId || "";
  const normalizedId = rawId
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-');

  const SelectedComponent = TEMPLATE_COMPONENTS[normalizedId];
  
  if (!SelectedComponent) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-lg">
        <h2 className="text-xl font-bold">Template Component Not Found</h2>
        <p className="mt-2 text-sm">
          ID Received: <span className="font-mono font-bold">&quot;{rawId}&quot;</span>
        </p>
        <p className="mt-1 text-sm text-red-400">
          Normalized to: <span className="font-mono">&quot;{normalizedId}&quot;</span>
        </p>
      </div>
    );
  }

  const audioUrl = 
    (typeof data?.audioUrl === 'string' && data.audioUrl) || 
    (typeof template?.defaultData?.audioUrl === 'string' && template.defaultData.audioUrl) || 
    '';

  const primaryColor = 
    (typeof data?.primaryColor === 'string' && data.primaryColor) || 
    (typeof template?.defaultData?.primaryColor === 'string' && template.defaultData.primaryColor) || 
    undefined;

  const content = (
    <div className="relative">
      {audioUrl && (
        <AmbientAudioPlayer
          audioUrl={audioUrl}
          title={typeof data?.heroNames === 'string' ? `Música de ${data.heroNames}` : "Música Ambiental"}
          primaryColor={primaryColor}
        />
      )}
      <SelectedComponent template={template} data={data} invitationId={invitationId} onRsvpClick={onRsvpClick} />
    </div>
  );

  if (!envelope) return content;

  return (
    <EnvelopeGate
      names={typeof data?.heroNames === 'string' ? data.heroNames : undefined}
      accentColor={primaryColor}
    >
      {content}
    </EnvelopeGate>
  );
}
