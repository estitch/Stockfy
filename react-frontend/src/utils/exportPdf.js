import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

export const exportToPDF = async (elementRef, title = 'Reporte') => {
  try {
    if (!elementRef) {
      throw new Error('No se encontró el elemento para exportar.');
    }

    // Crear un nuevo documento PDF en modo vertical (portrait)
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Obtener dimensiones de página
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Agregar título
    pdf.setFont('Helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.text(title, pageWidth / 2, 15, { align: 'center' });

    // Usar html2canvas para capturar el elemento
    const canvas = await html2canvas(elementRef, { 
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: null
    });

    // Calcular dimensiones de la imagen
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = pageWidth - 20; // Dejar márgenes
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Calcular espacio disponible para la imagen
    const availableHeight = pageHeight - 40; // Restando espacio para título y márgenes

    // Posición vertical inicial
    let verticalPosition = 30;

    // Si la imagen es más alta que la página, la escalamos
    if (imgHeight > availableHeight) {
      const scaleFactor = availableHeight / imgHeight;
      const scaledImgWidth = imgWidth * scaleFactor;
      const scaledImgHeight = availableHeight;

      pdf.addImage(
        imgData, 
        'PNG', 
        (pageWidth - scaledImgWidth) / 2, // Centrar horizontalmente
        verticalPosition, 
        scaledImgWidth, 
        scaledImgHeight
      );
    } else {
      // Si la imagen es más pequeña, la colocamos en la parte superior
      pdf.addImage(
        imgData, 
        'PNG', 
        10, 
        verticalPosition, 
        imgWidth, 
        imgHeight
      );
    }

    // Guardar PDF
    pdf.save(`${title.toLowerCase().replace(/ /g, '-')}.pdf`);

    // Notificación de éxito
    toast.success('PDF generado exitosamente.', {
      description: 'El archivo se ha descargado correctamente.',
    });

  } catch (error) {
    // Notificación de error
    toast.error('Error al generar el PDF.', {
      description: error.message || 'Ocurrió un problema durante la exportación.',
    });
  }
};