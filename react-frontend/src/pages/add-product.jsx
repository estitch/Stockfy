import { useState } from "react";
import { productAdapter } from "../adapter/product-adapter";
import { Toaster, toast } from 'sonner'
const ProductForm = () => {
  const [formData, setFormData] = useState({
    productCode: "",
    productName: "",
    productDescription: "",
    productQuantity: "",
    unitPrice: "",
    category: "",
  });

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Función para limpiar el formulario
  const handleReset = () => {
    setFormData({
      productCode: "",
      productName: "",
      productDescription: "",
      productQuantity: "",
      unitPrice: "",
      category: "",
    });
  };
  const handleCreateProduct = async () => {
    toast.promise(async () => {
      await productAdapter.createProduct(formData)
    }, {
      loading: 'Creando producto...',
      success: () => {
        return 'Producto creado exitosamente'
      },
      error: (err) => {
        console.error('Error al crear producto:', err)
        return 'Error al crear producto por favor intenta de nuevo.'
      }
    })
  }

  // Función para enviar los datos al endpoint
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://example.com/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Producto registrado exitosamente");
        handleReset(); // Limpia el formulario después de enviar
      } else {
        alert("Error al registrar el producto");
      }
    } catch (error) {
      console.error("Error en el envío:", error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <>
    <Toaster />
    <h1 className="text-sky-700 text-4xl font-bold mb-20 mt-12 text-center">
      Registrar Productos
    </h1>
    <div className="bg-white border-sky-700 border-solid border p-6 rounded-lg max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
          {/* Primera fila: Código del Producto y Nombre del Producto */}
  <div className="grid grid-cols-2 gap-4 mb-4">
    <div>
      <label
        htmlFor="productCode"
        className="block text-sky-700 font-medium mb-1"
      >
        Código del Producto
      </label>
      <input
        type="text"
        id="productCode"
        name="productCode"
        value={formData.productCode}
        onChange={handleChange}
        className="w-full border border-sky-700 rounded p-2 focus:outline-none focus:ring focus:ring-sky-300"
        placeholder="Código del Producto"
      />
        </div>
        <div>
          <label
            htmlFor="productName"
            className="block text-sky-700 font-medium mb-1"
          >
            Nombre del Producto
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            className="w-full border border-sky-700 rounded p-2 focus:outline-none focus:ring focus:ring-sky-300"
            placeholder="Nombre del Producto"
          />
        </div>
        </div>

        {/* Segunda fila: Descripción */}
        <div className="mb-4">
          <label
            htmlFor="productDescription"
            className="block text-sky-700 font-medium mb-1"
          >
            Descripción del Producto
          </label>
          <textarea
            id="productDescription"
            name="productDescription"
            value={formData.productDescription}
            onChange={handleChange}
            className="w-full border border-sky-700 rounded p-2 focus:outline-none focus:ring focus:ring-sky-300"
            placeholder="Descripción del Producto"
            rows="3"
          ></textarea>
        </div>

        {/* Tercera fila: Cantidad, Precio Unitario, Categoría */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label
              htmlFor="productQuantity"
              className="block text-sky-700 font-medium mb-1"
            >
              Cantidad
            </label>
            <input
              type="number"
              id="productQuantity"
              name="productQuantity"
              value={formData.productQuantity}
              onChange={handleChange}
              className="w-full border border-sky-700 rounded p-2 focus:outline-none focus:ring focus:ring-sky-300"
              placeholder="Cantidad"
            />
          </div>
          <div>
            <label
              htmlFor="unitPrice"
              className="block text-sky-700 font-medium mb-1"
            >
              Precio Unitario
            </label>
            <input
              type="number"
              step="0.01"
              id="unitPrice"
              name="unitPrice"
              value={formData.unitPrice}
              onChange={handleChange}
              className="w-full border border-sky-700 rounded p-2 focus:outline-none focus:ring focus:ring-sky-300"
              placeholder="Precio Unitario"
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sky-700 font-medium mb-1"
            >
              Categoría
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-sky-700 rounded p-2 focus:outline-none focus:ring focus:ring-sky-300"
            >
              <option value="">Selecciona una categoría</option>
              <option value="Electrónica">Electrónica</option>
              <option value="Ropa">Ropa</option>
              <option value="Alimentos">Alimentos</option>
              <option value="Otros">Otros</option>
            </select>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-evenly">
          <button
            type="submit"
            className="bg-sky-700 text-white px-4 py-2 rounded hover:bg-sky-600"
          >
            Registrar Producto
          </button>
          <button
            type="button"
            onClick={handleCreateProduct}
            className="bg-white border border-sky-700 text-sky-700 px-4 py-2 rounded hover:bg-sky-100"
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default ProductForm;
