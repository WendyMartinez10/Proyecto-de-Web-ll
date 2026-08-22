import { create } from 'xmlbuilder2';

export const exportToXml = (datos) => {
    const root = create({ version: '1.0' }).ele('reporte_marcas');
    datos.forEach(item => {
        const marca = root.ele('marca');
        marca.ele('usuario').txt(item.usuario);
        const fechaFormat = item.fecha ? new Date(item.fecha).toISOString().split('T')[0] : '';
        marca.ele('fecha').txt(fechaFormat);
        marca.ele('hora_entrada').txt(item.hora_entrada || '');
        marca.ele('hora_salida').txt(item.hora_salida || '');
        marca.ele('dispositivo').txt(item.dispositivo_entrada || item.dispositivo_salida || 'N/A');
        marca.ele('ip').txt(item.ip_entrada || item.ip_salida || 'N/A');
    });
    return root.end({ prettyPrint: true });
};
