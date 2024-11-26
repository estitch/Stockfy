import { useState } from 'react';
import ReactPaginate from 'react-paginate';
import { IconSquareArrowLeft, IconSquareArrowRight } from '@tabler/icons-react'
import PropTypes from 'prop-types';
const ProductTable = ({ products, exportMode = false }) => {
  // Pagination setup
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  // Determine which products to display
  const pageCount = Math.ceil(products.length / itemsPerPage);
  
  const displayedProducts = exportMode 
    ? products  // Show all products when in export mode
    : products.slice(
        currentPage * itemsPerPage, 
        (currentPage + 1) * itemsPerPage
      );

  // Handle page change
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <div >
      <table className=" bg-white min-w-full rounded-xl">
        <thead>
          <tr className="bg-sky-100">
            <th className="border-none px-4 py-2 text-left">Código</th>
            <th className="border-none px-4 py-2 text-left">Nombre</th>
            <th className="border-none px-4 py-2 text-left">Categoría</th>
            <th className="border-none px-4 py-2 text-left">Precio</th>
            <th className="border-none px-4 py-2 text-left">Stock</th>
          </tr>
        </thead>
        <tbody className="rounded-xl p-5 border-sky-900'">
          {displayedProducts.map((product) => (
            <tr key={product.id} className="hover:bg-sky-50">
              <td className="px-4 py-2">{product.code}</td>
              <td className="px-4 py-2">{product.name}</td>
              <td className="px-4 py-2">{product.category}</td>
              <td className="px-4 py-2">${product.price.toFixed(2)}</td>
              <td className="px-4 py-2">{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Only show pagination if not in export mode */}
      {!exportMode && (
        <div className="flex justify-center mt-4">
          <ReactPaginate
            breakLabel="..."
            nextLabel={<IconSquareArrowRight className='text-sky-700'/>}
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel={<IconSquareArrowLeft className='text-sky-700'/>}
            renderOnZeroPageCount={null}
            containerClassName="flex items-center space-x-2"
            pageClassName="px-3 py-1 border rounded-lg"
            activeClassName="bg-sky-700 text-white"
          />
        </div>
      )}
    </div>
  );
};

export default ProductTable;

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
  exportMode: PropTypes.bool,
};