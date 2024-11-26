import { useCallback, useRef, useEffect, useState } from 'react';
import { productAdapter } from '../adapter/product-adapter';
import ProductTable from '../components/table';
import InventoryLoader from '../components/loader';
import { exportToPDF } from '../utils/exportPdf';
import { IconCloudDownload } from '@tabler/icons-react'
import { Toaster} from 'sonner'
const QUANTITY_OPTIONS = [
  { label: 'Todas las cantidades', value: 'all' },
  { label: 'Menos de 10', value: '<10' },
  { label: 'Entre 10 y 50', value: '10-50' },
  { label: 'Entre 50 y 100', value: '50-100' },
  { label: 'Más de 100', value: '>100' }
];

const CATEGORY_OPTIONS = [
  { label: 'Todas las categorías', value: '' },
  { label: 'Electrónica', value: 'Electrónica' },
  { label: 'Ropa', value: 'Ropa' },
  { label: 'Alimentos', value: 'Alimentos' },
  { label: 'Otros', value: 'Otros' },
];

export default function ListProduct() {
  const tableRef = useRef();
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    category: '',
    quantity: 'all'
  });

  const handleExportPDF = async () => {
      exportToPDF(tableRef.current, 'Reporte de Productos');
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = useCallback(() => {
    let result = [...allProducts];

    if (filters.minPrice) {
      result = result.filter(product => product.price >= Number(filters.minPrice));
    }

    if (filters.maxPrice) {
      result = result.filter(product => product.price <= Number(filters.maxPrice));
    }

    if (filters.category) {
      result = result.filter(product => 
        product.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.quantity !== 'all') {
      switch (filters.quantity) {
        case '<10':
          result = result.filter(product => product.stock < 10);
          break;
        case '10-50':
          result = result.filter(product => product.stock >= 10 && product.stock <= 50);
          break;
        case '50-100':
          result = result.filter(product => product.stock > 50 && product.stock <= 100);
          break;
        case '>100':
          result = result.filter(product => product.stock> 100);
          break;
        default:
            break;
      }
    }

    setFilteredProducts(result);
  }, [filters, allProducts]);

  useEffect(() => {
    applyFilters();
  }, [filters, applyFilters]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const productsData = await productAdapter.getTransformedProducts();
      setAllProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      setAllProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);
  

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div>
      {loading ? (
        <InventoryLoader/>
      ) : (
        <>
        <Toaster />
        <div className='my-10 flex justify-between items-center'>
          <h1 className="text-sky-700 text-4xl font-bold text-center">
              Consulta de Productos
            </h1>

          <button
              onClick={handleExportPDF}
              className="flex px-4 py-2 h-12 bg-white border border-sky-200 text-sky-800 rounded-lg hover:border-sky-900"
            >
              <IconCloudDownload className= ' mr-2 'stroke={2} />
              Exportar pdf
          </button>
        </div>

          {/* Filtros */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Filtro de Precio Mínimo */}
            <div>
              <label htmlFor="minPrice" className="block text-sky-700 font-medium mb-1">
                Precio Mínimo
              </label>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="w-full border border-sky-700 rounded p-2 focus:outline-none focus:ring focus:ring-sky-300"
                placeholder="Precio mínimo"
              />
            </div>

            {/* Filtro de Precio Máximo */}
            <div>
              <label htmlFor="maxPrice" className="block text-sky-700 font-medium mb-1">
                Precio Máximo
              </label>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="w-full border border-sky-700 rounded p-2 focus:outline-none focus:ring focus:ring-sky-300"
                placeholder="Precio máximo"
              />
            </div>

            {/* Filtro de Categoría */}
            <div>
              <label htmlFor="category" className="block text-sky-700 font-medium mb-1">
                Categoría
              </label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full border border-sky-700 rounded p-2 focus:outline-none focus:ring focus:ring-sky-300"
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro de Cantidad */}
            <div>
              <label htmlFor="quantity" className="block text-sky-700 font-medium mb-1">
                Cantidad en Stock
              </label>
              <select
                id="quantity"
                name="quantity"
                value={filters.quantity}
                onChange={handleFilterChange}
                className="w-full border border-sky-700 rounded p-2 focus:outline-none focus:ring focus:ring-sky-300"
              >
                {QUANTITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div ref={tableRef}>
            <ProductTable products={filteredProducts} />
          </div>
        </>
      )}
    </div>
  );
}