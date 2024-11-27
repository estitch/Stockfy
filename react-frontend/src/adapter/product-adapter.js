import { productService } from '../services/product-service'

class ProductAdapter {
  transformedProductData(product) {
    return {
      id: Number(product.dynamo),
      code: product.Code,
      name: product.Name,
      description: product.Description,
      stock: Number(product.Quantity),
      price: Number(product.Price),
      category: product.Category,
    }
  }

  async getTransformedProducts() {
    try {
      const response = await productService.getProduct();
  
      const parsedBody = JSON.parse(response.body);
      const productsData = parsedBody.data;
  
      const products = productsData || [];
  
      if (!Array.isArray(products)) {
        throw new Error('La respuesta no contiene un array de productos');
      }
  
      // Transformar los productos y verificar valores
      const transformedProducts = products
        .map(product => {
          return this.transformedProductData(product);
        })
        .filter(Boolean); // Eliminar productos nulos
      return transformedProducts.sort((a, b) => b.id - a.id)
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
