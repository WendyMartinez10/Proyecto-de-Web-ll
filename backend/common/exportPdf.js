import PDFDocument from 'pdfkit';

export const exportToPdf = (datos) => {
    return new Promise((resolve) => {
        const doc = new PDFDocument();
        
        doc.fontSize(20).text('Reporte de Marcas', { align: 'center' });
        doc.moveDown();

        datos.forEach((item, index) => {
            const fecha = item.fecha ? new Date(item.fecha).toISOString().split('T')[0] : '';
            doc.fontSize(12).text(`${index + 1}. Usuario: ${item.usuario}`);
            doc.fontSize(10).text(`Fecha: ${fecha} | Entrada: ${item.hora_entrada || '—'} | Salida: ${item.hora_salida || '—'}`);
            doc.text(`Dispositivo: ${item.dispositivo_entrada || item.dispositivo_salida || 'N/A'} | IP: ${item.ip_entrada || item.ip_salida || 'N/A'}`);
            doc.moveDown();
        });

        resolve(doc);
    });
};
