import { useState } from "react";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    Code: "",
    Name: "",
    Description: "",
    Quantity: "",
    Price: "",
    Category: "",
  });

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: String(value),
    });
  };

  // Función para limpiar el formulario
  const handleReset = () => {
    setFormData({
      Code: "",
      Name: "",
      Description: "",
      Quantity: "",
      Price: "",
      Category: "",
    });
  };

  // Función para enviar los datos al endpoint
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);

    // Validación previa de datos
    if (!formData.Code || !formData.Name || !formData.Price || !formData.Quantity || !formData.Description || !formData.Category) {
        alert("Por favor, completa todos los campos requeridos.");
        return;
    }

    // Asegúrate de que los valores estén correctamente formateados
    const validFormData = {
        Code: formData.Code.trim(),
        Name: formData.Name.trim(),
        Description: formData.Description.trim(),
        Quantity: Number(formData.Quantity), // Convertir a número
        Price: Number(formData.Price),       // Convertir a número
        Category: formData.Category.trim(),
    };

    console.log("JSON generado:", JSON.stringify(validFormData));

    try {
        const response = await fetch("https://74el2vza40.execute-api.us-east-1.amazonaws.com/prod/createProdFunction", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(validFormData), // Enviar JSON válido
        });

        const responseText = await response.text();
        console.log("Respuesta del servidor:", responseText);

        if (response.ok) {
            alert("Producto registrado exitosamente");
            handleReset(); // Limpia el formulario después de enviar
        } else {
            console.error("Error al registrar el producto:", responseText);
            alert("Producto ya existe, intente con otro codigo");
        }
    } catch (error) {
        console.error("Error en el envío:", error);
        alert("Error al conectar con el servidor.");
    }
};

  return (
    <>
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
        name="Code"
        value={formData.Code}
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
            name="Name"
            value={formData.Name}
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
            name="Description"
            value={formData.Description}
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
              type="text"
              id="productQuantity"
              name="Quantity"
              value={formData.Quantity}
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
              type="text"
              step="0.01"
              id="unitPrice"
              name="Price"
              value={formData.Price}
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
              name="Category"
              value={formData.Category}
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
            onClick={handleReset}
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
