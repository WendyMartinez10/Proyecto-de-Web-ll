import PDFDocument from 'pdfkit';

// Paleta y layout de la tabla del reporte.
const COLOR_PRIMARIO = '#0d6efd';
const COLOR_TEXTO = '#212529';
const COLOR_TEXTO_SUAVE = '#6c757d';
const COLOR_ENCABEZADO_TABLA = '#0d6efd';
const COLOR_FILA_PAR = '#f4f7fb';
const COLOR_BORDE = '#dee2e6';

const COLUMNAS = [
    { key: 'usuario', label: 'Usuario', width: 100 },
    { key: 'fecha', label: 'Fecha', width: 70 },
    { key: 'hora_entrada', label: 'Entrada', width: 55 },
    { key: 'hora_salida', label: 'Salida', width: 55 },
    { key: 'dispositivo', label: 'Dispositivo', width: 100 },
    { key: 'ip', label: 'IP', width: 90 }
];

const MARGEN = 40;
const ALTO_FILA = 24;
const ALTO_ENCABEZADO_TABLA = 26;

const dibujarEncabezadoDocumento = (doc) => {
    doc
        .rect(0, 0, doc.page.width, 70)
        .fill(COLOR_PRIMARIO);

    doc
        .fillColor('#ffffff')
        .fontSize(18)
        .font('Helvetica-Bold')
        .text('UTN · Sistema de Marcas y Préstamo de Equipos', MARGEN, 18, {
            width: doc.page.width - MARGEN * 2
        });

    doc
        .fontSize(11)
        .font('Helvetica')
        .text('Reporte de Marcas', MARGEN, 42);

    const fechaGeneracion = new Date().toLocaleString('es-CR', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
    doc
        .fontSize(8)
        .text(`Generado: ${fechaGeneracion}`, MARGEN, 42, {
            width: doc.page.width - MARGEN * 2,
            align: 'right'
        });

    doc.y = 90;
};

const dibujarPiePagina = (doc, numeroPagina) => {
    const y = doc.page.height - doc.page.margins.bottom - 12;
    doc
        .fontSize(8)
        .fillColor(COLOR_TEXTO_SUAVE)
        .font('Helvetica')
        .text(`Página ${numeroPagina}`, MARGEN, y, {
            width: doc.page.width - MARGEN * 2,
            align: 'center',
            lineBreak: false
        });
};

const dibujarEncabezadoTabla = (doc, x, y) => {
    let cursorX = x;
    doc.rect(x, y, sumWidths(), ALTO_ENCABEZADO_TABLA).fill(COLOR_ENCABEZADO_TABLA);

    doc.font('Helvetica-Bold').fontSize(9).fillColor('#ffffff');
    COLUMNAS.forEach((col) => {
        doc.text(col.label, cursorX + 6, y + 8, { width: col.width - 12 });
        cursorX += col.width;
    });

    return y + ALTO_ENCABEZADO_TABLA;
};

const sumWidths = () => COLUMNAS.reduce((acc, c) => acc + c.width, 0);

const dibujarFila = (doc, item, index, x, y, mostrarUsuario, mostrarFecha) => {
    const anchoTotal = sumWidths();

    if (index % 2 === 0) {
        doc.rect(x, y, anchoTotal, ALTO_FILA).fill(COLOR_FILA_PAR);
    }

    // Separador más marcado cuando empieza un usuario nuevo, para que se
    // note claramente dónde termina un grupo de marcas y empieza el
    // siguiente (ej. termina "admin" y arranca "wen"). Cuando lo que
    // cambia es solo la fecha (mismo usuario, día distinto) se usa un
    // separador intermedio, más sutil que el de usuario pero más marcado
    // que el de una fila normal.
    if (mostrarUsuario && index !== 0) {
        doc
            .moveTo(x, y)
            .lineTo(x + anchoTotal, y)
            .strokeColor(COLOR_PRIMARIO)
            .lineWidth(1)
            .stroke();
    } else if (mostrarFecha && index !== 0) {
        doc
            .moveTo(x, y)
            .lineTo(x + anchoTotal, y)
            .strokeColor(COLOR_TEXTO_SUAVE)
            .lineWidth(0.75)
            .stroke();
    } else {
        doc
            .moveTo(x, y + ALTO_FILA)
            .lineTo(x + anchoTotal, y + ALTO_FILA)
            .strokeColor(COLOR_BORDE)
            .lineWidth(0.5)
            .stroke();
    }

    const fecha = item.fecha ? new Date(item.fecha).toISOString().split('T')[0] : '—';
    const valores = {
        usuario: mostrarUsuario ? (item.usuario || '—') : '',
        fecha: mostrarFecha ? fecha : '',
        hora_entrada: item.hora_entrada || '—',
        hora_salida: item.hora_salida || '—',
        dispositivo: item.dispositivo_entrada || item.dispositivo_salida || 'N/A',
        ip: item.ip_entrada || item.ip_salida || 'N/A'
    };

    let cursorX = x;
    COLUMNAS.forEach((col) => {
        if (col.key === 'usuario') {
            doc.font(mostrarUsuario ? 'Helvetica-Bold' : 'Helvetica').fillColor(COLOR_TEXTO);
        } else if (col.key === 'fecha') {
            doc.font(mostrarFecha ? 'Helvetica-Bold' : 'Helvetica').fillColor(mostrarFecha ? COLOR_TEXTO : COLOR_TEXTO_SUAVE);
        } else {
            doc.font('Helvetica').fillColor(COLOR_TEXTO);
        }
        doc.fontSize(9).text(String(valores[col.key]), cursorX + 6, y + 7, {
            width: col.width - 12,
            ellipsis: true
        });
        cursorX += col.width;
    });

    return y + ALTO_FILA;
};

// Ordena las marcas por usuario y, dentro de cada usuario, en orden
// cronológico (fecha y turno). Así todas las entradas/salidas de una misma
// persona quedan juntas, agrupadas primero por usuario y luego por fecha.
const ordenarPorUsuarioYFecha = (datos) => {
    return [...datos].sort((a, b) => {
        const nombreA = (a.usuario || '').toLowerCase();
        const nombreB = (b.usuario || '').toLowerCase();
        if (nombreA !== nombreB) return nombreA.localeCompare(nombreB);

        const fechaA = new Date(a.fecha).getTime();
        const fechaB = new Date(b.fecha).getTime();
        if (fechaA !== fechaB) return fechaA - fechaB;

        return (a.turno || 0) - (b.turno || 0);
    });
};

export const exportToPdf = (datos) => {
    return new Promise((resolve) => {
        const doc = new PDFDocument({ margin: MARGEN, size: 'A4', bufferPages: true });
        const datosOrdenados = ordenarPorUsuarioYFecha(datos);

        dibujarEncabezadoDocumento(doc);

        const x = MARGEN;
        let y = dibujarEncabezadoTabla(doc, x, doc.y);

        if (!datosOrdenados.length) {
            doc
                .font('Helvetica-Oblique')
                .fontSize(10)
                .fillColor(COLOR_TEXTO_SUAVE)
                .text('No se encontraron marcas para los filtros seleccionados.', x, y + 12);
        }

        let usuarioAnterior = null;
        let fechaAnterior = null;
        datosOrdenados.forEach((item, index) => {
            if (y + ALTO_FILA > doc.page.height - 50) {
                doc.addPage();
                y = dibujarEncabezadoTabla(doc, x, MARGEN);
                usuarioAnterior = null; // repetir usuario y fecha al inicio de la página nueva
                fechaAnterior = null;
            }

            const mostrarUsuario = item.usuario !== usuarioAnterior;
            const mostrarFecha = mostrarUsuario || item.fecha !== fechaAnterior;

            y = dibujarFila(doc, item, index, x, y, mostrarUsuario, mostrarFecha);

            usuarioAnterior = item.usuario;
            fechaAnterior = item.fecha;
        });

        const totalPaginas = doc.bufferedPageRange().count;
        for (let i = 0; i < totalPaginas; i++) {
            doc.switchToPage(i);
            dibujarPiePagina(doc, i + 1);
        }

        resolve(doc);
    });
};