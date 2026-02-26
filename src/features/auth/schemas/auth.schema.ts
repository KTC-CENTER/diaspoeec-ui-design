import { z } from 'zod';

// ============================================================================
// Login Schema
// ============================================================================

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'L\'email est requis' })
    .min(1, 'L\'email est requis')
    .email('Veuillez entrer un email valide'),
  password: z
    .string({ required_error: 'Le mot de passe est requis' })
    .min(1, 'Le mot de passe est requis'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ============================================================================
// Register Schema
// ============================================================================

export const registerSchema = z
  .object({
    nomComplet: z
      .string({ required_error: 'Le nom complet est requis' })
      .min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: z
      .string({ required_error: 'L\'email est requis' })
      .min(1, 'L\'email est requis')
      .email('Veuillez entrer un email valide'),
    password: z
      .string({ required_error: 'Le mot de passe est requis' })
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
      .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
      .regex(
        /[^A-Za-z0-9]/,
        'Le mot de passe doit contenir au moins un caractère spécial'
      ),
    confirmPassword: z
      .string({ required_error: 'Veuillez confirmer le mot de passe' })
      .min(1, 'Veuillez confirmer le mot de passe'),
    acceptTerms: z.literal(true, {
      errorMap: () => ({
        message: 'Vous devez accepter les conditions d\'utilisation',
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

// ============================================================================
// Forgot Password Schema
// ============================================================================

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'L\'email est requis' })
    .min(1, 'L\'email est requis')
    .email('Veuillez entrer un email valide'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// ============================================================================
// Onboarding - Identity Schema
// ============================================================================

export const onboardingIdentitySchema = z.object({
  dateNaissance: z
    .string({ required_error: 'La date de naissance est requise' })
    .min(1, 'La date de naissance est requise'),
  sexe: z.enum(['homme', 'femme'], {
    required_error: 'Veuillez sélectionner votre sexe',
  }),
  telephone: z.string().optional(),
});

export type OnboardingIdentityFormData = z.infer<
  typeof onboardingIdentitySchema
>;

// ============================================================================
// Onboarding - Diaspora Schema
// ============================================================================

export const onboardingDiasporaSchema = z.object({
  typeDiaspora: z
    .string({ required_error: 'Le type de diaspora est requis' })
    .min(1, 'Le type de diaspora est requis'),
  paysResidence: z
    .string({ required_error: 'Le pays de résidence est requis' })
    .min(1, 'Le pays de résidence est requis'),
  ville: z
    .string({ required_error: 'La ville est requise' })
    .min(2, 'La ville doit contenir au moins 2 caractères'),
});

export type OnboardingDiasporaFormData = z.infer<
  typeof onboardingDiasporaSchema
>;

// ============================================================================
// Onboarding - Church Schema
// ============================================================================

export const onboardingChurchSchema = z.object({
  paroisseOrigine: z
    .string({ required_error: 'La paroisse d\'origine est requise' })
    .min(1, 'La paroisse d\'origine est requise'),
  baptise: z.boolean().default(false),
  ministeres: z.array(z.string()).default([]),
});

export type OnboardingChurchFormData = z.infer<typeof onboardingChurchSchema>;
