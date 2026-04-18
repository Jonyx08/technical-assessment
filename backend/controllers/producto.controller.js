const pool = require('../config/db'); // Importamos la conexión

const crearProducto = async (req, res) => {
    try {
        const { name, price, description, provider_id } = req.body;
        if (!name || price === undefined) {
            return res.status(400).json({ success: false, error: { message: "Product name and price are required" } });
        }
        const sqlQuery = 'INSERT INTO products (name, price, description, provider_id) VALUES ($1, $2, $3, $4) RETURNING *';
        const newProduct = await pool.query(sqlQuery, [name, price, description, provider_id]);
        res.status(201).json({ success: true, data: newProduct.rows[0] }); 
    } catch (err) {
        res.status(500).json({ success: false, error: { message: "Internal server error" } }); 
    }
};

const obtenerProductos = async (req, res) => {
    try {
        const allProducts = await pool.query('SELECT * FROM products ORDER BY id ASC');
        
        res.status(200).json({ success: true, data: allProducts.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: { message: "Internal server error" } });
    }
};

const obtenerProductoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        if (product.rows.length === 0) return res.status(404).json({ success: false, error: { message: "Product not found" } }); 
        res.status(200).json({ success: true, data: product.rows[0] }); 
    } catch (err) {
        res.status(500).json({ success: false, error: { message: "Internal server error" } }); 
    }
};

const actualizarProducto = async (req, res) => {
    // 1. Sacamos el ID de la URL y los datos nuevos del cuerpo de la petición
    const { id } = req.params;
    const { nombre, categoria, precio, stock } = req.body;

    try {
        // 2. Le decimos a Neon que actualice la tabla "productos"
        const result = await pool.query(
            "UPDATE productos SET nombre = $1, categoria = $2, precio = $3, stock = $4 WHERE id = $5 RETURNING *",
            [nombre, categoria, precio, stock, id]
        );

        // 3. Si no encuentra el producto, avisamos
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Producto no encontrado" });
        }

        // 4. Si todo sale bien, devolvemos el producto actualizado
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
};

const eliminarProducto = async (req, res) => {
    // 1. Sacamos el ID de la URL
    const { id } = req.params;

    try {
        // 2. Le decimos a Neon que borre la fila en la tabla "productos"
        const result = await pool.query(
            "DELETE FROM productos WHERE id = $1 RETURNING *",
            [id]
        );

        // 3. Si no borró nada porque no existía, avisamos
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Producto no encontrado" });
        }

        // 4. Si lo borró, enviamos un mensaje de éxito
        res.json({ success: true, message: "Producto eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
};

// Exportamos todas las funciones para que las rutas las puedan usar
module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto
};