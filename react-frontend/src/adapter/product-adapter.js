import { productService } from '../services/product-service'

class ProductAdapter {
  transformedProductData(product) {
    return {
      id: product.id,
      code: product.code,
      name: product.name,
      description: product.description,
      stock: product.stock,
      price: product.price,
      category: product.category,
    }
  }

  async getTransformedProducts() {
    try {
      const response = await productService.getProduct();
      return response.map(product => this.transformedProductData(product));
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return [];  
    }
  }

  async createProduct(productData) {
    await productService.createProduct(productData);
  }
}

export const productAdapter = new ProductAdapter();