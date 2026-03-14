import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "./api";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load products. Is the backend running?");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (isConfirmed) {
      try {
        await api.delete(`/products/${id}`);

        setProducts(products.filter((product) => product.id !== id));
      } catch (err) {
        console.error(err);
        alert("Failed to delete the product.");
      }
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2>Products List</h2>

      <div style={{ marginBottom: "15px" }}>
        <Link
          to="/products/new"
          style={{
            padding: "8px 15px",
            backgroundColor: "#28a745",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            display: "inline-block",
          }}
        >
          + Create New Product
        </Link>
      </div>

      <table
        style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#f4f4f4",
              borderBottom: "2px solid #ddd",
            }}
          >
            <th style={{ padding: "10px" }}>ID</th>
            <th style={{ padding: "10px" }}>Name</th>
            <th style={{ padding: "10px" }}>Price</th>
            <th style={{ padding: "10px" }}>Description</th>
            <th style={{ padding: "10px" }}>Provider ID</th>
            <th style={{ padding: "10px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ padding: "10px", textAlign: "center" }}>
                No products found.
              </td>
            </tr>
          ) : (
           
            products.map((product, index) => (
              <tr key={product.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px" }}>{index + 1}</td>

                <td style={{ padding: "10px" }}>{product.name}</td>
                <td style={{ padding: "10px" }}>${product.price}</td>

                <td style={{ padding: "10px" }}>{product.description}</td>

                <td style={{ padding: "10px" }}>{product.provider_id}</td>

                <td style={{ padding: "10px", display: "flex", gap: "10px" }}>
                  <Link
                    to={`/products/edit/${product.id}`}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#ffc107",
                      color: "black",
                      textDecoration: "none",
                      borderRadius: "4px",
                    }}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;
