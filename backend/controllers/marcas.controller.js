import * as marcasService from '../services/marcas.service.js';
import { successResponse, errorResponse } from '../common/response.js';
import { exportToXml } from '../common/exportXml.js';
import { exportToPdf } from '../common/exportPdf.js';

export const registrarMarca = async (req, res, next) => {
    try {
        const usuarioId = req.session.usuario.id;
        const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
        const identificadorDispositivo = req.cookies?.device_id;

        const tipo = await marcasService.registrar({ usuarioId, ip, identificadorDispositivo });
        return successResponse(res, { message: `Marca de ${tipo} registrada exitosamente` }, 201);
    } catch (error) {
        next(error);
    }
};

export const getReporte = async (req, res, next) => {
    try {
        const marcas = await marcasService.obtenerReporte(req.query);
        return successResponse(res, marcas);
    } catch (error) {
        next(error);
    }
};

export const exportar = async (req, res, next) => {
    try {
        const { formato } = req.query;
        const marcas = await marcasService.obtenerReporte(req.query);

        if (formato === 'json') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', 'attachment; filename=reporte_marcas.json');
            return res.send(JSON.stringify(marcas, null, 2));
        } else if (formato === 'xml') {
            const xml = exportToXml(marcas);
            res.setHeader('Content-Type', 'application/xml');
            res.setHeader('Content-Disposition', 'attachment; filename=reporte_marcas.xml');
            return res.send(xml);
        } else if (formato === 'pdf') {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=reporte_marcas.pdf');
            const pdfDoc = await exportToPdf(marcas);
            pdfDoc.pipe(res);
            pdfDoc.end();
        } else {
            return errorResponse(res, 'Formato no soportado');
        }
    } catch (error) {
        next(error);
    }
};
