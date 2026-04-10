const express = require('express');
const router = express.Router();

// 1. Importamos tus 5 funciones perfectas del controlador
const { 
    crearProveedor, 
    obtenerProveedores, 
    obtenerProveedorPorId, 
    actualizarProveedor, 
    eliminarProveedor 
} = require('../controllers/provider.controller');

// 2. Conectamos las URLs con las funciones
router.post('/', crearProveedor);
router.get('/', obtenerProveedores);
router.get('/:id', obtenerProveedorPorId);
router.put('/:id', actualizarProveedor);
router.delete('/:id', eliminarProveedor);

// 3. Exportamos el enrutador
module.exports = router;