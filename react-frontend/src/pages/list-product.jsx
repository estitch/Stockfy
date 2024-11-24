import { useCallback, useRef, useEffect, useState } from 'react';
import { productAdapter } from '../adapter/product-adapter';
import ProductTable from '../components/table';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
export default function ListProduct() {
  const tableRef = useRef();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const exportToPDF = async () => {
    const reportElement = tableRef.current;

    // Captura el contenido del DOM como imagen
    const canvas = await html2canvas(reportElement, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    // Configuración del PDF en modo horizontal
    const pdf = new jsPDF('l', 'mm', 'a4'); // 'l' para landscape
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Añade el título al PDF antes de incluir la imagen
    pdf.setFont('Helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.text('Reporte de Inventario', pageWidth / 2, 20, { align: 'center' }); // Título centrado

    // Ajusta la imagen debajo del título con márgenes
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pageWidth / imgWidth, (pageHeight - 30) / imgHeight); // Espacio para el título

    pdf.addImage(imgData, 'PNG', 10, 30, imgWidth * ratio - 20, imgHeight * ratio - 20); // Imagen ajustada
    pdf.save('reporte-inventario.pdf');
};

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const productsData = await productAdapter.getTransformedProducts();
      console.log('Productos transformados:', productsData);
      setProducts(productsData); // Aquí ya no desestructuramos
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]); // Establecemos un array vacío en caso de error
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
        <p>Cargando productos...</p>
      ) : (
        <>
        <h1 className="text-sky-700 text-4xl font-bold mb-20 mt-12 text-center">
        Consulta de Productos
        </h1>
        <button
        onClick={exportToPDF}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
        Descargar PDF
        </button>
        <div  ref={tableRef}>
          <ProductTable products={products} />
        </div>
        </>
      )}
    </div>
  );
}