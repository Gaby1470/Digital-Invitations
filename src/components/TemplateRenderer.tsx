// src/components/TemplateRenderer.tsx
"use client";

import { useEffect } from 'react';
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
  
  const font = data?.font || template.defaultFont;

  useEffect(() => {
    if (font) {
      const fontName = font.replace(/ /g, '+');
      const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;700&display=swap`;
      
      // Remove any existing dynamic font link
      const existingLink = document.getElementById('dynamic-google-font');
      if (existingLink) {
        existingLink.remove();
      }

      const link = document.createElement('link');
      link.id = 'dynamic-google-font';
      link.rel = 'stylesheet';
      link.href = fontUrl;
      document.head.appendChild(link);

      return () => {
        // Clean up the link when the component unmounts or font changes
        const linkToRemove = document.getElementById('dynamic-google-font');
        if (linkToRemove) {
          linkToRemove.remove();
        }
      };
    }
  }, [font]);

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
    <div style={{ fontFamily: `'${font}', ${template.font}` }}>
      <SelectedComponent template={template} data={data} />
    </div>
  );
}
