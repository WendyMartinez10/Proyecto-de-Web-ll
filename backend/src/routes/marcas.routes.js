import { Router } from 'express';
import { validateResult } from '../middlewares/commonValidators.js';
import * as marcasController from '../controllers/marcas.controller.js';
import * as marcasValidators from '../middlewares/validaciones/marcas.validation.js';

import { isAuth } from '../middlewares/auth.middleware.js';
import { hasRole } from '../middlewares/role.middleware.js';

const router = Router();

router.use(isAuth);

router.post('/', marcasController.registrarMarca);

router.get('/', hasRole(['administrador']), marcasValidators.reporteValidator, validateResult, marcasController.getReporte);
router.get('/exportar', hasRole(['administrador']), marcasValidators.exportarValidator, validateResult, marcasController.exportar);

export default router;
