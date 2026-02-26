export type Devise = 'EUR' | 'USD' | 'XAF' | 'GBP' | 'CHF';
export type Frequence = 'ponctuel' | 'mensuel';
export type MethodePaiement = 'stripe' | 'paypal';

export interface Don {
  id: string;
  donateurId?: string;
  donateurNom?: string;
  estAnonyme: boolean;
  campagneId: string;
  campagneNom: string;
  montant: number;
  devise: Devise;
  frequence: Frequence;
  message?: string;
  methodePaiement: MethodePaiement;
  recuDisponible: boolean;
  createdAt: string;
}
