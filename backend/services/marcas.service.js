import ipRangeCheck from 'ip-range-check';
import * as marcasModel from '../models/marcas.model.js';
import * as dispositivosModel from '../models/dispositivos.model.js';
import { AppError } from '../common/AppError.js';
import { toReporteMarcas } from '../dtos/marca.dto.js';

/**
 * Registra una marca de entrada o salida. El tipo se determina
 * automáticamente según la última marca del usuario en la fecha actual.
 */
export const registrar = async ({
    usuarioId,
    ip,
    identificadorDispositivo
}) => {
    const rango = await marcasModel.getConfigIpRange();

    if (rango !== '0.0.0.0/0' && !ipRangeCheck(ip, rango)) {
        throw new AppError(
            'No es posible realizar la marca desde la red actual',
            403
        );
    }

    if (!identificadorDispositivo) {
        throw new AppError(
            'Dispositivo no registrado o no autorizado',
            403
        );
    }

    const dispositivo =
        await dispositivosModel.findByIdentificador(
            identificadorDispositivo
        );

    if (
        !dispositivo ||
        dispositivo.usuario_id !== usuarioId ||
        dispositivo.estado !== 'activo'
    ) {
        throw new AppError(
            'Dispositivo no autorizado o inactivo',
            403
        );
    }

    const now = new Date();

    const fecha =
        now.getFullYear() +
        '-' +
        String(now.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(now.getDate()).padStart(2, '0');

    const hora =
        String(now.getHours()).padStart(2, '0') +
        ':' +
        String(now.getMinutes()).padStart(2, '0') +
        ':' +
        String(now.getSeconds()).padStart(2, '0');

    const resultado = await marcasModel.registrarMarcaTransaccional({
        usuario_id: usuarioId,
        fecha,
        hora,
        ip,
        dispositivo_id: dispositivo.id
    });

    return resultado.tipo;
};

export const obtenerReporte = async (filtros) => {
    const rows = await marcasModel.getReporte(filtros);
    return toReporteMarcas(rows);
};
