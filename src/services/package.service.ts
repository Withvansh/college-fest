import BackendAPI from '../lib/api/backend';
import axiosInstance from '../lib/utils/axios';

export interface IPackage {
  _id: string;
  name: string;
  description: string;
  price: number | string;
  yearlyPrice: number | string;
  features: string[];
  category: string;
  icon: string;
  popular: boolean;
  gradient: string;
  cta: string;
  ctaLink: string;
  isActive: boolean;
}

class PackageService extends BackendAPI {
  async getAllPackages(): Promise<IPackage[]> {
    return this.get<IPackage[]>('/packages');
  }

  async getPackagesByCategory(category: string): Promise<IPackage[]> {
    return this.get<IPackage[]>(`/packages/category/${category}`);
  }
}

export const packageService = new PackageService();