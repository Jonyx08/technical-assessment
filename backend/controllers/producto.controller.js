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
    // (Aquí va tu lógica del app.put que me pasaste)
};

const eliminarProducto = async (req, res) => {
    // (Aquí va tu lógica del app.delete que me pasaste)
};

// Exportamos todas las funciones para que las rutas las puedan usar
module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto
};