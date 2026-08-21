import { Router } from 'express';
import { validateResult } from '../middlewares/commonValidators.js';
import * as prController from '../controllers/prestamos.controller.js';
import * as prValidators from '../middlewares/validaciones/prestamos.validation.js';

import { isAuth } from '../middlewares/auth.middleware.js';
import { hasRole } from '../middlewares/role.middleware.js';

const router = Router();

router.use(isAuth);
router.use(hasRole(['administrador']));

router.post('/', prValidators.registrarValidator, validateResult, prController.registrar);
router.get('/', prValidators.historialValidator, validateResult, prController.getHistorial);
router.get('/:id', prValidators.prestamoIdValidator, validateResult, prController.getDetalle);
router.put('/:id/devolver', prValidators.prestamoIdValidator, validateResult, prController.devolverCompleto);
router.put('/:id/detalle/:detalleId/devolver', prValidators.detalleIdValidator, validateResult, prController.devolverIndividual);

export default router;
