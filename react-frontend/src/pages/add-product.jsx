import { useState } from "react";
import { Toaster, toast} from 'sonner'
const ProductForm = () => {
  const [formData, setFormData] = useState({
    Code: "",
    Name: "",
    Description: "",
    Quantity: "",
    Price: "",
    Category: "",
  });

  const [errors, setErrors] = useState({});

  // Validaciones específicas
  const validateCode = (code) => {
    const regex = /^[a-zA-Z0-9]{1,30}$/;
    return regex.test(code);
  };

  const validateName = (name) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]{1,50}$/;
    return regex.test(name);
  };

  const validateDescription = (description) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,]{1,200}$/;
    return regex.test(description);
  };

  const validateQuantity = (quantity) => {
    const num = Number(quantity);
    return Number.isInteger(num) && num > 0;
  };

  const validatePrice = (price) => {
    const num = Number(price);
    return Number.isInteger(num) && num > 0;
  };

  const validateCategory = (category) => {
    return category !== "";
  };

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validar inmediatamente mientras escribe
    switch(name) {
      case 'Code':
        setErrors(prev => ({...prev, Code: !validateCode(value)}));
        break;
      case 'Name':
        setErrors(prev => ({...prev, Name: !validateName(value)}));
        break;
      case 'Description':
        setErrors(prev => ({...prev, Description: !validateDescription(value)}));
        break;
      case 'Quantity':
        setErrors(prev => ({...prev, Quantity: !validateQuantity(value)}));
        break;
      case 'Price':
        setErrors(prev => ({...prev, Price: !validatePrice(value)}));
        break;
      case 'Category':
        setErrors(prev => ({...prev, Category: !validateCategory(value)}));
        break;
      default:
        console.warn(`Campo no reconocido para validación: ${name}`);
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validación final antes del envío
    const newErrors = {
      Code: !validateCode(formData.Code),
      Name: !validateName(formData.Name),
      Description: !validateDescription(formData.Description),
      Quantity: !validateQuantity(formData.Quantity),
      Price: !validatePrice(formData.Price),
      Category: !validateCategory(formData.Category)
    };

    setErrors(newErrors);

    // Si hay algún error, no continúa
    if (Object.values(newErrors).some(error => error)) {
      toast.warning("Por favor, corrige los errores en el formulario");
      return;
    }

    // Proceso de envío como antes...
    const validFormData = {
      Code: formData.Code.trim(),
      Name: formData.Name.trim(),
      Description: formData.Description.trim(),
      Quantity: Number(formData.Quantity),
      Price: Number(formData.Price),
      Category: formData.Category,
    };

    try {
      toast.info('Registrando producto...');
      const response = await fetch("https://74el2vza40.execute-api.us-east-1.amazonaws.com/prod/createProdFunction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validFormData),
      });

      const responseText = await response.text();

      if (response.ok) {
        toast.success("Producto registrado exitosamente");
        handleReset();
      } else {
        console.error("Error al registrar el producto:", responseText);
        toast.error("Producto ya existe, intente con otro codigo");
      }
    } catch (error) {
      console.error("Error en el envío:", error);
      toast.error("Error al conectar con el servidor.");
    }
  };

  // Función para limpiar el formulario
  const handleReset = () => {
    setFormData({
      Code: "", Name: "", Description: "",
      Quantity: "", Price: "", Category: ""
    });
    setErrors({});
  };

  return (
    <>
    <Toaster richColors/>
      <h1 className="text-sky-700 text-4xl font-bold mb-20 mt-12 text-center">
        Registrar Productos
      </h1>
      <div className="bg-white border-sky-700 border-solid border p-6 rounded-lg max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          {/* Primera fila */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="productCode" className="block text-sky-700 font-medium mb-1">
                Código del Producto
              </label>
              <input
                type="text"
                id="productCode"
                name="Code"
                value={formData.Code}
                onChange={handleChange}
                className={`w-full border rounded p-2 focus:outline-none focus:ring 
                  ${errors.Code 
                    ? 'border-red-500 focus:ring-red-300' 
                    : 'border-sky-700 focus:ring-sky-300'}`}
                placeholder="Código del Producto"
              />
              {errors.Code && (
                <p className="text-red-500 text-xs mt-1">
                  Código inválido (1-30 caracteres alfanuméricos)
                </p>
              )}
            </div>
            <div>
              <label htmlFor="productName" className="block text-sky-700 font-medium mb-1">
                Nombre del Producto
              </label>
              <input
                type="text"
                id="productName"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                className={`w-full border rounded p-2 focus:outline-none focus:ring 
                  ${errors.Name 
                    ? 'border-red-500 focus:ring-red-300' 
                    : 'border-sky-700 focus:ring-sky-300'}`}
                placeholder="Nombre del Producto"
              />
              {errors.Name && (
                <p className="text-red-500 text-xs mt-1">
                  Nombre inválido (1-50 caracteres)
                </p>
              )}
            </div>
          </div>

          {/* Descripción */}
          <div className="mb-4">
            <label htmlFor="productDescription" className="block text-sky-700 font-medium mb-1">
              Descripción del Producto
            </label>
            <textarea
              id="productDescription"
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              className={`w-full border rounded p-2 focus:outline-none focus:ring 
                ${errors.Description 
                  ? 'border-red-500 focus:ring-red-300' 
                  : 'border-sky-700 focus:ring-sky-300'}`}
              placeholder="Descripción del Producto"
              rows="3"
            ></textarea>
            {errors.Description && (
              <p className="text-red-500 text-xs mt-1">
                Descripción inválida (1-200 caracteres sin símbolos especiales)
              </p>
            )}
          </div>

          {/* Tercera fila */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="productQuantity" className="block text-sky-700 font-medium mb-1">
                Cantidad
              </label>
              <input
                type="text"
                id="productQuantity"
                name="Quantity"
                value={formData.Quantity}
                onChange={handleChange}
                className={`w-full border rounded p-2 focus:outline-none focus:ring 
                  ${errors.Quantity 
                    ? 'border-red-500 focus:ring-red-300' 
                    : 'border-sky-700 focus:ring-sky-300'}`}
                placeholder="Cantidad"
              />
              {errors.Quantity && (
                <p className="text-red-500 text-xs mt-1">
                  Cantidad debe ser un número entero positivo
                </p>
              )}
            </div>
            <div>
              <label htmlFor="unitPrice" className="block text-sky-700 font-medium mb-1">
                Precio Unitario
              </label>
              <input
                type="text"
                id="unitPrice"
                name="Price"
                value={formData.Price}
                onChange={handleChange}
                className={`w-full border rounded p-2 focus:outline-none focus:ring 
                  ${errors.Price 
                    ? 'border-red-500 focus:ring-red-300' 
                    : 'border-sky-700 focus:ring-sky-300'}`}
                placeholder="Precio Unitario"
              />
              {errors.Price && (
                <p className="text-red-500 text-xs mt-1">
                  Precio debe ser un número entero positivo
                </p>
              )}
            </div>
            <div>
              <label htmlFor="category" className="block text-sky-700 font-medium mb-1">
                Categoría
              </label>
              <select
                id="category"
                name="Category"
                value={formData.Category}
                onChange={handleChange}
                className={`w-full border rounded p-2 focus:outline-none focus:ring 
                  ${errors.Category 
                    ? 'border-red-500 focus:ring-red-300' 
                    : 'border-sky-700 focus:ring-sky-300'}`}
              >
                <option value="">Selecciona una categoría</option>
                <option value="Electrónica">Electrónica</option>
                <option value="Ropa">Ropa</option>
                <option value="Alimentos">Alimentos</option>
                <option value="Otros">Otros</option>
              </select>
              {errors.Category && (
                <p className="text-red-500 text-xs mt-1">
                  Selecciona una categoría
                </p>
              )}
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