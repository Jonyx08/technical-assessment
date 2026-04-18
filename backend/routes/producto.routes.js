const express = require('express');
const router = express.Router();

// 1. Importamos tus 5 funciones perfectas del controlador
const { 
    crearProducto, 
    obtenerProductos, 
    obtenerProductoPorId, 
    actualizarProducto, 
    eliminarProducto, 
} = require('../controllers/producto.controller');

// 2. Conectamos las URLs con las funciones
router.post('/', crearProducto);
router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoPorId);
router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);

// 3. Exportamos el enrutador
module.exports = router;