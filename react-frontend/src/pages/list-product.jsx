import { useCallback, useRef, useEffect, useState } from 'react';
import { productAdapter } from '../adapter/product-adapter';
import ProductTable from '../components/table';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import InventoryLoader from '../components/loader';
import { IconCloudDownload } from '@tabler/icons-react'
import { Toaster, toast } from 'sonner'
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

  const exportToPDF = async () => {
    try {
      // Mostrar notificación de inicio
      toast('Generando el PDF, por favor espera...', {
        description: 'Estamos procesando el reporte.',
        type: 'info',
      });
  
      const reportElement = tableRef.current;
      if (!reportElement) {
        throw new Error('No se encontró el elemento para exportar.');
      }
  
      const canvas = await html2canvas(reportElement, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
  
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
  
      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.text('Reporte de Inventario', pageWidth / 2, 20, { align: 'center' });
  
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pageWidth / imgWidth, (pageHeight - 30) / imgHeight);
  
      pdf.addImage(imgData, 'PNG', 10, 30, imgWidth * ratio - 20, imgHeight * ratio - 20);
      pdf.save('reporte-inventario.pdf');
  
      // Mostrar notificación de éxito
      toast.success('PDF generado exitosamente.', {
        description: 'El archivo se ha descargado correctamente.',
      });
    } catch (error) {
      // Mostrar notificación de error
      toast.error('Error al generar el PDF.', {
        description: error.message || 'Ocurrió un problema durante la exportación.',
      });
    }
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
      //console.log(productsData)
  
      // Transformar nombres de propiedades a camelCase si es necesario
      const transformedData = productsData.map(product => ({
        id: product.id,
        code: product.code,
        price: Number(product.price),
        description: product.description,
        stock: Number(product.stock),
        category: product.category,
        name: product.name,
      }));
      //console.log(transformedData)
  
      setAllProducts(transformedData);
      setFilteredProducts(transformedData);
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
              onClick={exportToPDF}
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