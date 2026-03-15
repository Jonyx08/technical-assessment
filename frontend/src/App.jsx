import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ProductList from './ProductList';
import ProductCreate from './ProductCreate';
import ProductUpdate from './ProductUpdate';
import ProviderList from './ProviderList';
import ProviderCreate from './ProviderCreate';
import ProviderUpdate from './ProviderUpdate';

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
        <nav style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #ccc' }}>
          <h1 style={{ margin: '0 0 10px 0' }}>Management System</h1>
          <Link to="/" style={{ marginRight: '15px', textDecoration: 'none', color: 'blue' }}>Products</Link>
          <Link to="/providers" style={{ textDecoration: 'none', color: 'blue' }}>Providers</Link>
        </nav>

        <Routes>
          <Route path="/" element={<ProductList />} /> 
          <Route path="/products/new" element={<ProductCreate />} />
          <Route path="/products/edit/:id" element={<ProductUpdate />} /> 
          
          
          <Route path="/providers" element={<ProviderList />} />
          <Route path="/providers/new" element={<ProviderCreate />} /> 
          <Route path="/providers/edit/:id" element={<ProviderUpdate />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;