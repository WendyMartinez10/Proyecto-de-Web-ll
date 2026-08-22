/**
 * La configuración se expone como un mapa clave -> valor (ambos strings),
 * tal como lo arma `models/configuracion.model.js`. Este DTO documenta
 * explícitamente ese contrato para quien consuma el módulo.
 * Ejemplo: { nombre_institucion: "...", rango_ip_permitido: "0.0.0.0/0", ... }
 */
export const toConfiguracionPublica = (configMap) => ({ ...configMap });
