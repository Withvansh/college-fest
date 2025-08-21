export const digitalProductsApi = {
  async getProducts() {
    return [];
  },
  async getProductById(id: string) {
    return null;
  },
  async createProduct(product: any) {
    return { id: 'mock-' + Date.now(), ...product };
  },
  async updateProduct(id: string, updates: any) {
    return { id, ...updates };
  },
  async deleteProduct(id: string) {
    return { id };
  },
  async purchaseProduct(productId: string, userId: string) {
    return { id: 'mock-' + Date.now(), productId, userId };
  },
  async getUserPurchases(userId: string) {
    return [];
  }
};