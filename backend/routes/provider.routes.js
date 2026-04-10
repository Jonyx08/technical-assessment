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

// 2. Conectamos los verbos HTTP con tus funciones
router.post('/', crearProveedor);
router.get('/', obtenerProveedores);
router.get('/:id', obtenerProveedorPorId);
router.put('/:id', actualizarProveedor);
router.delete('/:id', eliminarProveedor);

// 3. Exportamos el enrutador para que el index.js lo pueda leer
module.exports = router;