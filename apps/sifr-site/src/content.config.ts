import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.coerce.date(),
    author: z.string().optional(),
    sourceUrl: z.string().url().optional(),
  }),
});

export const collections = { blog };
