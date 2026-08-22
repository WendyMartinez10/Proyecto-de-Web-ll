import { Router } from 'express';
import { validateResult } from '../middlewares/commonValidators.js';
import * as dispController from '../controllers/dispositivos.controller.js';
import * as dispValidators from '../middlewares/dispositivos.validation.js';
import { isAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(isAuth);
router.get('/', dispController.getDispositivos);
router.post('/', dispValidators.registerDispositivoValidator, validateResult, dispController.registerDispositivo);
router.put('/:id/estado', dispValidators.cambiarEstadoValidator, validateResult, dispController.cambiarEstado);

export default router;