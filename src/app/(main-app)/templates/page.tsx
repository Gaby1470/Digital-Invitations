"use client";

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { templateConfig } from '@/lib/templateConfig';
import { TemplateConfig } from '@/lib/types';
import { useState } from 'react';

const groupTemplatesByNewCategories = (config: { [key: string]: TemplateConfig }) => {
  return Object.entries(config).reduce((acc, [id, template]) => {
    let targetCategory: string = template.category;
    if (targetCategory === 'Kids Birthday' || targetCategory === 'Baptism') {
      targetCategory = 'Kids';
    } else if (targetCategory === 'Baby Shower') {
      targetCategory = 'Baby';
    } else if (targetCategory === 'Corporate') {
      targetCategory = 'Professional Events';
    }

    if (!acc[targetCategory]) acc[targetCategory] = [];
    acc[targetCategory].push({ id, ...template });
    return acc;
  }, {} as { [key: string]: (TemplateConfig & { id: string })[] });
};

export default function TemplatesPage() {
  const groupedTemplates = groupTemplatesByNewCategories(templateConfig);
  const categories = Object.keys(groupedTemplates);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTemplates = selectedCategory 
    ? { [selectedCategory]: groupedTemplates[selectedCategory] }
    : groupedTemplates;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-500">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-100/50 dark:bg-indigo-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-100/50 dark:bg-pink-900/10 rounded-full blur-3xl"></div>
      </div>

      <section className="relative z-10 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          
          <div className="max-w-2xl mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">Design</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Select from our curated collection of professional templates and make them your own.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-16">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === null 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              All Designs
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <motion.div layout className="space-y-20">
            <AnimatePresence mode='popLayout'>
              {Object.entries(filteredTemplates).map(([category, templates]) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {category}
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-800"></div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {templates.map((template, idx) => (
                      <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Link href={`/templates/${template.id}`} className="group block">
                          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2 border border-gray-100 dark:border-gray-800">
                            <img 
                              src={
                                template.thumbnail ||
                                template.defaultData.hero_image_url ||
                                `https://picsum.photos/seed/${template.id}/600/800`
                              }
                              alt={template.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <span className="px-6 py-2 bg-white text-gray-900 rounded-full font-semibold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                Personalize
                              </span>
                            </div>
                          </div>
                          <div className="mt-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                              {template.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Customizable</p>
                          </div>
                        </Link>
                      </motion.div>
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