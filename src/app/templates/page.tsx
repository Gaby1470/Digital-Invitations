"use client";

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { templateConfig } from '@/lib/templateConfig';
import { TemplateConfig } from '@/lib/types';
import { useState } from 'react';

const groupTemplatesByNewCategories = (config: { [key: string]: TemplateConfig }) => {
  return Object.entries(config).reduce((acc, [id, template]) => {
    let targetCategory: string = template.category;

    // Custom Mapping Logic
    if (targetCategory === 'Kids Birthday' || targetCategory === 'Baptism') {
      targetCategory = 'Kids';
    } else if (targetCategory === 'Baby Shower') {
      targetCategory = 'Baby';
    } else if (targetCategory === 'Corporate') {
      // This ensures your CorporateTemplate.tsx appears under the new section
      targetCategory = 'Professional Events';
    }

    if (!acc[targetCategory]) {
      acc[targetCategory] = [];
    }
    acc[targetCategory].push({ id, ...template });
    return acc;
  }, {} as { [key: string]: (TemplateConfig & { id: string })[] });
};

export default function TemplatesPage() {
  const groupedTemplates = groupTemplatesByNewCategories(templateConfig);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTemplates = selectedCategory 
    ? { [selectedCategory]: groupedTemplates[selectedCategory] }
    : groupedTemplates;

  // The specific navigation order you requested
  const categoryOrder = ['Wedding', 'XV Years', 'Kids', 'Baby', 'Graduation', 'Professional Events'];
  const availableCategories = ['All', ...categoryOrder.filter(cat => groupedTemplates[cat])];

  return (
    <main className="bg-white min-h-screen">
      <section className="w-full py-12 md:py-20">
        <div className="container px-4 md:px-6 mx-auto">
          
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-neutral-900">
              Encuentra la plantilla perfecta para tu evento
            </h1>
            <p className="mt-4 text-lg text-neutral-600">
              Explora nuestra colección de plantillas personalizables para bodas, cumpleaños, eventos corporativos y más. 
              Contáctanos para una solución personalizada.
            </p>
          </motion.div>

          {/* This is the Category Navigation Menu */}
          <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md py-4 mb-10 border-b border-neutral-100">
            <div className="flex flex-wrap justify-center gap-2">
              {availableCategories.map((cat) => {
                const isSelected = cat === 'All' ? !selectedCategory : selectedCategory === cat;
                return (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat === 'All' ? null : cat)}
                    className="relative px-5 py-1.5 text-sm font-medium transition-colors duration-300 rounded-full outline-none"
                  >
                    <span className={`relative z-10 ${isSelected ? 'text-white' : 'text-neutral-900'}`}>
                      {cat}
                    </span>
                    {isSelected && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute inset-0 bg-neutral-900 rounded-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <motion.div layout className="space-y-12">
            <AnimatePresence mode="popLayout">
              {Object.entries(filteredTemplates).map(([category, templates]) => (
                <motion.div key={category} layout className="space-y-6">
                  <h2 className="text-xl font-bold text-neutral-900 border-l-4 border-neutral-900 pl-4">
                    {category}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {templates.map((template) => (
                      <Link key={template.id} href={`/templates/${template.id}`} className="group">
                        <div className="relative overflow-hidden rounded-lg aspect-video bg-neutral-100">
                          {/** Prefer an explicit thumbnail, then the hero image, then the first gallery image. */}
                          <img 
                            src={
                              template.thumbnail ||
                              template.defaultData.hero_image_url ||
                              template.defaultData.galleryImages?.[0] ||
                              `https://picsum.photos/seed/${template.id}/600/338`
                            }
                            alt={template.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                        <h3 className="mt-3 text-base font-bold text-neutral-900">{template.name}</h3>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </main>
  );
}