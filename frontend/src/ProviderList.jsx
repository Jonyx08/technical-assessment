import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "./api";

function ProviderList() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await api.get("/providers");
      setProviders(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load providers.");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this provider?",
    );
    if (isConfirmed) {
      try {
        await api.delete(`/providers/${id}`);
        setProviders(providers.filter((provider) => provider.id !== id));
      } catch (err) {
        console.error(err);
        alert(
          "Failed to delete provider. It might be linked to existing products!",
        );
      }
    }
  };

  if (loading) return <div>Loading providers...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2>Providers List</h2>

      <div style={{ marginBottom: "15px" }}>
        <Link
          to="/providers/new"
          style={{
            padding: "8px 15px",
            backgroundColor: "#28a745",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            display: "inline-block",
          }}
        >
          + Add New Provider
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
            <th style={{ padding: "10px" }}>Address</th>
            <th style={{ padding: "10px" }}>Phone</th>
            <th style={{ padding: "10px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {providers.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ padding: "10px", textAlign: "center" }}>
                No providers found.
              </td>
            </tr>
          ) : (
           
            providers.map((provider, index) => (
              <tr key={provider.id} style={{ borderBottom: "1px solid #ddd" }}>
       
                <td style={{ padding: "10px" }}>{index + 1}</td>

                <td style={{ padding: "10px" }}>{provider.name}</td>
                <td style={{ padding: "10px" }}>{provider.address}</td>
                <td style={{ padding: "10px" }}>{provider.phone}</td>
                <td style={{ padding: "10px", display: "flex", gap: "10px" }}>
                 
                  <Link
                    to={`/providers/edit/${provider.id}`}
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
                    onClick={() => handleDelete(provider.id)}
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

export default ProviderList;
