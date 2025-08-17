import { z } from 'zod';

export const usernameSchema = z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/);
export const registerSchema = z.object({
  email: z.string().email(),
  username: usernameSchema,
  password: z.string().min(6),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
});
export const loginSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().optional(),
  password: z.string().min(6),
}).refine((d) => d.email || d.username, { message: "Provide email or username" });

export const profileUpdateSchema = z.object({
  bio: z.string().max(160).optional(),
  avatar_url: z.string().url().nullable().optional(),
  website: z.string().url().nullable().optional(),
  location: z.string().max(120).nullable().optional(),
  visibility: z.enum(['PUBLIC','PRIVATE','FOLLOWERS_ONLY']).optional()
});

export const postCreateSchema = z.object({
  content: z.string().min(1).max(280),
  image_url: z.string().url().nullable().optional(),
  category: z.enum(['GENERAL','ANNOUNCEMENT','QUESTION']).default('GENERAL')
});

export const commentCreateSchema = z.object({
  content: z.string().min(1).max(200)
});
