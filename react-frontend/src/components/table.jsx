import PropTypes from "prop-types";
export default function ProductTable({ products }) {
  return (
    <div className="bg-white ">
      <table className=" bg-white min-w-full rounded-xl">
        <thead className="rounded-xl">
          <tr>
            <th className="border-none px-4 py-2 text-left">Código</th>
            <th className="border-none px-4 py-2 text-left">Nombre</th>
            <th className="border-none px-4 py-2 text-left">Descripción</th>
            <th className="border-none px-4 py-2 text-left">Stock</th>
            <th className="border-none px-4 py-2 text-left">Precio</th>
            <th className="border-none px-4 py-2 text-left">Categoría</th>
          </tr>
        </thead>
        <tbody  className='rounded-xl border-t p-5 border-sky-900'>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{product.code}</td>
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">{product.description}</td>
                <td className="px-4 py-2">{product.stock}</td>
                <td className="px-4 py-2">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-4 py-2">{product.category}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
                className="border border-gray-300 px-4 py-2 text-center text-gray-500"
              >
                No hay productos disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

ProductTable.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      stock: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      price: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
    })
  ).isRequired,
};