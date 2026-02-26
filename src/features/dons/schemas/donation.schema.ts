import { z } from 'zod';

export const donationSchema = z.object({
  campagneId: z
    .string({ required_error: 'Veuillez selectionner une campagne' })
    .min(1, 'Veuillez selectionner une campagne'),
  montant: z
    .number({ required_error: 'Le montant est requis' })
    .min(1, 'Le montant doit etre d\'au moins 1'),
  devise: z.enum(['EUR', 'USD', 'XAF', 'GBP', 'CHF'], {
    required_error: 'La devise est requise',
  }),
  frequence: z.enum(['ponctuel', 'mensuel'], {
    required_error: 'La frequence est requise',
  }),
  estAnonyme: z.boolean().default(false),
  message: z
    .string()
    .max(500, 'Le message ne peut pas depasser 500 caracteres')
    .optional(),
  methodePaiement: z.enum(['stripe', 'paypal'], {
    required_error: 'Veuillez choisir un moyen de paiement',
  }),
});

export type DonationFormData = z.infer<typeof donationSchema>;
