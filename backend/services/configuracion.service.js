import * as configuracionModel from '../models/configuracion.model.js';
import { toConfiguracionPublica } from '../dtos/configuracion.dto.js';

export const obtener = async () => {
    const configMap = await configuracionModel.getAll();
    return toConfiguracionPublica(configMap);
};

export const actualizar = async (data) => configuracionModel.update(data);
