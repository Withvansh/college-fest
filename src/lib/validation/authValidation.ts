import { z } from 'zod';

// Password validation regex patterns
const hasLowerCase = /[a-z]/;
const hasUpperCase = /[A-Z]/;
const hasNumber = /\d/;
const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

// Password strength validation schema
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .refine(password => hasLowerCase.test(password), {
    message: 'Password must contain at least one lowercase letter',
  })
  .refine(password => hasUpperCase.test(password), {
    message: 'Password must contain at least one uppercase letter',
  })
  .refine(password => hasNumber.test(password), {
    message: 'Password must contain at least one number',
  })
  .refine(password => hasSpecialChar.test(password), {
    message: 'Password must contain at least one special character',
  });

// Email validation schema
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

// Login form validation schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// Signup form validation schema
export const signupSchema = z.object({
  name: z.string().min(1, 'Full name is required').min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  password: passwordSchema,
});

// Forgot password form validation schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Reset password form validation schema
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Password strength checker function
export const getPasswordStrength = (password: string) => {
  const checks = [
    { test: password.length >= 8, label: 'At least 8 characters' },
    { test: hasLowerCase.test(password), label: 'One lowercase letter' },
    { test: hasUpperCase.test(password), label: 'One uppercase letter' },
    { test: hasNumber.test(password), label: 'One number' },
    { test: hasSpecialChar.test(password), label: 'One special character' },
  ];

  const passedChecks = checks.filter(check => check.test).length;
  const totalChecks = checks.length;

  let strength = 'weak';
  if (passedChecks === totalChecks) {
    strength = 'strong';
  } else if (passedChecks >= totalChecks - 1) {
    strength = 'medium';
  }

  return {
    strength,
    checks,
    score: passedChecks / totalChecks,
  };
};

// Types
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
