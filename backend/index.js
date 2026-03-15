const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Pool } = require('pg');

const app = express();

app.use(cors()); 
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:YOUR_LOCAL_PASSWORD@localhost:5432/your_local_db_name',
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false 
});

// ==========================================
// ALL YOUR ROUTES GO HERE (app.get, app.post, etc.)
// ==========================================

//endpoints 

// app.post('/providers', async (req, res) =>{
//     try {
//         const {name, address, phone, description } = req.body;

//         // name validation

//         if(!name) {
//             return res.status(400).json({
//                 success: false,
//                 error: { code: "VALIDATION ERROR", message: "Provider name is required"}
//             }); // [cite: 104, 108-112]
//         }
        
//         const newProvider = await pool.query(
//         'INSERT INTO providers (name, address, phone, description) VALUES ($1, $2, $3, $4) RETURNING *',
//         [name, address, phone, description]
//         );

//         res.status(201).json({
//             succes: true,
//             data: newProvider.rows[0]
//         });

//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({
//             success: false,
//             error: { code: "SERVER_ERROR", message: "Internal server error"}
//         }); // [cite: 104]
        
//     }

// });

// POST /providers  create a new provider

app.post('/providers', async (req, res) => {
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
});

// GET /providers  retrieve all providers
app.get('/providers', async (req, res) => {
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
});

// 1. Get a single provider (Fixes the page loading error)
app.get('/providers/:id', async (req, res) => {
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
});

// 2. Update a provider (Fixes the "Save Changes" button error)
app.put('/providers/:id', async (req, res) => {
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
});

// DELETE /providers/:id delete a provider 
app.delete('/providers/:id', async (req, res) => {
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
});


// POST /products Create a new product 
app.post('/products', async (req, res) => {
    try {
        const { name, price, description, provider_id } = req.body;

        // Validation: Name and Price are required
        if (!name || price === undefined) {
            return res.status(400).json({ 
                success: false, 
                error: { code: "VALIDATION_ERROR", message: "Product name and price are required" } 
            });
        }

        const sqlQuery = 'INSERT INTO products (name, price, description, provider_id) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [name, price, description, provider_id];

        const newProduct = await pool.query(sqlQuery, values);

        res.status(201).json({ success: true, data: newProduct.rows[0] }); 
    } catch (err) {
        console.error("Database Error:", err.message);
        res.status(500).json({ success: false, error: { message: "Internal server error" } }); 
}
});

// GET /products - Retrieve all products (WITH ADVANCED FEATURES)
app.get('/products', async (req, res) => {
    try {
        let query = 'SELECT * FROM products WHERE 1=1';
        const values = [];
        let valueIndex = 1;

        // 1. FILTERING (e.g., ?name=laptop)
        if (req.query.name) {
            query += ` AND name ILIKE $${valueIndex}`;
            values.push(`%${req.query.name}%`);
            valueIndex++;
        }

        // 2. SORTING (e.g., ?sort=price or ?sort=-price)
        if (req.query.sort) {
            // If it starts with a minus, it's descending
            const isDescending = req.query.sort.startsWith('-'); 
            const sortField = isDescending ? req.query.sort.substring(1) : req.query.sort;
            
            // Whitelist allowed sort columns to prevent SQL injection crashes
            const allowedFields = ['id', 'name', 'price'];
            if (allowedFields.includes(sortField)) {
                query += ` ORDER BY ${sortField} ${isDescending ? 'DESC' : 'ASC'}`;
            } else {
                query += ' ORDER BY id ASC';
            }
        } else {
            query += ' ORDER BY id ASC'; // Default sort
        }

        // 3. PAGINATION (e.g., ?page=1&limit=5)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        query += ` LIMIT $${valueIndex} OFFSET $${valueIndex + 1}`;
        values.push(limit, offset);

        const allProducts = await pool.query(query, values);
        
        // Return extra metadata to prove pagination works!
        res.status(200).json({ 
            success: true, 
            count: allProducts.rows.length,
            page: page,
            data: allProducts.rows 
        });

    } catch (err) {
        console.error("Database Error:", err.message);
        res.status(500).json({ success: false, error: { message: "Internal server error" } });
    }
});

// GET /products/:id Retrieve a single product
app.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

        if (product.rows.length === 0) {
            return res.status(404).json({ success: false, error: { message: "Product not found" } }); 
        }

        res.status(200).json({ success: true, data: product.rows[0] }); 
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, error: { message: "Internal server error" } }); 
    }
});

// PUT /products/:id Update a product
app.put('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, provider_id } = req.body;

        const updateQuery = `
            UPDATE products 
            SET name = $1, price = $2, description = $3, provider_id = $4, updated_at = CURRENT_TIMESTAMP 
            WHERE id = $5 RETURNING *
        `;
        const updatedProduct = await pool.query(updateQuery, [name, price, description, provider_id, id]);

        if (updatedProduct.rows.length === 0) {
            return res.status(404).json({ success: false, error: { message: "Product not found" } });
        }

        res.status(200).json({ success: true, data: updatedProduct.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, error: { message: "Internal server error" } });
    }
});

// DELETE /products/:id - Delete a product
app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

        if (deletedProduct.rows.length === 0) {
            return res.status(404).json({ success: false, error: { message: "Product not found" } });
        }

        res.status(204).send();
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, error: { message: "Internal server error" } });
    }
});

// 4. Start the server at the VERY END of the file
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});