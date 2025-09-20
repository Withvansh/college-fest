import { z } from 'zod';

export const jobFormSchema = z
  .object({
    title: z.string().min(1, 'Job title is required').max(100, 'Job title is too long'),
    description: z
      .string()
      .min(10, 'Job description must be at least 10 characters')
      .max(2000, 'Description is too long'),
    requirements: z
      .string()
      .min(10, 'Requirements must be at least 10 characters')
      .max(1000, 'Requirements are too long'),
    company_name: z
      .string()
      .min(1, 'Company name is required')
      .max(100, 'Company name is too long'),
    location: z.string().min(1, 'Location is required').max(100, 'Location is too long'),
    job_type: z.enum(['full_time', 'part_time', 'contract', 'internship', 'freelance']),
    salary_min: z.number().min(0, 'Minimum salary must be positive').optional(),
    salary_max: z.number().min(0, 'Maximum salary must be positive').optional(),
    experience_required: z
      .number()
      .min(0, 'Experience must be positive')
      .max(50, 'Experience seems too high'),
    skills_required: z
      .array(z.string().min(1, 'Skill cannot be empty').max(30, 'Skill name is too long'))
      .min(1, 'At least one skill is required')
      .max(20, 'Too many skills selected'),
    benefits: z
      .array(
        z.string().min(1, 'Benefit cannot be empty').max(50, 'Benefit description is too long')
      )
      .min(1, 'At least one benefit is required')
      .max(15, 'Too many benefits listed'),
    remote_allowed: z.boolean(),
    application_deadline: z.string().optional(),
  })
  .refine(
    data => {
      if (data.salary_min && data.salary_max) {
        return data.salary_max >= data.salary_min;
      }
      return true;
    },
    {
      message: 'Maximum salary must be greater than or equal to minimum salary',
      path: ['salary_max'],
    }
  )
  .refine(
    data => {
      if (data.salary_min && !data.salary_max) {
        return false;
      }
      if (!data.salary_min && data.salary_max) {
        return false;
      }
      return true;
    },
    {
      message: 'Both minimum and maximum salary must be provided together',
      path: ['salary_min'],
    }
  );

export type JobFormData = z.infer<typeof jobFormSchema>;
