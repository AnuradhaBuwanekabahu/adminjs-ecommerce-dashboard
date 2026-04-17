import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthHeaders, request } from "../services/api";
import { useCart } from "../contexts/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setStatusMessage("");
    setLoading(true);
    try {
      const headers = { ...getAuthHeaders(), "Content-Type": "application/json" };
      const items = cart.map((item) => ({ productId: item.product.id, quantity: item.quantity }));
      
      await request("/orders", {
        method: "POST",
        headers,
        body: JSON.stringify({ items })
      });
      
      clearCart();
      setStatusMessage("Order placed successfully! Redirecting...");
      setTimeout(() => navigate("/orders"), 2000);
    } catch (error) {
      setStatusMessage(error.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fade-in-up">
      <div className="glass-card mt-2">
        <h2>Your Cart</h2>
        {statusMessage && <p className={statusMessage.includes("success") ? "message success" : "message error"}>{statusMessage}</p>}
        {cart.length === 0 ? (
          <p className="text-secondary mt-1">Your cart is empty. Go add some amazing tech!</p>
        ) : (
          <div>
            <ul style={{ listStyle: "none", padding: "1rem 0" }}>
              {cart.map((item) => (
                <li key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.5rem' }}>
                  <div>
                    <strong style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{item.product.name}</strong>
                    <br />
                    <span className="text-secondary">Quantity: {item.quantity} × ${Number(item.product.price).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--accent-cyan)' }}>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </strong>
                    <button style={{ background: 'transparent', border: 'none', color: '#fca5a5', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => removeFromCart(item.product.id)}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
              <h3>Total: <span className="text-gradient">${total.toFixed(2)}</span></h3>
              <button className="btn-primary" onClick={handleCheckout} disabled={loading}>
                {loading ? "Processing..." : "Complete Checkout"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
