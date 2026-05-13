"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { templateConfig } from '@/lib/templateConfig';
import { TemplateConfig } from '@/lib/types';

// Helper to group templates by category remains the same
const groupTemplatesByCategory = (config: { [key: string]: TemplateConfig }) => {
  return Object.entries(config).reduce((acc, [id, template]) => {
    const { category } = template;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({ id, ...template });
    return acc;
  }, {} as { [key: string]: (TemplateConfig & { id: string })[] });
};

// Animation variants for the container and items
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

export default function TemplatesPage() {
  const groupedTemplates = groupTemplatesByCategory(templateConfig);

  return (
    <main className="flex-1">
      <section className="w-full py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <motion.h1 
            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Choose Your Template
          </motion.h1>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {Object.entries(groupedTemplates).map(([category, templates]) => (
              <motion.div key={category} className="mb-16" variants={itemVariants}>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-8 border-b pb-4">
                  {category}
                </h2>
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                  variants={containerVariants}
                >
                  {templates.map((template) => (
                    <motion.div 
                      key={template.id} 
                      className="bg-white rounded-lg shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-2xl"
                      variants={itemVariants}
                    >
                      <div 
                        className="h-56 bg-gray-200 bg-cover bg-center" 
                        style={{ backgroundImage: `url(https://picsum.photos/seed/${template.id}/600/400)` }}
                      ></div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-1">{template.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                        <Link
                          href={`/templates/${template.id}`}
                          className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950"
                        >
                          Preview
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
