// src/components/TemplateRenderer.tsx
"use client";

import { TemplateConfig } from "@/lib/types";
import { TEMPLATE_COMPONENTS } from "./templates";

type TemplateRendererProps = {
  templateId: string;
  template: TemplateConfig;
  data: any;
};

export default function TemplateRenderer({ templateId, template, data }: TemplateRendererProps) {
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
          ID Received: <span className="font-mono font-bold">"{rawId}"</span>
        </p>
        <p className="mt-1 text-sm text-red-400">
          Normalized to: <span className="font-mono">"{normalizedId}"</span>
        </p>
      </div>
    );
  }

  return (
    <div>
      <SelectedComponent template={template} data={data} />
    </div>
  );
}
