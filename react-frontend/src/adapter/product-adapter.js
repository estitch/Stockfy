import { productService } from '../services/product-service'

class ProductAdapter{
  transformedProductData
  async getTransformedProducts(){
    try {
      const response = await productService.getProduct();
      return response;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return null;
    }
  }

  async createProduct(productData){
    await productService.createProduct(productData);
  }
}

export const productAdapter = new ProductAdapter();