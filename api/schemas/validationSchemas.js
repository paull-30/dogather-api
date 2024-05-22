import { z } from 'zod';

export const userRegistrationSchema = z.object({
  username: z.string().trim(),
  email: z.string().email().trim(),
  password: z.string().trim(),
  confirmPassword: z.string().trim(),
  role: z
    .enum(['ADMIN', 'ORGANIZER', 'VOLUNTEER'], {
      message: 'invalid!Please enter a valid role or leave the role null.',
    })
    .default('VOLUNTEER'),
});

export const userLoginSchema = z.object({
  username: z.string().trim(),
  password: z.string().trim(),
});

export const postCreateSchema = z.object({
  title: z.string().trim(),
  description: z.string().trim(),
  searching_for_skills: z.array(z.string()),
});

export const postUpdateSchema = z.object({
  title: z.string().trim().optional(),
  description: z.string().trim().optional(),
  searching_for_skills: z.array(z.string()).optional(),
  status: z.enum(['OPEN', 'CLOSED']).optional(),
});

export const taskCreateSchema = z.object({
  title: z.string().trim(),
  description: z.string().trim(),
  deadline: z.date().optional(),
  assigned: z.string().trim().optional(),
});

export const taskUpdateSchema = z.object({
  title: z.string().trim().optional(),
  description: z.string().trim().optional(),
  deadline: z.date().optional(),
  assigned: z.string().trim().optional(),
  status: z.enum(['not_started', 'in_progress', 'completed']).optional(),
});

export const taskStatusUpdateSchema = z.object({
  status: z.enum(['not_started', 'in_progress', 'completed']),
});
