export interface Package {
  _id: string;
  name: string;
  description: string;
  price: number;
  yearlyPrice: number;
  features: string[];
  category: string;
  icon: string;
  popular: boolean;
  gradient: string;
  cta: string;
  ctaLink: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}