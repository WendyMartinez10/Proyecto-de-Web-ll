import * as marcaService from '../models/marcas.model.js';
import * as dispService from '../models/dispositivos.model.js';
import { successResponse, errorResponse } from '../utils/response.js';
import ipRangeCheck from 'ip-range-check';
import { exportToXml } from '../utils/exportXml.js';
import { exportToPdf } from '../utils/exportPdf.js';

export const registrarMarca = async (req, res, next) => {
    try {
        const userId = req.session.usuario.id;
        const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';

        const rango = await marcaService.getConfigIpRange();
        if (rango !== '0.0.0.0/0' && !ipRangeCheck(ip, rango)) {
            return errorResponse(res, 'No es posible realizar la marca desde la red actual', 403);
        }

        const identificador = req.cookies?.device_id;
        if (!identificador) {
            return errorResponse(res, 'Dispositivo no registrado o no autorizado', 403);
        }
        
        const dispositivo = await dispService.findByIdentificador(identificador);
        if (!dispositivo || dispositivo.usuario_id !== userId || dispositivo.estado !== 'activo') {
            return errorResponse(res, 'Dispositivo no autorizado o inactivo', 403);
        }

        const now = new Date();
        const fecha = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
        const hora = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');

        const ultimaMarca = await marcaService.getLastMarcaByDate(userId, fecha);
        
        let tipo = 'entrada';
        if (ultimaMarca && ultimaMarca.tipo === 'entrada') {
            tipo = 'salida';
        }

        await marcaService.createMarca({
            usuario_id: userId,
            fecha,
            hora,
            tipo,
            ip,
            dispositivo_id: dispositivo.id
        });

        return successResponse(res, { message: `Marca de ${tipo} registrada exitosamente` }, 201);
    } catch (error) {
        next(error);
    }
};

export const getReporte = async (req, res, next) => {
    try {
        const { usuario, mes, anio, dia, departamento } = req.query;
        const marcas = await marcaService.getReporte({ usuario, mes, anio, dia, departamento });
        return successResponse(res, marcas);
    } catch (error) {
        next(error);
    }
};

export const exportar = async (req, res, next) => {
    try {
        const { formato } = req.query;
        const marcas = await marcaService.getReporte(req.query);

        if (formato === 'json') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', 'attachment; filename=reporte_marcas.json');
            return res.send(JSON.stringify(marcas, null, 2));
        } 
        else if (formato === 'xml') {
            const xml = exportToXml(marcas);
            res.setHeader('Content-Type', 'application/xml');
            res.setHeader('Content-Disposition', 'attachment; filename=reporte_marcas.xml');
            return res.send(xml);
        } 
        else if (formato === 'pdf') {
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
