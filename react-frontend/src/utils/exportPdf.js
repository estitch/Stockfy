import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

export const exportToPDF = async (elementRef, title = 'Reporte') => {
  try {
    // Mostrar notificación de inicio

    if (!elementRef) {
      throw new Error('No se encontró el elemento para exportar.');
    }

    const canvas = await html2canvas(elementRef, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'mm', 'a4');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.setFont('Helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.text(title, pageWidth / 2, 20, { align: 'center' });

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pageWidth / imgWidth, (pageHeight - 30) / imgHeight);

    pdf.addImage(imgData, 'PNG', 10, 30, imgWidth * ratio - 20, imgHeight * ratio - 20);
    pdf.save(`${title.toLowerCase().replace(/ /g, '-')}.pdf`);

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
