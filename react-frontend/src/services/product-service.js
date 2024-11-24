import axios from 'axios';

class ProductService{
// GET: Obtener lista de productos
  async getProduct() {
    const url = "https://rm1ntedky6.execute-api.us-east-1.amazonaws.com/default/ProductFunction"
    //const url = `${import.meta.env.API_BASE_URL}`
    try {
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return response.data; // Devuelve los datos de la API
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return null
    }
  };

  // POST: Crear un nuevo producto
  async createProduct(productData){
    //const url = `${import.meta.env.API_BASE_URL}`
    const url = "https://hxrksebmw2.execute-api.us-east-1.amazonaws.com/default/createProdFunction"
    try {
      const response = await axios.post(url, productData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error al crear producto:', error);
      return null
    }
  };
}
export const productService = new ProductService();