import { useEffect, useState } from "react";
import { getAuthHeaders, request } from "../services/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await request("/orders", { headers: getAuthHeaders() });
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="container fade-in-up mt-2">
      <h2 style={{ marginBottom: '1.5rem' }}>Order History</h2>
      {loading ? (
        <p className="text-secondary">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="glass-card text-center">
          <h3 className="text-secondary" style={{ margin: '2rem 0' }}>No orders found yet.</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {orders.map((order) => (
            <div key={order.id} className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h3 className="text-gradient" style={{ marginBottom: '0.2rem' }}>Order #{order.id}</h3>
                  {order.createdAt && (
                    <span className="text-secondary" style={{ fontSize: '0.8rem' }}>
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  )}
                </div>
                <h4 style={{ color: 'var(--text-primary)' }}>${Number(order.total).toFixed(2)}</h4>
              </div>
              <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
                Items: {order.OrderItems?.length || 0}
              </p>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', listStyleDetail: 'disc' }}>
                {order.OrderItems && order.OrderItems.map(item => (
                  <li key={item.id} className="text-secondary" style={{ marginBottom: '0.5rem' }}>
                    {item.Product?.name || 'Unknown Product'} × {item.quantity} - ${Number(item.Product?.price || 0).toFixed(2)} ea
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
