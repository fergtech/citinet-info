import { defineCollection, z } from 'astro:content';

const casesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    community: z.string(),
    location: z.string().optional(),
    category: z.enum(['community', 'education', 'local-gov', 'cooperative', 'other']),
    date: z.date(),
    image: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

const researchCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    publication: z.string(),
    source: z.string(),
    category: z.enum(['surveillance', 'environment', 'economics', 'privacy', 'governance', 'health']),
    date: z.date(),
    featured: z.boolean().default(false),
  }),
});

export const collections = {
  'cases': casesCollection,
  'research': researchCollection,
};
