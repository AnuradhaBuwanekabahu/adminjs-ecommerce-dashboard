import React from "react";
import { Link, useLocation } from "react-router-dom";
import { isAuthenticated } from "../services/api";
import { useCart } from "../contexts/CartContext";
import { useSettings } from "../contexts/SettingsContext";

export default function Navigation() {
  useLocation(); // Triggers a re-render beautifully on route change
  const { cart } = useCart();
  const { settings } = useSettings();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar" style={{ top: settings.bannerMessage ? '35px' : '0' }}>
      <div className="container navbar-container">
        <Link to="/" className="nav-brand">{settings.siteName || 'TechStore'}</Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Shop</Link>
          {isAuthenticated() ? (
            <>
              <Link to="/orders" className="nav-link">Orders</Link>
              <Link to="/cart" className="nav-link">
                Cart {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
              </Link>
              <button className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }} onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
