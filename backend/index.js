const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. Importamos las rutas que acabamos de separar
const productoRoutes = require('./routes/producto.routes');
const providerRoutes = require('./routes/provider.routes'); 

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json());

// 2. Conectamos las rutas
app.use('/products', productoRoutes);
app.use('/providers', providerRoutes); 

// 3. Encendemos el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});