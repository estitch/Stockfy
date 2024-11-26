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
      const response = await productService.getProduct(); // Obtiene el JSON
      //console.log('Response from productService:', response); // Inspección

      const parsedBody = JSON.parse(response.body);
      //console.log(parsedBody); // Asegúrate de que esto contiene los datos esperados
      const productsData = parsedBody.data;
      //console.log(productsData); // Verifica que contenga la lista de productos

      // Extraer los datos del JSON
      const products = productsData || []; // Cambia `data` según la clave del JSON
      //console.log(products)

      // Verificar que sea un array antes de aplicar map
      if (!Array.isArray(products)) {
        throw new Error('La respuesta no contiene un array de productos');
      }

      // Transformar los productos
      return products.map(product => this.transformedProductData(product));
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
