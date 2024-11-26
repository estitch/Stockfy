import { productService } from '../services/product-service'

class ProductAdapter {
  transformedProductData(product) {
    return {
      id: product.dynamo,
      code: product.Code,
      name: product.Name,
      description: product.Description,
      stock: product.Quantity,
      price: product.Price,
      category: product.Category,
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