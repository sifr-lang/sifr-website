import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    eyebrow: z.string().optional(),
    author: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    ogImage: z.string().optional(),
    ogImageAlt: z.string().optional(),
  }),
});

export const collections = { blog };
