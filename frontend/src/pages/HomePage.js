import { useCallback, useEffect, useState } from "react";
import { getAuthHeaders, request } from "../services/api";
import { useCart } from "../contexts/CartContext";
import { useSettings } from "../contexts/SettingsContext";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { settings } = useSettings();
  const [addedMessage, setAddedMessage] = useState("");

  const loadData = useCallback(async () => {
    try {
      const headers = getAuthHeaders();
      const [productsData, categoriesData] = await Promise.all([
        request("/products", { headers }),
        request("/categories", { headers })
      ]);
      setProducts(Array.isArray(productsData) ? productsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedMessage(`Added ${product.name} to cart!`);
    setTimeout(() => setAddedMessage(""), 2500);
  };

  const filteredProducts = selectedCategory
    ? products.filter(p => p.categoryId === selectedCategory || p.Category?.id === selectedCategory)
    : products;

  return (
    <div className="fade-in-up">
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        borderRadius: '24px',
        margin: '0 1.5rem 3rem 1.5rem',
        backgroundImage: 'linear-gradient(to bottom, rgba(11, 15, 25, 0.5), rgba(11, 15, 25, 1)), url(/hero.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)'
      }}>
        <div style={{ zIndex: 1, maxWidth: '800px' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }} className="text-gradient">
            {settings.heroHeader || 'Next-Gen Technology. Delivered.'}
          </h1>
          <p className="text-secondary" style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
            {settings.heroTagline || 'Elevate your setup with our premium, curated selection of electronics and futuristic gadgets. Experience the future today.'}
          </p>
          <a href="#products-section" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Explore Catalog
          </a>
        </div>
      </section>

      <div className="container" id="products-section">
        {/* Floating Notification */}
        {addedMessage && (
          <div style={{ position: 'fixed', top: '90px', right: '20px', zIndex: 9999 }} className="glass-card fade-in-up">
            <span style={{ color: '#86efac', fontWeight: '600' }}>✓ {addedMessage}</span>
          </div>
        )}

        {/* Categories Bar */}
        <section style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '2rem' }}>
          <button
            className={`btn-secondary ${selectedCategory === "" ? "active-filter" : ""}`}
            style={{ whiteSpace: 'nowrap', borderColor: selectedCategory === "" ? 'var(--accent-cyan)' : '' }}
            onClick={() => setSelectedCategory("")}
          >
            All Products
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className="btn-secondary"
              style={{ whiteSpace: 'nowrap', borderColor: selectedCategory === cat.id ? 'var(--accent-cyan)' : '' }}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </section>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center text-secondary" style={{ margin: '4rem 0', fontSize: '1.2rem' }}>Loading innovative products...</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2rem',
            paddingBottom: '4rem'
          }}>
            {filteredProducts.length === 0 ? (
              <p className="text-secondary" style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '2rem' }}>No products found in this category.</p>
            ) : (
              filteredProducts.map(product => (
                <div key={product.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '200px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span className="text-secondary" style={{ opacity: 0.5 }}>{product.name.substring(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{product.name}</h3>
                  <p className="text-gradient" style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem' }}>
                    ${Number(product.price).toFixed(2)}
                  </p>
                  {product.description && <p className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '1.5rem', flexGrow: 1 }}>{product.description}</p>}
                  <button className="btn-primary" style={{ width: '100%', marginTop: 'auto' }} onClick={() => handleAddToCart(product)}>
                    Add to Cart
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
