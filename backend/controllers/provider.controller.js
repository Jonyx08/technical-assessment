const pool = require('../config/db');

// 1. Crear un proveedor (POST)
const crearProveedor = async (req, res) => {
    try {
        const { name, address, phone, description } = req.body;

        if (!name) {
            return res.status(400).json({ 
                success: false, 
                error: { code: "VALIDATION_ERROR", message: "Provider name is required" } 
            }); // [cite: 104, 108-117]
        }

        const sqlQuery = 'INSERT INTO providers (name, address, phone, description) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [name, address, phone, description];

        const newProvider = await pool.query(sqlQuery, values);

        res.status(201).json({ 
            success: true, 
            data: newProvider.rows[0] 
        }); // [cite: 64-66, 104]

    } catch (err) {
        console.error("Database Error:", err.message);
        res.status(500).json({ 
            success: false, 
            error: { code: "SERVER_ERROR", message: "Internal server error" } 
        }); // [cite: 104]
    }
};

// 2. Obtener todos los proveedores (GET)
const obtenerProveedores = async (req, res) => {
    try {
       
        const allProviders = await pool.query('SELECT * FROM providers ORDER BY id ASC');

        res.status(200).json({
            success: true,
            data: allProviders.rows
        });

    } catch (err) {
        console.error("Database Error:", err.message);
        res.status(500).json({ 
            success: false, 
            error: { code: "SERVER_ERROR", message: "Internal server error" } 
        }); // [cite: 104, 108-112]
    }
};

// 3. Obtener un solo proveedor por ID (GET)
const obtenerProveedorPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM providers WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Provider not found" });
        }
        
        res.json({ data: result.rows[0] });
    } catch (error) {
        console.error("Error fetching provider:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// 4. Actualizar un proveedor (PUT)
const actualizarProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, phone, description } = req.body;
        
        await pool.query(
            'UPDATE providers SET name = $1, address = $2, phone = $3, description = $4 WHERE id = $5',
            [name, address, phone, description, id]
        );
        
        res.json({ message: "Provider updated successfully" });
    } catch (error) {
        console.error("Error updating provider:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// 5. Eliminar un proveedor (DELETE)
const eliminarProveedor = async (req, res) => {
     try {
        const { id } = req.params;
        const deletedProvider = await pool.query('DELETE FROM providers WHERE id = $1 RETURNING *', [id]);

        if (deletedProvider.rows.length === 0) {
            return res.status(404).json({ success: false, error: { message: "Provider not found" } }); // [cite: 104]
        }

        res.status(204).send(); // 204 No Content for successful deletion [cite: 104]
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, error: { message: "Internal server error" } }); // [cite: 104]
    }
};


module.exports = {
    crearProveedor,
    obtenerProveedores,
    obtenerProveedorPorId,
    actualizarProveedor,
    eliminarProveedor
};